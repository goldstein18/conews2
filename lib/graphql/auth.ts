import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      access_token
      user {
        id
        email
        firstName
        lastName
        role {
          name
        }
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
    register(registerInput: { firstName: $firstName, lastName: $lastName, email: $email, password: $password }) {
      access_token
      user {
        id
        email
        firstName
        lastName
        role {
          name
        }
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      firstName
      lastName
      username
      avatar
      bio
      phone
      isActive
      roleId
      createdAt
      updatedAt
      lastLogin
      emailVerified
      profilePhotoUrl
      role {
        id
        name
      }
    }
  }
`;

export const GET_USER_ROLE = gql`
  query GetUserRole($userId: String!) {
    user(id: $userId) {
      role {
        id
        name
      }
    }
  }
`;

export const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(input: { email: $email }) {
      success
      message
    }
  }
`;

export const VALIDATE_RESET_TOKEN_MUTATION = gql`
  mutation ValidateResetToken($token: String!) {
    validateResetToken(input: { token: $token }) {
      valid
      email
      message
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(input: { token: $token, newPassword: $newPassword }) {
      access_token
      user {
        id
        email
        firstName
        lastName
        avatar
        role {
          name
          displayName
        }
      }
    }
  }
`;
