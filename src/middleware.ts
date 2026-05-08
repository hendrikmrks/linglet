import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/admin'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Just check if session cookie exists
    // Full validation happens in the route handlers
    const sessionToken = request.cookies.get('sessionToken')?.value;

    if (!sessionToken) {
      // Redirect to login with return URL
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
