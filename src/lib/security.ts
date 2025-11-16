// Security configuration and utilities for NAMNGAM

// Rate limiting storage (fallback for development)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security configuration
export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 1000, // requests per window (increased for development)
  LOGIN_RATE_LIMIT_MAX: 20, // login attempts per window (increased for development)
  
  // Session configuration
  SESSION_MAX_AGE: 60 * 60 * 8, // 8 hours instead of 30 days
  SESSION_UPDATE_AGE: 60 * 60 * 2, // 2 hours
  
  // File upload security
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ],
  
  // Password security
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SYMBOLS: true,
  
  // CSRF protection
  CSRF_TOKEN_EXPIRY: 60 * 60 * 24, // 24 hours
};

// Rate limiting middleware (memory-based for Edge Runtime compatibility)
export async function rateLimit(
  identifier: string,
  maxRequests: number = SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS
): Promise<{ success: boolean; remaining: number; error?: string; resetTime?: number }> {
  // Memory-based rate limiting (compatible with Edge Runtime)
  const now = Date.now();
  const windowStart = now - SECURITY_CONFIG.RATE_LIMIT_WINDOW;
  
  // Clean up old entries
  rateLimitStore.forEach((value, key) => {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  });
  
  // Check current rate limit
  const current = rateLimitStore.get(identifier);
  
  if (!current) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW });
    return { success: true, remaining: maxRequests - 1 };
  }
  
  if (current.count >= maxRequests) {
    return {
      success: false,
      error: 'Rate limit exceeded',
      remaining: 0,
      resetTime: current.resetTime
    };
  }
  
  current.count++;
  return { success: true, remaining: maxRequests - current.count };
}

// Get client IP for rate limiting
export function getClientIP(request: any): string {
  // Handle different request object structures
  const headers = request.headers || request.header || {};
  
  // Handle both Headers object and plain object
  const getHeader = (name: string) => {
    if (typeof headers.get === 'function') {
      return headers.get(name);
    }
    return headers[name] || headers[name.toLowerCase()];
  };
  
  const forwarded = getHeader('x-forwarded-for');
  const realIP = getHeader('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return request.ip || request.connection?.remoteAddress || 'unknown';
}

// Validate file upload security
export function validateFileUpload(file: File, maxSize: number = SECURITY_CONFIG.MAX_FILE_SIZE): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit` };
  }
  
  // Check file type
  if (!SECURITY_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed' };
  }
  
  // Check file extension matches MIME type
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif'
  };
  
  if (extension !== mimeToExt[file.type]) {
    return { valid: false, error: 'File extension does not match file type' };
  }
  
  return { valid: true };
}

// Password validation
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters long`);
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (SECURITY_CONFIG.PASSWORD_REQUIRE_SYMBOLS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return { valid: errors.length === 0, errors };
}

// Generate secure random token using crypto module
export function generateSecureToken(length: number = 32): string {
  const crypto = require('crypto');
  
  // Generate random bytes and convert to hex string
  const randomBytes = crypto.randomBytes(length);
  return randomBytes.toString('hex');
}

// Generate URL-safe token for API usage
export function generateURLSafeToken(length: number = 32): string {
  const crypto = require('crypto');
  
  // Generate random bytes and convert to URL-safe base64
  const randomBytes = crypto.randomBytes(length);
  return randomBytes.toString('base64url');
}

// Sanitize input to prevent XSS and injection attacks
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    // Remove potentially dangerous HTML tags and attributes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embed tags
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '') // Remove form tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers (onclick, onload, etc.)
    .replace(/<[^>]*>/g, '') // Remove all remaining HTML tags
    // Handle SQL injection patterns
    .replace(/[';]|--|(\s+(or|and)\s+.*=)|(union\s+select)/gi, '')
    // Handle NoSQL injection patterns
    .replace(/\$where/gi, '')
    .replace(/\$ne/gi, '')
    .replace(/\$gt/gi, '')
    .replace(/\$lt/gi, '')
    // Trim and limit length
    .trim()
    .substring(0, maxLength);
}

// Sanitize HTML content (for rich text editors)
export function sanitizeHTML(input: string, allowedTags: string[] = ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li']): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Create a simple whitelist sanitizer
  const tagPattern = new RegExp(`<(?!\\/?(${allowedTags.join('|')})\\s*\/?>)[^>]+>`, 'gi');
  
  return input
    .replace(tagPattern, '') // Remove disallowed tags
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
}

// Validate and sanitize file names
export function sanitizeFileName(fileName: string): string {
  if (typeof fileName !== 'string') {
    return '';
  }
  
  return fileName
    .replace(/[^a-zA-Z0-9.\-_]/g, '_') // Replace special characters with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .toLowerCase();
}

// Validate environment variables on startup
export function validateEnvironmentVariables(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const required = ['DATABASE_URL', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET'];
  
  // Simple approach - just check if process exists
  for (const envVar of required) {
    // @ts-ignore - process is available in Node.js environment
    if (!process?.env?.[envVar]) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }
  
  // Validate NEXTAUTH_SECRET strength
  // @ts-ignore
  if (process?.env?.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    errors.push('NEXTAUTH_SECRET should be at least 32 characters long');
  }
  
  // Validate DATABASE_URL format
  // @ts-ignore
  if (process?.env?.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgresql://')) {
    errors.push('DATABASE_URL should start with postgresql://');
  }
  
  return { valid: errors.length === 0, errors };
}