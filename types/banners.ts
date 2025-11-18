export enum BannerType {
  ROS = 'ROS',
  PREMIUM = 'PREMIUM',
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  RED = 'RED',
  ESCOOP = 'ESCOOP'
}

export enum BannerStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  RUNNING = 'RUNNING',
  EXPIRED = 'EXPIRED',
  DECLINED = 'DECLINED',
  PAUSED = 'PAUSED'
}

export enum BannerSortField {
  NAME = 'name',
  BANNER_TYPE = 'bannerType',
  STATUS = 'status',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  TOTAL_CLICKS = 'totalClicks',
  TOTAL_IMPRESSIONS = 'totalImpressions',
  CTR = 'ctr',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt'
}

export type BannerSortDirection = 'asc' | 'desc';

export interface Company {
  id: string;
  name: string;
  email?: string;
}

export interface BannerUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Banner {
  id: string;
  name: string;
  bannerType: BannerType;
  startDate: string;
  endDate: string;
  status: BannerStatus;
  isActive: boolean;
  isRunning: boolean;
  market: string;
  image?: string;
  imageUrl?: string;
  link: string;
  declinedReason?: string;
  totalClicks: number;
  totalImpressions: number;
  totalOpens: number;
  companyId: string;
  company?: Company;
  userId: string;
  user?: BannerUser;
  bypassCredits: boolean;
  zoneId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BannerStats {
  totalImpressions: number;
  totalClicks: number;
  averageCTR: number;
  runningBanners: number;
  totalBanners: number;
  pendingBanners: number;
  approvedBanners: number;
  expiredBanners: number;
  declinedBanners: number;
  pausedBanners: number;
}

export interface BannerStatusSummary {
  pending: number;
  approved: number;
  running: number;
  expired: number;
  declined: number;
  paused: number;
  total: number;
  activeCount: number;
}

export interface BannerStatistics {
  id: string;
  clicks: number;
  impressions: number;
  opens: number;
  date: string;
  userAgent?: string;
  ipAddress?: string;
  referer?: string;
}

export interface TopPerformingBanner {
  id: string;
  name: string;
  bannerType: BannerType;
  totalClicks: number;
  totalImpressions: number;
  ctr: number;
}

export interface AccessibleCompany {
  id: string;
  name: string;
  canCreateBanners: boolean;
}

export interface BannerCreationPermissions {
  canCreate: boolean;
  maxBanners: number;
  companiesAllowed: string[];
}

export interface BannerCreditsBreakdown {
  lbhBanners: number;
  lbvBanners: number;
  banners: number;
  escoopBanners: number;
  hasCredits: boolean;
  source: string;
  companyName: string;
}

export interface BannerCreditRequirements {
  ROS: number;
  PREMIUM: number;
  BLUE: number;
  GREEN: number;
  RED: number;
  ESCOOP: number;
}

// GraphQL Response Types
export interface BannersResponse {
  bannersPaginated: {
    edges: Array<{
      node: Banner;
      cursor: string;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
      totalCount?: number;
    };
  };
}

export interface BannersFilter {
  bannerType?: BannerType;
  status?: BannerStatus;
  isActive?: boolean;
  market?: string;
  companyId?: string;
  search?: string;
  first?: number;
  after?: string;
  sort?: {
    field: BannerSortField;
    direction: BannerSortDirection;
  };
  includeTotalCount?: boolean;
}

export interface BannersQueryVariables {
  filter: BannersFilter;
}

// Form Types
export interface BannerFormData {
  name: string;
  bannerType: BannerType;
  startDate: string;
  endDate: string;
  link: string;
  market: string;
  companyId: string;
  zoneId?: string;
  image?: string;
  bypassCredits?: boolean;
  premiumSize?: string;
}

export interface CreateBannerInput {
  name: string;
  bannerType: BannerType;
  startDate: string;
  endDate: string;
  link: string;
  market: string;
  companyId: string;
  zoneId?: string;
}

export interface UpdateBannerInput {
  bannerId: string;
  name?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  market?: string;
  zoneId?: string;
}

export interface UpdateBannerImageInput {
  bannerId: string;
  imageKey: string;
}

export interface ApproveBannerInput {
  bannerId: string;
}

export interface DeclineBannerInput {
  bannerId: string;
  reason: string;
}

export interface TrackBannerClickInput {
  bannerId: string;
  clickType: string;
}

export interface GenerateBannerUploadUrlInput {
  bannerId: string;
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface GenerateBannerUploadUrlResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
  maxFileSize: number;
  recommendedDimensions?: string;
}