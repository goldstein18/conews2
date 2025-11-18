import { NextResponse } from 'next/server';

export async function POST() {
  // Refresh token functionality temporarily disabled
  // Using backend tokens directly for compatibility
  return NextResponse.json(
    { error: 'Refresh token not implemented. Please login again.' },
    { status: 401 }
  );
}