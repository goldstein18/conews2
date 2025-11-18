import { gql } from '@apollo/client';

// ==================== MUTATIONS ====================

export const START_IMPERSONATION = gql`
  mutation StartImpersonation($input: StartImpersonationInput!) {
    startImpersonation(input: $input) {
      access_token
      impersonatedUser {
        id
        email
        firstName
        lastName
        role {
          id
          name
        }
      }
      sessionId
      expiresIn
      message
    }
  }
`;

export const END_IMPERSONATION = gql`
  mutation EndImpersonation {
    endImpersonation {
      access_token
      user {
        id
        email
        firstName
        lastName
        role {
          id
          name
        }
      }
    }
  }
`;

// ==================== QUERIES ====================

export const CURRENT_IMPERSONATION = gql`
  query CurrentImpersonation {
    currentImpersonation {
      id
      adminId
      targetUserId
      isActive
      startedAt
      endedAt
      reason
      admin {
        id
        email
        firstName
        lastName
      }
      targetUser {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

// ==================== TYPES ====================

export interface StartImpersonationInput {
  targetUserId: string;
  reason?: string;
}

export interface ImpersonatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: {
    id: string;
    name: string;
  };
}

export interface StartImpersonationResponse {
  access_token: string;
  impersonatedUser: ImpersonatedUser;
  sessionId: string;
  expiresIn: string;
  message: string;
}

export interface EndImpersonationResponse {
  access_token: string;
  user: ImpersonatedUser;
}

export interface ImpersonationSession {
  id: string;
  adminId: string;
  targetUserId: string;
  isActive: boolean;
  startedAt: string;
  endedAt?: string;
  reason?: string;
  admin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  targetUser: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface CurrentImpersonationResponse {
  currentImpersonation: ImpersonationSession | null;
}
