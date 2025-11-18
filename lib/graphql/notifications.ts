import { gql } from '@apollo/client';

// Query: Get paginated notifications for current user
export const GET_NOTIFICATIONS = gql`
  query GetNotifications(
    $first: Int
    $after: String
    $includeTotalCount: Boolean
    $filter: NotificationFilterInput
  ) {
    notifications(
      first: $first
      after: $after
      includeTotalCount: $includeTotalCount
      filter: $filter
    ) {
      edges {
        node {
          id
          title
          message
          type
          userId
          targetRole
          isRead
          readAt
          metadata
          createdBy
          creator {
            id
            email
            firstName
            lastName
          }
          user {
            id
            email
            firstName
            lastName
          }
          createdAt
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

// Query: Get single notification by ID
export const GET_NOTIFICATION = gql`
  query GetNotification($id: ID!) {
    notification(id: $id) {
      id
      title
      message
      type
      userId
      targetRole
      isRead
      readAt
      metadata
      createdBy
      creator {
        id
        email
        firstName
        lastName
      }
      user {
        id
        email
        firstName
        lastName
      }
      createdAt
    }
  }
`;

// Query: Get unread notifications count
export const GET_UNREAD_COUNT = gql`
  query GetUnreadCount {
    unreadNotificationsCount
  }
`;

// Query: Get connected SSE clients count (admin only)
export const GET_CONNECTED_CLIENTS = gql`
  query GetConnectedClients {
    connectedClientsCount
  }
`;

// Mutation: Send global notification (admin only)
export const SEND_GLOBAL_NOTIFICATION = gql`
  mutation SendGlobalNotification($input: CreateNotificationInput!) {
    sendGlobalNotification(input: $input) {
      id
      title
      message
      type
      userId
      metadata
      createdAt
      creator {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

// Mutation: Send direct notification to specific user (admin only)
export const SEND_DIRECT_NOTIFICATION = gql`
  mutation SendDirectNotification($input: CreateNotificationInput!) {
    sendDirectNotification(input: $input) {
      id
      title
      message
      type
      userId
      user {
        id
        email
        firstName
        lastName
      }
      metadata
      createdAt
      creator {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

// Mutation: Mark notification(s) as read
export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($input: MarkAsReadInput!) {
    markNotificationAsRead(input: $input) {
      id
      isRead
      readAt
      title
      message
      type
      metadata
      createdAt
    }
  }
`;

// Mutation: Mark all notifications as read
export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;
