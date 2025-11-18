import { NextResponse } from 'next/server';

// Allow both GET and POST for easier testing
export async function GET() {
  return forceLogout();
}

export async function POST() {
  return forceLogout();
}

async function forceLogout() {
  try {
    
    const response = NextResponse.json({ message: 'Force logout successful' });
    
    // Multiple aggressive cookie clearing methods
    const cookiesToClear = ['token', 'refreshToken'];
    
    cookiesToClear.forEach(cookieName => {
      // Method 1: Delete with all possible configurations
      response.cookies.delete(cookieName);
      response.cookies.delete({ name: cookieName, path: '/' });
      response.cookies.delete({ name: cookieName, path: '/', domain: 'localhost' });
      
      // Method 2: Set expired cookies with all configurations
      const expiredDate = new Date(0);
      
      // Base config
      response.cookies.set(cookieName, '', {
        expires: expiredDate,
        maxAge: -1,
        path: '/',
      });
      
      // With httpOnly
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        expires: expiredDate,
        maxAge: -1,
        path: '/',
      });
      
      // With all security flags
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: false, // Force to false for localhost
        sameSite: 'lax', // More permissive for clearing
        expires: expiredDate,
        maxAge: -1,
        path: '/',
      });
    });

    // Add headers to prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
    
  } catch (error) {
    console.error('Force logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}