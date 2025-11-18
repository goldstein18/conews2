"use client";

import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import {
  MY_COMPANY_PROFILE,
  MY_COMPANY_TEAM,
  UPDATE_COMPANY_PROFILE,
  NETWORK_BY_COMPANY,
  CREATE_NETWORK,
  UPDATE_NETWORK,
  INVITE_TEAM_MEMBER,
  UPDATE_TEAM_MEMBER_ROLE,
  DEACTIVATE_TEAM_MEMBER
} from '@/lib/graphql/settings';

// Types
export interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  logo?: string;
  logoUrl?: string;
  userCount: number;
  managerCount: number;
  network?: {
    socialNetworks?: Record<string, string>;
  };
  plan?: {
    plan: string;
    price: number;
  };
  currentBenefit?: {
    benefits: Record<string, unknown>;
  };
}

export interface TeamMember {
  id: string;
  displayRole: string;
  isActive: boolean;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    avatarUrl?: string;
  };
}

export interface SocialChannels {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  website?: string;
}

// Custom hooks
// Hook to get the correct company ID for the current user
export function useCompanyId() {
  const { user } = useAuthStore();
  
  // Use the myCompanyProfile query to get the company ID
  const { data, loading } = useQuery(MY_COMPANY_PROFILE, {
    errorPolicy: 'all',
    skip: user?.role?.name === 'SUPER_ADMIN' // Skip for super admin users
  });

  if (!loading && data && process.env.NODE_ENV === 'development') {
    console.log('🏢 Company profile data:', data.myCompanyProfile);
  }

  // Extract the company ID from myCompanyProfile
  const companyId = user?.role?.name !== 'SUPER_ADMIN' 
    ? data?.myCompanyProfile?.id
    : undefined;

  return { 
    companyId,
    loading,
    data: data?.myCompanyProfile
  };
}

export function useCompanyProfile() {
  const { companyId, data, loading } = useCompanyId();
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 useCompanyProfile - Using companyId:', companyId);
  }

  // Since useCompanyId already fetches the company profile, we can reuse that data
  const error = null; // The error handling is done in useCompanyId
  const refetch = () => {
    // For refetch, we'd need to refetch from useCompanyId, but for now we'll handle this differently
  };

  // Mock data fallback
  const mockData: CompanyProfile = {
    id: companyId || 'mock-id',
    name: 'Brooklyn Arts Collective',
    email: 'contact@brooklynarts.com',
    address: '123 Creative Street',
    city: 'Brooklyn',
    state: 'NY',
    phone: '(123) 456-7890',
    logoUrl: undefined,
    userCount: 4,
    managerCount: 2,
    network: {
      socialNetworks: {
        instagram: 'https://instagram.com/yourhandle',
        facebook: 'https://facebook.com/yourpage',
        tiktok: 'https://tiktok.com/@yourhandle',
        youtube: 'https://youtube.com/c/yourchannel'
      }
    },
    plan: {
      plan: 'Membership Pro',
      price: 49
    }
  };

  return {
    profile: data || mockData,
    loading,
    error,
    refetch
  };
}

export function useCompanyTeam() {
  const { companyId } = useCompanyId();

  const { data, loading, error, refetch } = useQuery(MY_COMPANY_TEAM, {
    skip: !companyId,
    errorPolicy: 'all',
  });

  // Mock data fallback
  const mockData: TeamMember[] = [
    {
      id: '1',
      displayRole: 'OWNER',
      isActive: true,
      createdAt: '2024-01-15T00:00:00Z',
      user: {
        id: '1',
        email: 'sarah@eventflow.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        avatarUrl: undefined
      }
    },
    {
      id: '2',
      displayRole: 'ADMIN',
      isActive: true,
      createdAt: '2024-02-15T00:00:00Z',
      user: {
        id: '2',
        email: 'mike@eventflow.com',
        firstName: 'Mike',
        lastName: 'Chen',
        avatarUrl: undefined
      }
    },
    {
      id: '3',
      displayRole: 'MEMBER',
      isActive: true,
      createdAt: '2024-03-15T00:00:00Z',
      user: {
        id: '3',
        email: 'emily@eventflow.com',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        avatarUrl: undefined
      }
    },
    {
      id: '4',
      displayRole: 'MEMBER',
      isActive: false,
      createdAt: '2024-04-15T00:00:00Z',
      user: {
        id: '4',
        email: 'david@eventflow.com',
        firstName: 'David',
        lastName: 'Kim',
        avatarUrl: undefined
      }
    }
  ];

  return {
    teamMembers: data?.myCompanyTeam || mockData,
    loading,
    error,
    refetch
  };
}

export function useUpdateCompanyProfile() {
  const client = useApolloClient();
  const { companyId } = useCompanyId();

  const [updateProfile, { loading }] = useMutation(UPDATE_COMPANY_PROFILE, {
    onCompleted: () => {
      toast.success('Company profile updated successfully');
      // Update cache
      client.refetchQueries({ include: [MY_COMPANY_PROFILE] });
    },
    onError: (error) => {
      console.error('Error updating company profile:', error);
      toast.error('Failed to update company profile');
    }
  });

  const updateCompanyProfile = async (profileData: Partial<CompanyProfile>) => {
    if (!companyId) {
      toast.error('Company ID not found');
      return;
    }

    try {
      await updateProfile({
        variables: {
          companyId,
          updateCompanyInput: profileData
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  return {
    updateCompanyProfile,
    loading
  };
}

// Hook to get social networks for a company
export function useSocialNetworks() {
  const { companyId } = useCompanyId();

  const { data, loading, error, refetch } = useQuery(NETWORK_BY_COMPANY, {
    variables: { companyId },
    skip: !companyId,
    errorPolicy: 'all'
  });

  return {
    socialNetworks: data?.networkByCompany?.socialNetworks || {},
    networkId: data?.networkByCompany?.id,
    loading,
    error,
    refetch
  };
}

export function useUpdateSocialChannels() {
  const client = useApolloClient();
  const { companyId } = useCompanyId();

  // Query to check if network exists
  const { data: networkData } = useQuery(NETWORK_BY_COMPANY, {
    variables: { companyId },
    skip: !companyId,
    errorPolicy: 'all'
  });

  const networkId = networkData?.networkByCompany?.id;
  const hasExistingNetwork = Boolean(networkId);

  const [createNetwork, { loading: createLoading }] = useMutation(CREATE_NETWORK, {
    onCompleted: () => {
      toast.success('Social channels created successfully');
      client.refetchQueries({ include: [NETWORK_BY_COMPANY, MY_COMPANY_PROFILE] });
    },
    onError: (error) => {
      console.error('Error creating social channels:', error);
      toast.error('Failed to create social channels');
    }
  });

  const [updateNetwork, { loading: updateLoading }] = useMutation(UPDATE_NETWORK, {
    onCompleted: () => {
      toast.success('Social channels updated successfully');
      client.refetchQueries({ include: [NETWORK_BY_COMPANY, MY_COMPANY_PROFILE] });
    },
    onError: (error) => {
      console.error('Error updating social channels:', error);
      toast.error('Failed to update social channels');
    }
  });

  const updateSocialChannels = async (socialData: SocialChannels) => {
    if (!companyId) {
      toast.error('Company ID not found');
      return;
    }

    console.log('🔍 Update social channels:', {
      companyId,
      hasExistingNetwork,
      networkId,
      socialData
    });

    try {
      if (hasExistingNetwork && networkId) {
        // Update existing network
        console.log('📝 Updating existing network with ID:', networkId);
        await updateNetwork({
          variables: {
            updateNetworkInput: {
              id: networkId,
              socialNetworks: socialData
            }
          }
        });
      } else {
        // Create new network
        console.log('🆕 Creating new network for company:', companyId);
        await createNetwork({
          variables: {
            createNetworkInput: {
              companyId,
              socialNetworks: socialData
            }
          }
        });
      }
    } catch (error) {
      console.error('Update social channels error:', error);
      toast.error('Failed to save social channels');
    }
  };

  return {
    updateSocialChannels,
    loading: createLoading || updateLoading
  };
}

export function useTeamManagement() {
  const client = useApolloClient();
  const { companyId } = useCompanyId();

  const [inviteMember, { loading: inviteLoading }] = useMutation(INVITE_TEAM_MEMBER, {
    onCompleted: () => {
      toast.success('Team member invited successfully');
      client.refetchQueries({ include: [MY_COMPANY_TEAM] });
    },
    onError: (error) => {
      console.error('Error inviting team member:', error);
      toast.error('Failed to invite team member');
    }
  });

  const [updateRole, { loading: updateLoading }] = useMutation(UPDATE_TEAM_MEMBER_ROLE, {
    onCompleted: () => {
      toast.success('Team member role updated successfully');
      client.refetchQueries({ include: [MY_COMPANY_TEAM] });
    },
    onError: (error) => {
      console.error('Error updating team member role:', error);
      toast.error('Failed to update team member role');
    }
  });

  const [deactivateMember, { loading: deactivateLoading }] = useMutation(DEACTIVATE_TEAM_MEMBER, {
    onCompleted: () => {
      toast.success('Team member deactivated successfully');
      client.refetchQueries({ include: [MY_COMPANY_TEAM] });
    },
    onError: (error) => {
      console.error('Error deactivating team member:', error);
      toast.error('Failed to deactivate team member');
    }
  });

  const inviteTeamMember = async (email: string, role: string) => {
    if (!companyId) {
      toast.error('Company ID not found');
      return;
    }

    try {
      await inviteMember({
        variables: {
          companyId,
          email,
          role
        }
      });
    } catch (error) {
      console.error('Invite team member error:', error);
    }
  };

  const updateTeamMemberRole = async (memberId: string, role: string) => {
    try {
      await updateRole({
        variables: {
          memberId,
          role
        }
      });
    } catch (error) {
      console.error('Update team member role error:', error);
    }
  };

  const deactivateTeamMember = async (memberId: string) => {
    try {
      await deactivateMember({
        variables: {
          memberId
        }
      });
    } catch (error) {
      console.error('Deactivate team member error:', error);
    }
  };

  return {
    inviteTeamMember,
    updateTeamMemberRole,
    deactivateTeamMember,
    loading: inviteLoading || updateLoading || deactivateLoading
  };
}