import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, createRateLimitResponse } from '@/lib/rate-limiter';
import { validateAndSanitize, isInputSafe } from '@/lib/sanitizer';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting: 5 login attempts per 15 minutes
    const rateLimitResult = rateLimit(request, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    });

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    const body = await request.json();
    
    // Security check for malicious input
    const emailInput = body.email || '';
    const passwordInput = body.password || '';
    
    if (!isInputSafe(emailInput) || !isInputSafe(passwordInput)) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400 }
      );
    }
    
    // Validate and sanitize input
    const validatedData = validateAndSanitize(loginSchema, body);
    
    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Login attempt:', { email: validatedData.email });
      console.log('Backend URL:', process.env.GRAPHQL_BACKEND_URL);
    }
    
    // Forward request to GraphQL backend
    const graphqlResponse = await fetch(process.env.GRAPHQL_BACKEND_URL || 'http://localhost:3001/graphql', {
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
        variables: validatedData,
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
      console.error('GraphQL Login Error:', graphqlResult.errors);
      return NextResponse.json(
        { error: 'Invalid credentials', debug: graphqlResult.errors },
        { status: 401 }
      );
    }

    const { user, access_token } = graphqlResult.data.login;

    // Use the token from backend (ensures compatibility)
    const response = NextResponse.json({ user });
    
    // Set secure httpOnly cookie with backend token
    response.cookies.set('token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days (or whatever the backend token expiration is)
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

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}