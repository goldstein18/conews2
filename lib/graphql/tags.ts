import { gql } from '@apollo/client';

// List all tags with pagination and filtering (Admin only)
export const LIST_TAGS = gql`
  query ListTags(
    $first: Int = 20
    $after: String
    $before: String
    $last: Int
    $filter: TagsFilterInput
    $sort: TagsSortInput
    $includeTotalCount: Boolean = true
  ) {
    tagsPaginated(
      first: $first
      after: $after
      before: $before
      last: $last
      filter: $filter
      sort: $sort
      includeTotalCount: $includeTotalCount
    ) {
      edges {
        cursor
        node {
          id
          name
          display
          type
          mainGenre
          color
          description
          isActive
          order
          metadata
          displayName
          createdAt
          updatedAt
        }
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

// Get all active tags (Public)
export const GET_ALL_TAGS = gql`
  query GetAllTags {
    tags {
      id
      name
      display
      type
      mainGenre
      color
      description
      isActive
      order
      metadata
      displayName
    }
  }
`;

// Get main genres (Public)
export const GET_MAIN_GENRES = gql`
  query GetMainGenres {
    mainGenres {
      id
      name
      display
      type
      color
      order
    }
  }
`;

// Get subgenres by main genre (Public)
export const GET_SUBGENRES = gql`
  query GetSubgenres($mainGenre: String!) {
    subgenres(mainGenre: $mainGenre) {
      id
      name
      display
      mainGenre
      color
      order
    }
  }
`;

// Get supporting tags (Public)
export const GET_SUPPORTING_TAGS = gql`
  query GetSupportingTags {
    supportingTags {
      id
      name
      display
      color
      order
    }
  }
`;

// Get audience tags (Public)
export const GET_AUDIENCE_TAGS = gql`
  query GetAudienceTags {
    audienceTags {
      id
      name
      display
      color
      order
    }
  }
`;

// Get complete genre structure (Public)
export const GET_GENRE_STRUCTURE = gql`
  query GetGenreStructure {
    genreStructure {
      mainGenres {
        id
        name
        display
        color
        order
      }
      subgenres {
        id
        name
        display
        mainGenre
        color
        order
      }
      supportingTags {
        id
        name
        display
        color
        order
      }
      audienceTags {
        id
        name
        display
        color
        order
      }
    }
  }
`;

// Get single tag by ID (Admin only)
export const GET_TAG = gql`
  query GetTag($id: ID!) {
    tag(id: $id) {
      id
      name
      display
      type
      mainGenre
      color
      description
      isActive
      order
      metadata
      displayName
      createdAt
      updatedAt
    }
  }
`;

// Get user tags for a specific user (Admin only)
export const GET_USER_TAGS = gql`
  query GetUserTags($userId: ID!) {
    userTags(userId: $userId) {
      id
      userId
      tagId
      assignedAt
      tag {
        id
        name
        display
        type
        color
        mainGenre
      }
    }
  }
`;

// Get my assigned tags (Authenticated users)
export const GET_MY_TAGS = gql`
  query GetMyTags {
    myTags {
      id
      userId
      tagId
      assignedAt
      tag {
        id
        name
        display
        type
        color
        mainGenre
      }
    }
  }
`;

// MUTATIONS

// Create new tag (Admin only)
export const CREATE_TAG = gql`
  mutation CreateTag($createTagInput: CreateTagInput!) {
    createTag(createTagInput: $createTagInput) {
      id
      name
      display
      type
      mainGenre
      color
      description
      isActive
      order
      metadata
      displayName
      createdAt
      updatedAt
    }
  }
`;

// Update existing tag (Admin only)
export const UPDATE_TAG = gql`
  mutation UpdateTag($id: ID!, $updateTagInput: UpdateTagInput!) {
    updateTag(id: $id, updateTagInput: $updateTagInput) {
      id
      name
      display
      type
      mainGenre
      color
      description
      isActive
      order
      metadata
      displayName
      updatedAt
    }
  }
`;

// Remove/Delete tag (Admin only)
export const REMOVE_TAG = gql`
  mutation RemoveTag($id: ID!) {
    removeTag(id: $id) {
      id
      name
      isActive
    }
  }
`;

// Assign tags to a user (Admin only)
export const ASSIGN_USER_TAGS = gql`
  mutation AssignUserTags($userId: ID!, $assignTagsInput: AssignTagsInput!) {
    assignUserTags(userId: $userId, assignTagsInput: $assignTagsInput) {
      id
      userId
      tagId
      assignedAt
      tag {
        id
        name
        display
        type
        color
        mainGenre
      }
    }
  }
`;

// Assign tags to my profile (Authenticated users)
export const ASSIGN_MY_TAGS = gql`
  mutation AssignMyTags($assignTagsInput: AssignTagsInput!) {
    assignMyTags(assignTagsInput: $assignTagsInput) {
      id
      userId
      tagId
      assignedAt
      tag {
        id
        name
        display
        type
        color
        mainGenre
      }
    }
  }
`;

// Remove tag from my profile (Authenticated users)
export const REMOVE_MY_TAG = gql`
  mutation RemoveMyTag($tagId: ID!) {
    removeMyTag(tagId: $tagId) {
      id
      userId
      tagId
    }
  }
`;

// Toggle tag active status (Admin only)
export const TOGGLE_TAG_STATUS = gql`
  mutation ToggleTagStatus($id: ID!, $isActive: Boolean!) {
    updateTag(id: $id, updateTagInput: { isActive: $isActive }) {
      id
      isActive
      updatedAt
    }
  }
`;