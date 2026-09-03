import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth/server-auth';
import { getLeadDetail } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Independent defense-in-depth authorization check
  const auth = await verifyApiAuth();
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Enquiry ID is required' },
        { status: 400, headers: { 'Cache-Control': 'private, no-store' } }
      );
    }

    const detail = await getLeadDetail(id);

    if (!detail) {
      return NextResponse.json(
        { success: false, error: 'Lead enquiry not found' },
        { status: 404, headers: { 'Cache-Control': 'private, no-store' } }
      );
    }

    return NextResponse.json(
      { success: true, data: detail },
      {
        headers: {
          'Cache-Control': 'private, no-store',
        },
      }
    );
  } catch {
    console.error('Failed to fetch lead detail');
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve lead detail from database' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'private, no-store',
        },
      }
    );
  }
}
