import { gql } from '@apollo/client';

// Fragments
export const MARQUEE_FRAGMENT = gql`
  fragment MarqueeFragment on MarqueeEntity {
    id
    name
    slug
    link
    startDate
    endDate
    status
    market
    declinedReason

    buttonText
    buttonColor
    buttonFontWeight

    desktopImage
    desktopVideo
    mobileImage
    mobileVideo

    desktopImageUrl
    desktopVideoUrl
    mobileImageUrl
    mobileVideoUrl

    company {
      id
      name
      email
      phone
    }
    owner {
      id
      email
      firstName
      lastName
    }

    bypassCredits
    createdBy
    updatedBy
    deletedBy
    createdAt
    updatedAt
  }
`;

// Queries
export const LIST_MARQUEES_PAGINATED = gql`
  ${MARQUEE_FRAGMENT}
  query ListMarqueesPaginated(
    $first: Int
    $after: String
    $includeTotalCount: Boolean
    $filter: MarqueeFilterInput
  ) {
    marqueePaginated(
      first: $first
      after: $after
      includeTotalCount: $includeTotalCount
      filter: $filter
    ) {
      edges {
        node {
          ...MarqueeFragment
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_MARQUEE = gql`
  ${MARQUEE_FRAGMENT}
  query GetMarquee($id: ID!) {
    marquee(id: $id) {
      ...MarqueeFragment
    }
  }
`;

export const GET_MARQUEE_STATS = gql`
  query GetMarqueeStats($market: String) {
    marqueeStats(market: $market) {
      total
      pending
      approved
      declined
      deleted
      byMarket
    }
  }
`;

export const GET_MY_MARQUEES = gql`
  ${MARQUEE_FRAGMENT}
  query GetMyMarquees {
    myMarquees {
      ...MarqueeFragment
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

// Mutations
export const CREATE_MARQUEE = gql`
  ${MARQUEE_FRAGMENT}
  mutation CreateMarquee($createMarqueeInput: CreateMarqueeInput!) {
    createMarquee(createMarqueeInput: $createMarqueeInput) {
      ...MarqueeFragment
    }
  }
`;

export const UPDATE_MARQUEE = gql`
  ${MARQUEE_FRAGMENT}
  mutation UpdateMarquee($updateMarqueeInput: UpdateMarqueeInput!) {
    updateMarquee(updateMarqueeInput: $updateMarqueeInput) {
      ...MarqueeFragment
    }
  }
`;

export const UPDATE_MARQUEE_STATUS = gql`
  ${MARQUEE_FRAGMENT}
  mutation UpdateMarqueeStatus($id: ID!, $status: MarqueeStatus!, $declinedReason: String) {
    updateMarqueeStatus(id: $id, status: $status, declinedReason: $declinedReason) {
      ...MarqueeFragment
    }
  }
`;

export const GENERATE_MARQUEE_MEDIA_UPLOAD_URL = gql`
  mutation GenerateMarqueeMediaUploadUrl(
    $generateMarqueeMediaUploadUrlInput: GenerateMarqueeMediaUploadUrlInput!
  ) {
    generateMarqueeMediaUploadUrl(
      generateMarqueeMediaUploadUrlInput: $generateMarqueeMediaUploadUrlInput
    ) {
      uploadUrl
      key
      expiresIn
      maxFileSize
      recommendedDimensions
      mediaType
    }
  }
`;

export const GET_MARQUEE_MEDIA_URL = gql`
  query GetMarqueeMediaUrl($mediaKey: String!) {
    getMarqueeMediaUrl(mediaKey: $mediaKey)
  }
`;
