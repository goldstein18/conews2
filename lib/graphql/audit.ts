import { gql } from '@apollo/client';

export const RECENT_AUDIT_ACTIVITY = gql`
  query RecentAuditActivity(
    $entityTypes: [String!]
    $limit: Float = 100
  ) {
    recentAuditActivity(
      entityTypes: $entityTypes
      limit: $limit
    ) {
      action
      entityType
      entityId
      createdAt
      user {
        firstName
        lastName
      }
    }
  }
`;

export const ENTITY_AUDIT_HISTORY = gql`
  query GetEntityAuditHistory(
    $entityType: String!
    $entityId: String!
    $limit: Float = 50
  ) {
    auditHistory(filter: {
      entityType: $entityType
      entityId: $entityId
      limit: $limit
    }) {
      action
      userId
      createdAt
      user {
        firstName
        lastName
      }
      changes
      metadata
    }
  }
`;

export const MY_AUDIT_HISTORY = gql`
  query MyAuditHistory($limit: Float = 20) {
    myAuditHistory(limit: $limit) {
      action
      entityType
      entityId
      createdAt
      changes
    }
  }
`;