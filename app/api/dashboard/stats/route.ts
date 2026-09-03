import { NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth/server-auth';
import { getDashboardStats } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Independent defense-in-depth authorization check
  const auth = await verifyApiAuth();
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
    const stats = await getDashboardStats();

    return NextResponse.json(
      { success: true, data: stats },
      {
        headers: {
          'Cache-Control': 'private, no-store',
        },
      }
    );
  } catch {
    console.error('Failed to fetch dashboard stats');
    return NextResponse.json(
      { success: false, error: 'Failed to calculate dashboard statistics' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'private, no-store',
        },
      }
    );
  }
}
