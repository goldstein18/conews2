"use client";

import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  CREATE_ESCOOP,
  UPDATE_ESCOOP,
  DELETE_ESCOOP,
  LIST_ESCOOPS
} from '@/lib/graphql/escoops';
import {
  CreateEscoopInput,
  UpdateEscoopInput,
  Escoop
} from '@/types/escoops';
import { getMarketFromLocations } from '../lib/validations';

export function useCreateEscoop() {
  const [createEscoopMutation, { loading, error }] = useMutation(CREATE_ESCOOP, {
    refetchQueries: [LIST_ESCOOPS],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data?.createEscoop) {
        toast.success('Escoop created successfully');
      }
    },
    onError: (error) => {
      console.error('Error creating escoop:', error);
      toast.error('Failed to create escoop');
    }
  });

  const createEscoop = async (input: CreateEscoopInput): Promise<Escoop | null> => {
    try {
      const result = await createEscoopMutation({
        variables: {
          createEscoopInput: {
            ...input,
            market: getMarketFromLocations(input.locations)
          }
        }
      });

      return result.data?.createEscoop || null;
    } catch (err) {
      console.error('Error in createEscoop:', err);
      return null;
    }
  };

  return {
    createEscoop,
    loading,
    error
  };
}

export function useUpdateEscoop() {
  const [updateEscoopMutation, { loading, error }] = useMutation(UPDATE_ESCOOP, {
    refetchQueries: [LIST_ESCOOPS],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data?.updateEscoop) {
        toast.success('Escoop updated successfully');
      }
    },
    onError: (error) => {
      console.error('Error updating escoop:', error);
      toast.error('Failed to update escoop');
    }
  });

  const updateEscoop = async (input: UpdateEscoopInput): Promise<Escoop | null> => {
    try {
      const result = await updateEscoopMutation({
        variables: {
          updateEscoopInput: {
            ...input,
            ...(input.locations && { market: getMarketFromLocations(input.locations) })
          }
        }
      });

      return result.data?.updateEscoop || null;
    } catch (err) {
      console.error('Error in updateEscoop:', err);
      return null;
    }
  };

  return {
    updateEscoop,
    loading,
    error
  };
}

export function useDeleteEscoop() {
  const [deleteEscoopMutation, { loading, error }] = useMutation(DELETE_ESCOOP, {
    refetchQueries: [LIST_ESCOOPS],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data?.deleteEscoop?.success) {
        toast.success('Escoop deleted successfully');
      }
    },
    onError: (error) => {
      console.error('Error deleting escoop:', error);
      toast.error('Failed to delete escoop');
    }
  });

  const deleteEscoop = async (id: string): Promise<boolean> => {
    try {
      const result = await deleteEscoopMutation({
        variables: { id }
      });

      return result.data?.deleteEscoop?.success || false;
    } catch (err) {
      console.error('Error in deleteEscoop:', err);
      return false;
    }
  };

  return {
    deleteEscoop,
    loading,
    error
  };
}