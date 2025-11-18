import { gql } from "@apollo/client";

// Get company asset counters (NEW API) - FIXED VERSION
export const GET_COMPANY_ASSET_COUNTERS = gql`
  query GetCompanyAssetCounters($companyId: String!) {
    getCompanyAssetCounters(companyId: $companyId) {
      assetType
      planAllowed
      individuallyAdded
      totalAvailable
      totalConsumed
      totalRemaining
      usagePercentage
      consumedThisMonth
      isLowStock
      isOutOfStock
    }
  }
`;

// Get company additional assets (LEGACY - for backward compatibility)
export const GET_COMPANY_ADDITIONAL_ASSETS = gql`
  query GetCompanyAdditionalAssets($companyId: ID!) {
    getCompanyAdditionalAssets(companyId: $companyId) {
      id
      type
      quantity
      duration
      notes
      addedBy {
        firstName
        lastName
      }
      addedDate
      updatedDate
    }
  }
`;

// Get company asset history
export const GET_COMPANY_ASSET_HISTORY = gql`
  query GetCompanyAssetHistory(
    $companyId: ID!
    $assetType: AssetType
    $fromDate: String
    $limit: Float!
  ) {
    getCompanyAssetHistory(
      companyId: $companyId
      assetType: $assetType
      fromDate: $fromDate
      limit: $limit
    ) {
      id
      assetType
      quantity
      duration
      action
      addedBy {
        firstName
        lastName
      }
      date
      notes
    }
  }
`;

// Add company asset
export const ADD_COMPANY_ASSET = gql`
  mutation AddCompanyAsset(
    $companyId: String!
    $type: AssetType!
    $quantity: Float!
    $duration: String
    $notes: String
  ) {
    addCompanyAsset(
      companyId: $companyId
      addAssetInput: {
        type: $type
        quantity: $quantity
        duration: $duration
        notes: $notes
      }
    ) {
      id
      name
    }
  }
`;

// Update company asset
export const UPDATE_COMPANY_ASSET = gql`
  mutation UpdateCompanyAsset(
    $companyId: String!
    $assetId: String!
    $quantity: Float!
    $notes: String
  ) {
    updateCompanyAsset(
      companyId: $companyId
      updateAssetInput: {
        assetId: $assetId
        quantity: $quantity
        notes: $notes
      }
    ) {
      id
      name
    }
  }
`;

// Consume company asset (NEW API)
export const CONSUME_COMPANY_ASSET = gql`
  mutation ConsumeCompanyAsset(
    $companyId: String!
    $assetType: AssetType!
    $quantity: Float!
    $context: String
  ) {
    consumeCompanyAsset(
      companyId: $companyId
      consumeInput: {
        assetType: $assetType
        quantity: $quantity
        context: $context
      }
    ) {
      success
      consumed
      remainingAfter
    }
  }
`;

// Get usage report (NEW API)
export const GET_ASSET_USAGE_REPORT = gql`
  query GetAssetUsageReport(
    $companyId: String!
    $assetType: AssetType
    $startDate: String
  ) {
    getAssetUsageReport(
      companyId: $companyId
      assetType: $assetType
      startDate: $startDate
    ) {
      companyName
      reportPeriod
      assetCounters {
        assetType
        totalAvailable
        totalConsumed
        usagePercentage
      }
      totalAssetsAvailable
      totalAssetsConsumed
      overallUsagePercentage
      lowStockAssets
      outOfStockAssets
      generatedAt
    }
  }
`;