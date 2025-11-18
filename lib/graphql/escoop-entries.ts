import { gql } from '@apollo/client';

// Fragments
export const ESCOOP_ENTRY_FRAGMENT = gql`
  fragment EscoopEntryFragment on EscoopEntry {
    id
    escoopId
    eventId
    status
    locations
    approvalReason
    approvedAt
    createdBy
    updatedBy
    deletedBy
    createdAt
    updatedAt
    escoop {
      id
      name
      title
      remaining
      status
    }
    event {
      id
      title
      slug
      status
      image
      mainImageUrl
      startDate
      companyId
    }
  }
`;

// Queries
export const SEARCH_ESCOOPS = gql`
  query SearchEscoops($input: EscoopSearchInput) {
    searchEscoops(input: $input) {
      id
      name
      status
      remaining
      market
    }
  }
`;

export const SEARCH_EVENTS = gql`
  query SearchEvents($input: EventSearchInput) {
    searchEvents(input: $input) {
      id
      title
      startDate
      status
      companyId
      mainImageUrl
    }
  }
`;

export const LIST_ESCOOP_ENTRIES = gql`
  ${ESCOOP_ENTRY_FRAGMENT}
  query EscoopEntriesPaginated($paginatedFilter: EscoopEntriesPaginatedFilterInput) {
    escoopEntriesPaginated(paginatedFilter: $paginatedFilter) {
      edges {
        node {
          ...EscoopEntryFragment
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

export const GET_ESCOOP_ENTRY = gql`
  query GetEscoopEntry($id: ID!) {
    escoopEntry(id: $id) {
      id
      escoopId
      eventId
      status
      locations
      approvalReason
      approvedAt
      createdBy
      updatedBy
      deletedBy
      createdAt
      updatedAt
      escoop {
        id
        name
        title
        remaining
        status
      }
      event {
        id
        title
        slug
        status
        image
        mainImageUrl
        startDate
        companyId
      }
    }
  }
`;

// Mutations
export const CREATE_ESCOOP_ENTRY = gql`
  ${ESCOOP_ENTRY_FRAGMENT}
  mutation CreateEscoopEntry($createEscoopEntryInput: CreateEscoopEntryInput!) {
    createEscoopEntry(createEscoopEntryInput: $createEscoopEntryInput) {
      ...EscoopEntryFragment
    }
  }
`;

export const UPDATE_ESCOOP_ENTRY = gql`
  mutation UpdateEscoopEntry($updateEscoopEntryInput: UpdateEscoopEntryInput!) {
    updateEscoopEntry(updateEscoopEntryInput: $updateEscoopEntryInput) {
      id
      status
      locations
      approvalReason
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_ESCOOP_ENTRY = gql`
  mutation DeleteEscoopEntry($id: ID!) {
    deleteEscoopEntry(id: $id) {
      id
      success
      message
    }
  }
`;

// Query for Escoop Builder - Get entries for a specific escoop
export const GET_ESCOOP_ENTRIES = gql`
  query GetEscoopEntries($paginatedFilter: EscoopEntriesPaginatedFilterInput) {
    escoopEntriesPaginated(paginatedFilter: $paginatedFilter) {
      edges {
        node {
          id
          escoopId
          eventId
          status
          event {
            id
            title
            startDate
            imageUrl
            slug
          }
          locations
          approvalReason
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Stats query (if needed for dashboard)
export const ESCOOP_ENTRY_STATS = gql`
  query EscoopEntryStats($filter: EscoopEntryStatsFilter) {
    escoopEntryStats(filter: $filter) {
      totalPending
      totalApproved
      totalRejected
      totalPublished
      recentEntries {
        id
        status
        locations
        createdAt
        escoop {
          name
        }
        event {
          title
        }
      }
    }
  }
`;