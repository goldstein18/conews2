export enum MarqueeStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  DELETED = 'DELETED'
}

export enum MarqueeButtonFontWeight {
  REGULAR = 'REGULAR',
  BOLD = 'BOLD'
}

export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface MarqueeOwner {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Marquee {
  id: string;
  name: string;
  slug: string;
  link: string;
  startDate: string;
  endDate: string;
  status: MarqueeStatus;
  market: string;
  declinedReason?: string;

  // Button configuration
  buttonText?: string;
  buttonColor?: string;
  buttonFontWeight?: MarqueeButtonFontWeight;

  // S3 Keys
  desktopImage?: string;
  desktopVideo?: string;
  mobileImage?: string;
  mobileVideo?: string;

  // Public URLs (1-hour expiration)
  desktopImageUrl?: string;
  desktopVideoUrl?: string;
  mobileImageUrl?: string;
  mobileVideoUrl?: string;

  // Relations
  company?: Company;
  companyId: string;
  owner?: MarqueeOwner;

  // Metadata
  bypassCredits: boolean;
  createdBy: string;
  updatedBy?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarqueeStats {
  total: number;
  pending: number;
  approved: number;
  declined: number;
  deleted: number;
  byMarket: number | null;
}

// GraphQL Response Types
export interface MarqueesResponse {
  marqueePaginated: {
    edges: Array<{
      node: Marquee;
      cursor: string;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string;
    };
    totalCount?: number;
  };
}

export interface MarqueesFilter {
  status?: MarqueeStatus;
  market?: string;
  searchTerm?: string;
  first?: number;
  after?: string | null;
  includeTotalCount?: boolean;
}

// Form Types
export interface MarqueeBasicFormData {
  name: string;
  link: string;
  startDate: string;
  endDate: string;
  market: string;
  companyId: string;
  buttonText?: string;
  buttonColor?: string;
  buttonFontWeight?: MarqueeButtonFontWeight;
}

export interface MarqueeAdvancedFormData {
  desktopImage?: string;
  desktopVideo?: string;
  mobileImage?: string;
  mobileVideo?: string;
}

export interface MarqueeEditFormData {
  name: string;
  link: string;
  startDate: string;
  endDate: string;
  market: string;
  companyId: string;
  buttonText?: string;
  buttonColor?: string;
  buttonFontWeight?: MarqueeButtonFontWeight;
  desktopImage?: string;
  desktopVideo?: string;
  mobileImage?: string;
  mobileVideo?: string;
}

// GraphQL Input Types
export interface CreateMarqueeInput {
  name: string;
  link: string;
  startDate: string;
  endDate: string;
  market: string;
  companyId: string;
  buttonText?: string;
  buttonColor?: string;
  buttonFontWeight?: MarqueeButtonFontWeight;
}

export interface UpdateMarqueeInput {
  id: string;
  name?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  market?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonFontWeight?: MarqueeButtonFontWeight;
  desktopImage?: string;
  desktopVideo?: string;
  mobileImage?: string;
  mobileVideo?: string;
}

export interface UpdateMarqueeStatusInput {
  id: string;
  status: MarqueeStatus;
  declinedReason?: string;
}

export interface GenerateMarqueeMediaUploadUrlInput {
  marqueeId: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  mediaType: 'desktop_image' | 'desktop_video' | 'mobile_image' | 'mobile_video';
}

export interface GenerateMarqueeMediaUploadUrlResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
  maxFileSize: number;
  recommendedDimensions?: string;
  mediaType: string;
}
