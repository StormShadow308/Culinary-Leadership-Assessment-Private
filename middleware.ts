import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from './lib/auth';
import { db } from './db';
import { member as memberTable, user as userTable } from './db/schema';
import { eq } from 'drizzle-orm';

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);

  // Allow unauthenticated access to attempt routes
  if (pathname.startsWith('/attempt')) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Determine if the authenticated user is an organization member
  let isOrgMember = false;
  if (session) {
    try {
      const memberships = await db
        .select({ id: memberTable.id })
        .from(memberTable)
        .where(eq(memberTable.userId, session.user.id))
        .limit(1);
      isOrgMember = memberships.length > 0;
    } catch {}
  }

  if (pathname === '/assessment') {
    console.log('User is trying to access /assessment');
    return NextResponse.next();
  }

  // Always redirect from home to sign-in page first
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Allow unauthenticated access to sign-in and sign-up
  if (pathname === '/sign-in' || pathname === '/sign-up') {
    return NextResponse.next();
  }

  // Redirect authenticated users away from sign-in to their appropriate page
  if (pathname === '/sign-in' && session) {
    if (session.user.role === 'admin') {
      console.log('User is admin, redirecting to /admin');
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (!isOrgMember) {
      console.log('User is not an org member, redirecting to /assessment');
      return NextResponse.redirect(new URL('/assessment', request.url));
    }

    if (session.session.activeOrganizationId === null) {
      console.log('Org member with no active organization, redirecting to /organisation/new');
      return NextResponse.redirect(new URL('/organisation/new', request.url));
    }

    console.log('Org member, redirecting to /organisation');
    return NextResponse.redirect(new URL('/organisation', request.url));
  }

  // Redirect authenticated users away from sign-up
  if (pathname === '/sign-up' && session) {
    if (session.user.role === 'admin') {
      console.log('User is admin, redirecting to /admin');
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      console.log('User is not admin, redirecting to /organisation');
      return NextResponse.redirect(new URL('/organisation', request.url));
    }
  }

  // Enforce access based on organization membership
  if (session) {
    try {
      const memberships = await db
        .select({ id: memberTable.id })
        .from(memberTable)
        .where(eq(memberTable.userId, session.user.id))
        .limit(1);

      const isOrgMember = memberships.length > 0;

      // Block students (non-members) from any organisation/admin paths
      if (!isOrgMember && (pathname === '/organisation' || pathname.startsWith('/organisation') || pathname === '/admin' || pathname.startsWith('/admin'))) {
        return NextResponse.redirect(new URL('/assessment', request.url));
      }

      // Optionally, block org members from attempt routes meant for students only
      if (isOrgMember && pathname.startsWith('/attempt')) {
        return NextResponse.redirect(new URL('/organisation', request.url));
      }
    } catch {}
  }

  // Check for admin routes - require both authentication AND admin role
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    // Redirect unauthenticated users to sign-in
    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Redirect non-admin users appropriately
    if (session?.user.role !== 'admin') {
      console.log('Non-admin user trying to access admin area');

      // Check if user has an active organization
      if (session.session.activeOrganizationId === null) {
        console.log('User has no active organization, redirecting to /organisation/new');
        return NextResponse.redirect(new URL('/organisation/new', request.url));
      } else {
        console.log('User has active organization, redirecting to /organisation');
        return NextResponse.redirect(new URL('/organisation', request.url));
      }
    }
  }

  // For all other routes
  if (!session) {
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
