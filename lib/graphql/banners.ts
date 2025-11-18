import { gql } from '@apollo/client';

// Fragments
export const BANNER_FRAGMENT = gql`
  fragment BannerFragment on BannerEntity {
    id
    name
    bannerType
    startDate
    endDate
    status
    isActive
    isRunning
    market
    image
    imageUrl
    link
    declinedReason
    totalClicks
    totalImpressions
    totalOpens
    companyId
    company {
      id
      name
      email
    }
    userId
    bypassCredits
    zoneId
    createdAt
    updatedAt
  }
`;

// Queries
export const LIST_BANNERS = gql`
  ${BANNER_FRAGMENT}
  query ListBanners(
    $first: Int
    $after: String
    $filter: BannersFilterInput
    $includeTotalCount: Boolean
  ) {
    bannersPaginated(
      first: $first
      after: $after
      filter: $filter
      includeTotalCount: $includeTotalCount
    ) {
      edges {
        node {
          ...BannerFragment
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_BANNER = gql`
  ${BANNER_FRAGMENT}
  query GetBanner($id: ID!) {
    banner(id: $id) {
      ...BannerFragment
    }
  }
`;

export const GET_BANNER_STATS = gql`
  query GetBannerStats($companyId: ID) {
    bannerStatusSummary(companyId: $companyId)
    topPerformingBanners(
      companyId: $companyId
      limit: 1
      metric: "impressions"
    )
  }
`;

export const GET_BANNER_STATUS_SUMMARY = gql`
  query GetBannerStatusSummary($companyId: ID) {
    bannerStatusSummary(companyId: $companyId)
  }
`;

export const GET_BANNER_STATISTICS = gql`
  query GetBannerStatistics(
    $bannerId: ID!
    $startDate: String
    $endDate: String
  ) {
    bannerStatistics(
      bannerId: $bannerId
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      clicks
      impressions
      opens
      date
      userAgent
      ipAddress
      referer
    }
  }
`;

export const GET_ACCESSIBLE_COMPANIES = gql`
  query GetAccessibleCompanies {
    accessibleCompanies {
      id
      name
      canCreateBanners
    }
  }
`;

export const GET_ALL_COMPANIES_FOR_DROPDOWN = gql`
  query GetAllCompanies {
    companies {
      id
      name
    }
  }
`;

export const GET_BANNER_CREATION_PERMISSIONS = gql`
  query GetBannerCreationPermissions {
    bannerCreationPermissions {
      canCreate
      maxBanners
      companiesAllowed
    }
  }
`;

export const GET_BANNER_CREDITS_BREAKDOWN = gql`
  query GetBannerCreditsBreakdown {
    bannerCreditsBreakdown {
      lbhBanners
      lbvBanners
      banners
      escoopBanners
      hasCredits
      source
      companyName
    }
  }
`;

export const GET_BANNER_CREDIT_REQUIREMENTS = gql`
  query GetBannerCreditRequirements {
    bannerCreditRequirements {
      ROS
      PREMIUM
      BLUE
      GREEN
      RED
      ESCOOP
    }
  }
`;

export const GET_TOP_PERFORMING_BANNERS = gql`
  query GetTopPerformingBanners(
    $companyId: String
    $limit: Int
    $metric: String
    $startDate: String
    $endDate: String
  ) {
    topPerformingBanners(
      companyId: $companyId
      limit: $limit
      metric: $metric
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      name
      bannerType
      totalClicks
      totalImpressions
      ctr
    }
  }
`;

// Mutations
export const CREATE_BANNER = gql`
  ${BANNER_FRAGMENT}
  mutation CreateBanner($input: CreateBannerInput!) {
    createBanner(input: $input) {
      ...BannerFragment
    }
  }
`;

export const UPDATE_BANNER = gql`
  ${BANNER_FRAGMENT}
  mutation UpdateBanner($input: UpdateBannerInput!) {
    updateBanner(input: $input) {
      ...BannerFragment
    }
  }
`;

export const DELETE_BANNER = gql`
  mutation DeleteBanner($bannerId: ID!) {
    deleteBanner(bannerId: $bannerId)
  }
`;

export const GENERATE_BANNER_UPLOAD_URL = gql`
  mutation GenerateBannerUploadUrl($input: GenerateBannerUploadUrlInput!) {
    generateBannerUploadUrl(input: $input) {
      uploadUrl
      key
      expiresIn
      maxFileSize
      recommendedDimensions
    }
  }
`;

export const UPDATE_BANNER_IMAGE = gql`
  ${BANNER_FRAGMENT}
  mutation UpdateBannerImage($input: UpdateBannerImageInput!) {
    updateBannerImage(input: $input) {
      ...BannerFragment
    }
  }
`;

export const APPROVE_BANNER = gql`
  ${BANNER_FRAGMENT}
  mutation ApproveBanner($input: ApproveBannerInput!) {
    approveBanner(input: $input) {
      ...BannerFragment
    }
  }
`;

export const DECLINE_BANNER = gql`
  ${BANNER_FRAGMENT}
  mutation DeclineBanner($input: DeclineBannerInput!) {
    declineBanner(input: $input) {
      ...BannerFragment
    }
  }
`;

export const PAUSE_BANNER = gql`
  ${BANNER_FRAGMENT}
  mutation PauseBanner($bannerId: ID!) {
    pauseBanner(bannerId: $bannerId) {
      ...BannerFragment
    }
  }
`;

export const RESUME_BANNER = gql`
  ${BANNER_FRAGMENT}
  mutation ResumeBanner($bannerId: ID!) {
    resumeBanner(bannerId: $bannerId) {
      ...BannerFragment
    }
  }
`;

export const TRACK_BANNER_CLICK = gql`
  mutation TrackBannerClick($input: TrackBannerClickInput!) {
    trackBannerClick(input: $input) {
      success
      message
    }
  }
`;

export const TRACK_BANNER_IMPRESSION = gql`
  mutation TrackBannerImpression($bannerId: ID!) {
    trackBannerImpression(bannerId: $bannerId) {
      success
      message
    }
  }
`;