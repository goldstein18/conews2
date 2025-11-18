import { gql } from '@apollo/client';

/**
 * GraphQL query for public venues directory
 * Uses cursor-based pagination for efficient data fetching
 * Supports filtering by market, search, city, and state
 */
export const PUBLIC_VENUES_PAGINATED = gql`
  query PublicVenuesPaginated(
    $first: Int!
    $after: String
    $market: String
    $search: String
    $city: String
    $state: String
  ) {
    publicVenuesPaginated(filter: {
      first: $first
      after: $after
      market: $market
      search: $search
      city: $city
      state: $state
      sort: { field: "name", direction: "asc" }
      includeTotalCount: true
    }) {
      edges {
        node {
          id
          name
          slug
          description
          address
          city
          state
          zipcode
          phone
          website
          imageUrl
          imageBigUrl
          market
          venueType
          status
          hostsPrivateEvents
          createdAt
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

/**
 * GraphQL query for single venue by identifier (slug)
 * Used for venue detail page
 */
export const PUBLIC_VENUE = gql`
  query PublicVenue($identifier: String!) {
    publicVenue(identifier: $identifier) {
      id
      name
      slug
      description
      address
      city
      state
      zipcode
      phone
      website
      imageUrl
      imageBigUrl
      video
      videoType
      facebook
      twitter
      instagram
      youtube
      tiktok
      venueType
      hostsPrivateEvents
      parkingInformation
      accessibilityFeatures
      metadescription
      faqs {
        id
        question
        answer
        order
      }
      createdAt
    }
  }
`;

// Export types for use in components
export type {
  PublicVenue,
  PublicVenueEdge,
  PublicVenuesPaginated,
  PublicVenuesResponse,
  PublicVenuesQueryVariables,
  PublicVenueResponse,
  PublicVenueVariables
} from '@/types/public-venues';
