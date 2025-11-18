import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function POST(request: NextRequest) {
  try {
    // 1. Get current token (should be impersonation token)
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // 2. Verify JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);

    // 3. Call GraphQL backend to end impersonation
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
            mutation EndImpersonation {
              endImpersonation {
                access_token
                user {
                  id
                  email
                  firstName
                  lastName
                  role {
                    id
                    name
                  }
                }
                message
              }
            }
          `,
        }),
      }
    );

    const graphqlResult = await graphqlResponse.json();

    // 4. Handle errors
    if (graphqlResult.errors) {
      console.error('End impersonation error:', graphqlResult.errors);
      return NextResponse.json(
        {
          error: graphqlResult.errors[0]?.message || 'Failed to end impersonation',
          details: graphqlResult.errors
        },
        { status: 400 }
      );
    }

    const { access_token, user, message } = graphqlResult.data.endImpersonation;

    // 5. Set admin token back as httpOnly cookie
    const response = NextResponse.json({
      success: true,
      user,
      message,
    });

    // Restore admin token (normal 7-day expiry)
    response.cookies.set('token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    console.log(`🎭 Impersonation ended, returned to admin: ${user.email}`);

    return response;
  } catch (error) {
    console.error('End impersonation error:', error);
    return NextResponse.json(
      { error: 'Failed to end impersonation' },
      { status: 500 }
    );
  }
}
