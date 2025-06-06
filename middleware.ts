import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);

  // Allow unauthenticated access to attempt routes
  if (pathname.startsWith('/attempt')) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (pathname === '/assessment') {
    console.log('User is trying to access /assessment');
    return NextResponse.next();
  }

  // Redirect authenticated users to their role-specific page
  if (pathname === '/' && session) {
    if (session.user.role === 'admin') {
      console.log('User is admin, redirecting to /admin');
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (!session.session.activeOrganizationId) {
      console.log('User has no active organization, redirecting to /organisation/new');
      return NextResponse.redirect(new URL('/organisation/new', request.url));
    } else {
      console.log('User is not admin, redirecting to /organisation');
      return NextResponse.redirect(new URL('/organisation', request.url));
    }
  }

  // Redirect unauthenticated users from home to sign-in
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Redirect authenticated users away from sign-in
  if (pathname === '/sign-in' && session) {
    if (session.user.role === 'admin') {
      console.log('User is admin, redirecting to /admin');
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (session.session.activeOrganizationId === null) {
      console.log('User has NULL organization, redirecting to /organisation/new');
      return NextResponse.redirect(new URL('/organisation/new', request.url));
    } else {
      console.log('User has active organization:', session.session.activeOrganizationId);
      return NextResponse.redirect(new URL('/organisation', request.url));
    }
  }

  // Allow unauthenticated access to sign-in
  if (pathname === '/sign-in') {
    return NextResponse.next();
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

  // Allow unauthenticated access to sign-up
  if (pathname === '/sign-up') {
    return NextResponse.next();
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
