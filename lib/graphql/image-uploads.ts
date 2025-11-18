import { gql } from '@apollo/client';

// Generic Image Upload Mutations
export const GENERATE_IMAGE_UPLOAD_URL = gql`
  mutation GenerateImageUploadUrl(
    $generateImageUploadUrlInput: GenerateImageUploadUrlInput!
    $companyId: String!
    $module: String!
  ) {
    generateImageUploadUrl(
      generateImageUploadUrlInput: $generateImageUploadUrlInput
      companyId: $companyId
      module: $module
    ) {
      uploadUrl
      key
      expiresIn
      maxFileSize
      recommendedDimensions {
        width
        height
      }
      allowedFileTypes
    }
  }
`;

// Venue-specific image upload
export const GENERATE_VENUE_IMAGE_UPLOAD_URL = gql`
  mutation GenerateVenueImageUploadUrl(
    $generateVenueImageUploadUrlInput: GenerateVenueImageUploadUrlInput!
  ) {
    generateVenueImageUploadUrl(
      generateVenueImageUploadUrlInput: $generateVenueImageUploadUrlInput
    ) {
      uploadUrl
      key
      expiresIn
      maxFileSize
    }
  }
`;

// Event-specific image upload
export const GENERATE_EVENT_IMAGE_UPLOAD_URL = gql`
  mutation GenerateEventImageUploadUrl(
    $generateImageUploadUrlInput: GenerateImageUploadUrlInput!
    $companyId: String!
  ) {
    generateEventImageUploadUrl(
      generateImageUploadUrlInput: $generateImageUploadUrlInput
      companyId: $companyId
    ) {
      uploadUrl
      key
      expiresIn
      maxFileSize
      recommendedDimensions {
        width
        height
      }
      allowedFileTypes
    }
  }
`;

// Restaurant-specific image upload
export const GENERATE_RESTAURANT_IMAGE_UPLOAD_URL = gql`
  mutation GenerateRestaurantImageUploadUrl(
    $generateImageUploadUrlInput: GenerateImageUploadUrlInput!
    $companyId: String!
  ) {
    generateRestaurantImageUploadUrl(
      generateImageUploadUrlInput: $generateImageUploadUrlInput
      companyId: $companyId
    ) {
      uploadUrl
      key
      expiresIn
      maxFileSize
      recommendedDimensions {
        width
        height
      }
      allowedFileTypes
    }
  }
`;

// Banner-specific image upload
export const GENERATE_BANNER_IMAGE_UPLOAD_URL = gql`
  mutation GenerateBannerImageUploadUrl(
    $generateImageUploadUrlInput: GenerateImageUploadUrlInput!
    $companyId: String!
  ) {
    generateBannerImageUploadUrl(
      generateImageUploadUrlInput: $generateImageUploadUrlInput
      companyId: $companyId
    ) {
      uploadUrl
      key
      expiresIn
      maxFileSize
      recommendedDimensions {
        width
        height
      }
      allowedFileTypes
    }
  }
`;

// Image update mutations for different entities
export const UPDATE_VENUE_IMAGES = gql`
  mutation UpdateVenueImages($updateVenueImagesInput: UpdateVenueImagesInput!) {
    updateVenueImages(updateVenueImagesInput: $updateVenueImagesInput) {
      id
      name
      image
      imageUrl
    }
  }
`;

export const UPDATE_EVENT_IMAGE = gql`
  mutation UpdateEventImage(
    $eventId: ID!
    $imageKey: String!
  ) {
    updateEventImage(
      eventId: $eventId
      imageKey: $imageKey
    ) {
      id
      title
      image
      imageUrl
    }
  }
`;

export const UPDATE_RESTAURANT_IMAGE = gql`
  mutation UpdateRestaurantImage(
    $restaurantId: ID!
    $imageKey: String!
  ) {
    updateRestaurantImage(
      restaurantId: $restaurantId
      imageKey: $imageKey
    ) {
      id
      name
      image
      imageUrl
    }
  }
`;

// Remove image mutations
export const REMOVE_VENUE_IMAGE = gql`
  mutation RemoveVenueImage($venueId: ID!) {
    removeVenueImage(venueId: $venueId) {
      id
      name
      image
      imageUrl
    }
  }
`;

export const REMOVE_EVENT_IMAGE = gql`
  mutation RemoveEventImage($eventId: ID!) {
    removeEventImage(eventId: $eventId) {
      id
      title
      image
      imageUrl
    }
  }
`;

export const REMOVE_RESTAURANT_IMAGE = gql`
  mutation RemoveRestaurantImage($restaurantId: ID!) {
    removeRestaurantImage(restaurantId: $restaurantId) {
      id
      name
      image
      imageUrl
    }
  }
`;