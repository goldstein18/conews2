import { gql } from '@apollo/client';

// QUERIES

// List events with cursor-based pagination and filters
export const LIST_EVENTS = gql`
  query EventsPaginated(
    $filter: EventsFilterInput
  ) {
    eventsPaginated(
      filter: $filter
    ) {
      edges {
        cursor
        node {
          id
          title
          slug
          status
          isDraft
          summary
          venueName
          address
          city
          state
          zipcode
          market
          mainImageUrl
          bigImageUrl
          featuredImageUrl
          free
          virtual
          createdAt
          updatedAt
          owner {
            id
            firstName
            lastName
            email
          }
          venue {
            id
            name
            address
            city
            state
          }
          company {
            name
          }
          nextEventDate {
            date
            startTime
            endTime
          }
          eventDates {
            date
            startTime
            endTime
          }
          eventOccurrences {
            id
          }
          eventTags {
            id
            assignmentType
            tag {
              id
              name
              type
              color
            }
          }
          _count {
            eventLikes
          }
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

// Get single event by ID
export const GET_EVENT = gql`
  query GetEvent($id: String!) {
    event(id: $id) {
      id
      title
      description
      slug
      status
      isDraft
      summary
      companyId
      venueName
      address
      city
      state
      zipcode
      phone
      website
      ticketUrl
      facebook
      twitter
      instagram
      youtube
      tiktok
      free
      virtual
      virtualEventLink
      venueId
      market
      pricing
      eventDetails
      faqs
      # Additional Information fields
      ageInfo
      doorTime
      parkingInfo
      accessibilityInfo
      times
      image
      mainImageUrl
      bigImageUrl
      featuredImageUrl
      video
      videoType
      createdAt
      updatedAt
      lastAutoSaveAt
      owner {
        id
        firstName
        lastName
        email
      }
      venue {
        id
        name
        address
        city
        state
      }
      eventTags {
        id
        assignmentType
        tag {
          id
          name
          type
          color
        }
      }
      eventDates {
        id
        date
        startTime
        endTime
        timezone
        maxCapacity
        soldOut
        cancelled
      }
      eventOccurrences {
        id
        rrule
        timezone
        startTime
        endTime
        durationMinutes
        exceptionDates
        customOccurrences
      }
      eventLineups {
        id
        name
        role
        type
        description
        image
        orderIndex
        __typename
      }
      eventAgendas {
        id
        title
        description
        startTime
        duration
        orderIndex
        status
        __typename
      }
      _count {
        eventLikes
      }
    }
  }
`;

// Get events dashboard stats
export const EVENTS_DASHBOARD_STATS = gql`
  query EventsDashboardStats(
    $market: String
    $companyId: String
  ) {
    eventsDashboardStats(
      market: $market
      companyId: $companyId
    ) {
      summary {
        totalEvents
        pendingEvents
        liveEvents
        draftEvents
        pastEvents
      }
    }
  }
`;

// Search events for escoop builder
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

// MUTATIONS

// Initialize a new draft event
export const INITIALIZE_DRAFT = gql`
  mutation InitializeDraft {
    initializeDraft {
      id
      title
      slug
      status
      isDraft
      createdAt
    }
  }
`;

// Auto-save event data
export const AUTO_SAVE_EVENT = gql`
  mutation AutoSaveEvent(
    $eventId: String!
    $data: AutoSaveEventInput!
  ) {
    autoSaveEvent(
      eventId: $eventId
      data: $data
    ) {
      id
      lastAutoSaveAt
      isDraft
      title
      summary
    }
  }
`;

// Create new event
export const CREATE_EVENT = gql`
  mutation CreateEvent($createEventInput: CreateEventInput!) {
    createEvent(createEventInput: $createEventInput) {
      id
      title
      slug
      status
      isDraft
      createdAt
    }
  }
`;

// Update existing event
export const UPDATE_EVENT = gql`
  mutation UpdateEvent($updateEventInput: UpdateEventInput!) {
    updateEvent(updateEventInput: $updateEventInput) {
      id
      title
      slug
      status
      isDraft
      updatedAt
      image
    }
  }
`;

// Submit draft for review
export const SUBMIT_DRAFT = gql`
  mutation SubmitDraft($eventId: String!) {
    submitDraft(eventId: $eventId) {
      id
      status
      isDraft
      updatedAt
    }
  }
`;

// Delete event
export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      id
      title
      status
    }
  }
`;

// Generate presigned URL for image upload
export const GENERATE_EVENT_IMAGE_UPLOAD_URL = gql`
  mutation GenerateEventImageUploadUrl($generateEventImageUploadUrlInput: GenerateEventImageUploadUrlInput!) {
    generateEventImageUploadUrl(generateEventImageUploadUrlInput: $generateEventImageUploadUrlInput) {
      uploadUrl
      key
      expiresIn
      maxFileSize
      recommendedDimensions
      imageType
    }
  }
`;

// Update event images after S3 upload
export const UPDATE_EVENT_IMAGES = gql`
  mutation UpdateEventImages($updateEventInput: UpdateEventInput!) {
    updateEvent(updateEventInput: $updateEventInput) {
      id
      mainImage
      bigImage
      featuredImage
      updatedAt
    }
  }
`;

// Bulk operations
export const BULK_UPDATE_EVENTS = gql`
  mutation BulkUpdateEvents(
    $eventIds: [ID!]!
    $action: BulkEventAction!
  ) {
    bulkUpdateEvents(
      eventIds: $eventIds
      action: $action
    ) {
      success
      updatedCount
      errors
    }
  }
`;

// Clone event
export const CLONE_EVENT = gql`
  mutation CloneEvent($eventId: String!) {
    cloneEvent(eventId: $eventId) {
      id
      title
      slug
      status
      isDraft
    }
  }
`;

// Types for event search in escoop builder
export interface SearchEvent {
  id: string;
  title: string;
  startDate?: string;
  status: string;
  companyId?: string;
  mainImageUrl?: string;
}

export interface EventSearchInput {
  search?: string;
  companyId?: string;
}

export interface SearchEventsVariables {
  input?: EventSearchInput;
}

export interface SearchEventsData {
  searchEvents: SearchEvent[];
}