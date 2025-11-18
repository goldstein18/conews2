import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicPaths = ['/auth/login', '/auth/register', '/', '/events'];

export async function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;
    
    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set');
      // For now, just continue without JWT verification to avoid complete failure
      return NextResponse.next();
    }

    // Exclude API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // If it's a public route, allow access
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    // If user is authenticated and tries to access login/register, redirect to dashboard
    if (token && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Valid token found, redirecting to dashboard');
        }
        
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (error) {
        // Invalid token, allow access to login/register and clear cookies
        if (process.env.NODE_ENV === 'development') {
          console.log('Invalid token detected, clearing and allowing login access');
        }
        
        const response = NextResponse.next();
        response.cookies.delete('token');
        return response;
      }
    }
    return NextResponse.next();
  }

  // For protected routes, verify authentication
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/subscriber')) {
    if (!token) {
      if (process.env.NODE_ENV === 'development') {
        console.log('No token found, redirecting to login');
      }
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Token verified successfully, allowing access to protected route');
      }
      
      // Note: In middleware we can't verify specific role
      // because we don't have access to the database.
      // Role verification is done in dashboard layout
      
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login and clear cookie
      if (process.env.NODE_ENV === 'development') {
        console.log('Token verification failed, redirecting to login:', error);
      }
      
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of any middleware error, allow the request to continue
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - monitoring (Sentry tunnel)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|monitoring).*)',
  ],
};
