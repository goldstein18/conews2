import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  CREATE_ARTS_GROUP,
  UPDATE_ARTS_GROUP,
  UPDATE_ARTS_GROUP_STATUS,
  DELETE_ARTS_GROUP
} from '@/lib/graphql/arts-groups';
import {
  ArtsGroup,
  ArtsGroupStatus,
  CreateArtsGroupInput,
  UpdateArtsGroupInput
} from '@/types/arts-groups';
import { showErrorToast, showSuccessToast } from '@/lib/toast-utils';
import { getErrorMessage } from '@/lib/error-handler';

interface UseArtsGroupActionsReturn {
  createArtsGroup: (input: CreateArtsGroupInput) => Promise<ArtsGroup | null>;
  updateArtsGroup: (input: UpdateArtsGroupInput) => Promise<ArtsGroup | null>;
  updateArtsGroupStatus: (id: string, status: ArtsGroupStatus) => Promise<ArtsGroup | null>;
  deleteArtsGroup: (id: string) => Promise<boolean>;
  loading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
}

export const useArtsGroupActions = (): UseArtsGroupActionsReturn => {
  const [loading, setLoading] = useState(false);

  const [createArtsGroupMutation, { loading: createLoading }] = useMutation(CREATE_ARTS_GROUP, {
    // TODO: Restore refetchQueries when backend implements the endpoints
    // refetchQueries: [
    //   { query: LIST_ARTS_GROUPS, variables: { first: 20, includeTotalCount: true } }
    // ],
    onError: (error) => {
      console.error('Create arts group error:', error);
      showErrorToast(`Failed to create arts group: ${getErrorMessage(error)}`);
    }
  });

  const [updateArtsGroupMutation, { loading: updateLoading }] = useMutation(UPDATE_ARTS_GROUP, {
    onError: (error) => {
      console.error('Update arts group error:', error);
      showErrorToast(`Failed to update arts group: ${getErrorMessage(error)}`);
    }
  });

  const [updateArtsGroupStatusMutation] = useMutation(UPDATE_ARTS_GROUP_STATUS, {
    // TODO: Restore refetchQueries when backend implements the endpoints
    // refetchQueries: [
    //   { query: LIST_ARTS_GROUPS, variables: { first: 20, includeTotalCount: true } }
    // ],
    onError: (error) => {
      console.error('Update status error:', error);
      showErrorToast(`Failed to update status: ${getErrorMessage(error)}`);
    }
  });

  const [deleteArtsGroupMutation, { loading: deleteLoading }] = useMutation(DELETE_ARTS_GROUP, {
    // TODO: Restore refetchQueries when backend implements the endpoints
    // refetchQueries: [
    //   { query: LIST_ARTS_GROUPS, variables: { first: 20, includeTotalCount: true } }
    // ],
    onError: (error) => {
      console.error('Delete arts group error:', error);
      showErrorToast(`Failed to delete arts group: ${getErrorMessage(error)}`);
    }
  });

  const createArtsGroup = async (input: CreateArtsGroupInput): Promise<ArtsGroup | null> => {
    try {
      setLoading(true);
      const { data } = await createArtsGroupMutation({
        variables: { createArtsGroupInput: input }
      });

      if (data?.createArtsGroup) {
        showSuccessToast('Arts group created successfully');
        return data.createArtsGroup;
      }

      showErrorToast('Failed to create arts group');
      return null;
    } catch (error) {
      console.error('Create arts group error:', error);
      showErrorToast(`Failed to create arts group: ${getErrorMessage(error)}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateArtsGroup = async (input: UpdateArtsGroupInput): Promise<ArtsGroup | null> => {
    try {
      setLoading(true);
      const { data } = await updateArtsGroupMutation({
        variables: { updateArtsGroupInput: input }
      });

      if (data?.updateArtsGroup) {
        showSuccessToast('Arts group updated successfully');
        return data.updateArtsGroup;
      }

      showErrorToast('Failed to update arts group');
      return null;
    } catch (error) {
      console.error('Update arts group error:', error);
      showErrorToast(`Failed to update arts group: ${getErrorMessage(error)}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateArtsGroupStatus = async (
    id: string,
    status: ArtsGroupStatus
  ): Promise<ArtsGroup | null> => {
    try {
      setLoading(true);
      const { data } = await updateArtsGroupStatusMutation({
        variables: { id, status }
      });

      if (data?.updateArtsGroupStatus) {
        const statusLabel =
          status === ArtsGroupStatus.APPROVED
            ? 'approved'
            : status === ArtsGroupStatus.DECLINED
            ? 'declined'
            : 'updated';
        showSuccessToast(`Arts group ${statusLabel} successfully`);
        return data.updateArtsGroupStatus;
      }

      showErrorToast('Failed to update arts group status');
      return null;
    } catch (error) {
      console.error('Update status error:', error);
      showErrorToast(`Failed to update status: ${getErrorMessage(error)}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteArtsGroup = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data } = await deleteArtsGroupMutation({
        variables: { id }
      });

      if (data?.deleteArtsGroup) {
        showSuccessToast('Arts group deleted successfully');
        return true;
      }

      showErrorToast('Failed to delete arts group');
      return false;
    } catch (error) {
      console.error('Delete arts group error:', error);
      showErrorToast(`Failed to delete arts group: ${getErrorMessage(error)}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createArtsGroup,
    updateArtsGroup,
    updateArtsGroupStatus,
    deleteArtsGroup,
    loading,
    createLoading,
    updateLoading,
    deleteLoading
  };
};
