import { gql } from '@apollo/client';

// Fragments
export const ESCOOP_FRAGMENT = gql`
  fragment EscoopFragment on Escoop {
    id
    name
    title
    sendDate
    status
    sent
    remaining
    bannersRemaining
    market
    locations
    userId
    campaignId
    owner {
      id
      firstName
      lastName
      email
      __typename
    }
    createdAt
    updatedAt
    # ✅ Include restaurants, featuredEvents, and settings for builder
    restaurants {
      id
      position
      restaurant {
        id
        name
        slug
        imageUrl
        address
        city
        state
        __typename
      }
      __typename
    }
    featuredEvents {
      id
      position
      event {
        id
        title
        slug
        imageUrl
        startDate
        status
        __typename
      }
      __typename
    }
    settings {
      id
      subjectLine
      templateName
      brevoLists
      brevoSegments
      sendNow
      scheduleDate
      scheduleTime
      timezone
      trackOpens
      trackClicks
      testMode
      __typename
    }
    company {
      id
      name
      __typename
    }
    __typename
  }
`;

// Queries
export const LIST_ESCOOPS = gql`
  ${ESCOOP_FRAGMENT}
  query EscoopsPaginated($filter: EscoopsPaginatedFilterInput) {
    escoopsPaginated(filter: $filter) {
      edges {
        node {
          ...EscoopFragment
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

export const GET_ESCOOP = gql`
  ${ESCOOP_FRAGMENT}
  query GetEscoop($id: ID!) {
    escoop(id: $id) {
      ...EscoopFragment
    }
  }
`;

// Mutations
export const CREATE_ESCOOP = gql`
  mutation CreateEscoop($createEscoopInput: CreateEscoopInput!) {
    createEscoop(createEscoopInput: $createEscoopInput) {
      id
      name
      title
      sendDate
      remaining
      bannersRemaining
      market
      locations
      status
      createdAt
      updatedAt
      # Relaciones
      company {
        id
        name
        __typename
      }
      restaurants {
        id
        position
        restaurant {
          id
          name
          slug
          imageUrl
          __typename
        }
        __typename
      }
      featuredEvents {
        id
        position
        event {
          id
          title
          slug
          imageUrl
          __typename
        }
        __typename
      }
      settings {
        id
        subjectLine
        templateName
        brevoLists
        brevoSegments
        sendNow
        scheduleDate
        scheduleTime
        timezone
        trackOpens
        trackClicks
        testMode
        __typename
      }
      __typename
    }
  }
`;

export const UPDATE_ESCOOP = gql`
  mutation UpdateEscoop($updateEscoopInput: UpdateEscoopInput!) {
    updateEscoop(updateEscoopInput: $updateEscoopInput) {
      id
      name
      title
      sendDate
      remaining
      bannersRemaining
      market
      locations
      status
      createdAt
      updatedAt
      # Relaciones
      company {
        id
        name
        __typename
      }
      restaurants {
        id
        position
        restaurant {
          id
          name
          slug
          imageUrl
          __typename
        }
        __typename
      }
      featuredEvents {
        id
        position
        event {
          id
          title
          slug
          imageUrl
          __typename
        }
        __typename
      }
      settings {
        id
        subjectLine
        templateName
        brevoLists
        brevoSegments
        sendNow
        scheduleDate
        scheduleTime
        timezone
        trackOpens
        trackClicks
        testMode
        __typename
      }
      __typename
    }
  }
`;

export const DELETE_ESCOOP = gql`
  mutation DeleteEscoop($id: ID!) {
    deleteEscoop(id: $id) {
      id
      success
      message
    }
  }
`;

// Stats query (if needed)
export const ESCOOP_STATS = gql`
  query EscoopStats($market: String) {
    escoopStats(market: $market) {
      totalSent
      totalScheduled
      totalDraft
      recentActivity {
        id
        name
        status
        sendDate
      }
    }
  }
`;

// Types
export interface EscoopSettings {
  subjectLine: string;    // ✅ REQUERIDO
  templateName: string;   // ✅ REQUERIDO
  brevoLists?: string[];  // ✅ Array de IDs de listas de Brevo
  brevoSegments?: string[];  // ✅ Array de IDs de segmentos de Brevo
  sendNow?: boolean;
  scheduleDate?: string;  // ✅ Formato YYYY-MM-DD
  scheduleTime?: string;  // ✅ Formato HH:mm
  timezone?: string;
}

export interface CreateEscoopInput {
  name: string;
  title: string;
  sendDate: string;
  remaining?: number;
  bannersRemaining?: number;
  market?: string;
  locations?: string[];
  companyId?: string;
  restaurantIds?: string[];
  featuredEventIds?: string[];
  settings: EscoopSettings;
}

export interface CreateEscoopVariables {
  createEscoopInput: CreateEscoopInput;
}

export interface CreateEscoopData {
  createEscoop: {
    id: string;
    name: string;
    title: string;
    sendDate: string;
    remaining?: number;
    bannersRemaining?: number;
    market?: string;
    locations?: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
    company?: {
      id: string;
      name: string;
    };
    restaurants?: Array<{
      id: string;
      position: number;
      restaurant: {
        id: string;
        name: string;
        slug: string;
        imageUrl?: string;
      };
    }>;
    featuredEvents?: Array<{
      id: string;
      position: number;
      event: {
        id: string;
        title: string;
        slug: string;
        imageUrl?: string;
      };
    }>;
    settings?: {
      id: string;
      subjectLine: string;
      templateName?: string;
      brevoLists?: string[];
      brevoSegments?: string[];
      sendNow?: boolean;
      scheduleDate?: string;
      scheduleTime?: string;
      timezone?: string;
      trackOpens?: boolean;
      trackClicks?: boolean;
      testMode?: boolean;
    };
  };
}

export interface UpdateEscoopInput {
  id: string; // ✅ Required for update
  name?: string;
  title?: string;
  sendDate?: string;
  remaining?: number;
  bannersRemaining?: number;
  market?: string;
  locations?: string[];
  restaurantIds?: string[];
  featuredEventIds?: string[];
  settings?: EscoopSettings;
}

export interface UpdateEscoopVariables {
  updateEscoopInput: UpdateEscoopInput;
}

export interface UpdateEscoopData {
  updateEscoop: CreateEscoopData['createEscoop']; // Same structure as create
}