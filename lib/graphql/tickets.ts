import { gql } from '@apollo/client';

// Fragment for ticket user information
export const TICKET_USER_FRAGMENT = gql`
  fragment TicketUserFields on User {
    id
    firstName
    lastName
    email
  }
`;

// Fragment for ticket company information
export const TICKET_COMPANY_FRAGMENT = gql`
  fragment TicketCompanyFields on Company {
    id
    name
    email
  }
`;

// Fragment for ticket attachment information
export const TICKET_ATTACHMENT_FRAGMENT = gql`
  fragment TicketAttachmentFields on TicketAttachment {
    id
    fileName
    fileUrl
    fileSize
    contentType
    createdAt
  }
`;

// Fragment for ticket comment information
export const TICKET_COMMENT_FRAGMENT = gql`
  fragment TicketCommentFields on TicketComment {
    id
    content
    isInternal
    ticketId
    user {
      ...TicketUserFields
    }
    attachments {
      ...TicketAttachmentFields
    }
    createdAt
    updatedAt
  }
  ${TICKET_USER_FRAGMENT}
  ${TICKET_ATTACHMENT_FRAGMENT}
`;

// Fragment for basic ticket information (list view)
export const TICKET_BASIC_FRAGMENT = gql`
  fragment TicketBasicFields on Ticket {
    id
    title
    status
    priority
    category
    company {
      ...TicketCompanyFields
    }
    user {
      ...TicketUserFields
    }
    assignedTo {
      ...TicketUserFields
    }
    _count {
      comments
      attachments
    }
    createdAt
    updatedAt
    lastCommentAt
  }
  ${TICKET_COMPANY_FRAGMENT}
  ${TICKET_USER_FRAGMENT}
`;

// Fragment for full ticket information (detail view)
export const TICKET_FULL_FRAGMENT = gql`
  fragment TicketFullFields on Ticket {
    id
    title
    description
    status
    priority
    category
    company {
      ...TicketCompanyFields
    }
    user {
      ...TicketUserFields
    }
    assignedTo {
      ...TicketUserFields
    }
    comments {
      ...TicketCommentFields
    }
    attachments {
      ...TicketAttachmentFields
    }
    createdAt
    updatedAt
    resolvedAt
    closedAt
    lastCommentAt
  }
  ${TICKET_COMPANY_FRAGMENT}
  ${TICKET_USER_FRAGMENT}
  ${TICKET_COMMENT_FRAGMENT}
  ${TICKET_ATTACHMENT_FRAGMENT}
`;

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get a single ticket with full details
 */
export const GET_TICKET = gql`
  query GetTicket($id: ID!) {
    ticket(id: $id) {
      ...TicketFullFields
    }
  }
  ${TICKET_FULL_FRAGMENT}
`;

/**
 * Get current user's tickets
 */
export const GET_MY_TICKETS = gql`
  query GetMyTickets {
    myTickets {
      ...TicketBasicFields
    }
  }
  ${TICKET_BASIC_FRAGMENT}
`;

/**
 * Get tickets assigned to current user (support staff)
 */
export const GET_MY_ASSIGNED_TICKETS = gql`
  query GetMyAssignedTickets {
    myAssignedTickets {
      ...TicketBasicFields
    }
  }
  ${TICKET_BASIC_FRAGMENT}
`;

/**
 * Get tickets by company ID
 */
export const GET_TICKETS_BY_COMPANY = gql`
  query GetTicketsByCompany($companyId: String!) {
    ticketsByCompany(companyId: $companyId) {
      ...TicketBasicFields
    }
  }
  ${TICKET_BASIC_FRAGMENT}
`;

/**
 * Get all tickets with optional filters (admin only)
 */
export const GET_TICKETS = gql`
  query GetTickets($filter: TicketFilterInput) {
    tickets(filter: $filter) {
      ...TicketBasicFields
    }
  }
  ${TICKET_BASIC_FRAGMENT}
`;

/**
 * Get paginated tickets with filters and sorting
 */
export const GET_TICKETS_PAGINATED = gql`
  query GetTicketsPaginated(
    $first: Int
    $after: String
    $includeTotalCount: Boolean
    $filter: TicketFilterInput
  ) {
    ticketsPaginated(
      first: $first
      after: $after
      includeTotalCount: $includeTotalCount
      filter: $filter
    ) {
      edges {
        node {
          ...TicketBasicFields
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
  ${TICKET_BASIC_FRAGMENT}
`;

/**
 * Get ticket statistics
 */
export const GET_TICKET_STATS = gql`
  query GetTicketStats($companyId: String) {
    ticketStats(companyId: $companyId) {
      total
      open
      inProgress
      waitingForCustomer
      resolved
      closed
      cancelled
      reopened
      urgent
      high
      unassigned
    }
  }
`;

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new ticket
 */
export const CREATE_TICKET = gql`
  mutation CreateTicket($createTicketInput: CreateTicketInput!) {
    createTicket(createTicketInput: $createTicketInput) {
      ...TicketFullFields
    }
  }
  ${TICKET_FULL_FRAGMENT}
`;

/**
 * Update ticket details
 */
export const UPDATE_TICKET = gql`
  mutation UpdateTicket($updateTicketInput: UpdateTicketInput!) {
    updateTicket(updateTicketInput: $updateTicketInput) {
      ...TicketFullFields
    }
  }
  ${TICKET_FULL_FRAGMENT}
`;

/**
 * Update ticket status
 */
export const UPDATE_TICKET_STATUS = gql`
  mutation UpdateTicketStatus($updateTicketStatusInput: UpdateTicketStatusInput!) {
    updateTicketStatus(updateTicketStatusInput: $updateTicketStatusInput) {
      id
      status
      assignedTo {
        ...TicketUserFields
      }
      updatedAt
      resolvedAt
      closedAt
    }
  }
  ${TICKET_USER_FRAGMENT}
`;

/**
 * Assign ticket to support staff
 */
export const ASSIGN_TICKET = gql`
  mutation AssignTicket($assignTicketInput: AssignTicketInput!) {
    assignTicket(assignTicketInput: $assignTicketInput) {
      id
      assignedTo {
        ...TicketUserFields
        role {
          name
        }
      }
      status
      updatedAt
    }
  }
  ${TICKET_USER_FRAGMENT}
`;

/**
 * Add a comment or internal note to a ticket
 */
export const ADD_TICKET_COMMENT = gql`
  mutation AddTicketComment($addCommentInput: AddCommentInput!) {
    addTicketComment(addCommentInput: $addCommentInput) {
      ...TicketCommentFields
    }
  }
  ${TICKET_COMMENT_FRAGMENT}
`;

/**
 * Generate presigned URL for ticket attachment upload
 */
export const GENERATE_TICKET_ATTACHMENT_UPLOAD_URL = gql`
  mutation GenerateTicketAttachmentUploadUrl(
    $generateAttachmentUploadUrlInput: GenerateAttachmentUploadUrlInput!
  ) {
    generateTicketAttachmentUploadUrl(
      generateAttachmentUploadUrlInput: $generateAttachmentUploadUrlInput
    ) {
      uploadUrl
      key
      expiresIn
      maxFileSize
    }
  }
`;

/**
 * Delete a ticket (soft delete, sets status to CANCELLED)
 */
export const DELETE_TICKET = gql`
  mutation DeleteTicket($id: ID!) {
    deleteTicket(id: $id) {
      id
      status
      deletedBy
    }
  }
`;
