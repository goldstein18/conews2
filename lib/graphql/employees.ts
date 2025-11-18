import { gql } from '@apollo/client';

export const LIST_EMPLOYEES = gql`
  query ListEmployees(
    $first: Int = 20
    $after: String
  ) {
    employeesPaginated(
      first: $first
      after: $after
    ) {
      edges {
        cursor
        node {
          id
          email
          firstName
          lastName
          isActive
          employee
          role {
            id
            name
          }
          employeeMarkets {
            id
            market
            canCreate
            canEdit
            canView
            isDefault
          }
          employeeProfile {
            id
            department
            position
            hireDate
            manager {
              id
              firstName
              lastName
            }
          }
          createdAt
          updatedAt
          lastLogin
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($createEmployeeInput: CreateEmployeeInput!) {
    createEmployee(createEmployeeInput: $createEmployeeInput) {
      id
      email
      firstName
      lastName
      isActive
      role {
        id
        name
      }
      employeeMarkets {
        id
        market
        canCreate
        canEdit
        canView
        isDefault
      }
      employeeProfile {
        id
        department
        position
        hireDate
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $updateEmployeeInput: UpdateEmployeeInput!) {
    updateEmployee(id: $id, updateEmployeeInput: $updateEmployeeInput) {
      id
      email
      firstName
      lastName
      isActive
      role {
        id
        name
      }
      employeeMarkets {
        id
        market
        canCreate
        canEdit
        canView
        isDefault
      }
      employeeProfile {
        id
        department
        position
        hireDate
      }
      updatedAt
    }
  }
`;

export const TOGGLE_EMPLOYEE_STATUS = gql`
  mutation ToggleEmployeeStatus($id: ID!, $isActive: Boolean!) {
    updateEmployee(id: $id, updateEmployeeInput: { isActive: $isActive }) {
      id
      isActive
      updatedAt
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      email
      firstName
      lastName
      isActive
      employee
      role {
        id
        name
      }
      employeeMarkets {
        id
        market
        canCreate
        canEdit
        canView
        isDefault
      }
      employeeProfile {
        id
        department
        position
        hireDate
        manager {
          id
          firstName
          lastName
        }
      }
      createdAt
      updatedAt
      lastLogin
    }
  }
`;