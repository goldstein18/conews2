import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, createRateLimitResponse } from '@/lib/rate-limiter';
import { validateAndSanitize, isInputSafe } from '@/lib/sanitizer';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  tagIds: z.array(z.string()).optional().default([]),
  turnstileToken: z.string().min(1, 'Bot verification token is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting: 3 registration attempts per 15 minutes
    const rateLimitResult = rateLimit(request, {
      maxRequests: 3,
      windowMs: 15 * 60 * 1000, // 15 minutes
    });

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    const body = await request.json();

    // Security check for malicious input
    const emailInput = body.email || '';
    const passwordInput = body.password || '';
    const firstNameInput = body.firstName || '';
    const lastNameInput = body.lastName || '';

    if (!isInputSafe(emailInput) || !isInputSafe(passwordInput) ||
        !isInputSafe(firstNameInput) || !isInputSafe(lastNameInput)) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400 }
      );
    }

    // Validate and sanitize input
    const validatedData = validateAndSanitize(registerSchema, body);

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Registration attempt:', {
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        city: validatedData.city,
        state: validatedData.state,
        hasTurnstileToken: !!validatedData.turnstileToken
      });
      console.log('Backend URL:', process.env.GRAPHQL_BACKEND_URL);
    }

    // Verify Turnstile token before proceeding
    const turnstileVerifyResponse = await fetch(
      `${request.nextUrl.origin}/api/auth/verify-turnstile`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: validatedData.turnstileToken }),
      }
    );

    const turnstileResult = await turnstileVerifyResponse.json();

    if (!turnstileResult.success) {
      console.warn('🤖 Turnstile verification failed:', turnstileResult.error);
      return NextResponse.json(
        {
          error: turnstileResult.error || 'Bot verification failed. Please try again.',
          errorCodes: turnstileResult.errorCodes
        },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Turnstile verification successful');
    }

    // Forward request to GraphQL backend
    const graphqlResponse = await fetch(process.env.GRAPHQL_BACKEND_URL || 'http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation CreateSubscriber($createSubscriberInput: CreateSubscriberInput!) {
            createSubscriber(createSubscriberInput: $createSubscriberInput) {
              id
              email
              firstName
              lastName
              userField {
                city
                state
                address
                zipcode
              }
              role {
                id
                name
                displayName
              }
              createdAt
            }
          }
        `,
        variables: {
          createSubscriberInput: {
            email: validatedData.email,
            password: validatedData.password,
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            city: validatedData.city,
            state: validatedData.state,
            ...(validatedData.tagIds && validatedData.tagIds.length > 0 && {
              tagIds: validatedData.tagIds
            })
          }
        },
      }),
    });

    // Check if response is actually JSON
    const responseText = await graphqlResponse.text();
    let graphqlResult;

    try {
      graphqlResult = JSON.parse(responseText);
    } catch {
      console.error('GraphQL Response is not valid JSON. Status:', graphqlResponse.status);
      console.error('Response body:', responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''));

      return NextResponse.json(
        {
          error: 'Backend connection failed',
          debug: process.env.NODE_ENV === 'development' ? {
            status: graphqlResponse.status,
            url: process.env.GRAPHQL_BACKEND_URL || 'http://localhost:3001/graphql',
            responsePreview: responseText.substring(0, 200)
          } : undefined
        },
        { status: 502 }
      );
    }

    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('GraphQL Response Status:', graphqlResponse.status);
      console.log('GraphQL Result:', JSON.stringify(graphqlResult, null, 2));
    }

    if (graphqlResult.errors) {
      console.error('GraphQL Registration Error:', graphqlResult.errors);

      // Check for specific error messages
      const errorMessage = graphqlResult.errors[0]?.message || 'Registration failed';

      // Handle duplicate email error
      if (errorMessage.toLowerCase().includes('already exists') ||
          errorMessage.toLowerCase().includes('duplicate')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: errorMessage, debug: graphqlResult.errors },
        { status: 400 }
      );
    }

    const subscriber = graphqlResult.data.createSubscriber;

    // Auto-login: Now call the login endpoint to get the token
    const loginResponse = await fetch(process.env.GRAPHQL_BACKEND_URL || 'http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation Login($email: String!, $password: String!) {
            login(loginInput: { email: $email, password: $password }) {
              access_token
              user {
                id
                email
                firstName
                lastName
                role {
                  name
                }
                isActive
                createdAt
                updatedAt
              }
            }
          }
        `,
        variables: {
          email: validatedData.email,
          password: validatedData.password
        },
      }),
    });

    const loginResult = await loginResponse.json();

    if (loginResult.errors) {
      // Registration succeeded but auto-login failed
      console.error('Auto-login failed after registration:', loginResult.errors);
      return NextResponse.json(
        {
          user: subscriber,
          message: 'Registration successful. Please login to continue.',
          shouldRedirectToLogin: true
        },
        { status: 201 }
      );
    }

    const { user, access_token } = loginResult.data.login;

    // Create response with user data
    const response = NextResponse.json({
      user,
      message: 'Registration successful! Welcome to CultureOwl!'
    }, { status: 201 });

    // Set secure httpOnly cookie with backend token
    response.cookies.set('token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
