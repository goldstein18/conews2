'use client';

import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  CREATE_DEDICATED,
  UPDATE_DEDICATED,
  UPDATE_DEDICATED_STATUS,
  DELETE_DEDICATED,
  CREATE_DEDICATED_CAMPAIGN,
  UPDATE_DEDICATED_CAMPAIGN
} from '@/lib/graphql/dedicated';
import {
  Dedicated,
  DedicatedStatus,
  CreateDedicatedInput,
  UpdateDedicatedInput,
  CreateDedicatedCampaignInput,
  UpdateDedicatedCampaignInput
} from '@/types/dedicated';

export function useDedicatedActions() {
  const [createDedicatedMutation] = useMutation(CREATE_DEDICATED);
  const [updateDedicatedMutation] = useMutation(UPDATE_DEDICATED);
  const [updateDedicatedStatusMutation] = useMutation(UPDATE_DEDICATED_STATUS);
  const [deleteDedicatedMutation] = useMutation(DELETE_DEDICATED);
  const [createDedicatedCampaignMutation] = useMutation(CREATE_DEDICATED_CAMPAIGN);
  const [updateDedicatedCampaignMutation] = useMutation(UPDATE_DEDICATED_CAMPAIGN);

  const createDedicated = async (input: CreateDedicatedInput): Promise<Dedicated | null> => {
    try {
      const { data } = await createDedicatedMutation({
        variables: {
          createDedicatedInput: input
        }
      });

      if (data?.createDedicated) {
        toast.success('Dedicated campaign created successfully');
        return data.createDedicated;
      }

      toast.error('Failed to create dedicated campaign');
      return null;
    } catch (error) {
      console.error('Error creating dedicated campaign:', error);
      toast.error('An error occurred while creating the campaign');
      return null;
    }
  };

  const updateDedicated = async (input: UpdateDedicatedInput): Promise<Dedicated | null> => {
    try {
      const { data } = await updateDedicatedMutation({
        variables: {
          updateDedicatedInput: input
        }
      });

      if (data?.updateDedicated) {
        toast.success('Dedicated campaign updated successfully');
        return data.updateDedicated;
      }

      toast.error('Failed to update dedicated campaign');
      return null;
    } catch (error) {
      console.error('Error updating dedicated campaign:', error);
      toast.error('An error occurred while updating the campaign');
      return null;
    }
  };

  const updateDedicatedStatus = async (
    id: string,
    status: DedicatedStatus
  ): Promise<Dedicated | null> => {
    try {
      const { data } = await updateDedicatedStatusMutation({
        variables: { id, status }
      });

      if (data?.updateDedicatedStatus) {
        toast.success(`Status updated to ${status}`);
        return data.updateDedicatedStatus;
      }

      toast.error('Failed to update status');
      return null;
    } catch (error) {
      console.error('Error updating dedicated status:', error);
      toast.error('An error occurred while updating status');
      return null;
    }
  };

  const deleteDedicated = async (id: string): Promise<boolean> => {
    try {
      const { data } = await deleteDedicatedMutation({
        variables: { id }
      });

      if (data?.deleteDedicated) {
        toast.success('Dedicated campaign deleted successfully');
        return true;
      }

      toast.error('Failed to delete dedicated campaign');
      return false;
    } catch (error) {
      console.error('Error deleting dedicated campaign:', error);
      toast.error('An error occurred while deleting the campaign');
      return false;
    }
  };

  const createDedicatedCampaign = async (input: CreateDedicatedCampaignInput) => {
    try {
      const { data } = await createDedicatedCampaignMutation({
        variables: {
          createDedicatedCampaignInput: input
        }
      });

      if (data?.createDedicatedCampaign?.success) {
        toast.success('Brevo campaign created successfully');
        return data.createDedicatedCampaign;
      }

      const errorMessage = data?.createDedicatedCampaign?.message || 'Failed to create campaign';
      toast.error(errorMessage);
      return null;
    } catch (error) {
      console.error('Error creating Brevo campaign:', error);
      toast.error('An error occurred while creating the campaign');
      return null;
    }
  };

  const updateDedicatedCampaign = async (input: UpdateDedicatedCampaignInput) => {
    try {
      const { data } = await updateDedicatedCampaignMutation({
        variables: {
          updateDedicatedCampaignInput: input
        }
      });

      if (data?.updateDedicatedCampaign?.success) {
        toast.success('Brevo campaign updated successfully');
        return data.updateDedicatedCampaign;
      }

      const errorMessage = data?.updateDedicatedCampaign?.message || 'Failed to update campaign';
      toast.error(errorMessage);
      return null;
    } catch (error) {
      console.error('Error updating Brevo campaign:', error);
      toast.error('An error occurred while updating the campaign');
      return null;
    }
  };

  return {
    createDedicated,
    updateDedicated,
    updateDedicatedStatus,
    deleteDedicated,
    createDedicatedCampaign,
    updateDedicatedCampaign
  };
}
