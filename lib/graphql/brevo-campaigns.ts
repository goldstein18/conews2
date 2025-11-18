import { gql } from '@apollo/client';

// Fragments
export const BREVO_LIST_FRAGMENT = gql`
  fragment BrevoListFragment on BrevoList {
    id
    name
    folderId
    totalSubscribers
    totalBlacklisted
    uniqueSubscribers
    createdAt
    campaignStats
    dynamicList
    __typename
  }
`;

export const BREVO_LISTS_FRAGMENT = gql`
  fragment BrevoListsFragment on BrevoListsResponse {
    lists {
      id
      name
      uniqueSubscribers
      totalBlacklisted
      __typename
    }
    count
    __typename
  }
`;

export const BREVO_SEGMENT_FRAGMENT = gql`
  fragment BrevoSegmentFragment on BrevoSegment {
    id
    name
    categoryName
    createdAt
    updatedAt
    __typename
  }
`;

export const BREVO_SEGMENTS_FRAGMENT = gql`
  fragment BrevoSegmentsFragment on BrevoSegmentsResponse {
    segments {
      id
      name
      categoryName
      createdAt
      updatedAt
      __typename
    }
    count
    __typename
  }
`;

// Queries
export const GET_BREVO_LISTS = gql`
  ${BREVO_LISTS_FRAGMENT}
  query GetBrevoLists($limit: Int, $offset: Int) {
    brevoLists(limit: $limit, offset: $offset) {
      ...BrevoListsFragment
    }
  }
`;

export const GET_BREVO_LIST = gql`
  ${BREVO_LIST_FRAGMENT}
  query GetBrevoList($listId: String!) {
    brevoList(listId: $listId) {
      ...BrevoListFragment
    }
  }
`;

export const GET_BREVO_SEGMENTS = gql`
  ${BREVO_SEGMENTS_FRAGMENT}
  query GetBrevoSegments {
    brevoSegments {
      ...BrevoSegmentsFragment
    }
  }
`;

// Mutations
export const CREATE_ESCOOP_CAMPAIGN = gql`
  mutation CreateEscoopCampaign($input: CreateEscoopCampaignInput!) {
    createEscoopCampaign(input: $input) {
      success
      message
      campaignId
      escoopId
      recipientCount
      __typename
    }
  }
`;

export const SEND_TEST_CAMPAIGN = gql`
  mutation SendTestCampaign($input: SendTestCampaignInput!) {
    sendTestCampaign(input: $input) {
      success
      message
      __typename
    }
  }
`;

export const UPDATE_ESCOOP_CAMPAIGN = gql`
  mutation UpdateEscoopCampaign($input: UpdateEscoopCampaignInput!) {
    updateEscoopCampaign(input: $input) {
      success
      message
      campaignId
      escoopId
      recipientCount
      __typename
    }
  }
`;

export const SEND_CAMPAIGN = gql`
  mutation SendCampaign($input: SendCampaignInput!) {
    sendCampaign(input: $input) {
      success
      message
      __typename
    }
  }
`;