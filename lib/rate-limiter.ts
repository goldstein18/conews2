import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Cleanup every minute

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): RateLimitResult {
  // Get client IP address
  const ip = getClientIP(request);
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);
  
  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  const success = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);

  return {
    success,
    remaining,
    resetTime: entry.resetTime,
  };
}

function getClientIP(request: NextRequest): string {
  // Try to get IP from various headers (for different deployment scenarios)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cloudflareIP = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }

  if (cloudflareIP) {
    return cloudflareIP;
  }

  // Fallback to a default IP if none found
  return '127.0.0.1';
}

export function createRateLimitResponse(result: RateLimitResult) {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.resetTime.toString(),
        'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
      },
    }
  );
}