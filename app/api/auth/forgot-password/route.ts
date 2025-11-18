import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, createRateLimitResponse } from '@/lib/rate-limiter';
import { validateAndSanitize, isInputSafe } from '@/lib/sanitizer';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
});

/**
 * POST /api/auth/forgot-password
 *
 * Request password reset link via email.
 * Security: Always returns the same message to prevent email enumeration.
 * Rate limited to 3 requests per hour per email address.
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting: 3 requests per hour per email
    const rateLimitResult = rateLimit(request, {
      maxRequests: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
    });

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    const body = await request.json();

    // Security check for malicious input
    const emailInput = body.email || '';

    if (!isInputSafe(emailInput)) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400 }
      );
    }

    // Validate and sanitize input
    const validatedData = validateAndSanitize(forgotPasswordSchema, body);

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 Password reset request:', { email: validatedData.email });
    }

    // Forward request to GraphQL backend
    const graphqlResponse = await fetch(process.env.GRAPHQL_BACKEND_URL || 'http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation RequestPasswordReset($email: String!) {
            requestPasswordReset(input: { email: $email }) {
              success
              message
            }
          }
        `,
        variables: { email: validatedData.email },
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

    // Handle GraphQL errors (e.g., rate limit from backend)
    if (graphqlResult.errors) {
      const errorMessage = graphqlResult.errors[0]?.message || 'An error occurred';

      // Check for rate limit error from backend
      if (errorMessage.includes('Too many') || errorMessage.includes('rate limit')) {
        return NextResponse.json(
          {
            error: 'Too many password reset requests. Please try again in 60 minutes.',
            code: 'TOO_MANY_REQUESTS'
          },
          { status: 429 }
        );
      }

      console.error('GraphQL Error:', graphqlResult.errors);

      // Still return success message for security (don't reveal backend errors)
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link shortly.'
      });
    }

    const { message } = graphqlResult.data.requestPasswordReset;

    // Always return the same generic message for security
    return NextResponse.json({
      success: true,
      message: message || 'If an account exists with this email, you will receive a password reset link shortly.'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email format', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Forgot password error:', error);

    // Return generic success message even on error (security)
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link shortly.'
    });
  }
}
