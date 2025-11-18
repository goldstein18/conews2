import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT secrets are not defined in environment variables');
}

const secret = new TextEncoder().encode(JWT_SECRET);
const refreshSecret = new TextEncoder().encode(JWT_REFRESH_SECRET);

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function createTokens(payload: Omit<JWTPayload, 'iat' | 'exp'>) {
  const now = Math.floor(Date.now() / 1000);

  // Access token (15 minutes)
  const accessToken = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + 15 * 60) // 15 minutes
    .sign(secret);

  // Refresh token (7 days)
  const refreshToken = await new SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + 7 * 24 * 60 * 60) // 7 days
    .sign(refreshSecret);

  return { accessToken, refreshToken };
}

export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    throw new Error('Invalid access token');
  }
}

export async function verifyRefreshToken(token: string): Promise<{ userId: string }> {
  try {
    const { payload } = await jwtVerify(token, refreshSecret);
    return payload as { userId: string };
  } catch {
    throw new Error('Invalid refresh token');
  }
}

export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value || null;
}

export async function getRefreshTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('refreshToken')?.value || null;
}