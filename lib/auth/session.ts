import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload } from '@/lib/types';

export const SESSION_COOKIE_NAME = 'noblecare4u_session';
export const SESSION_EXPIRATION_SECONDS = 24 * 60 * 60; // 24 hours

/**
 * Derives a key for HMAC-SHA256 from the AUTH_SECRET environment variable.
 */
function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable is not defined');
  }
  return new TextEncoder().encode(secret);
}

/**
 * Creates and signs a secure JWT session token using jose.
 * Compatible with both Edge runtime (middleware) and Node.js server runtimes.
 */
export async function createSessionToken(email: string): Promise<string> {
  const key = getSecretKey();
  const now = Math.floor(Date.now() / 1000);

  const token = await new SignJWT({
    email,
    role: 'admin',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_EXPIRATION_SECONDS)
    .sign(key);

  return token;
}

/**
 * Verifies the JWT session token and returns the payload if valid.
 * Returns null if the token is invalid, tampered, or expired.
 */
export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });

    if (!payload.email || typeof payload.email !== 'string') {
      return null;
    }

    // Verify against current configured ADMIN_EMAIL if set
    const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (configuredAdminEmail && payload.email.toLowerCase() !== configuredAdminEmail) {
      return null;
    }

    return {
      email: payload.email,
      role: 'admin',
      iat: payload.iat as number,
      exp: payload.exp as number,
    };
  } catch {
    return null;
  }
}
