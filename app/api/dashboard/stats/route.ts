import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
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
