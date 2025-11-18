import { gql } from '@apollo/client';

// Fragments
export const VENUE_FRAGMENT = gql`
  fragment VenueFragment on Venue {
    id
    name
    status
    venueType
    city
    state
    market
    description
    address
    zipcode
    phone
    website
    priority
    companyId
    company {
      id
      name
    }
    owner {
      firstName
      lastName
      email
    }
    hostsPrivateEvents
    parkingInformation
    accessibilityFeatures
    adminNotes
    image
    imageUrl
    imageBig
    video
    facebook
    twitter
    instagram
    youtube
    tiktok
    metadescription
    cityId
    createdAt
    updatedAt
  }
`;

export const VENUE_OPERATING_HOURS_FRAGMENT = gql`
  fragment VenueOperatingHoursFragment on VenueOperatingHoursEntity {
    id
    venueId
    dayOfWeek
    startTime
    endTime
    isClosed
    createdAt
    updatedAt
    createdBy
    updatedBy
    __typename
  }
`;

export const VENUE_FAQ_FRAGMENT = gql`
  fragment VenueFAQFragment on VenueFAQEntity {
    id
    question
    answer
    order
    isActive
    createdAt
    updatedAt
  }
`;

// Queries
export const LIST_VENUES = gql`
  ${VENUE_FRAGMENT}
  query ListVenues($filter: VenuesFilterInput) {
    venuesPaginated(filter: $filter) {
      edges {
        node {
          ...VenueFragment
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        totalCount
      }
    }
  }
`;

// Simple venues query for dropdown selections with search
export const SEARCH_VENUES = gql`
  query SearchVenues($filter: VenuesFilterInput) {
    venues(filter: $filter) {
      venues {
        id
        name
        address
        city
        state
        zipcode
        status
        priority
        hostsPrivateEvents
        company {
          id
          name
        }
      }
      total
      totalPages
      hasNextPage
    }
  }
`;

export const GET_VENUE = gql`
  ${VENUE_FRAGMENT}
  ${VENUE_OPERATING_HOURS_FRAGMENT}
  ${VENUE_FAQ_FRAGMENT}
  query GetVenue($identifier: String!) {
    venue(identifier: $identifier) {
      ...VenueFragment
      operatingHours {
        ...VenueOperatingHoursFragment
      }
      faqs {
        ...VenueFAQFragment
      }
    }
  }
`;

export const GET_VENUE_FOR_EDIT = gql`
  query GetVenueForEdit($identifier: String!) {
    venue(identifier: $identifier) {
      id
      name
      description
      venueType
      address
      city
      state
      zipcode
      market
      phone
      website
      image
      imageUrl
      imageBig
      video
      facebook
      twitter
      instagram
      youtube
      tiktok
      metadescription
      priority
      hostsPrivateEvents
      parkingInformation
      accessibilityFeatures
      # FAQs
      faqs {
        id
        question
        answer
        order
        isActive
        createdAt
        updatedAt
      }
      # Operating Hours
      operatingHours {
        id
        dayOfWeek
        startTime
        endTime
        isClosed
        createdAt
        updatedAt
      }
      status
      adminNotes
      companyId
      company {
        id
        name
      }
    }
  }
`;

export const GET_MY_COMPANIES_FOR_DROPDOWN = gql`
  query GetMyCompaniesForDropdown {
    getMyCompaniesForDropdown {
      id
      name
      email
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

export const GET_VENUE_OPERATING_HOURS = gql`
  ${VENUE_OPERATING_HOURS_FRAGMENT}
  query GetVenueOperatingHours($venueId: String!) {
    getVenueOperatingHours(venueId: $venueId) {
      ...VenueOperatingHoursFragment
    }
  }
`;

export const GET_VENUE_FAQS = gql`
  ${VENUE_FAQ_FRAGMENT}
  query GetVenueFAQs($venueId: String!, $activeOnly: Boolean) {
    getVenueFAQs(venueId: $venueId, activeOnly: $activeOnly) {
      ...VenueFAQFragment
    }
  }
`;

// Mutations
export const CREATE_VENUE = gql`
  ${VENUE_FRAGMENT}
  mutation CreateVenue($createVenueInput: CreateVenueInput!) {
    createVenue(createVenueInput: $createVenueInput) {
      ...VenueFragment
    }
  }
`;

export const UPDATE_VENUE = gql`
  ${VENUE_FRAGMENT}
  mutation UpdateVenue($updateVenueInput: UpdateVenueInput!) {
    updateVenue(updateVenueInput: $updateVenueInput) {
      ...VenueFragment
    }
  }
`;

export const DELETE_VENUE = gql`
  mutation DeleteVenue($id: String!) {
    deleteVenue(id: $id)
  }
`;

// Operating Hours Mutations
export const CREATE_VENUE_OPERATING_HOURS = gql`
  ${VENUE_OPERATING_HOURS_FRAGMENT}
  mutation CreateVenueOperatingHours($createVenueOperatingHoursInput: CreateVenueOperatingHoursInput!) {
    createVenueOperatingHours(createVenueOperatingHoursInput: $createVenueOperatingHoursInput) {
      ...VenueOperatingHoursFragment
      __typename
    }
  }
`;

export const UPDATE_VENUE_OPERATING_HOURS = gql`
  ${VENUE_OPERATING_HOURS_FRAGMENT}
  mutation UpdateVenueOperatingHours($updateVenueOperatingHoursInput: UpdateVenueOperatingHoursInput!) {
    updateVenueOperatingHours(updateVenueOperatingHoursInput: $updateVenueOperatingHoursInput) {
      ...VenueOperatingHoursFragment
      __typename
    }
  }
`;

export const DELETE_VENUE_OPERATING_HOURS = gql`
  mutation DeleteVenueOperatingHours($id: String!) {
    deleteVenueOperatingHours(id: $id)
  }
`;

// FAQ Mutations
export const CREATE_VENUE_FAQ = gql`
  ${VENUE_FAQ_FRAGMENT}
  mutation CreateVenueFAQ($createVenueFAQInput: CreateVenueFAQInput!) {
    createVenueFAQ(createVenueFAQInput: $createVenueFAQInput) {
      ...VenueFAQFragment
    }
  }
`;

export const UPDATE_VENUE_FAQ = gql`
  ${VENUE_FAQ_FRAGMENT}
  mutation UpdateVenueFAQ($updateVenueFAQInput: UpdateVenueFAQInput!) {
    updateVenueFAQ(updateVenueFAQInput: $updateVenueFAQInput) {
      ...VenueFAQFragment
    }
  }
`;

export const DELETE_VENUE_FAQ = gql`
  mutation DeleteVenueFAQ($id: String!) {
    deleteVenueFAQ(id: $id)
  }
`;

// Stats Query (for dashboard summary cards)
export const GET_VENUE_STATS = gql`
  query GetVenueStats {
    venueStats {
      totalVenues
      approvedVenues
      pendingReviewVenues
      activeClients
      rejectedVenues
    }
  }
`;

// Export types for use in components
export type {
  VenuesResponse,
  VenueResponse,
  MyCompaniesDropdownResponse,
  VenueOperatingHoursResponse,
  VenueFAQsResponse,
  VenuesQueryVariables,
  VenueQueryVariables,
  VenueOperatingHoursQueryVariables,
  VenueFAQsQueryVariables,
  CreateVenueMutationVariables,
  UpdateVenueMutationVariables,
  CreateVenueOperatingHoursMutationVariables,
  UpdateVenueOperatingHoursMutationVariables,
  CreateVenueFAQMutationVariables,
  UpdateVenueFAQMutationVariables
} from '@/types/venues';