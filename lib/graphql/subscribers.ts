import { gql } from '@apollo/client';

/**
 * GraphQL operations for subscriber management
 * Subscribers are cultural members (CULTURAL_MEMBER role) who register for free
 */

// Create a new subscriber (public registration)
export const CREATE_SUBSCRIBER = gql`
  mutation CreateSubscriber($createSubscriberInput: CreateSubscriberInput!) {
    createSubscriber(createSubscriberInput: $createSubscriberInput) {
      id
      email
      firstName
      lastName
      city
      state
      role {
        id
        name
        displayName
      }
      userTags {
        id
        tagId
        tag {
          id
          name
          type
          color
          display
        }
      }
      createdAt
    }
  }
`;

// Get subscriber profile (authenticated)
export const GET_SUBSCRIBER_PROFILE = gql`
  query GetSubscriberProfile {
    me {
      id
      email
      firstName
      lastName
      city
      state
      role {
        id
        name
        displayName
      }
      userTags {
        id
        tagId
        tag {
          id
          name
          type
          color
          display
        }
      }
      createdAt
      updatedAt
    }
  }
`;

// Update subscriber profile
export const UPDATE_SUBSCRIBER = gql`
  mutation UpdateSubscriber($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      email
      firstName
      lastName
      city
      state
      updatedAt
    }
  }
`;
