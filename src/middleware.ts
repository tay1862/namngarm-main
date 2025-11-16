// @ts-ignore
import createMiddleware from 'next-intl/middleware';
// @ts-ignore
import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
import { getToken } from 'next-auth/jwt';
import { locales, defaultLocale } from './i18n';
import { getClientIP, SECURITY_CONFIG, validateEnvironmentVariables } from './lib/security';
import { logError } from './lib/error-handler';

// Validate environment variables on startup
const envValidation = validateEnvironmentVariables();
if (!envValidation.valid) {
  console.error('Environment validation failed:', envValidation.errors);
  // In production, you might want to exit the process
  // @ts-ignore
  if (process?.env?.NODE_ENV === 'production') {
    throw new Error('Invalid environment configuration');
  }
}

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

// Rate limiting for API routes (Edge Runtime compatible)
const apiRateLimit = new Map<string, { count: number; resetTime: number }>();

// Simple rate limiting function for Edge Runtime
function edgeRateLimit(
  identifier: string,
  maxRequests: number = SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS
): { success: boolean; remaining: number; error?: string; resetTime?: number } {
  const now = Date.now();
  const windowStart = now - SECURITY_CONFIG.RATE_LIMIT_WINDOW;
  
  // Clean up old entries
  for (const [key, value] of apiRateLimit.entries()) {
    if (value.resetTime < now) {
      apiRateLimit.delete(key);
    }
  }
  
  // Check current rate limit
  const current = apiRateLimit.get(identifier);
  
  if (!current) {
    apiRateLimit.set(identifier, { count: 1, resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW });
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);

  // Security headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()');
  
  // Add HSTS header only in production and for HTTPS requests
  if (process.env.NODE_ENV === 'production' && request.url.startsWith('https://')) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Skip i18n for admin, api, and static files
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/uploads')
  ) {
    // Rate limiting for API routes (except public settings)
    if (pathname.startsWith('/api') && !pathname.startsWith('/api/public/settings')) {
      const rateLimitKey = `api:${clientIP}`;
      const now = Date.now();
      const rateLimitResult = edgeRateLimit(rateLimitKey, SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS);
      
      if (!rateLimitResult.success) {
        const rateLimitResponse = new NextResponse(
          JSON.stringify({ success: false, error: rateLimitResult.error }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS.toString(),
              'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
              'X-RateLimit-Reset': rateLimitResult.resetTime ? new Date(rateLimitResult.resetTime).toUTCString() : '',
              'Retry-After': rateLimitResult.resetTime ? Math.ceil((rateLimitResult.resetTime - now) / 1000).toString() : '60'
            }
          }
        );
        
        // Apply security headers to rate limit response as well
        rateLimitResponse.headers.set('X-Content-Type-Options', 'nosniff');
        rateLimitResponse.headers.set('X-Frame-Options', 'DENY');
        rateLimitResponse.headers.set('X-XSS-Protection', '1; mode=block');
        rateLimitResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        rateLimitResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()');
        
        return rateLimitResponse;
      }
      
      // Add rate limit headers to successful responses as well
      response.headers.set('X-RateLimit-Limit', SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime ? new Date(rateLimitResult.resetTime).toUTCString() : '');
    }

    // Check auth for admin routes (except login)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      const token = await getToken({
        req: request,
        // @ts-ignore
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        const url = new URL('/admin/login', request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
      }

      // Check if session is still valid (not expired)
      if (token.exp && typeof token.exp === 'number' && token.exp < Date.now() / 1000) {
        const url = new URL('/admin/login', request.url);
        url.searchParams.set('callbackUrl', pathname);
        url.searchParams.set('error', 'session_expired');
        return NextResponse.redirect(url);
      }
    }
    
    return response;
  }

  // Handle public routes with i18n
  const intlResponse = intlMiddleware(request);
  
  // Add security headers to public routes as well
  Object.entries(response.headers).forEach(([key, value]) => {
    intlResponse.headers.set(key, value);
  });
  
  return intlResponse;
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
