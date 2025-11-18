import { gql } from "@apollo/client";

// Get company plan history
export const GET_COMPANY_PLAN_HISTORY = gql`
  query GetCompanyPlanHistory($companyId: ID!, $limit: Float!) {
    getCompanyPlanHistory(companyId: $companyId, limit: $limit) {
      items {
        id
        eventType
        date
        title
        description
        addedBy {
          firstName
          lastName
        }
        fromPlan
        toPlan
        assetType
        assetQuantity
        assetDuration
        fromStatus
        toStatus
      }
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
`;

// Get current plan details for a company
export const GET_COMPANY_CURRENT_PLAN = gql`
  query GetCompanyCurrentPlan($companyId: String!) {
    companyCurrentPlan(companyId: $companyId) {
      id
      planName
      price
      billingCycle
      status
      startDate
      endDate
      features
      assets {
        assetType
        assetName
        quantity
        usedQuantity
      }
    }
  }
`;