import { gql } from '@apollo/client';

// Fragment for restaurant type
export const RESTAURANT_TYPE_FRAGMENT = gql`
  fragment RestaurantTypeFields on RestaurantType {
    id
    name
    slug
    displayName
    description
    isActive
    createdAt
    updatedAt
  }
`;

// Fragment for company info
export const RESTAURANT_COMPANY_FRAGMENT = gql`
  fragment RestaurantCompanyFields on Company {
    id
    name
    email
  }
`;

// Fragment for owner info
export const RESTAURANT_OWNER_FRAGMENT = gql`
  fragment RestaurantOwnerFields on User {
    id
    firstName
    lastName
    email
  }
`;

// Fragment for operating hours
export const OPERATING_HOURS_FRAGMENT = gql`
  fragment OperatingHoursFields on RestaurantOperatingHours {
    id
    dayOfWeek
    startTime
    endTime
    isClosed
    createdAt
    updatedAt
  }
`;

// Fragment for basic restaurant info (for lists)
export const RESTAURANT_BASIC_FRAGMENT = gql`
  fragment RestaurantBasicFields on Restaurant {
    id
    name
    slug
    description
    address
    city
    state
    zipcode
    phone
    email
    website
    priceRange
    status
    market
    imageUrl
    imageBigUrl
    createdAt
    updatedAt
    restaurantType {
      ...RestaurantTypeFields
    }
    company {
      ...RestaurantCompanyFields
    }
    owner {
      ...RestaurantOwnerFields
    }
  }
  ${RESTAURANT_TYPE_FRAGMENT}
  ${RESTAURANT_COMPANY_FRAGMENT}
  ${RESTAURANT_OWNER_FRAGMENT}
`;

// Fragment for full restaurant info (for details)
export const RESTAURANT_FULL_FRAGMENT = gql`
  fragment RestaurantFullFields on Restaurant {
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
    image
    imageUrl
    imageBig
    imageBigUrl
    facebook
    twitter
    instagram
    youtube
    tiktok
    menuLink
    priceRange
    dietaryOptions
    amenities
    status
    declinedReason
    adminNotes
    latitude
    longitude
    market
    createdAt
    updatedAt
    restaurantType {
      ...RestaurantTypeFields
    }
    company {
      ...RestaurantCompanyFields
    }
    owner {
      ...RestaurantOwnerFields
    }
    operatingHours {
      ...OperatingHoursFields
    }
  }
  ${RESTAURANT_TYPE_FRAGMENT}
  ${RESTAURANT_COMPANY_FRAGMENT}
  ${RESTAURANT_OWNER_FRAGMENT}
  ${OPERATING_HOURS_FRAGMENT}
`;

// Query to list restaurants with pagination
export const LIST_RESTAURANTS = gql`
  query RestaurantsPaginated($filter: RestaurantsFilterInput!) {
    restaurantsPaginated(filter: $filter) {
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
          email
          website
          priceRange
          status
          market
          imageUrl
          imageBigUrl
          createdAt
          updatedAt
          restaurantType {
            displayName
          }
          company {
            id
            name
            email
          }
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

// Query to get restaurant stats
export const GET_RESTAURANT_STATS = gql`
  query RestaurantStats {
    restaurantStats {
      totalRestaurants
      approvedRestaurants
      pendingReviewRestaurants
      rejectedRestaurants
      activeClients
    }
  }
`;

// Query to get single restaurant
export const GET_RESTAURANT = gql`
  query Restaurant($id: String!) {
    restaurant(id: $id) {
      id
      name
      slug
      description
      address
      city
      state
      zipcode
      phone
      email
      website
      image
      imageUrl
      imageBig
      imageBigUrl
      facebook
      twitter
      instagram
      youtube
      tiktok
      menuLink
      priceRange
      dietaryOptions
      amenities
      status
      declinedReason
      adminNotes
      latitude
      longitude
      market
      restaurantType {
        id
        name
        displayName
        description
      }
      company {
        id
        name
        email
      }
      owner {
        id
        firstName
        lastName
        email
      }
      operatingHours {
        id
        dayOfWeek
        startTime
        endTime
        isClosed
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

// Query to get restaurant for editing
export const GET_RESTAURANT_FOR_EDIT = gql`
  query RestaurantForEdit($id: String!) {
    restaurant(id: $id) {
      id
      name
      slug
      description
      address
      city
      state
      zipcode
      phone
      email
      website
      image
      imageUrl
      imageBig
      imageBigUrl
      facebook
      twitter
      instagram
      youtube
      tiktok
      menuLink
      priceRange
      dietaryOptions
      amenities
      status
      declinedReason
      adminNotes
      latitude
      longitude
      market
      restaurantType {
        id
        name
        displayName
        description
      }
      company {
        id
        name
        email
      }
      owner {
        id
        firstName
        lastName
        email
      }
      operatingHours {
        id
        dayOfWeek
        startTime
        endTime
        isClosed
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

// Query to get restaurant types
export const GET_RESTAURANT_TYPES = gql`
  query GetRestaurantTypes {
    restaurantTypes {
      id
      name
      slug
      displayName
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;

// Query to get dietary options
export const GET_DIETARY_OPTIONS = gql`
  query RestaurantDietaryOptions {
    restaurantDietaryOptions {
      id
      name
      slug
      displayName
      description
      category
      isActive
      createdAt
      updatedAt
    }
  }
`;

// Query to get companies for dropdown (reuse from existing)
export const GET_ALL_COMPANIES_FOR_DROPDOWN = gql`
  query GetAllCompanies {
    companies {
      id
      name
    }
  }
`;

// Mutation to create restaurant
export const CREATE_RESTAURANT = gql`
  mutation CreateRestaurant($createRestaurantInput: CreateRestaurantInput!) {
    createRestaurant(createRestaurantInput: $createRestaurantInput) {
      id
      name
      slug
      description
      address
      city
      state
      zipcode
      phone
      email
      website
      priceRange
      status
      market
      imageUrl
      imageBigUrl
      facebook
      twitter
      instagram
      youtube
      tiktok
      menuLink
      dietaryOptions
      amenities
      latitude
      longitude
      createdAt
      updatedAt
      restaurantType {
        id
        name
        slug
        displayName
        description
      }
      company {
        id
        name
        email
      }
      owner {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

// Mutation to update restaurant
export const UPDATE_RESTAURANT = gql`
  mutation UpdateRestaurant($updateRestaurantInput: UpdateRestaurantInput!) {
    updateRestaurant(updateRestaurantInput: $updateRestaurantInput) {
      id
      name
      slug
      description
      address
      city
      state
      zipcode
      phone
      email
      website
      priceRange
      status
      market
      imageUrl
      imageBigUrl
      facebook
      twitter
      instagram
      youtube
      tiktok
      menuLink
      dietaryOptions
      amenities
      latitude
      longitude
      createdAt
      updatedAt
      restaurantType {
        id
        name
        slug
        displayName
        description
      }
      company {
        id
        name
        email
      }
      owner {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
export const UPDATE_RESTAURANT_ADMIN = gql`
  mutation UpdateRestaurantAdmin($updateRestaurantAdminInput: UpdateRestaurantAdminInput!) {
    updateRestaurantAdmin(updateRestaurantAdminInput: $updateRestaurantAdminInput) {
      id
      name
      slug
      description
      address
      city
      state
      zipcode
      phone
      email
      website
      priceRange
      status
      market
      imageUrl
      imageBigUrl
      facebook
      twitter
      instagram
      youtube
      tiktok
      menuLink
      dietaryOptions
      amenities
      latitude
      longitude
      createdAt
      updatedAt
      restaurantType {
        id
        name
        slug
        displayName
        description
      }
      company {
        id
        name
        email
      }
      owner {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

// Mutation to approve restaurant
export const APPROVE_RESTAURANT = gql`
  mutation ApproveRestaurant($id: String!) {
    approveRestaurant(id: $id) {
      id
      name
      status
      declinedReason
      updatedAt
    }
  }
`;

// Mutation to decline restaurant
export const DECLINE_RESTAURANT = gql`
  mutation DeclineRestaurant($id: String!, $reason: String!) {
    declineRestaurant(id: $id, reason: $reason) {
      id
      name
      status
      declinedReason
      updatedAt
    }
  }
`;

// Mutation to delete restaurant
export const DELETE_RESTAURANT = gql`
  mutation DeleteRestaurant($id: String!) {
    deleteRestaurant(id: $id) {
      id
      status
    }
  }
`;

// Mutation to update restaurant images
export const UPDATE_RESTAURANT_IMAGES = gql`
  mutation UpdateRestaurantImages($updateRestaurantImagesInput: UpdateRestaurantImagesInput!) {
    updateRestaurantImages(updateRestaurantImagesInput: $updateRestaurantImagesInput) {
      id
      image
      imageUrl
      imageBig
      imageBigUrl
      updatedAt
    }
  }
`;

// Mutation to generate image upload URL
export const GENERATE_RESTAURANT_IMAGE_UPLOAD_URL = gql`
  mutation GenerateRestaurantImageUploadUrl($generateRestaurantImageUploadUrlInput: GenerateRestaurantImageUploadUrlInput!) {
    generateRestaurantImageUploadUrl(generateRestaurantImageUploadUrlInput: $generateRestaurantImageUploadUrlInput) {
      uploadUrl
      key
      expiresIn
      maxFileSize
      recommendedDimensions
      imageType
    }
  }
`;

// Query to get market stats for filter cards
export const GET_RESTAURANT_MARKET_STATS = gql`
  query RestaurantMarketStats {
    restaurantMarketStats {
      market
      count
    }
  }
`;

// Types for Apollo Client
export interface RestaurantsPaginatedVariables {
  filter: {
    first?: number;
    after?: string;
    search?: string;
    status?: string;
    priceRange?: string;
    city?: string;
    market?: string;
    cuisineType?: string;
    companyId?: string;
    includeTotalCount?: boolean;
  };
}

export interface RestaurantVariables {
  id: string;
}

export interface CreateRestaurantVariables {
  createRestaurantInput: {
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    market: string;
    phone?: string;
    email?: string;
    website?: string;
    restaurantTypeId: string;
    priceRange: string;
    companyId: string;
    latitude?: number;
    longitude?: number;
    image?: string;
  };
}

export interface UpdateRestaurantVariables {
  updateRestaurantInput: {
    id: string;
    name?: string;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    phone?: string;
    website?: string;
    email?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    menuLink?: string;
    priceRange?: string;
    dietaryOptions?: string[];
    amenities?: string[];
    latitude?: number;
    longitude?: number;
    market?: string;
    restaurantTypeId?: string;
    companyId?: string;
    adminNotes?: string;
  };
}

export interface ApproveRestaurantVariables {
  id: string;
}

export interface DeclineRestaurantVariables {
  id: string;
  reason: string;
}

export interface DeleteRestaurantVariables {
  id: string;
}

export interface UpdateRestaurantImagesVariables {
  updateRestaurantImagesInput: {
    restaurantId: string;
    imageKey?: string;
    imageBigKey?: string;
  };
}

export interface GenerateRestaurantImageUploadUrlVariables {
  generateRestaurantImageUploadUrlInput: {
    restaurantId: string;
    fileName: string;
    contentType: string;
    fileSize: number;
    imageType: 'MAIN' | 'BIG';
  };
}

// Search Restaurants query for escoop builder
export const SEARCH_RESTAURANTS = gql`
  query SearchRestaurants($search: String, $market: String, $limit: Int) {
    searchRestaurants(search: $search, market: $market, limit: $limit) {
      id
      name
      description
      address
      city
      state
      imageUrl
      slug
    }
  }
`;

// Types for restaurant search in escoop builder
export interface SearchRestaurant {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  imageUrl?: string;
  slug: string;
}

export interface SearchRestaurantsVariables {
  search?: string;
  market?: string;
  limit?: number;
}

export interface SearchRestaurantsData {
  searchRestaurants: SearchRestaurant[];
}