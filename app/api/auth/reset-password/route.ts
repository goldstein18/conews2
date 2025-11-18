import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateAndSanitize, isInputSafe } from '@/lib/sanitizer';

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

/**
 * POST /api/auth/reset-password
 *
 * Reset user password with a valid reset token.
 * On success, automatically logs in the user by setting httpOnly cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('📥 Reset password request:', {
        hasToken: !!body.token,
        tokenLength: body.token?.length || 0,
        hasPassword: !!body.newPassword,
        passwordLength: body.newPassword?.length || 0,
        bodyKeys: Object.keys(body),
      });
    }

    // Security check for malicious input
    const tokenInput = body.token || '';
    const passwordInput = body.newPassword || '';

    if (!isInputSafe(tokenInput) || !isInputSafe(passwordInput)) {
      console.error('❌ Security check failed');
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400 }
      );
    }

    // Validate and sanitize input
    const validatedData = validateAndSanitize(resetPasswordSchema, body);

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Resetting password with token');
    }

    // Forward request to GraphQL backend
    const graphqlResponse = await fetch(process.env.GRAPHQL_BACKEND_URL || 'http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation ResetPassword($token: String!, $newPassword: String!) {
            resetPassword(input: { token: $token, newPassword: $newPassword }) {
              access_token
              user {
                id
                email
                firstName
                lastName
                avatar
                role {
                  name
                  displayName
                }
              }
            }
          }
        `,
        variables: {
          token: validatedData.token,
          newPassword: validatedData.newPassword,
        },
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
          error: 'Backend connection failed',
          debug: process.env.NODE_ENV === 'development' ? {
            status: graphqlResponse.status,
            responsePreview: responseText.substring(0, 200)
          } : undefined
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
      const errorMessage = graphqlResult.errors[0]?.message || 'Reset failed';

      console.error('GraphQL Error:', graphqlResult.errors);

      // Handle specific error cases
      if (errorMessage.includes('expired')) {
        return NextResponse.json(
          { error: 'Reset link has expired. Please request a new one.' },
          { status: 400 }
        );
      }

      if (errorMessage.includes('used') || errorMessage.includes('invalid')) {
        return NextResponse.json(
          { error: 'This reset link is invalid or has already been used.' },
          { status: 400 }
        );
      }

      if (errorMessage.includes('Password must contain')) {
        return NextResponse.json(
          { error: errorMessage },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Password reset failed. Please try again.' },
        { status: 400 }
      );
    }

    const { user, access_token } = graphqlResult.data.resetPassword;

    // Create response with user data
    const response = NextResponse.json({ user });

    // Set secure httpOnly cookie with backend token (auto-login)
    response.cookies.set('token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Password reset successful, user auto-logged in:', {
        email: user.email,
        role: user.role?.name,
      });
    }

    return response;

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Zod validation error:', JSON.stringify(error.issues, null, 2));
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('❌ Reset password error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
