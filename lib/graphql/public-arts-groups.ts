/**
 * Public Arts Groups GraphQL Queries
 * Queries for public-facing arts groups directory and detail pages
 */

import { gql } from '@apollo/client';

/**
 * Optimized GraphQL query for global arts groups search
 * Returns structured data with locations and arts groups
 * Used in search dropdown for fast results
 */
export const GLOBAL_ARTS_GROUPS_SEARCH = gql`
  query GlobalArtsGroupsSearch($input: GlobalArtsGroupsSearchInput!) {
    globalArtsGroupsSearch(input: $input) {
      locations {
        city
        state
        market
        count
        __typename
      }
      artsGroups {
        id
        name
        slug
        artType
        imageUrl
        city
        market
        __typename
      }
      totalResults
      __typename
    }
  }
`;

/**
 * Query for paginated public arts groups (directory listing)
 */
export const PUBLIC_ARTS_GROUPS_PAGINATED = gql`
  query PublicArtsGroupsPaginated(
    $first: Int!
    $after: String
    $filter: ArtsGroupsFilterInput
  ) {
    publicArtsGroupsPaginated(
      first: $first
      after: $after
      filter: $filter
      includeTotalCount: true
    ) {
      edges {
        node {
          id
          name
          slug
          artType
          imageUrl
          imageBigUrl
          market
          description
          address
          phone
          email
          website
          memberCount
          foundedYear
          createdAt
          __typename
        }
        cursor
        __typename
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        totalCount
        __typename
      }
      totalCount
      __typename
    }
  }
`;

/**
 * Query for single public arts group (detail page)
 */
export const PUBLIC_ARTS_GROUP = gql`
  query PublicArtsGroup($identifier: String!) {
    publicArtsGroup(identifier: $identifier) {
      id
      name
      slug
      description
      artType
      memberCount
      foundedYear
      address
      market
      phone
      email
      website
      imageUrl
      imageBigUrl
      createdAt
      updatedAt
      __typename
    }
  }
`;
