import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_EXPIRATION_SECONDS } from '@/lib/auth/session';
import { verifyAdminPassword } from '@/lib/auth/password';
import { checkLoginRateLimit, recordFailedLogin, resetLoginRateLimit } from '@/lib/auth/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Basic IP resolution for in-memory rate limiting (never logged or saved to database)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

    // Rate limit check
    const rateLimit = checkLoginRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts. Please try again in ${rateLimit.retryAfterSeconds || 60} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds || 60),
            'Cache-Control': 'private, no-store',
          },
        }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid login request' },
        { status: 400, headers: { 'Cache-Control': 'private, no-store' } }
      );
    }

    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401, headers: { 'Cache-Control': 'private, no-store' } }
      );
    }

    const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const configuredHash = process.env.ADMIN_PASSWORD_HASH?.trim();

    if (!configuredEmail || !configuredHash) {
      // Configuration missing on server - generic response to client
      return NextResponse.json(
        { success: false, error: 'Authentication service unavailable' },
        { status: 503, headers: { 'Cache-Control': 'private, no-store' } }
      );
    }

    // Verify email (case-insensitive)
    const emailMatches = email.trim().toLowerCase() === configuredEmail;

    // Verify password against secure bcrypt hash
    const passwordMatches = emailMatches && (await verifyAdminPassword(password, configuredHash));

    if (!emailMatches || !passwordMatches) {
      recordFailedLogin(ip);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401, headers: { 'Cache-Control': 'private, no-store' } }
      );
    }

    // Reset rate limit on success
    resetLoginRateLimit(ip);

    // Create session token
    const token = await createSessionToken(configuredEmail);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Authentication successful',
        email: configuredEmail,
      },
      {
        headers: {
          'Cache-Control': 'private, no-store',
        },
      }
    );

    // Set secure httpOnly session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_EXPIRATION_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Authentication failed. Please try again later.' },
      { status: 500, headers: { 'Cache-Control': 'private, no-store' } }
    );
  }
}
