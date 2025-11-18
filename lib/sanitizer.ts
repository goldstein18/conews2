// Simple sanitizer to prevent XSS attacks
// For production, consider using a library like DOMPurify for client-side or isomorphic-dompurify for server-side

export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Encode HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    // Remove null bytes and control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }

  return email
    .trim()
    .toLowerCase()
    // Basic email sanitization - only allow alphanumeric, dots, hyphens, underscores, plus, and @ symbol
    .replace(/[^a-z0-9.@_+-]/g, '');
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      if (key === 'email') {
        sanitized[key as keyof T] = sanitizeEmail(value) as T[keyof T];
      } else {
        sanitized[key as keyof T] = sanitizeString(value) as T[keyof T];
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key as keyof T] = sanitizeObject(value as Record<string, unknown>) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value as T[keyof T];
    }
  }

  return sanitized;
}

// Validate and sanitize form data
export function validateAndSanitize<T>(schema: { parse: (data: unknown) => T }, data: unknown): T {
  // First sanitize the data
  const sanitizedData = sanitizeObject(data as Record<string, unknown>);
  
  // Then validate with Zod
  return schema.parse(sanitizedData);
}

// Check for common SQL injection patterns (basic protection)
export function containsSQLInjection(input: string): boolean {
  if (typeof input !== 'string') {
    return false;
  }

  const sqlInjectionPatterns = [
    /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
    /(\bUNION\b|\bJOIN\b)/i,
    /(--|\#|\/\*)/,
    /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/i,
    /('\s*(OR|AND)\s*')/i,
  ];

  return sqlInjectionPatterns.some(pattern => pattern.test(input));
}

// Check for XSS patterns
export function containsXSS(input: string): boolean {
  if (typeof input !== 'string') {
    return false;
  }

  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]*onerror[^>]*>/gi,
    /<svg[^>]*onload[^>]*>/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

// Comprehensive security check
export function isInputSafe(input: string): boolean {
  return !containsSQLInjection(input) && !containsXSS(input);
}