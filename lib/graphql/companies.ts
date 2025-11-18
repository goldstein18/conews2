import { gql } from '@apollo/client';

export const CREATE_COMPANY_WITH_USERS = gql`
  mutation CreateCompanyWithUsers($createCompanyWithUsersInput: CreateCompanyWithUsersInput!) {
    createCompanyWithUsers(createCompanyWithUsersInput: $createCompanyWithUsersInput) {
      id
      name
      email
      phone
      address
      city
      state
      zipcode
      owner {
        id
        email
        firstName
        lastName
      }
      plan {
        id
        plan
        planSlug
        price
        priceLong
        allowances {
          events
          restaurants
          banners
          venues
        }
      }
      users {
        id
        displayRole
        isActive
        user {
          id
          email
          firstName
          lastName
        }
      }
      benefits {
        id
        startDate
        endDate
        benefits
        checkPayment
      }
      createdAt
      updatedAt
    }
  }
`;