import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { rateLimit, createRateLimitResponse } from '@/lib/rate-limiter';
import { captureGraphQLError, addBreadcrumb } from '@/lib/sentry';

export async function POST(request: NextRequest) {
  try {
    // Apply moderate rate limiting: 100 requests per minute per IP for GraphQL
    const rateLimitResult = rateLimit(request, {
      maxRequests: 100,
      windowMs: 60 * 1000, // 1 minute
    });

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    // Debug: Log request details
    console.log('GraphQL Request Headers:', Object.fromEntries(request.headers.entries()));
    console.log('GraphQL Request Method:', request.method);
    console.log('GraphQL Request URL:', request.url);

    let body;
    let requestText = '';
    try {
      requestText = await request.text();
      console.log('GraphQL Request Body (raw):', requestText);
      
      if (!requestText) {
        console.error('Empty request body received');
        return NextResponse.json(
          { error: 'Empty request body' },
          { status: 400 }
        );
      }
      
      body = JSON.parse(requestText);
      console.log('GraphQL Request Body (parsed):', body);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      console.error('Request body type:', typeof requestText);
      console.error('Request body content:', requestText);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    const token = request.cookies.get('token')?.value;

    // Add breadcrumb for GraphQL request
    addBreadcrumb(
      'GraphQL request initiated',
      'graphql',
      {
        operationName: body.operationName,
        hasToken: !!token,
      }
    );

    // Validate GraphQL query structure
    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid GraphQL query' },
        { status: 400 }
      );
    }

    // Prepare headers for backend request
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists and is valid
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
        headers['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        // Token is invalid, proceed without authorization
        console.warn('Invalid token in GraphQL request:', error);
        addBreadcrumb('Invalid JWT token detected', 'auth', { 
          error: error instanceof Error ? error.message : String(error) 
        });
      }
    }

    // Debug log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('GraphQL Request:', {
        query: body.query,
        variables: JSON.stringify(body.variables, null, 2), // ✅ Show actual array contents
        operationName: body.operationName,
      });
    }

    // Forward request to GraphQL backend
    const graphqlResponse = await fetch(process.env.GRAPHQL_BACKEND_URL || 'http://localhost:3001/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: body.query,
        variables: body.variables || {},
        operationName: body.operationName,
      }),
    });

    const graphqlResult = await graphqlResponse.json();

    // Debug log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('GraphQL Response Status:', graphqlResponse.status);
      console.log('GraphQL Result:', JSON.stringify(graphqlResult, null, 2));
    }

    // Check for GraphQL errors and report to Sentry
    if (graphqlResult.errors && graphqlResult.errors.length > 0) {
      addBreadcrumb('GraphQL errors received', 'graphql', {
        errorCount: graphqlResult.errors.length,
        operationName: body.operationName,
      });
      
      graphqlResult.errors.forEach((error: unknown) => {
        captureGraphQLError(error, body.query, body.variables);
      });
    }

    // Add success breadcrumb
    addBreadcrumb('GraphQL request completed', 'graphql', {
      status: graphqlResponse.status,
      hasData: !!graphqlResult.data,
      hasErrors: !!graphqlResult.errors,
    });

    // Return the GraphQL response as-is
    return NextResponse.json(graphqlResult, {
      status: graphqlResponse.status,
    });
    
  } catch (error) {
    console.error('GraphQL proxy error:', error);
    
    // Capture the error in Sentry
    captureGraphQLError(error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}