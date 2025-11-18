import { gql } from '@apollo/client';

// Fragments
export const ARTS_GROUP_FRAGMENT = gql`
  fragment ArtsGroupFragment on ArtsGroup {
    id
    name
    slug
    description
    companyId
    address
    market
    phone
    email
    website
    image
    imageUrl
    artType
    memberCount
    foundedYear
    status
    declinedReason
    createdAt
    updatedAt
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
`;

// Queries
export const LIST_ARTS_GROUPS = gql`
  ${ARTS_GROUP_FRAGMENT}
  query ListArtsGroups(
    $first: Int
    $after: String
    $includeTotalCount: Boolean
    $filter: ArtsGroupsFilterInput
  ) {
    artsGroupsPaginated(
      first: $first
      after: $after
      includeTotalCount: $includeTotalCount
      filter: $filter
    ) {
      edges {
        node {
          ...ArtsGroupFragment
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;

export const GET_ARTS_GROUP = gql`
  ${ARTS_GROUP_FRAGMENT}
  query GetArtsGroup($id: String!) {
    artsGroup(id: $id) {
      ...ArtsGroupFragment
    }
  }
`;

export const GET_ARTS_GROUP_STATS = gql`
  query GetArtsGroupStats {
    artsGroupStats {
      total
      approved
      pending
      declined
      deleted
    }
  }
`;

// Mutations
export const CREATE_ARTS_GROUP = gql`
  ${ARTS_GROUP_FRAGMENT}
  mutation CreateArtsGroup($createArtsGroupInput: CreateArtsGroupInput!) {
    createArtsGroup(createArtsGroupInput: $createArtsGroupInput) {
      ...ArtsGroupFragment
    }
  }
`;

export const UPDATE_ARTS_GROUP = gql`
  ${ARTS_GROUP_FRAGMENT}
  mutation UpdateArtsGroup($updateArtsGroupInput: UpdateArtsGroupInput!) {
    updateArtsGroup(updateArtsGroupInput: $updateArtsGroupInput) {
      ...ArtsGroupFragment
    }
  }
`;

export const UPDATE_ARTS_GROUP_STATUS = gql`
  ${ARTS_GROUP_FRAGMENT}
  mutation UpdateArtsGroupStatus($id: String!, $status: ArtsGroupStatus!) {
    updateArtsGroupStatus(id: $id, status: $status) {
      ...ArtsGroupFragment
    }
  }
`;

export const DELETE_ARTS_GROUP = gql`
  mutation DeleteArtsGroup($id: String!) {
    deleteArtsGroup(id: $id)
  }
`;

// Image Upload Mutation
export const GENERATE_ARTS_GROUP_IMAGE_UPLOAD_URL = gql`
  mutation GenerateArtsGroupImageUploadUrl(
    $generateArtsGroupImageUploadUrlInput: GenerateArtsGroupImageUploadUrlInput!
  ) {
    generateArtsGroupImageUploadUrl(
      generateArtsGroupImageUploadUrlInput: $generateArtsGroupImageUploadUrlInput
    ) {
      uploadUrl
      key
      expiresIn
      maxFileSize
      recommendedDimensions
      imageType
    }
  }
`;

export const UPDATE_ARTS_GROUP_IMAGE = gql`
  ${ARTS_GROUP_FRAGMENT}
  mutation UpdateArtsGroupImage($updateArtsGroupImageInput: UpdateArtsGroupImageInput!) {
    updateArtsGroupImage(updateArtsGroupImageInput: $updateArtsGroupImageInput) {
      ...ArtsGroupFragment
    }
  }
`;

export const REMOVE_ARTS_GROUP_IMAGE = gql`
  mutation RemoveArtsGroupImage($artsGroupId: String!) {
    removeArtsGroupImage(artsGroupId: $artsGroupId)
  }
`;
