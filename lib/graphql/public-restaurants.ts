import { gql } from '@apollo/client';

/**
 * Optimized GraphQL query for global restaurant search
 * Returns structured data with locations and restaurants
 * Used in search dropdown for fast results
 */
export const GLOBAL_RESTAURANTS_SEARCH = gql`
  query GlobalRestaurantsSearch($input: GlobalRestaurantsSearchInput!) {
    globalRestaurantsSearch(input: $input) {
      locations {
        city
        state
        market
        restaurantCount
        __typename
      }
      restaurants {
        id
        name
        slug
        city
        state
        cuisineType
        priceRange
        imageUrl
        averageRating
        reviewCount
        __typename
      }
      totalResults
      __typename
    }
  }
`;

/**
 * GraphQL query for fetching all active restaurant types (cuisine types)
 * Used to populate cuisine filter checkboxes
 */
export const PUBLIC_RESTAURANT_TYPES = gql`
  query PublicRestaurantTypes {
    publicRestaurantTypes {
      id
      name
      slug
      displayName
      description
      isActive
    }
  }
`;

/**
 * GraphQL query for fetching all active dietary options
 * Used for amenities/dietary filter checkboxes
 */
export const PUBLIC_DIETARY_OPTIONS = gql`
  query PublicDietaryOptions {
    publicDietaryOptions {
      id
      name
      slug
      displayName
      description
      category
      isActive
    }
  }
`;

/**
 * GraphQL query for public restaurants directory
 * Uses cursor-based pagination for efficient data fetching
 * Supports filtering by market, search, city, state, cuisine types, price range, and dietary options
 * Sorts by createdAt DESC (most recent first)
 */
export const PUBLIC_RESTAURANTS_PAGINATED = gql`
  query PublicRestaurantsPaginated(
    $first: Int!
    $after: String
    $market: String
    $search: String
    $city: String
    $state: String
    $restaurantTypeSlug: String
    $restaurantTypeIds: [String!]
    $priceRange: RestaurantPriceRange
    $dietaryOptions: [String!]
  ) {
    publicRestaurantsPaginated(filter: {
      first: $first
      after: $after
      market: $market
      search: $search
      city: $city
      state: $state
      restaurantTypeSlug: $restaurantTypeSlug
      restaurantTypeIds: $restaurantTypeIds
      priceRange: $priceRange
      dietaryOptions: $dietaryOptions
      sort: { field: "createdAt", direction: "desc" }
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
          priceRange
          restaurantType {
            id
            name
            slug
            displayName
          }
          menuLink
          dietaryOptions
          amenities
          status
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
 * GraphQL query for single restaurant by identifier (slug)
 * Used for restaurant detail page
 * Returns null if restaurant is not APPROVED status
 */
export const PUBLIC_RESTAURANT = gql`
  query PublicRestaurant($identifier: String!) {
    publicRestaurant(identifier: $identifier) {
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
      email
      imageUrl
      imageBigUrl
      facebook
      twitter
      instagram
      youtube
      tiktok
      priceRange
      restaurantType {
        id
        name
        displayName
      }
      menuLink
      dietaryOptions
      amenities
      operatingHours {
        id
        dayOfWeek
        startTime
        endTime
        isClosed
      }
      latitude
      longitude
      createdAt
      updatedAt
    }
  }
`;

// Export types for use in components
export type {
  PublicRestaurant,
  PublicRestaurantEdge,
  PublicRestaurantsPaginated,
  PublicRestaurantsResponse,
  PublicRestaurantsQueryVariables,
  PublicRestaurantResponse,
  PublicRestaurantVariables
} from '@/types/public-restaurants';
