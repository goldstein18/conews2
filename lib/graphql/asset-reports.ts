import { gql } from '@apollo/client';

// Generate Client Asset Report
export const GENERATE_CLIENT_ASSET_REPORT = gql`
  mutation GenerateClientAssetReport(
    $companyId: String!
    $startDate: String!
    $endDate: String!
    $includeEvents: Boolean
    $includeBanners: Boolean
  ) {
    generateClientAssetReport(input: {
      companyId: $companyId
      startDate: $startDate
      endDate: $endDate
      includeEvents: $includeEvents
      includeBanners: $includeBanners
    }) {
      id
      companyId
      startDate
      endDate
      reportUrl
      s3Key
      status
      generatedBy
      fileSize
      createdAt
      updatedAt
      company {
        name
        email
      }
      user {
        firstName
        lastName
      }
    }
  }
`;

// Check Report Status (for polling)
export const GET_CLIENT_ASSET_REPORT = gql`
  query GetClientAssetReport($reportId: ID!) {
    getClientAssetReport(reportId: $reportId) {
      id
      companyId
      startDate
      endDate
      status
      reportUrl
      s3Key
      generatedBy
      fileSize
      createdAt
      updatedAt
      company {
        name
        email
      }
      user {
        firstName
        lastName
      }
    }
  }
`;

// Preview Client Asset Report
export const PREVIEW_CLIENT_ASSET_REPORT = gql`
  query PreviewClientAssetReport(
    $companyId: String!
    $startDate: String!
    $endDate: String!
    $includeEvents: Boolean
    $includeBanners: Boolean
  ) {
    previewClientAssetReport(input: {
      companyId: $companyId
      startDate: $startDate
      endDate: $endDate
      includeEvents: $includeEvents
      includeBanners: $includeBanners
    }) {
      totalEvents
      totalBanners
      totalBannerImpressions
      totalBannerClicks
      averageCtr
      events {
        id
        title
      }
      banners {
        id
        name
        impressions
        clicks
        ctr
      }
    }
  }
`;

// List Company Reports (for history)
export const LIST_CLIENT_ASSET_REPORTS = gql`
  query ListClientAssetReports($companyId: ID!, $first: Float) {
    listClientAssetReports(companyId: $companyId, first: $first) {
      id
      status
      reportUrl
      startDate
      endDate
      fileSize
      createdAt
      user {
        firstName
        lastName
      }
    }
  }
`;

// Overall Analytics Query (placeholder - will need to be defined in backend)
export const GET_OVERALL_ANALYTICS = gql`
  query GetOverallAnalytics(
    $startDate: String!
    $endDate: String!
    $assetType: String
  ) {
    overallAnalytics(input: {
      startDate: $startDate
      endDate: $endDate
      assetType: $assetType
    }) {
      totalAssets
      totalReach
      totalClicks
      topPerformingAsset {
        type
        name
        ctr
      }
      monthlyPerformance {
        month
        impressions
        clicks
        ctr
      }
      topAssetTypes {
        type
        activeAssets
        impressions
        clicks
        ctr
      }
    }
  }
`;

// Types for TypeScript
export interface GenerateClientAssetReportVariables {
  companyId: string;
  startDate: string;
  endDate: string;
  includeEvents?: boolean;
  includeBanners?: boolean;
}

export interface PreviewClientAssetReportVariables {
  companyId: string;
  startDate: string;
  endDate: string;
  includeEvents?: boolean;
  includeBanners?: boolean;
}

export interface OverallAnalyticsVariables {
  startDate: string;
  endDate: string;
  assetType?: 'EVENTS' | 'BANNERS' | 'ALL';
}

export interface ClientAssetReport {
  id: string;
  companyId: string;
  startDate: string;
  endDate: string;
  reportUrl?: string;
  s3Key?: string;
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  generatedBy: string;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
  company: {
    name: string;
    email: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
}

export interface ReportPreview {
  totalEvents: number;
  totalBanners: number;
  totalBannerImpressions: number;
  totalBannerClicks: number;
  averageCtr: number;
  events: Array<{
    id: string;
    title: string;
  }>;
  banners: Array<{
    id: string;
    name: string;
    impressions: number;
    clicks: number;
    ctr: number;
  }>;
}

export interface OverallAnalytics {
  totalAssets: number;
  totalReach: number;
  totalClicks: number;
  topPerformingAsset: {
    type: string;
    name: string;
    ctr: number;
  };
  monthlyPerformance: Array<{
    month: string;
    impressions: number;
    clicks: number;
    ctr: number;
  }>;
  topAssetTypes: Array<{
    type: string;
    activeAssets: number;
    impressions: number;
    clicks: number;
    ctr: number;
  }>;
}