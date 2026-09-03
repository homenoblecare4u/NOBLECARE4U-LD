export type CareNeededType =
  | 'Elder Care'
  | 'Nursing'
  | 'Physiotherapy'
  | 'Not sure yet';

export type UserType = 'New' | 'Repeat';

export interface CampaignTouchpoint {
  _id: string;
  route?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  platform?: string;
  gclid?: string;
  fbclid?: string;
  matchtype?: string;
  network?: string;
  device?: string;
  keyword?: string;
  placement?: string;
  campaignid?: string;
  adgroupid?: string;
  createdAt: string | Date;
}

export interface EnquiryHistoryItem {
  _id: string;
  careNeeded: CareNeededType;
  additionalInfo?: string;
  createdAt: string | Date;
}

export interface LeadRecord {
  _id: string; // care_info._id
  careInfoId: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  countryCode: string;
  timezone: string;
  careNeeded: CareNeededType;
  additionalInfo?: string;
  createdAt: string | Date;
  userType: UserType; // Determined chronologically per user
  totalUserEnquiries: number;
  userCampaignTouchpoint?: {
    route?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
}

export interface UserProfile {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  countryCode: string;
  timezone: string;
  status: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface LeadDetailData {
  enquiry: LeadRecord;
  user: UserProfile;
  enquiryHistory: EnquiryHistoryItem[];
  campaignHistory: CampaignTouchpoint[];
  firstEnquiryDate: string | Date;
  latestEnquiryDate: string | Date;
  isRepeatUser: boolean;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetLeadsQueryOptions {
  search?: string;
  service?: string;
  source?: string;
  campaign?: string;
  dateRange?: 'all' | 'today' | 'yesterday' | '7days' | '30days' | 'custom';
  startDate?: string;
  endDate?: string;
  trafficType?: 'all' | 'direct' | 'campaign';
  sort?: 'newest' | 'oldest';
  page?: number;
  limit?: number;
}

export interface GetLeadsResponse {
  success: boolean;
  message?: string;
  data: {
    leads: LeadRecord[];
    pagination: PaginationMeta;
    availableServices: string[];
    availableSources: string[];
    availableCampaigns: string[];
  };
}

export interface RecentEnquirySummary {
  _id: string;
  name: string;
  maskedPhone: string;
  city: string;
  careNeeded: CareNeededType;
  createdAt: string | Date;
  userType: UserType;
}

export interface DashboardStats {
  totalUniqueLeads: number;
  totalCareEnquiries: number;
  enquiriesToday: number;
  enquiriesThisMonth: number;
  elderCareEnquiries: number;
  nursingEnquiries: number;
  physiotherapyEnquiries: number;
  directOrganicEnquiries: number;
  campaignAttributedEnquiries: number;
  serviceDistribution: {
    name: CareNeededType;
    count: number;
    percentage: number;
  }[];
  attributionBreakdown: {
    source: string;
    count: number;
    percentage: number;
  }[];
  sevenDayTrend: {
    date: string;
    label: string;
    count: number;
  }[];
  recentEnquiries: RecentEnquirySummary[];
}

export interface SessionPayload {
  email: string;
  role: 'admin';
  iat: number;
  exp: number;
}
