import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * POST /api/auth/set-token
 *
 * Updates the authentication token in httpOnly cookie.
 * Used during impersonation to switch between user tokens.
 *
 * @param token - The new JWT token to set
 * @returns Success response with cookie updated
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify the token is valid before setting it in cookie
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 401 }
      );
    }

    // Fetch user data from backend using the token
    let userData = null;
    try {
      const graphqlResponse = await fetch(
        process.env.GRAPHQL_BACKEND_URL || 'http://localhost:3001/graphql',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              query Me {
                me {
                  id
                  email
                  firstName
                  lastName
                  username
                  avatar
                  bio
                  phone
                  isActive
                  roleId
                  createdAt
                  updatedAt
                  lastLogin
                  emailVerified
                  profilePhotoUrl
                  role {
                    id
                    name
                  }
                }
              }
            `,
          }),
        }
      );

      const graphqlResult = await graphqlResponse.json();

      if (graphqlResult.errors) {
        console.error('Failed to fetch user data:', graphqlResult.errors);
        return NextResponse.json(
          { error: 'Invalid token: user not found' },
          { status: 401 }
        );
      }

      userData = graphqlResult.data.me;

      if (!userData) {
        console.error('User data is null from backend');
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      console.log('✅ User data fetched successfully:', {
        email: userData.email,
        firstName: userData.firstName,
        role: userData.role?.name
      });

    } catch (fetchError) {
      console.error('Error fetching user data:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    // Set the new token in httpOnly cookie and return user data
    const response = NextResponse.json({
      success: true,
      message: 'Token updated successfully',
      user: userData
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    console.log('✅ Token updated in httpOnly cookie');

    return response;
  } catch (error) {
    console.error('Set token error:', error);
    return NextResponse.json(
      { error: 'Failed to update token' },
      { status: 500 }
    );
  }
}
