import { NextRequest, NextResponse } from 'next/server';
import { verifyApiAuth } from '@/lib/auth/server-auth';
import { getLeadsData } from '@/lib/db/queries';
import { GetLeadsQueryOptions } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Independent defense-in-depth authorization check
  const auth = await verifyApiAuth();
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
    const searchParams = request.nextUrl.searchParams;

    const options: GetLeadsQueryOptions = {
      search: searchParams.get('search') || undefined,
      service: searchParams.get('service') || undefined,
      source: searchParams.get('source') || undefined,
      campaign: searchParams.get('campaign') || undefined,
      dateRange: (searchParams.get('dateRange') as any) || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      trafficType: (searchParams.get('trafficType') as any) || undefined,
      sort: (searchParams.get('sort') as any) || undefined,
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 15,
    };

    const result = await getLeadsData(options);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('Failed to fetch leads');
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve leads from database' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'private, no-store',
        },
      }
    );
  }
}
