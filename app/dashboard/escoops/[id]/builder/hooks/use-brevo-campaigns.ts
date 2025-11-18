'use client';

import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  GET_BREVO_LISTS,
  GET_BREVO_LIST,
  GET_BREVO_SEGMENTS,
  CREATE_ESCOOP_CAMPAIGN,
  UPDATE_ESCOOP_CAMPAIGN,
  SEND_TEST_CAMPAIGN,
  SEND_CAMPAIGN
} from '@/lib/graphql/brevo-campaigns';

// Types
export interface BrevoList {
  id: string;
  name: string;
  uniqueSubscribers: number;
  totalBlacklisted: number;
}

export interface BrevoListRaw {
  id: string | number;
  name: string;
  uniqueSubscribers: number;
  totalBlacklisted: number;
}

export interface BrevoListDetail {
  id: string;
  name: string;
  folderId: number;
  totalSubscribers: number;
  totalBlacklisted: number;
  uniqueSubscribers: number;
  createdAt: string;
  campaignStats: boolean;
  dynamicList: boolean;
}

export interface BrevoSegment {
  id: string;
  name: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrevoSegmentRaw {
  id: string | number;
  name: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignInput {
  escoopId: string;
  htmlContent: string;
  subject: string;
  listIds: string[];
  segmentIds?: string[];
  exclusionListIds?: string[];
  sender: {
    name: string;
    email: string;
  };
  toField: string;
  scheduledAt?: string;
}

export interface UpdateCampaignInput {
  escoopId: string;
  subject?: string;
  htmlContent?: string;
  listIds?: string[];
  segmentIds?: string[];
  exclusionListIds?: string[];
  sender?: {
    name: string;
    email: string;
  };
  scheduledAt?: string;
  toField?: string;
}

export interface SendTestCampaignInput {
  campaignId: number;
  testEmails: string[];
}

export interface SendCampaignInput {
  campaignId: number;
}

// Hook to fetch Brevo lists
export function useBrevoLists(limit: number = 50, offset: number = 0) {
  const { data, loading, error, refetch } = useQuery(GET_BREVO_LISTS, {
    variables: { limit, offset },
    errorPolicy: 'all',
    onError: (error) => {
      console.error('Error fetching Brevo lists:', error);
      toast.error('Failed to load Brevo lists');
    }
  });

  return {
    lists: (data?.brevoLists?.lists || []).map((list: BrevoListRaw) => ({
      ...list,
      id: String(list.id) // ✅ Asegurar que el ID sea string
    })),
    count: data?.brevoLists?.count || 0,
    loading,
    error,
    refetch
  };
}

// Hook to fetch a specific Brevo list
export function useBrevoList(listId: string | null) {
  const { data, loading, error } = useQuery(GET_BREVO_LIST, {
    variables: { listId: listId || '' },
    skip: !listId,
    errorPolicy: 'all',
    onError: (error) => {
      console.error('Error fetching Brevo list:', error);
      toast.error('Failed to load Brevo list details');
    }
  });

  return {
    list: data?.brevoList || null,
    loading,
    error
  };
}

// Hook to fetch Brevo segments
export function useBrevoSegments() {
  const { data, loading, error, refetch } = useQuery(GET_BREVO_SEGMENTS, {
    errorPolicy: 'all',
    onError: (error) => {
      console.error('Error fetching Brevo segments:', error);
      toast.error('Failed to load Brevo segments');
    }
  });

  return {
    segments: (data?.brevoSegments?.segments || []).map((segment: BrevoSegmentRaw) => ({
      ...segment,
      id: String(segment.id) // ✅ Asegurar que el ID sea string
    })),
    count: data?.brevoSegments?.count || 0,
    loading,
    error,
    refetch
  };
}

// Hook to create Escoop campaign
export function useCreateEscoopCampaign() {
  const [createCampaignMutation, { loading, error }] = useMutation(CREATE_ESCOOP_CAMPAIGN, {
    onCompleted: (data) => {
      if (data?.createEscoopCampaign?.success) {
        toast.success('Campaign created successfully in Brevo');
      } else {
        toast.error(data?.createEscoopCampaign?.message || 'Failed to create campaign');
      }
    },
    onError: (error) => {
      console.error('Error creating Escoop campaign:', error);
      toast.error('Failed to create campaign');
    }
  });

  const createCampaign = async (input: CreateCampaignInput) => {
    try {
      const result = await createCampaignMutation({
        variables: { input }
      });

      return result.data?.createEscoopCampaign || null;
    } catch (err) {
      console.error('Error in createCampaign:', err);
      return null;
    }
  };

  return {
    createCampaign,
    loading,
    error
  };
}

// Hook to update Escoop campaign
export function useUpdateEscoopCampaign() {
  const [updateCampaignMutation, { loading, error }] = useMutation(UPDATE_ESCOOP_CAMPAIGN, {
    onCompleted: (data) => {
      if (data?.updateEscoopCampaign?.success) {
        toast.success('Campaign updated successfully');
      } else {
        toast.error(data?.updateEscoopCampaign?.message || 'Failed to update campaign');
      }
    },
    onError: (error) => {
      console.error('Error updating Escoop campaign:', error);
      toast.error('Failed to update campaign');
    }
  });

  const updateCampaign = async (input: UpdateCampaignInput) => {
    try {
      const result = await updateCampaignMutation({
        variables: { input }
      });

      return result.data?.updateEscoopCampaign || null;
    } catch (err) {
      console.error('Error in updateCampaign:', err);
      return null;
    }
  };

  return {
    updateCampaign,
    loading,
    error
  };
}

// Hook to send test campaign
export function useSendTestCampaign() {
  const [sendTestMutation, { loading, error }] = useMutation(SEND_TEST_CAMPAIGN, {
    onCompleted: (data) => {
      if (data?.sendTestCampaign?.success) {
        toast.success('Test campaign sent successfully');
      } else {
        toast.error(data?.sendTestCampaign?.message || 'Failed to send test campaign');
      }
    },
    onError: (error) => {
      console.error('Error sending test campaign:', error);
      toast.error('Failed to send test campaign');
    }
  });

  const sendTest = async (input: SendTestCampaignInput) => {
    try {
      const result = await sendTestMutation({
        variables: { input }
      });

      return result.data?.sendTestCampaign || null;
    } catch (err) {
      console.error('Error in sendTest:', err);
      return null;
    }
  };

  return {
    sendTest,
    loading,
    error
  };
}

// Hook to send final campaign
export function useSendCampaign() {
  const [sendCampaignMutation, { loading, error }] = useMutation(SEND_CAMPAIGN, {
    onCompleted: (data) => {
      if (data?.sendCampaign?.success) {
        toast.success('Campaign sent successfully');
      } else {
        toast.error(data?.sendCampaign?.message || 'Failed to send campaign');
      }
    },
    onError: (error) => {
      console.error('Error sending campaign:', error);
      toast.error('Failed to send campaign');
    }
  });

  const sendCampaign = async (input: SendCampaignInput) => {
    try {
      const result = await sendCampaignMutation({
        variables: { input }
      });

      return result.data?.sendCampaign || null;
    } catch (err) {
      console.error('Error in sendCampaign:', err);
      return null;
    }
  };

  return {
    sendCampaign,
    loading,
    error
  };
}

// Combined hook for all campaign operations
export function useBrevoCampaigns() {
  const brevoLists = useBrevoLists();
  const brevoSegments = useBrevoSegments();
  const createCampaign = useCreateEscoopCampaign();
  const updateCampaign = useUpdateEscoopCampaign();
  const sendTest = useSendTestCampaign();
  const sendFinal = useSendCampaign();

  return {
    lists: brevoLists.lists,
    segments: brevoSegments.segments,
    loading: brevoLists.loading || brevoSegments.loading,
    error: brevoLists.error || brevoSegments.error,
    refetch: () => {
      brevoLists.refetch();
      brevoSegments.refetch();
    },
    createCampaign: createCampaign.createCampaign,
    createLoading: createCampaign.loading,
    updateCampaign: updateCampaign.updateCampaign,
    updateLoading: updateCampaign.loading,
    sendTest: sendTest.sendTest,
    testLoading: sendTest.loading,
    sendCampaign: sendFinal.sendCampaign,
    sendLoading: sendFinal.loading
  };
}