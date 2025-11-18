import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {
  try {
    // 1. Get current token
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { currentImpersonation: null },
        { status: 200 }
      );
    }

    // 2. Verify JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);

    // 3. Query GraphQL backend for current impersonation session
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
            query CurrentImpersonation {
              currentImpersonation {
                id
                adminId
                targetUserId
                isActive
                startedAt
                endedAt
                reason
                admin {
                  id
                  email
                  firstName
                  lastName
                }
                targetUser {
                  id
                  email
                  firstName
                  lastName
                }
              }
            }
          `,
        }),
      }
    );

    const graphqlResult = await graphqlResponse.json();

    // 4. Handle errors
    if (graphqlResult.errors) {
      console.error('Current impersonation query error:', graphqlResult.errors);
      return NextResponse.json(
        { currentImpersonation: null },
        { status: 200 }
      );
    }

    const { currentImpersonation } = graphqlResult.data;

    return NextResponse.json({
      currentImpersonation,
    });
  } catch (error) {
    console.error('Current impersonation error:', error);
    return NextResponse.json(
      { currentImpersonation: null },
      { status: 200 }
    );
  }
}
