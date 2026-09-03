/**
 * Best-effort in-memory rate limiter for login attempts.
 *
 * KNOWN ARCHITECTURAL LIMITATION:
 * This rate limiter stores attempt counters in process memory.
 * On serverless platforms like Vercel, separate lambdas/instances do not share memory,
 * so this rate limiter serves as a defense-in-depth control and local development safeguard,
 * but DOES NOT provide global rate limiting across distributed serverless invocations.
 * (Global rate limiting in production would require an external store such as Redis/Upstash).
 *
 * Privacy Note: IP addresses are used solely in-memory as ephemeral cache keys and are NEVER
 * stored in the database, persisted to logs, or associated with lead analytics.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();

// Default configuration: max 5 failed attempts within 15 minutes
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

/**
 * Checks whether an IP identifier is currently rate limited.
 */
export function checkLoginRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const entry = loginAttempts.get(identifier);

  if (!entry || now > entry.resetTime) {
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((entry.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - entry.count,
  };
}

/**
 * Records a failed login attempt for an identifier.
 */
export function recordFailedLogin(identifier: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(identifier);

  if (!entry || now > entry.resetTime) {
    loginAttempts.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
  } else {
    entry.count += 1;
  }
}

/**
 * Resets the rate limit counter on successful login.
 */
export function resetLoginRateLimit(identifier: string): void {
  loginAttempts.delete(identifier);
}
