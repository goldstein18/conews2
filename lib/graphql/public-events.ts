import { gql } from '@apollo/client';

/**
 * GraphQL query for public events directory
 * Uses cursor-based pagination for efficient data fetching
 * Supports filtering by date, tags, location, virtual status, and search
 * Uses tagNames instead of tagIds for simpler, more reliable filtering
 */
export const PUBLIC_EVENTS_PAGINATED = gql`
  query PublicEventsPaginated(
    $first: Int!
    $after: String
    $dateFilter: DateFilterType
    $virtual: Boolean
    $tagNames: [String!]
    $city: String
    $state: String
    $market: String
    $search: String
  ) {
    publicEventsPaginated(filter: {
      first: $first
      after: $after
      dateFilter: $dateFilter
      virtual: $virtual
      tagNames: $tagNames
      city: $city
      state: $state
      market: $market
      search: $search
      includeTotalCount: true
    }) {
      edges {
        node {
          id
          title
          slug
          description
          summary
          startDate
          endDate
          eventDates {
            id
            date
            startTime
            endTime
            soldOut
            cancelled
          }
          free
          virtual
          mainImageUrl
          bigImageUrl
          venueName
          city
          state
          market
          eventTags {
            tag {
              id
              name
              display
            }
          }
          venue {
            id
            name
            city
            state
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

/**
 * GraphQL query for single event by identifier (slug or ID)
 * Used for event detail page with full information
 */
export const PUBLIC_EVENT = gql`
  query PublicEvent($identifier: String!) {
    publicEvent(identifier: $identifier) {
      id
      title
      slug
      description
      summary
      startDate
      endDate
      eventDates {
        id
        date
        startTime
        endTime
        soldOut
        cancelled
      }
      free
      virtual
      mainImageUrl
      bigImageUrl
      venueName
      city
      state
      market
      eventTags {
        tag {
          id
          name
          display
        }
      }
      venue {
        id
        name
        city
        state
      }
    }
  }
`;

// Export types for use in components
export type {
  PublicEvent,
  PublicEventEdge,
  PublicEventsPaginated,
  PublicEventsResponse,
  PublicEventsQueryVariables,
  PublicEventResponse,
  PublicEventVariables,
  EventTag,
  EventVenue,
  EventDate
} from '@/types/public-events';
