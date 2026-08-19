import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(pathname);
  const isRootPage = pathname === '/';
  const isAdminRoute = pathname.startsWith('/admin');

  // 1. Redirect unauthenticated users trying to access protected routes to /login
  if (!token && !isAuthPage && !isRootPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. Protect /admin routes from non-admin accounts
  if (token && isAdminRoute && userRole !== 'admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // 3. Redirect logged-in users away from auth pages to their respective target page
  if (token && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = userRole === 'admin' ? '/admin' : '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.).*)',
  ],
};
