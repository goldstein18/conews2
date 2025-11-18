# Security Implementation Guide

## Overview
This document outlines the security measures implemented in the frontend-eventos application to protect against common web vulnerabilities.

## Implemented Security Measures

### 1. Backend for Frontend (BFF) Pattern
- **Implementation**: All GraphQL requests go through `/api/graphql` proxy endpoint
- **Benefits**: 
  - Hides backend API structure from client
  - Allows server-side validation and sanitization
  - Enables request filtering and rate limiting
  - Reduces attack surface

### 2. Secure Authentication
- **JWT Tokens**: Short-lived access tokens (15 minutes) with refresh tokens (7 days)
- **httpOnly Cookies**: Tokens stored in secure, httpOnly cookies to prevent XSS attacks
- **Token Rotation**: Automatic token refresh using refresh tokens
- **Secure Secrets**: Environment-based JWT secrets (minimum 32 characters)

### 3. Rate Limiting
- **Login Protection**: 5 attempts per 15 minutes per IP
- **IP-based Tracking**: Supports various proxy headers (X-Forwarded-For, X-Real-IP, CF-Connecting-IP)
- **Automatic Cleanup**: Expired rate limit entries are cleaned periodically

### 4. Input Validation and Sanitization
- **Zod Schemas**: Comprehensive validation with type safety
- **Input Sanitization**: HTML tag removal, entity encoding, control character filtering
- **Security Patterns**: Detection of SQL injection and XSS attempts
- **Email Validation**: RFC 5321 compliant email validation

### 5. Content Security Policy (CSP)
- **Strict Policies**: Only allow resources from same origin
- **Script Sources**: Controlled script execution (dev: unsafe-eval, prod: strict)
- **Style Sources**: Allows inline styles for Tailwind CSS
- **Frame Protection**: Prevents clickjacking with frame-src 'none'

### 6. Security Headers
- **X-Frame-Options**: DENY - prevents clickjacking
- **X-Content-Type-Options**: nosniff - prevents MIME type sniffing
- **X-XSS-Protection**: Legacy XSS protection for older browsers
- **Referrer-Policy**: strict-origin-when-cross-origin
- **HSTS**: Strict Transport Security in production
- **Permissions-Policy**: Restricts browser features

### 7. Environment Security
- **Environment Variables**: Secrets stored in environment variables
- **Git Protection**: .env files excluded from version control
- **Production Secrets**: Secure random generation recommended

## Security Checklist

### Development
- [ ] Use HTTPS in production
- [ ] Generate secure JWT secrets (minimum 32 characters)
- [ ] Configure CORS properly for production domains
- [ ] Implement proper error handling (don't leak sensitive info)
- [ ] Use environment variables for all secrets

### Production Deployment
- [ ] Set NODE_ENV=production
- [ ] Configure secure cookies (secure: true, sameSite: 'strict')
- [ ] Enable HSTS headers
- [ ] Set up proper logging and monitoring
- [ ] Configure rate limiting storage (Redis recommended)
- [ ] Implement IP whitelisting if needed

### Monitoring
- [ ] Log authentication attempts
- [ ] Monitor rate limiting violations
- [ ] Set up alerts for security events
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning

## Environment Variables

### Required Production Variables
```env
# JWT Secrets (generate secure random strings)
JWT_SECRET=your-secure-32-character-minimum-secret-here
JWT_REFRESH_SECRET=your-secure-32-character-minimum-refresh-secret-here

# Backend URL (internal)
GRAPHQL_BACKEND_URL=https://your-backend-api.com/graphql

# Node Environment
NODE_ENV=production
```

### Security Best Practices for Secrets
1. Use cryptographically secure random generators
2. Minimum 32 characters for JWT secrets
3. Different secrets for access and refresh tokens
4. Rotate secrets regularly
5. Store in secure key management systems

## Common Vulnerabilities Addressed

### XSS (Cross-Site Scripting)
- **httpOnly cookies**: Tokens not accessible via JavaScript
- **CSP headers**: Restrict script sources
- **Input sanitization**: HTML tag removal and entity encoding
- **Output encoding**: Safe rendering of user content

### CSRF (Cross-Site Request Forgery)
- **SameSite cookies**: Prevent cross-site cookie usage
- **Origin validation**: Check request origins
- **Custom headers**: Require custom headers for API requests

### SQL Injection
- **Input validation**: Zod schema validation
- **Parameterized queries**: Backend uses parameterized queries
- **Input sanitization**: Remove dangerous SQL patterns

### Session Fixation
- **Token rotation**: New tokens on login
- **Secure sessions**: httpOnly, secure cookies
- **Session timeout**: Short-lived access tokens

### Clickjacking
- **X-Frame-Options**: Deny all framing
- **CSP frame-src**: Prevent iframe embedding

### Information Disclosure
- **Error handling**: Generic error messages
- **Stack traces**: Hidden in production
- **Debug info**: Disabled in production

## Testing Security

### Automated Testing
```bash
# Run security linting
npm audit

# Check for vulnerable dependencies
npm audit fix

# Run ESLint security rules
npm run lint
```

### Manual Testing
1. Test rate limiting with multiple login attempts
2. Verify CSP headers in browser dev tools
3. Check cookie settings (httpOnly, secure, sameSite)
4. Test input validation with malicious payloads
5. Verify token expiration and refresh flow

## Incident Response

### If Security Breach Suspected
1. Immediately rotate all JWT secrets
2. Invalidate all active sessions
3. Review logs for suspicious activity
4. Check for data exfiltration
5. Implement additional monitoring

### Regular Maintenance
- Weekly dependency updates
- Monthly security reviews
- Quarterly penetration testing
- Annual security audits

## Resources

### Security Tools
- [OWASP ZAP](https://owasp.org/www-project-zap/) - Web application security scanner
- [Snyk](https://snyk.io/) - Dependency vulnerability scanning
- [Security Headers](https://securityheaders.com/) - Header analysis

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [JWT Security Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)