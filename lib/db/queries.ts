import 'server-only';
import mongoose from 'mongoose';
import connectToDatabase from './connection';
import { User, CareInfo, UtmCampaign } from './models';
import {
  CareNeededType,
  DashboardStats,
  GetLeadsQueryOptions,
  GetLeadsResponse,
  LeadDetailData,
  LeadRecord,
  RecentEnquirySummary,
} from '@/lib/types';
import { getDateRangeBounds, getIstStartAndEndOfDay, maskPhoneNumber } from '@/lib/date';

/**
 * Escapes regex special characters in search inputs to prevent ReDoS and regex errors.
 */
function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Strictly read-only query fetching care enquiries with joined user details and user-level touchpoints.
 * Chronologically determines New vs Repeat enquiry status.
 * Strips clientIp, userAgent, and raw database internals.
 */
export async function getLeadsData(options: GetLeadsQueryOptions): Promise<GetLeadsResponse> {
  await connectToDatabase();

  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(options.limit) || 15));
  const skip = (page - 1) * limit;
  const sortDirection = options.sort === 'oldest' ? 1 : -1;

  // 1. Build CareInfo Match Filter
  const matchFilter: Record<string, unknown> = {};

  if (options.service && options.service !== 'all') {
    matchFilter.careNeeded = options.service;
  }

  const { start, end } = getDateRangeBounds(
    options.dateRange,
    options.startDate,
    options.endDate
  );

  if (start || end) {
    matchFilter.createdAt = {
      ...(start ? { $gte: start } : {}),
      ...(end ? { $lte: end } : {}),
    };
  }

  // Base aggregation pipeline
  const pipeline: mongoose.PipelineStage[] = [
    { $match: matchFilter },
    { $sort: { createdAt: sortDirection } },
    // Lookup User demographics
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
  ];

  // Search by Name, Phone, or City
  if (options.search && options.search.trim()) {
    const escapedSearch = escapeRegex(options.search.trim());
    const searchRegex = { $regex: escapedSearch, $options: 'i' };
    pipeline.push({
      $match: {
        $or: [
          { 'user.name': searchRegex },
          { 'user.phone': searchRegex },
          { 'user.city': searchRegex },
        ],
      },
    });
  }

  // Lookup all enquiries for this user to compute total enquiries and determine if this is first enquiry
  pipeline.push({
    $lookup: {
      from: 'care_info',
      localField: 'userId',
      foreignField: 'userId',
      as: 'allUserEnquiries',
    },
  });

  // Lookup user-level campaign touchpoints (user campaign history)
  pipeline.push({
    $lookup: {
      from: 'utm_campaigns',
      localField: 'userId',
      foreignField: 'userId',
      as: 'userCampaigns',
    },
  });

  // Filter by Source if requested
  if (options.source && options.source !== 'all') {
    pipeline.push({
      $match: {
        'userCampaigns.utm_source': options.source,
      },
    });
  }

  // Filter by Campaign if requested
  if (options.campaign && options.campaign !== 'all') {
    pipeline.push({
      $match: {
        'userCampaigns.utm_campaign': options.campaign,
      },
    });
  }

  // Filter by Traffic Type (direct vs campaign)
  if (options.trafficType === 'direct') {
    pipeline.push({
      $match: {
        $or: [
          { userCampaigns: { $size: 0 } },
          {
            userCampaigns: {
              $not: {
                $elemMatch: {
                  utm_source: { $exists: true, $nin: ['', null, 'direct'] },
                },
              },
            },
          },
        ],
      },
    });
  } else if (options.trafficType === 'campaign') {
    pipeline.push({
      $match: {
        'userCampaigns.utm_source': { $exists: true, $nin: ['', null, 'direct'] },
      },
    });
  }

  // Compute Total Count for Pagination
  const countPipeline = [...pipeline, { $count: 'total' }];
  const countResult = await CareInfo.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

  // Add Pagination and Projections
  const dataPipeline: mongoose.PipelineStage[] = [
    ...pipeline,
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        userId: 1,
        careNeeded: 1,
        additionalInfo: 1,
        createdAt: 1,
        userName: '$user.name',
        userPhone: '$user.phone',
        userEmail: '$user.email',
        userCity: '$user.city',
        userCountryCode: '$user.countryCode',
        userTimezone: '$user.timezone',
        allUserEnquiries: {
          _id: 1,
          createdAt: 1,
        },
        latestTouchpoint: {
          $arrayElemAt: [
            {
              $sortArray: {
                input: '$userCampaigns',
                sortBy: { createdAt: -1 },
              },
            },
            0,
          ],
        },
      },
    },
  ];

  const results = await CareInfo.aggregate(dataPipeline);

  // Map to strongly-typed LeadRecord with chronological New vs Repeat determination
  const leads: LeadRecord[] = results.map((row: any) => {
    // Sort all enquiries for this user chronologically
    const sortedUserEnquiries = (row.allUserEnquiries || []).sort(
      (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const totalEnquiries = sortedUserEnquiries.length;
    // The very first enquiry by this user is 'New'; subsequent enquiries are 'Repeat'
    const isFirstEnquiry =
      sortedUserEnquiries.length === 0 ||
      String(sortedUserEnquiries[0]._id) === String(row._id);

    const userType = isFirstEnquiry ? 'New' : 'Repeat';

    return {
      _id: String(row._id),
      careInfoId: String(row._id),
      userId: String(row.userId),
      name: row.userName || 'Unknown Lead',
      phone: row.userPhone || '—',
      email: row.userEmail || undefined,
      city: row.userCity || '—',
      countryCode: row.userCountryCode || '+91',
      timezone: row.userTimezone || 'Asia/Kolkata',
      careNeeded: row.careNeeded as CareNeededType,
      additionalInfo: row.additionalInfo || undefined,
      createdAt: row.createdAt,
      userType,
      totalUserEnquiries: totalEnquiries,
      userCampaignTouchpoint: row.latestTouchpoint
        ? {
            route: row.latestTouchpoint.route,
            utm_source: row.latestTouchpoint.utm_source,
            utm_medium: row.latestTouchpoint.utm_medium,
            utm_campaign: row.latestTouchpoint.utm_campaign,
          }
        : undefined,
    };
  });

  // Extract distinct filter values for UI dropdowns
  const [availableServices, availableSources, availableCampaigns] = await Promise.all([
    CareInfo.distinct('careNeeded'),
    UtmCampaign.distinct('utm_source', { utm_source: { $nin: ['', null] } }),
    UtmCampaign.distinct('utm_campaign', { utm_campaign: { $nin: ['', null] } }),
  ]);

  return {
    success: true,
    data: {
      leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      availableServices: availableServices.filter(Boolean),
      availableSources: availableSources.filter(Boolean),
      availableCampaigns: availableCampaigns.filter(Boolean),
    },
  };
}

/**
 * Fetches single enquiry details along with user profile, complete user enquiry history,
 * and complete user UTM campaign history.
 */
export async function getLeadDetail(careInfoId: string): Promise<LeadDetailData | null> {
  await connectToDatabase();

  if (!mongoose.Types.ObjectId.isValid(careInfoId)) {
    return null;
  }

  const enquiryDoc = await CareInfo.findById(careInfoId).lean();
  if (!enquiryDoc) {
    return null;
  }

  const userId = enquiryDoc.userId;

  // Parallel fetch of User profile, all user enquiries, and all user campaign touchpoints
  const [userDoc, allEnquiries, allCampaigns] = await Promise.all([
    User.findById(userId).lean(),
    CareInfo.find({ userId }).sort({ createdAt: 1 }).lean(),
    UtmCampaign.find({ userId })
      .select('-clientIp -userAgent -__v')
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  if (!userDoc) {
    return null;
  }

  const firstEnquiryDate = allEnquiries.length > 0 ? allEnquiries[0].createdAt : enquiryDoc.createdAt;
  const latestEnquiryDate =
    allEnquiries.length > 0 ? allEnquiries[allEnquiries.length - 1].createdAt : enquiryDoc.createdAt;

  // Chronological determination of whether THIS enquiry was the first
  const isFirst =
    allEnquiries.length > 0 && String(allEnquiries[0]._id) === String(enquiryDoc._id);
  const userType = isFirst ? 'New' : 'Repeat';

  const enquiry: LeadRecord = {
    _id: String(enquiryDoc._id),
    careInfoId: String(enquiryDoc._id),
    userId: String(userId),
    name: userDoc.name,
    phone: userDoc.phone,
    email: userDoc.email,
    city: userDoc.city,
    countryCode: userDoc.countryCode || '+91',
    timezone: userDoc.timezone || 'Asia/Kolkata',
    careNeeded: enquiryDoc.careNeeded as CareNeededType,
    additionalInfo: enquiryDoc.additionalInfo,
    createdAt: enquiryDoc.createdAt,
    userType,
    totalUserEnquiries: allEnquiries.length,
    userCampaignTouchpoint: allCampaigns.length > 0
      ? {
          route: allCampaigns[0].route,
          utm_source: allCampaigns[0].utm_source,
          utm_medium: allCampaigns[0].utm_medium,
          utm_campaign: allCampaigns[0].utm_campaign,
        }
      : undefined,
  };

  return {
    enquiry,
    user: {
      _id: String(userDoc._id),
      name: userDoc.name,
      phone: userDoc.phone,
      email: userDoc.email,
      city: userDoc.city,
      countryCode: userDoc.countryCode || '+91',
      timezone: userDoc.timezone || 'Asia/Kolkata',
      status: userDoc.status || 'ACTIVE',
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    },
    enquiryHistory: allEnquiries.map((e: any) => ({
      _id: String(e._id),
      careNeeded: e.careNeeded as CareNeededType,
      additionalInfo: e.additionalInfo,
      createdAt: e.createdAt,
    })),
    campaignHistory: allCampaigns.map((c: any) => ({
      _id: String(c._id),
      route: c.route,
      utm_source: c.utm_source,
      utm_medium: c.utm_medium,
      utm_campaign: c.utm_campaign,
      utm_content: c.utm_content,
      utm_term: c.utm_term,
      platform: c.platform,
      gclid: c.gclid,
      fbclid: c.fbclid,
      matchtype: c.matchtype,
      network: c.network,
      device: c.device,
      keyword: c.keyword,
      placement: c.placement,
      campaignid: c.campaignid,
      adgroupid: c.adgroupid,
      createdAt: c.createdAt,
    })),
    firstEnquiryDate,
    latestEnquiryDate,
    isRepeatUser: allEnquiries.length > 1,
  };
}

/**
 * Calculates high-level KPI stats, service distribution, source breakdown, and 7-day trend
 * for the overview dashboard.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  await connectToDatabase();

  const now = new Date();
  const { start: todayStart, end: todayEnd } = getIstStartAndEndOfDay(now);

  // Month boundary in Asia/Kolkata
  const istNow = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const monthStartUtc = Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), 1, 0, 0, 0) - 5.5 * 60 * 60 * 1000;
  const monthStart = new Date(monthStartUtc);

  // Parallel computation of aggregate KPI metrics
  const [
    totalUniqueLeadsCount,
    totalCareEnquiries,
    enquiriesToday,
    enquiriesThisMonth,
    serviceCounts,
    directOrganicCount,
    campaignCount,
    recentEnquiryDocs,
  ] = await Promise.all([
    CareInfo.distinct('userId').then((u) => u.length),
    CareInfo.countDocuments(),
    CareInfo.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
    CareInfo.countDocuments({ createdAt: { $gte: monthStart } }),
    CareInfo.aggregate([
      { $group: { _id: '$careNeeded', count: { $sum: 1 } } },
    ]),
    UtmCampaign.countDocuments({
      $or: [
        { utm_source: { $exists: false } },
        { utm_source: '' },
        { utm_source: null },
        { utm_source: 'direct' },
      ],
    }),
    UtmCampaign.countDocuments({
      utm_source: { $exists: true, $nin: ['', null, 'direct'] },
    }),
    CareInfo.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate<{ userId: { name: string; phone: string; city: string } }>('userId', 'name phone city')
      .lean(),
  ]);

  // Map service breakdown
  const serviceMap = new Map<string, number>();
  serviceCounts.forEach((s: any) => serviceMap.set(s._id, s.count));

  const elderCareEnquiries = serviceMap.get('Elder Care') || 0;
  const nursingEnquiries = serviceMap.get('Nursing') || 0;
  const physiotherapyEnquiries = serviceMap.get('Physiotherapy') || 0;
  const notSureEnquiries = serviceMap.get('Not sure yet') || 0;

  const totalServices = totalCareEnquiries || 1;
  const serviceDistribution = [
    {
      name: 'Elder Care' as CareNeededType,
      count: elderCareEnquiries,
      percentage: Math.round((elderCareEnquiries / totalServices) * 100),
    },
    {
      name: 'Nursing' as CareNeededType,
      count: nursingEnquiries,
      percentage: Math.round((nursingEnquiries / totalServices) * 100),
    },
    {
      name: 'Physiotherapy' as CareNeededType,
      count: physiotherapyEnquiries,
      percentage: Math.round((physiotherapyEnquiries / totalServices) * 100),
    },
    {
      name: 'Not sure yet' as CareNeededType,
      count: notSureEnquiries,
      percentage: Math.round((notSureEnquiries / totalServices) * 100),
    },
  ];

  // Attribution breakdown from utm_campaigns
  const topSources = await UtmCampaign.aggregate([
    {
      $group: {
        _id: {
          $cond: [
            {
              $or: [
                { $eq: ['$utm_source', ''] },
                { $not: ['$utm_source'] },
                { $eq: ['$utm_source', null] },
              ],
            },
            'Direct / Organic',
            '$utm_source',
          ],
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 6 },
  ]);

  const totalAttributions = topSources.reduce((acc, s) => acc + s.count, 0) || 1;
  const attributionBreakdown = topSources.map((s) => ({
    source: s._id || 'Direct / Organic',
    count: s.count,
    percentage: Math.round((s.count / totalAttributions) * 100),
  }));

  // 7-day Trend in Asia/Kolkata
  const sevenDayTrend: { date: string; label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const { start: dayStart, end: dayEnd } = getIstStartAndEndOfDay(dayDate);

    // Format IST label e.g. "01 Sep"
    const istShifted = new Date(dayDate.getTime() + 5.5 * 60 * 60 * 1000);
    const label = istShifted.toLocaleDateString('en-IN', {
      timeZone: 'UTC',
      day: '2-digit',
      month: 'short',
    });
    const dateStr = istShifted.toISOString().split('T')[0];

    const count = await CareInfo.countDocuments({
      createdAt: { $gte: dayStart, $lte: dayEnd },
    });

    sevenDayTrend.push({ date: dateStr, label, count });
  }

  // Recent enquiries with masked phone numbers for privacy
  const recentEnquiries: RecentEnquirySummary[] = await Promise.all(
    recentEnquiryDocs.map(async (doc: any) => {
      // Check if repeat
      const priorCount = await CareInfo.countDocuments({
        userId: doc.userId?._id || doc.userId,
        createdAt: { $lt: doc.createdAt },
      });

      return {
        _id: String(doc._id),
        name: doc.userId?.name || 'Unknown Lead',
        maskedPhone: maskPhoneNumber(doc.userId?.phone || ''),
        city: doc.userId?.city || '—',
        careNeeded: doc.careNeeded as CareNeededType,
        createdAt: doc.createdAt,
        userType: priorCount > 0 ? 'Repeat' : 'New',
      };
    })
  );

  return {
    totalUniqueLeads: totalUniqueLeadsCount,
    totalCareEnquiries,
    enquiriesToday,
    enquiriesThisMonth,
    elderCareEnquiries,
    nursingEnquiries,
    physiotherapyEnquiries,
    directOrganicEnquiries: directOrganicCount,
    campaignAttributedEnquiries: campaignCount,
    serviceDistribution,
    attributionBreakdown,
    sevenDayTrend,
    recentEnquiries,
  };
}
