import 'server-only';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from './session';
import { SessionPayload } from '@/lib/types';
import { NextResponse } from 'next/server';

/**
 * Retrieves and verifies the administrator session for Server Components and Route Handlers.
 */
export async function getServerSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(sessionCookie);
}

/**
 * Asserts that the request is from an authenticated administrator.
 * If unauthenticated, returns a 401 NextResponse with Cache-Control: private, no-store.
 */
export async function verifyApiAuth(): Promise<{ session: SessionPayload } | { errorResponse: NextResponse }> {
  const session = await getServerSession();
  if (!session) {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: 'Unauthorized' },
        {
          status: 401,
          headers: {
            'Cache-Control': 'private, no-store',
          },
        }
      ),
    };
  }
  return { session };
}
