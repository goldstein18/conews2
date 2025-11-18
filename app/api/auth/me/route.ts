import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify JWT token (using same secret as backend)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);

    // Forward request to GraphQL backend to get user data
    const graphqlResponse = await fetch(process.env.GRAPHQL_BACKEND_URL || 'http://localhost:3001/graphql', {
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
    });

    const graphqlResult = await graphqlResponse.json();

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('ME Query Response Status:', graphqlResponse.status);
      console.log('ME Query Result:', JSON.stringify(graphqlResult, null, 2));
    }

    if (graphqlResult.errors) {
      console.error('ME Query Error:', graphqlResult.errors);
      return NextResponse.json(
        { error: 'Invalid token', debug: graphqlResult.errors },
        { status: 401 }
      );
    }

    return NextResponse.json({ user: graphqlResult.data.me });
    
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}