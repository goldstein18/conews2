import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🚪 LOGOUT ENDPOINT CALLED');
    
    // Create response
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Try multiple approaches to clear cookies
    
    // Method 1: Delete explicitly
    response.cookies.delete({
      name: 'token',
      path: '/',
    });
    
    response.cookies.delete({
      name: 'refreshToken', 
      path: '/',
    });
    
    // Method 2: Set to empty with immediate expiration
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: -1, // Negative maxAge to expire immediately
      path: '/',
    });

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: -1, // Negative maxAge to expire immediately
      path: '/',
    });

    console.log('🚪 Logout: All cookie clearing methods applied');
    return response;
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}