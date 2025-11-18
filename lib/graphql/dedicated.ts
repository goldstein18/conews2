import { gql } from '@apollo/client';

// Common fields for dedicated campaigns
const dedicatedFields = `
  id
  subject
  alternateText
  link
  sendDate
  status
  market
  companyId
  userId
  image
  imageUrl
  createdAt
  updatedAt
  createdBy
  updatedBy
  deletedBy
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
  campaign {
    id
    dedicatedId
    brevoCampaignId
    campaignName
    subject
    status
    templateId
    sentAt
    scheduledAt
    brevoLists
    brevoSegments
    brevoSender
    recipientCount
    createdBy
    updatedBy
    createdAt
    updatedAt
  }
`;

// Queries
export const LIST_DEDICATED = gql`
  query DedicatedList($filter: DedicatedFilterInput) {
    dedicatedList(filter: $filter) {
      ${dedicatedFields}
    }
  }
`;

export const DEDICATED_PAGINATED = gql`
  query DedicatedPaginated(
    $first: Int
    $after: String
    $includeTotalCount: Boolean
    $filter: DedicatedFilterInput
  ) {
    dedicatedPaginated(
      first: $first
      after: $after
      includeTotalCount: $includeTotalCount
      filter: $filter
    ) {
      edges {
        node {
          ${dedicatedFields}
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

export const GET_DEDICATED = gql`
  query GetDedicated($id: String!) {
    dedicated(id: $id) {
      ${dedicatedFields}
    }
  }
`;

export const MY_DEDICATED = gql`
  query MyDedicated {
    myDedicated {
      ${dedicatedFields}
    }
  }
`;

export const DEDICATED_BY_COMPANY = gql`
  query DedicatedByCompany($companyId: String!) {
    dedicatedByCompany(companyId: $companyId) {
      ${dedicatedFields}
    }
  }
`;

export const DEDICATED_STATS = gql`
  query DedicatedStats($market: String) {
    dedicatedStats(market: $market) {
      total
      pending
      scheduled
      sent
      deleted
      byMarket
    }
  }
`;

export const GET_DEDICATED_IMAGE_URL = gql`
  query GetDedicatedImageUrl($imageKey: String!) {
    getDedicatedImageUrl(imageKey: $imageKey)
  }
`;

// Mutations
export const CREATE_DEDICATED = gql`
  mutation CreateDedicated($createDedicatedInput: CreateDedicatedInput!) {
    createDedicated(createDedicatedInput: $createDedicatedInput) {
      ${dedicatedFields}
    }
  }
`;

export const UPDATE_DEDICATED = gql`
  mutation UpdateDedicated($updateDedicatedInput: UpdateDedicatedInput!) {
    updateDedicated(updateDedicatedInput: $updateDedicatedInput) {
      ${dedicatedFields}
    }
  }
`;

export const UPDATE_DEDICATED_STATUS = gql`
  mutation UpdateDedicatedStatus($id: String!, $status: DedicatedStatus!) {
    updateDedicatedStatus(id: $id, status: $status) {
      ${dedicatedFields}
    }
  }
`;

export const DELETE_DEDICATED = gql`
  mutation DeleteDedicated($id: String!) {
    deleteDedicated(id: $id) {
      ${dedicatedFields}
    }
  }
`;

// Image Upload Mutation
export const GENERATE_DEDICATED_IMAGE_UPLOAD_URL = gql`
  mutation GenerateDedicatedImageUploadUrl(
    $generateDedicatedImageUploadUrlInput: GenerateDedicatedImageUploadUrlInput!
  ) {
    generateDedicatedImageUploadUrl(
      generateDedicatedImageUploadUrlInput: $generateDedicatedImageUploadUrlInput
    ) {
      uploadUrl
      key
      expiresIn
      maxFileSize
      recommendedDimensions
    }
  }
`;

// Brevo Campaign Mutations
export const CREATE_DEDICATED_CAMPAIGN = gql`
  mutation CreateDedicatedCampaign(
    $createDedicatedCampaignInput: CreateDedicatedCampaignInput!
  ) {
    createDedicatedCampaign(createDedicatedCampaignInput: $createDedicatedCampaignInput) {
      success
      message
      campaignId
      dedicatedId
      recipientCount
    }
  }
`;

export const UPDATE_DEDICATED_CAMPAIGN = gql`
  mutation UpdateDedicatedCampaign(
    $updateDedicatedCampaignInput: UpdateDedicatedCampaignInput!
  ) {
    updateDedicatedCampaign(updateDedicatedCampaignInput: $updateDedicatedCampaignInput) {
      success
      message
      campaignId
      dedicatedId
      recipientCount
    }
  }
`;
