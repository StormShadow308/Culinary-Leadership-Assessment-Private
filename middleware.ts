import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { db } from './db';
import { member as memberTable, user as userTable } from './db/schema';
import { eq, sql } from 'drizzle-orm';
import { isDatabaseConnected, executeWithHealthCheck } from './lib/db-connection';

// Simple in-memory cache for user data (in production, use Redis)
const userCache = new Map<string, { role: string; isOrgMember: boolean; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Rate limiting for log messages to prevent spam
const logRateLimit = new Map<string, { count: number; lastReset: number }>();
const LOG_RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_LOGS_PER_WINDOW = 5;

// Database connection status
let dbConnectionHealthy = true;
let lastDbCheck = 0;
const DB_CHECK_INTERVAL = 30000; // Check every 30 seconds

// Cache cleanup function
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of userCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      userCache.delete(key);
    }
  }
  
  // Clean up log rate limiting
  for (const [key, value] of logRateLimit.entries()) {
    if (now - value.lastReset > LOG_RATE_LIMIT_WINDOW) {
      logRateLimit.delete(key);
    }
  }
}, 60000); // Clean up every minute

// Helper function to check if we should log a message (rate limiting)
function shouldLogMessage(messageKey: string): boolean {
  const now = Date.now();
  const current = logRateLimit.get(messageKey);
  
  if (!current) {
    logRateLimit.set(messageKey, { count: 1, lastReset: now });
    return true;
  }
  
  if (now - current.lastReset > LOG_RATE_LIMIT_WINDOW) {
    logRateLimit.set(messageKey, { count: 1, lastReset: now });
    return true;
  }
  
  if (current.count >= MAX_LOGS_PER_WINDOW) {
    return false;
  }
  
  current.count++;
  return true;
}

// Database health check function with timeout
async function checkDatabaseHealth(): Promise<boolean> {
  const now = Date.now();
  if (now - lastDbCheck < DB_CHECK_INTERVAL) {
    return dbConnectionHealthy;
  }
  
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database health check timeout')), 5000);
    });
    
    await Promise.race([
      db.execute(sql`SELECT 1`),
      timeoutPromise
    ]);
    
    dbConnectionHealthy = true;
    lastDbCheck = now;
    return true;
  } catch (error) {
    console.warn('Database health check failed:', error);
    dbConnectionHealthy = false;
    lastDbCheck = now;
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);

  // Allow unauthenticated access to attempt routes and assessment page (for invite links)
  if (pathname.startsWith('/attempt') || pathname === '/assessment') {
    // For authenticated users, still enforce role-based access control below
    // For unauthenticated users, allow access (invite links)
    const cookieStoreQuick = await cookies();
    const supabaseQuick = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStoreQuick.getAll();
          },
          setAll() {}
        }
      }
    );
    
    const { data: { user: quickUser } } = await supabaseQuick.auth.getUser();
    
    if (!quickUser) {
      // Unauthenticated user - allow access for invite links
      return NextResponse.next();
    }
    // Authenticated user - continue to role-based checks
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  // Determine if the authenticated user is an organization member
  let isOrgMember = false;
  let userRole = 'student';
  
  if (user) {
    try {
      // Check cache first
      const cacheKey = user.email!;
      const cached = userCache.get(cacheKey);
      
      if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        userRole = cached.role;
        isOrgMember = cached.isOrgMember;
      } else {
        // Check database health first
        const isDbHealthy = await checkDatabaseHealth();
        
        if (isDbHealthy) {
          try {
            // Add timeout to database queries
            const queryTimeout = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Database query timeout')), 3000);
            });
            
            const userQuery = db
              .select({
                id: userTable.id,
                role: userTable.role,
              })
              .from(userTable)
              .where(eq(userTable.email, user.email!))
              .limit(1);
            
            const userResult = await Promise.race([userQuery, queryTimeout]) as any[];
            const localUser = userResult[0];
            
            if (localUser) {
              userRole = localUser.role;
              
              // Check membership with timeout
              const membershipQuery = db
                .select({ id: memberTable.id })
                .from(memberTable)
                .where(eq(memberTable.userId, localUser.id))
                .limit(1);
              
              const membershipResult = await Promise.race([membershipQuery, queryTimeout]) as any[];
              isOrgMember = !!membershipResult[0];
            }
          } catch (dbError) {
            console.warn('Database query failed in middleware, using fallback:', dbError);
            dbConnectionHealthy = false;
            
            // Fallback to Supabase metadata
            if (user.user_metadata?.role) {
              userRole = user.user_metadata.role;
            } else if (user.app_metadata?.role) {
              userRole = user.app_metadata.role;
            } else {
              userRole = 'student';
            }
            isOrgMember = false;
          }
        } else {
          // Database is not healthy, use Supabase metadata fallback
          if (user.user_metadata?.role) {
            userRole = user.user_metadata.role;
          } else if (user.app_metadata?.role) {
            userRole = user.app_metadata.role;
          } else {
            userRole = 'student';
          }
          isOrgMember = false;
        }
        
        // Cache the result
        userCache.set(cacheKey, {
          role: userRole,
          isOrgMember,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Middleware error:', error);
      
      // Fallback: Try to determine role from Supabase user metadata
      if (user.user_metadata?.role) {
        userRole = user.user_metadata.role;
      } else if (user.app_metadata?.role) {
        userRole = user.app_metadata.role;
      } else {
        // Default to student if no role found
        userRole = 'student';
      }
      
      isOrgMember = false;
    }
  }

  // Always redirect from home to landing site
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/landing-site/index.html', request.url));
  }

  // Allow unauthenticated access to landing page and authentication pages
  if (pathname === '/landing' || pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/forgot-password' || pathname === '/reset-password' || pathname === '/verify-email') {
    return NextResponse.next();
  }

  // Only redirect authenticated users away from sign-in and sign-up (not forgot-password, etc.)
  if ((pathname === '/sign-in' || pathname === '/sign-up') && user) {
    if (userRole === 'admin') {
      console.log('User is admin, redirecting to /admin');
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (userRole === 'student') {
      console.log('User is student, redirecting to /assessment');
      return NextResponse.redirect(new URL('/assessment', request.url));
    } else if (isOrgMember) {
      console.log('Org member, redirecting to /organisation');
      return NextResponse.redirect(new URL('/organisation', request.url));
    } else {
      console.log('Default user, redirecting to /assessment');
      return NextResponse.redirect(new URL('/assessment', request.url));
    }
  }

  // STRICT ROLE-BASED ACCESS CONTROL
  if (user) {
    // Only log access control messages occasionally to reduce noise
    if (shouldLogMessage(`access-control-${user.email}`)) {
      console.log(`🔐 Access Control: User ${user.email} (Role: ${userRole}) trying to access ${pathname}`);
    }
    
    // ADMIN-ONLY ROUTES: Only admins can access
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      if (userRole !== 'admin') {
        if (shouldLogMessage(`admin-access-denied-${user.email}`)) {
          console.log(`❌ Access Denied: Non-admin user trying to access admin area`);
        }
        if (userRole === 'student') {
          return NextResponse.redirect(new URL('/assessment', request.url));
        } else if (userRole === 'organization') {
          return NextResponse.redirect(new URL('/organisation', request.url));
        } else {
          return NextResponse.redirect(new URL('/assessment', request.url));
        }
      }
    }

    // ORGANIZATION-ONLY ROUTES: Only organization users and admins can access
    if (pathname === '/organisation' || pathname.startsWith('/organisation/')) {
      if (userRole !== 'organization' && userRole !== 'admin') {
        if (shouldLogMessage(`org-access-denied-${user.email}`)) {
          console.log(`❌ Access Denied: Non-organization user trying to access organization area`);
        }
        if (userRole === 'student') {
          return NextResponse.redirect(new URL('/assessment', request.url));
        } else {
          return NextResponse.redirect(new URL('/assessment', request.url));
        }
      } else {
        // Clear invite session cookie when organization user returns to their dashboard
        const hasInviteSession = cookieStore.get('invite_session')?.value === 'true';
        if (hasInviteSession && (userRole === 'organization' || userRole === 'admin')) {
          const response = NextResponse.next();
          response.cookies.delete('invite_session');
          console.log(`🧹 Cleared invite session for user: ${user.email} returning to organization dashboard`);
          return response;
        }
      }
    }

    // STUDENT-ONLY ROUTES: Only students can access assessment and attempt routes
    // EXCEPTION: Allow invite links (invite=true query parameter) for all users
    if (pathname === '/assessment' || pathname.startsWith('/attempt')) {
      // Check if this is an invite link or if user has an active invite session
      const url = new URL(request.url);
      const isInviteLink = url.searchParams.get('invite') === 'true';
      const hasInviteSession = cookieStore.get('invite_session')?.value === 'true';
      
      // If this is a new invite link, set the invite session cookie
      if (isInviteLink && !hasInviteSession) {
        const response = NextResponse.next();
        response.cookies.set('invite_session', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/',
        });
        console.log(`✅ Invite link access granted for user: ${user.email} (Role: ${userRole}) - Session cookie set`);
        return response;
      }
      
      // Allow access if user has invite session or is a student
      if (!isInviteLink && !hasInviteSession && userRole !== 'student') {
        if (shouldLogMessage(`student-access-denied-${user.email}`)) {
          console.log(`❌ Access Denied: Non-student user trying to access student area`);
        }
        if (userRole === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url));
        } else if (userRole === 'organization') {
          return NextResponse.redirect(new URL('/organisation', request.url));
        } else {
          return NextResponse.redirect(new URL('/assessment', request.url));
        }
      } else if (hasInviteSession) {
        // Allow continued access for users with active invite session
        if (shouldLogMessage(`invite-session-access-${user.email}`)) {
          console.log(`✅ Invite session access granted for user: ${user.email} (Role: ${userRole})`);
        }
      }
    }

    // Note: Authentication pages are now allowed for all users (authenticated and unauthenticated)
    // This allows users to reset passwords even while logged in
  }

  // Redirect unauthenticated users to sign-in for protected routes
  // Note: /assessment and /attempt are excluded as they allow unauthenticated access for invite links
  if (!user && (pathname === '/admin' || pathname.startsWith('/admin/') || 
                pathname === '/organisation' || pathname.startsWith('/organisation/'))) {
    // Rate limit unauthenticated access logs to prevent spam from prefetch requests
    if (shouldLogMessage(`unauthenticated-access-${pathname}`)) {
      console.log(`🔒 Unauthenticated user trying to access protected route: ${pathname}`);
    }
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // For all other routes
  if (!user) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - landing-site (static landing page files)
     * - lovable-uploads (landing page images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|landing-site|lovable-uploads).*)',
  ],
};
