import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/server-auth';

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      {
        status: 401,
        headers: {
          'Cache-Control': 'private, no-store',
        },
      }
    );
  }

  return NextResponse.json(
    {
      success: true,
      email: session.email,
      role: session.role,
    },
    {
      headers: {
        'Cache-Control': 'private, no-store',
      },
    }
  );
}
