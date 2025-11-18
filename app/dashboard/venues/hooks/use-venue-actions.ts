import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  CREATE_VENUE,
  UPDATE_VENUE,
  DELETE_VENUE,
  CREATE_VENUE_OPERATING_HOURS,
  UPDATE_VENUE_OPERATING_HOURS,
  DELETE_VENUE_OPERATING_HOURS,
  CREATE_VENUE_FAQ,
  UPDATE_VENUE_FAQ,
  DELETE_VENUE_FAQ,
  LIST_VENUES
} from '@/lib/graphql/venues';
import {
  CreateVenueMutationVariables,
  UpdateVenueMutationVariables,
  CreateVenueOperatingHoursMutationVariables,
  UpdateVenueOperatingHoursMutationVariables,
  CreateVenueFAQMutationVariables,
  UpdateVenueFAQMutationVariables,
  Venue,
  VenueOperatingHours,
  VenueFAQ,
  VenueStatus
} from '@/types/venues';
import { showErrorToast, showSuccessToast } from '@/lib/toast-utils';
import { getErrorMessage } from '@/lib/error-handler';

interface UseVenueActionsReturn {
  // Venue operations
  createVenue: (input: CreateVenueMutationVariables['createVenueInput']) => Promise<Venue | null>;
  updateVenue: (input: UpdateVenueMutationVariables['updateVenueInput']) => Promise<Venue | null>;
  updateVenueStatus: (id: string, status: VenueStatus) => Promise<Venue | null>;
  deleteVenue: (id: string) => Promise<boolean>;
  
  // Operating hours operations
  createOperatingHours: (input: CreateVenueOperatingHoursMutationVariables['createVenueOperatingHoursInput']) => Promise<VenueOperatingHours | null>;
  updateOperatingHours: (input: UpdateVenueOperatingHoursMutationVariables['updateVenueOperatingHoursInput']) => Promise<VenueOperatingHours | null>;
  deleteOperatingHours: (id: string) => Promise<boolean>;
  
  // FAQ operations
  createFAQ: (input: CreateVenueFAQMutationVariables['createVenueFAQInput']) => Promise<VenueFAQ | null>;
  updateFAQ: (input: UpdateVenueFAQMutationVariables['updateVenueFAQInput']) => Promise<VenueFAQ | null>;
  deleteFAQ: (id: string) => Promise<boolean>;
  
  // Loading states
  loading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
}

export const useVenueActions = (): UseVenueActionsReturn => {
  const [loading, setLoading] = useState(false);

  // Venue mutations
  const [createVenueMutation, { loading: createLoading }] = useMutation(CREATE_VENUE, {
    refetchQueries: [{ query: LIST_VENUES, variables: { filter: { first: 20, includeTotalCount: true } } }],
    onError: (error) => {
      console.error('Create venue error:', error);
      showErrorToast(`Failed to create venue: ${getErrorMessage(error)}`);
    }
  });

  const [updateVenueMutation, { loading: updateLoading }] = useMutation(UPDATE_VENUE, {
    refetchQueries: [
      { query: LIST_VENUES, variables: { filter: { first: 20, includeTotalCount: true } } },
      'GetVenueStats'
    ],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('Update venue error:', error);
      showErrorToast(`Failed to update venue: ${getErrorMessage(error)}`);
    }
  });

  const [deleteVenueMutation, { loading: deleteLoading }] = useMutation(DELETE_VENUE, {
    refetchQueries: [{ query: LIST_VENUES, variables: { filter: { first: 20, includeTotalCount: true } } }],
    onError: (error) => {
      console.error('Delete venue error:', error);
      showErrorToast(`Failed to delete venue: ${getErrorMessage(error)}`);
    }
  });

  // Operating hours mutations
  const [createOperatingHoursMutation] = useMutation(CREATE_VENUE_OPERATING_HOURS, {
    onError: (error) => {
      console.error('Create operating hours error:', error);
      showErrorToast(`Failed to create operating hours: ${getErrorMessage(error)}`);
    }
  });

  const [updateOperatingHoursMutation] = useMutation(UPDATE_VENUE_OPERATING_HOURS, {
    onError: (error) => {
      console.error('Update operating hours error:', error);
      showErrorToast(`Failed to update operating hours: ${getErrorMessage(error)}`);
    }
  });

  const [deleteOperatingHoursMutation] = useMutation(DELETE_VENUE_OPERATING_HOURS, {
    onError: (error) => {
      console.error('Delete operating hours error:', error);
      showErrorToast(`Failed to delete operating hours: ${getErrorMessage(error)}`);
    }
  });

  // FAQ mutations
  const [createFAQMutation] = useMutation(CREATE_VENUE_FAQ, {
    onError: (error) => {
      console.error('Create FAQ error:', error);
      showErrorToast(`Failed to create FAQ: ${getErrorMessage(error)}`);
    }
  });

  const [updateFAQMutation] = useMutation(UPDATE_VENUE_FAQ, {
    onError: (error) => {
      console.error('Update FAQ error:', error);
      showErrorToast(`Failed to update FAQ: ${getErrorMessage(error)}`);
    }
  });

  const [deleteFAQMutation] = useMutation(DELETE_VENUE_FAQ, {
    onError: (error) => {
      console.error('Delete FAQ error:', error);
      showErrorToast(`Failed to delete FAQ: ${getErrorMessage(error)}`);
    }
  });

  // Venue operations
  const createVenue = async (input: CreateVenueMutationVariables['createVenueInput']): Promise<Venue | null> => {
    try {
      setLoading(true);
      const { data } = await createVenueMutation({
        variables: { createVenueInput: input }
      });

      if (data?.createVenue) {
        showSuccessToast('Venue created successfully');
        return data.createVenue;
      }

      showErrorToast('Failed to create venue');
      return null;
    } catch (error) {
      console.error('Create venue error:', error);
      showErrorToast(`Failed to create venue: ${getErrorMessage(error)}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateVenue = async (input: UpdateVenueMutationVariables['updateVenueInput']): Promise<Venue | null> => {
    try {
      setLoading(true);
      const { data } = await updateVenueMutation({
        variables: { updateVenueInput: input }
      });

      if (data?.updateVenue) {
        showSuccessToast('Venue updated successfully');
        return data.updateVenue;
      }

      showErrorToast('Failed to update venue');
      return null;
    } catch (error) {
      console.error('Update venue error:', error);
      showErrorToast(`Failed to update venue: ${getErrorMessage(error)}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateVenueStatus = async (id: string, status: VenueStatus): Promise<Venue | null> => {
    try {
      setLoading(true);
      const { data } = await updateVenueMutation({
        variables: { 
          updateVenueInput: { 
            id, 
            status 
          } 
        }
      });

      if (data?.updateVenue) {
        const statusLabel = status === VenueStatus.APPROVED ? 'approved' : 'set to pending';
        showSuccessToast(`Venue status ${statusLabel} successfully`);
        return data.updateVenue;
      }

      showErrorToast('Failed to update venue status');
      return null;
    } catch (error) {
      console.error('Update venue status error:', error);
      showErrorToast(`Failed to update venue status: ${getErrorMessage(error)}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteVenue = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data } = await deleteVenueMutation({
        variables: { id }
      });

      if (data?.deleteVenue) {
        showSuccessToast('Venue deleted successfully');
        return true;
      }

      showErrorToast('Failed to delete venue');
      return false;
    } catch (error) {
      console.error('Delete venue error:', error);
      showErrorToast(`Failed to delete venue: ${getErrorMessage(error)}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Operating hours operations
  const createOperatingHours = async (input: CreateVenueOperatingHoursMutationVariables['createVenueOperatingHoursInput']): Promise<VenueOperatingHours | null> => {
    try {
      const { data } = await createOperatingHoursMutation({
        variables: { createVenueOperatingHoursInput: input }
      });

      if (data?.createVenueOperatingHours) {
        return data.createVenueOperatingHours;
      }

      return null;
    } catch (error) {
      console.error('Create operating hours error:', error);
      return null;
    }
  };

  const updateOperatingHours = async (input: UpdateVenueOperatingHoursMutationVariables['updateVenueOperatingHoursInput']): Promise<VenueOperatingHours | null> => {
    try {
      const { data } = await updateOperatingHoursMutation({
        variables: { updateVenueOperatingHoursInput: input }
      });

      if (data?.updateVenueOperatingHours) {
        return data.updateVenueOperatingHours;
      }

      return null;
    } catch (error) {
      console.error('Update operating hours error:', error);
      return null;
    }
  };

  const deleteOperatingHours = async (id: string): Promise<boolean> => {
    try {
      const { data } = await deleteOperatingHoursMutation({
        variables: { id }
      });

      return !!data?.deleteVenueOperatingHours;
    } catch (error) {
      console.error('Delete operating hours error:', error);
      return false;
    }
  };

  // FAQ operations
  const createFAQ = async (input: CreateVenueFAQMutationVariables['createVenueFAQInput']): Promise<VenueFAQ | null> => {
    try {
      const { data } = await createFAQMutation({
        variables: { createVenueFAQInput: input }
      });

      if (data?.createVenueFAQ) {
        return data.createVenueFAQ;
      }

      return null;
    } catch (error) {
      console.error('Create FAQ error:', error);
      return null;
    }
  };

  const updateFAQ = async (input: UpdateVenueFAQMutationVariables['updateVenueFAQInput']): Promise<VenueFAQ | null> => {
    try {
      const { data } = await updateFAQMutation({
        variables: { updateVenueFAQInput: input }
      });

      if (data?.updateVenueFAQ) {
        return data.updateVenueFAQ;
      }

      return null;
    } catch (error) {
      console.error('Update FAQ error:', error);
      return null;
    }
  };

  const deleteFAQ = async (id: string): Promise<boolean> => {
    try {
      const { data } = await deleteFAQMutation({
        variables: { id }
      });

      return !!data?.deleteVenueFAQ;
    } catch (error) {
      console.error('Delete FAQ error:', error);
      return false;
    }
  };

  return {
    // Venue operations
    createVenue,
    updateVenue,
    updateVenueStatus,
    deleteVenue,
    
    // Operating hours operations
    createOperatingHours,
    updateOperatingHours,
    deleteOperatingHours,
    
    // FAQ operations
    createFAQ,
    updateFAQ,
    deleteFAQ,
    
    // Loading states
    loading,
    createLoading,
    updateLoading,
    deleteLoading
  };
};

// Helper hook for bulk operations
export const useBulkVenueActions = () => {
  const [loading, setLoading] = useState(false);
  const { deleteVenue } = useVenueActions();

  const bulkDelete = async (venueIds: string[]): Promise<{ success: number; failed: number }> => {
    setLoading(true);
    let success = 0;
    let failed = 0;

    try {
      for (const id of venueIds) {
        const result = await deleteVenue(id);
        if (result) {
          success++;
        } else {
          failed++;
        }
      }

      if (success > 0) {
        showSuccessToast(`Successfully deleted ${success} venue${success > 1 ? 's' : ''}`);
      }
      
      if (failed > 0) {
        showErrorToast(`Failed to delete ${failed} venue${failed > 1 ? 's' : ''}`);
      }

      return { success, failed };
    } catch (error) {
      console.error('Bulk delete error:', error);
      showErrorToast('Bulk delete operation failed');
      return { success, failed: venueIds.length };
    } finally {
      setLoading(false);
    }
  };

  return {
    bulkDelete,
    loading
  };
};