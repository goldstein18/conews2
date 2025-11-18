export interface Allowances {
  id: string;
  events: number;
  restaurants: number;
  banners: number;
  venues: number;
  // Additional allowances from GraphQL
  appBanners: number;
  dedicated: number;
  eMags: number;
  editorials: number;
  escoopBanners: number;
  escoopFeature: number;
  escoops: number;
  eventFeaturedHp: number;
  fbCarousels: number;
  fbCovers: number;
  fbSocialAd: number;
  fbSocialBoost: number;
  genreBlue: number;
  genreBlue6: number;
  genreBlue12: number;
  genreGreen: number;
  genreGreen6: number;
  genreGreen12: number;
  genreRed: number;
  lbhBanners: number;
  lbvBanners: number;
  mainFeatures: number;
  marquee: number;
  pageAd: number;
}

export interface Plan {
  id: string;
  plan: string;
  planSlug: string;
  price: number;
  priceLong: string;
  allowances: Allowances;
}

export interface Benefits {
  eMags: number;
  events: number;
  pageAd: number;
  venues: number;
  banners: number;
  escoops: number;
  marquee: number;
  fbCovers: number;
  genreRed: number;
  dedicated: number;
  genreBlue: number;
  appBanners: number;
  editorials: number;
  fbSocialAd: number;
  genreBlue6: number;
  genreGreen: number;
  lbhBanners: number;
  lbvBanners: number;
  fbCarousels: number;
  genreBlue12: number;
  genreGreen6: number;
  restaurants: number;
  genreGreen12: number;
  mainFeatures: number;
  escoopBanners: number;
  escoopFeature: number;
  fbSocialBoost: number;
  eventFeaturedHp: number;
}

export interface UserBenefit {
  id: string;
  endDate: string;
  checkPayment: boolean;
}

export interface CompanyBenefit {
  id: string;
  startDate: string;
  endDate: string;
  benefits: Benefits;
  checkPayment: boolean;
}

export type CompanyStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';

export interface OwnedCompany {
  id: string;
  name: string;
  status: CompanyStatus;
  managerCount: number;
  userCount: number;
  plan: Plan;
  benefits: CompanyBenefit[];
  users?: { id: string; displayRole: string; }[];
}

export interface Member {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string | null;
  market: string;
  isActive: boolean;
  createdAt: string;
  plan: Plan | null;
  userBenefits: UserBenefit[];
  ownedCompany: OwnedCompany | null;
}

export interface MemberEdge {
  cursor: string;
  node: Member;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
  totalCount?: number;
}

export interface MembersPaginated {
  edges: MemberEdge[];
  pageInfo: PageInfo;
}

export interface MembersResponse {
  membersPaginated: MembersPaginated;
}

export interface MembersFilterInput {
  email?: string;
  name?: string;
  market?: string;
  planId?: string;
  planSlug?: string;
  companyId?: string;
  hasCompany?: boolean;
  hasActiveBenefits?: boolean;
  activeOnly?: boolean;
  pendingOnly?: boolean;
  expiringThisMonth?: boolean;
}

import type { SortDirection } from '@/components/ui/sortable-table-header';

export type { SortDirection };
export type SortField = 
  // Basic fields
  | 'createdAt' 
  | 'updatedAt'
  // Company fields
  | 'COMPANY_NAME'
  | 'COMPANY_EMAIL'
  | 'COMPANY_CITY'
  | 'COMPANY_STATE'
  | 'COMPANY_PHONE'
  // Owner fields
  | 'OWNER_NAME'
  | 'OWNER_FIRST_NAME'
  | 'OWNER_LAST_NAME'
  | 'OWNER_EMAIL'
  | 'OWNER_MARKET'
  // Employee fields
  | 'FIRST_NAME'
  | 'LAST_NAME' 
  | 'EMAIL'
  | 'ROLE'
  | 'CREATED_AT'
  | 'LAST_LOGIN'
  | 'OWNER_LAST_LOGIN'
  // Status fields
  | 'STATUS'
  | 'IS_ACTIVE'
  // Plan fields
  | 'PLAN_NAME'
  | 'PLAN_PRICE'
  | 'STRIPE_PLAN'
  // Metrics
  | 'USER_COUNT'
  | 'ACTIVE_USER_COUNT'
  // Date fields
  | 'BENEFITS_END_DATE'
  | 'EXPIRATION_DATE';

export interface MembersSortInput {
  field: SortField;
  direction: SortDirection;
}

export interface MembersVariables {
  first?: number;
  after?: string;
  filter?: MembersFilterInput;
  sort?: MembersSortInput;
}

// Dashboard stats interfaces
export interface PlanStat {
  planName: string;
  planSlug: string;
  count: number;
  color: string | null;
}

export interface CompaniesSummary {
  totalCompanies: number;
  activeCompanies: number;
  pendingCompanies: number;
  expiringThisMonth: number;
}

export interface CompaniesDashboardStats {
  planStats: PlanStat[];
  summary: CompaniesSummary;
}

export interface CompaniesDashboardStatsResponse {
  membersDashboardStats: CompaniesDashboardStats;
}

export interface CompaniesDashboardStatsVariables {
  market?: string;
}

// Company Detail interfaces
export interface CompanyOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  market: string;
  lastLogin: string | null;
}

export interface CompanyUser {
  id: string;
  displayRole: string; // Human readable role name like "Owner", "Manager", etc.
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    market: string;
    lastLogin: string | null;
  };
}

export interface CompanyDetail {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  status: CompanyStatus;
  userCount: number;
  managerCount: number;
  createdAt: string;
  updatedAt: string;
  owner: CompanyOwner;
  plan: Plan;
  benefits: CompanyBenefit[];
  users?: CompanyUser[]; // Optional in case it's not available
}

export interface CompanyDetailResponse {
  company: CompanyDetail;
}

export interface CompanyDetailVariables {
  companyId: string;
}

// Market options for filter
export const MARKET_OPTIONS = [
  'miami',
  'new-york',
  'los-angeles',
  'chicago',
] as const;

export type MarketOption = typeof MARKET_OPTIONS[number];