import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const checkEmailSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate email format
    const validation = checkEmailSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { exists: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Query GraphQL backend to check if email exists
    const graphqlResponse = await fetch(
      process.env.GRAPHQL_BACKEND_URL || 'http://localhost:3001/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query CheckEmailExists($email: String!) {
              checkEmailExists(email: $email)
            }
          `,
          variables: {
            email,
          },
        }),
      }
    );

    const result = await graphqlResponse.json();

    if (result.errors) {
      console.error('GraphQL Error checking email:', result.errors);
      return NextResponse.json(
        { exists: false, error: 'Failed to check email' },
        { status: 500 }
      );
    }

    const exists = result.data.checkEmailExists;

    return NextResponse.json({ exists });
  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json(
      { exists: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
