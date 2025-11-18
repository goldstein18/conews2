import { gql } from '@apollo/client';

export const MEMBERS_DASHBOARD_STATS = gql`
  query MembersDashboardStats($market: String) {
    membersDashboardStats(market: $market) {
      planStats {
        planName
        planSlug
        count
        color
      }
      summary {
        totalCompanies
        activeCompanies
        pendingCompanies
        expiringThisMonth
      }
    }
  }
`;

export const LIST_COMPANY_OWNERS = gql`
  query ListCompanyOwners(
    $first: Int = 20
    $after: String
    $filter: MembersFilterInput
    $sort: MembersSortInput
  ) {
    membersPaginated(
      first: $first
      after: $after
      filter: $filter
      sort: $sort
    ) {
      edges {
        cursor
        node {
          id
          email
          firstName
          lastName
          name
          market
          isActive
          createdAt

          # Company Information (ALWAYS present)
          ownedCompany {
            id
            name
            status
            managerCount
            userCount

            # Company Plan
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

            # Company Benefits (expiration)
            benefits {
              id
              startDate
              endDate
              benefits
              checkPayment
            }

            # Users to get real count
            users {
              id
              displayRole
            }
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

export const LIST_COMPANIES_SIMPLE = gql`
  query ListCompaniesSimple($filter: MembersFilterInput) {
    membersPaginated(
      first: 200
      filter: $filter
    ) {
      edges {
        node {
          ownedCompany {
            id
            name
            status
          }
        }
      }
    }
  }
`;

export const GET_COMPANY_DETAIL = gql`
  query GetCompanyDetailsWithStats($companyId: ID!) {
    company(id: $companyId) {
      id
      name
      email
      phone
      address
      city
      state
      zipcode
      status
      notes
      userCount
      managerCount
      createdAt
      updatedAt

      # Company Plan
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

      # Company Benefits (expiration)
      benefits {
        id
        startDate
        endDate
        benefits
        checkPayment
      }

      # Company Owner (Primary Contact)
      owner {
        id
        firstName
        lastName
        email
        phone
        market
        lastLogin
      }

      # Try to get users with roles if available
      users {
        id
        displayRole
        user {
          id
          firstName
          lastName
          email
          phone
          market
          lastLogin
        }
      }
    }
  }
`;