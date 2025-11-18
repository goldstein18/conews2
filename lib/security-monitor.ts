import { NextRequest } from 'next/server';

interface SecurityEvent {
  ip: string;
  endpoint: string;
  timestamp: number;
  type: 'failed_auth' | 'rate_limit' | 'suspicious_pattern';
}

// In-memory store for security events (in production, use Redis or database)
const securityEvents: SecurityEvent[] = [];
const suspiciousIPs = new Set<string>();

// Cleanup old events periodically
setInterval(() => {
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
  const oldEventsIndex = securityEvents.findIndex(event => event.timestamp > fiveMinutesAgo);
  if (oldEventsIndex > 0) {
    securityEvents.splice(0, oldEventsIndex);
  }
}, 60000); // Cleanup every minute

function getClientIP(request: NextRequest): string {
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

  return '127.0.0.1';
}

export function logSecurityEvent(
  request: NextRequest, 
  type: SecurityEvent['type'], 
  endpoint: string
) {
  const ip = getClientIP(request);
  const event: SecurityEvent = {
    ip,
    endpoint,
    timestamp: Date.now(),
    type,
  };

  securityEvents.push(event);

  // Check for suspicious patterns
  checkSuspiciousActivity(ip);

  // Log for monitoring (in production, send to monitoring service)
  if (process.env.NODE_ENV === 'development') {
    console.warn(`🚨 Security Event: ${type} from ${ip} on ${endpoint}`);
  }
}

function checkSuspiciousActivity(ip: string) {
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
  const recentEvents = securityEvents.filter(
    event => event.ip === ip && event.timestamp > fiveMinutesAgo
  );

  // Patterns that indicate potential attacks
  const failedAuthCount = recentEvents.filter(e => e.type === 'failed_auth').length;
  const rateLimitCount = recentEvents.filter(e => e.type === 'rate_limit').length;

  // Mark IP as suspicious if:
  // - More than 10 failed auth attempts in 5 minutes
  // - More than 5 rate limit violations in 5 minutes
  if (failedAuthCount > 10 || rateLimitCount > 5) {
    suspiciousIPs.add(ip);
    console.error(`🚨 SUSPICIOUS IP DETECTED: ${ip} - Failed Auth: ${failedAuthCount}, Rate Limits: ${rateLimitCount}`);
  }
}

export function isSuspiciousIP(request: NextRequest): boolean {
  const ip = getClientIP(request);
  return suspiciousIPs.has(ip);
}

export function getSecurityStats() {
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
  const recentEvents = securityEvents.filter(event => event.timestamp > fiveMinutesAgo);

  return {
    totalEvents: recentEvents.length,
    byType: {
      failed_auth: recentEvents.filter(e => e.type === 'failed_auth').length,
      rate_limit: recentEvents.filter(e => e.type === 'rate_limit').length,
      suspicious_pattern: recentEvents.filter(e => e.type === 'suspicious_pattern').length,
    },
    suspiciousIPs: Array.from(suspiciousIPs),
    topIPs: getTopOffenders(recentEvents),
  };
}

function getTopOffenders(events: SecurityEvent[]): Array<{ip: string, count: number}> {
  const ipCounts = events.reduce((acc, event) => {
    acc[event.ip] = (acc[event.ip] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(ipCounts)
    .map(([ip, count]) => ({ ip, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}