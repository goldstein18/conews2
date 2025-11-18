import { NextRequest, NextResponse } from 'next/server';

/**
 * Cloudflare Turnstile Server-Side Verification
 *
 * This endpoint verifies Turnstile tokens with Cloudflare's siteverify API
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    // Validate token presence
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Turnstile token is required'
        },
        { status: 400 }
      );
    }

    // Check if bot protection is enabled
    const skipBotProtection = process.env.SKIP_BOT_PROTECTION === 'true';
    if (skipBotProtection) {
      console.warn('⚠️ Bot protection is DISABLED (SKIP_BOT_PROTECTION=true)');
      return NextResponse.json({
        success: true,
        message: 'Bot protection skipped (development mode)'
      });
    }

    // Validate secret key is configured
    const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (!secretKey) {
      console.error('❌ CLOUDFLARE_TURNSTILE_SECRET_KEY is not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'Bot protection is not configured properly'
        },
        { status: 500 }
      );
    }

    // Verify token with Cloudflare
    const formData = new FormData();
    formData.append('secret', secretKey);
    formData.append('response', token);

    // Optional: Add remote IP for additional verification
    const remoteIp = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    if (remoteIp !== 'unknown') {
      formData.append('remoteip', remoteIp);
    }

    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: formData,
      }
    );

    const verifyResult: TurnstileVerifyResponse = await verifyResponse.json();

    // Log verification result in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Turnstile Verification Result:', {
        success: verifyResult.success,
        errorCodes: verifyResult['error-codes'],
        hostname: verifyResult.hostname,
      });
    }

    if (!verifyResult.success) {
      const errorCodes = verifyResult['error-codes'] || [];

      // Map Cloudflare error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        'missing-input-secret': 'Bot protection configuration error',
        'invalid-input-secret': 'Bot protection configuration error',
        'missing-input-response': 'Bot verification is required',
        'invalid-input-response': 'Bot verification failed. Please try again.',
        'timeout-or-duplicate': 'Bot verification expired. Please try again.',
        'internal-error': 'Bot verification temporarily unavailable',
      };

      const errorMessage = errorCodes
        .map((code) => errorMessages[code] || 'Bot verification failed')
        .join(', ') || 'Bot verification failed';

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          errorCodes: process.env.NODE_ENV === 'development' ? errorCodes : undefined,
        },
        { status: 400 }
      );
    }

    // Verification successful
    return NextResponse.json({
      success: true,
      message: 'Bot verification successful',
      hostname: verifyResult.hostname,
      challengeTs: verifyResult.challenge_ts,
    });

  } catch (error) {
    console.error('Turnstile verification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Bot verification failed. Please try again.'
      },
      { status: 500 }
    );
  }
}
