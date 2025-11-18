import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify current user has admin token
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // 2. Verify JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // 3. Check if user is admin or super admin
    const userRole = payload.role as string;
    if (!['SUPER_ADMIN', 'ADMIN'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Only SUPER_ADMIN and ADMIN can impersonate users.' },
        { status: 403 }
      );
    }

    // 4. Get request body
    const body = await request.json();
    const { targetUserId, reason } = body;

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'targetUserId is required' },
        { status: 400 }
      );
    }

    // 5. Call GraphQL backend to start impersonation
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
            mutation StartImpersonation($input: StartImpersonationInput!) {
              startImpersonation(input: $input) {
                access_token
                impersonatedUser {
                  id
                  email
                  firstName
                  lastName
                  role {
                    id
                    name
                  }
                }
                sessionId
                expiresIn
                message
              }
            }
          `,
          variables: {
            input: {
              targetUserId,
              reason: reason || undefined,
            },
          },
        }),
      }
    );

    const graphqlResult = await graphqlResponse.json();

    // 6. Handle errors
    if (graphqlResult.errors) {
      console.error('Start impersonation error:', graphqlResult.errors);
      return NextResponse.json(
        {
          error: graphqlResult.errors[0]?.message || 'Failed to start impersonation',
          details: graphqlResult.errors
        },
        { status: 400 }
      );
    }

    const { access_token, impersonatedUser, sessionId, expiresIn, message } =
      graphqlResult.data.startImpersonation;

    // 7. Set new impersonation token as httpOnly cookie
    const response = NextResponse.json({
      success: true,
      impersonatedUser,
      sessionId,
      expiresIn,
      message,
      originalAdmin: {
        id: payload.sub,
        email: payload.email,
        name: `${payload.firstName || ''} ${payload.lastName || ''}`.trim(),
      },
    });

    // Set the impersonation token (short-lived, 1 hour)
    response.cookies.set('token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    console.log(`🎭 Impersonation started: ${payload.email} -> ${impersonatedUser.email}`);

    return response;
  } catch (error) {
    console.error('Start impersonation error:', error);
    return NextResponse.json(
      { error: 'Failed to start impersonation' },
      { status: 500 }
    );
  }
}
