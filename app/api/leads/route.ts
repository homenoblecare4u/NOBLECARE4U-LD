import { NextRequest, NextResponse } from 'next/server';
import { getLeadsData } from '@/lib/db/queries';
import { GetLeadsQueryOptions } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const options: GetLeadsQueryOptions = {
      search: searchParams.get('search')?.slice(0, 100) || undefined,
      service: searchParams.get('service')?.slice(0, 50) || undefined,
      source: searchParams.get('source')?.slice(0, 100) || undefined,
      campaign: searchParams.get('campaign')?.slice(0, 100) || undefined,
      dateRange: (searchParams.get('dateRange') as any) || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      trafficType: (searchParams.get('trafficType') as any) || undefined,
      sort: searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest',
      page: Math.max(1, Number(searchParams.get('page')) || 1),
      limit: Math.max(1, Math.min(100, Number(searchParams.get('limit')) || 15)),
    };

    const result = await getLeadsData(options);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
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
