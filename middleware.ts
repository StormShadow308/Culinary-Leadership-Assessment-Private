import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { db } from './db';
import { member as memberTable, user as userTable } from './db/schema';
import { eq } from 'drizzle-orm';

// Simple in-memory cache for user data (in production, use Redis)
const userCache = new Map<string, { role: string; isOrgMember: boolean; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Cache cleanup function
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of userCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      userCache.delete(key);
    }
  }
}, 60000); // Clean up every minute

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);

  // Allow unauthenticated access to attempt routes
  if (pathname.startsWith('/attempt')) {
    return NextResponse.next();
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
        // Get user from local database with optimized query
        const [localUser] = await db
          .select({
            id: userTable.id,
            role: userTable.role,
          })
          .from(userTable)
          .where(eq(userTable.email, user.email!))
          .limit(1);
        
        if (localUser) {
          userRole = localUser.role;
          
          // Check membership with optimized query
          const [membership] = await db
            .select({ id: memberTable.id })
            .from(memberTable)
            .where(eq(memberTable.userId, localUser.id))
            .limit(1);
          isOrgMember = !!membership;
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
      // Continue with default values on error
    }
  }

  if (pathname === '/assessment') {
    console.log('User is trying to access /assessment');
    return NextResponse.next();
  }

  // Always redirect from home to sign-in page first
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Allow unauthenticated access to authentication pages
  if (pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/forgot-password' || pathname === '/reset-password' || pathname === '/verify-email') {
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
    console.log(`🔐 Access Control: User ${user.email} (Role: ${userRole}) trying to access ${pathname}`);
    
    // ADMIN-ONLY ROUTES: Only admins can access
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      if (userRole !== 'admin') {
        console.log(`❌ Access Denied: Non-admin user trying to access admin area`);
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
        console.log(`❌ Access Denied: Non-organization user trying to access organization area`);
        if (userRole === 'student') {
          return NextResponse.redirect(new URL('/assessment', request.url));
        } else {
          return NextResponse.redirect(new URL('/assessment', request.url));
        }
      }
    }

    // STUDENT-ONLY ROUTES: Only students can access assessment and attempt routes
    if (pathname === '/assessment' || pathname.startsWith('/attempt')) {
      if (userRole !== 'student') {
        console.log(`❌ Access Denied: Non-student user trying to access student area`);
        if (userRole === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url));
        } else if (userRole === 'organization') {
          return NextResponse.redirect(new URL('/organisation', request.url));
        } else {
          return NextResponse.redirect(new URL('/assessment', request.url));
        }
      }
    }

    // Note: Authentication pages are now allowed for all users (authenticated and unauthenticated)
    // This allows users to reset passwords even while logged in
  }

  // Redirect unauthenticated users to sign-in for protected routes
  if (!user && (pathname === '/admin' || pathname.startsWith('/admin/') || 
                pathname === '/organisation' || pathname.startsWith('/organisation/') ||
                pathname === '/assessment' || pathname.startsWith('/attempt'))) {
    console.log(`🔒 Unauthenticated user trying to access protected route: ${pathname}`);
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
