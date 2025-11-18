import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/backup-token
 *
 * Returns the current authentication token for backup purposes.
 * This endpoint is ONLY used before starting impersonation to save
 * the admin's original token as a fallback recovery mechanism.
 *
 * Security: Only returns the token if one exists in the httpOnly cookie.
 * The token is used as a backup in case the endImpersonation mutation fails.
 */
export async function GET(request: NextRequest) {
  try {
    const currentToken = request.cookies.get('token')?.value;

    if (!currentToken) {
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 401 }
      );
    }

    console.log('📦 Backup token retrieved for impersonation safety');

    return NextResponse.json({
      token: currentToken,
      timestamp: new Date().toISOString(),
      purpose: 'impersonation-backup'
    });

  } catch (error) {
    console.error('Backup token error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve backup token' },
      { status: 500 }
    );
  }
}
