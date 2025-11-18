import { gql } from '@apollo/client';

// Company Profile Queries
export const MY_COMPANY_PROFILE = gql`
  query MyCompanyProfile {
    myCompanyProfile {
      id
      name
      email
      address
      city
      state
      phone
      logo
      logoUrl
      userCount
      managerCount
      network {
        socialNetworks
      }
      plan {
        plan
        price
      }
      currentBenefit {
        benefits
      }
    }
  }
`;

// Team Management Query
export const MY_COMPANY_TEAM = gql`
  query MyCompanyTeam {
    myCompanyTeam {
      id
      displayRole
      isActive
      createdAt
      user {
        id
        email
        firstName
        lastName
        avatar
        avatarUrl
      }
    }
  }
`;

// Logo Upload Mutations
export const GENERATE_LOGO_UPLOAD_URL = gql`
  mutation GenerateLogoUploadUrl(
    $generateLogoUploadUrlInput: GenerateLogoUploadUrlInput!
    $companyId: String!
  ) {
    generateLogoUploadUrl(
      generateLogoUploadUrlInput: $generateLogoUploadUrlInput
      companyId: $companyId
    ) {
      uploadUrl
      key
      expiresIn
      maxFileSize
      recommendedDimensions
    }
  }
`;

export const UPDATE_COMPANY_LOGO = gql`
  mutation UpdateCompanyLogo(
    $companyId: String!
    $logoKey: String!
  ) {
    updateCompanyLogo(
      companyId: $companyId
      logoKey: $logoKey
    ) {
      id
      name
      logo
      logoUrl
    }
  }
`;

export const REMOVE_COMPANY_LOGO = gql`
  mutation RemoveCompanyLogo($companyId: String!) {
    removeCompanyLogo(companyId: $companyId) {
      id
      name
      logo
      logoUrl
    }
  }
`;

// Company Profile Update Mutations
export const UPDATE_COMPANY_PROFILE = gql`
  mutation UpdateCompanyProfile(
    $companyId: ID!
    $updateCompanyInput: UpdateCompanyInput!
  ) {
    updateCompany(
      id: $companyId
      updateCompanyInput: $updateCompanyInput
    ) {
      id
      name
      email
      address
      city
      state
      phone
      status
      logoUrl
    }
  }
`;

// Social Networks Queries and Mutations
export const NETWORK_BY_COMPANY = gql`
  query NetworkByCompany($companyId: String!) {
    networkByCompany(companyId: $companyId) {
      id
      socialNetworks
      isActive
    }
  }
`;

export const CREATE_NETWORK = gql`
  mutation CreateNetwork($createNetworkInput: CreateNetworkInput!) {
    createNetwork(createNetworkInput: $createNetworkInput) {
      id
      companyId
      socialNetworks
      isActive
    }
  }
`;

export const UPDATE_NETWORK = gql`
  mutation UpdateNetwork($updateNetworkInput: UpdateNetworkInput!) {
    updateNetwork(updateNetworkInput: $updateNetworkInput) {
      id
      companyId
      socialNetworks
    }
  }
`;

// Team Member Management
export const INVITE_TEAM_MEMBER = gql`
  mutation InviteTeamMember(
    $companyId: String!
    $email: String!
    $role: String!
  ) {
    inviteTeamMember(
      companyId: $companyId
      inviteInput: {
        email: $email
        role: $role
      }
    ) {
      id
      email
      displayRole
      isActive
      user {
        email
        firstName
        lastName
      }
    }
  }
`;

export const UPDATE_TEAM_MEMBER_ROLE = gql`
  mutation UpdateTeamMemberRole(
    $memberId: String!
    $role: String!
  ) {
    updateTeamMemberRole(
      memberId: $memberId
      role: $role
    ) {
      id
      displayRole
      user {
        email
        firstName
        lastName
      }
    }
  }
`;

export const DEACTIVATE_TEAM_MEMBER = gql`
  mutation DeactivateTeamMember($memberId: String!) {
    deactivateTeamMember(memberId: $memberId) {
      id
      isActive
    }
  }
`;

// Plan and Billing Query (mock data for now)
export const MY_COMPANY_BILLING = gql`
  query MyCompanyBilling {
    myCompanyBilling {
      currentPlan {
        name
        price
        features
        billingCycle
      }
      paymentMethod {
        type
        last4
        expiryDate
      }
      recentBilling {
        id
        date
        amount
        status
        description
        downloadUrl
      }
    }
  }
`;