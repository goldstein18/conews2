import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateAndSanitize, isInputSafe } from '@/lib/sanitizer';

const validateTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

/**
 * POST /api/auth/validate-reset-token
 *
 * Validates a password reset token before allowing the user to set a new password.
 * Returns token validity status and associated email if valid.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Security check for malicious input
    const tokenInput = body.token || '';

    if (!isInputSafe(tokenInput)) {
      return NextResponse.json(
        {
          valid: false,
          email: null,
          message: 'Invalid token format'
        },
        { status: 400 }
      );
    }

    // Validate input
    const validatedData = validateAndSanitize(validateTokenSchema, body);

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Validating reset token');
    }

    // Forward request to GraphQL backend
    const graphqlResponse = await fetch(process.env.GRAPHQL_BACKEND_URL || 'http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation ValidateResetToken($token: String!) {
            validateResetToken(input: { token: $token }) {
              valid
              email
              message
            }
          }
        `,
        variables: { token: validatedData.token },
      }),
    });

    const responseText = await graphqlResponse.text();
    let graphqlResult;

    try {
      graphqlResult = JSON.parse(responseText);
    } catch {
      console.error('GraphQL Response is not valid JSON:', responseText.substring(0, 500));

      return NextResponse.json(
        {
          valid: false,
          email: null,
          message: 'Backend connection failed'
        },
        { status: 502 }
      );
    }

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('GraphQL Response:', JSON.stringify(graphqlResult, null, 2));
    }

    // Handle GraphQL errors
    if (graphqlResult.errors) {
      console.error('GraphQL Error:', graphqlResult.errors);

      return NextResponse.json(
        {
          valid: false,
          email: null,
          message: graphqlResult.errors[0]?.message || 'Token validation failed'
        },
        { status: 400 }
      );
    }

    const { valid, email, message } = graphqlResult.data.validateResetToken;

    return NextResponse.json({
      valid,
      email,
      message
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          valid: false,
          email: null,
          message: 'Invalid token format'
        },
        { status: 400 }
      );
    }

    console.error('Validate token error:', error);
    return NextResponse.json(
      {
        valid: false,
        email: null,
        message: 'An error occurred while validating the token'
      },
      { status: 500 }
    );
  }
}
