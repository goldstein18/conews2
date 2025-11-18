import { NextResponse } from 'next/server';
import { getSecurityStats } from '@/lib/security-monitor';

export async function GET() {
  // This endpoint should be protected in production (admin only)
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  try {
    const stats = getSecurityStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Security stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}