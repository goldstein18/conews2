'use client';

import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  CREATE_RESTAURANT,
  UPDATE_RESTAURANT,
  UPDATE_RESTAURANT_ADMIN,
  DELETE_RESTAURANT,
  APPROVE_RESTAURANT,
  DECLINE_RESTAURANT,
  LIST_RESTAURANTS
} from '@/lib/graphql/restaurants';
import {
  CreateRestaurantVariables,
  UpdateRestaurantVariables
} from '@/lib/graphql/restaurants';
import { Restaurant } from '@/types/restaurants';

interface UpdateRestaurantAdminInput {
  id: string;
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  market?: string;
  phone?: string;
  email?: string;
  website?: string;
  restaurantTypeId?: string;
  priceRange?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  menuLink?: string;
  dietaryOptions?: string[];
  amenities?: string[];
  adminNotes?: string;
  image?: string;
  status?: string;
}

export function useRestaurantActions() {
  // Create restaurant mutation
  const [createRestaurantMutation, { loading: createLoading }] = useMutation(CREATE_RESTAURANT, {
    refetchQueries: [{ query: LIST_RESTAURANTS, variables: { filter: { first: 20, includeTotalCount: true } } }],
    onCompleted: () => {
      toast.success('Restaurant created successfully');
    },
    onError: (error) => {
      console.error('Create restaurant error:', error);
      toast.error(error.message || 'Failed to create restaurant');
    }
  });

  // Update restaurant mutation (for regular users)
  const [updateRestaurantMutation, { loading: updateLoading }] = useMutation(UPDATE_RESTAURANT, {
    onCompleted: () => {
      toast.success('Restaurant updated successfully');
    },
    onError: (error) => {
      console.error('Update restaurant error:', error);
      toast.error(error.message || 'Failed to update restaurant');
    }
  });

  // Update restaurant admin mutation (for admin users with status changes)
  const [updateRestaurantAdminMutation, { loading: updateAdminLoading }] = useMutation(UPDATE_RESTAURANT_ADMIN, {
    onCompleted: () => {
      toast.success('Restaurant updated successfully');
    },
    onError: (error) => {
      console.error('Update restaurant admin error:', error);
      toast.error(error.message || 'Failed to update restaurant');
    }
  });

  // Delete restaurant mutation
  const [deleteRestaurantMutation, { loading: deleteLoading }] = useMutation(DELETE_RESTAURANT, {
    refetchQueries: [{ query: LIST_RESTAURANTS, variables: { filter: { first: 20, includeTotalCount: true } } }],
    onCompleted: () => {
      toast.success('Restaurant deleted successfully');
    },
    onError: (error) => {
      console.error('Delete restaurant error:', error);
      toast.error(error.message || 'Failed to delete restaurant');
    }
  });

  // Approve restaurant mutation
  const [approveRestaurantMutation, { loading: approveLoading }] = useMutation(APPROVE_RESTAURANT, {
    refetchQueries: [{ query: LIST_RESTAURANTS, variables: { filter: { first: 20, includeTotalCount: true } } }],
    onCompleted: () => {
      toast.success('Restaurant approved successfully');
    },
    onError: (error) => {
      console.error('Approve restaurant error:', error);
      toast.error(error.message || 'Failed to approve restaurant');
    }
  });

  // Decline restaurant mutation
  const [declineRestaurantMutation, { loading: declineLoading }] = useMutation(DECLINE_RESTAURANT, {
    refetchQueries: [{ query: LIST_RESTAURANTS, variables: { filter: { first: 20, includeTotalCount: true } } }],
    onCompleted: () => {
      toast.success('Restaurant declined successfully');
    },
    onError: (error) => {
      console.error('Decline restaurant error:', error);
      toast.error(error.message || 'Failed to decline restaurant');
    }
  });

  // Action functions
  const createRestaurant = async (input: CreateRestaurantVariables['createRestaurantInput']): Promise<Restaurant | null> => {
    try {
      const result = await createRestaurantMutation({
        variables: { createRestaurantInput: input }
      });
      return result.data?.createRestaurant || null;
    } catch (error) {
      console.error('Error creating restaurant:', error);
      return null;
    }
  };

  const updateRestaurant = async (input: UpdateRestaurantVariables['updateRestaurantInput']): Promise<Restaurant | null> => {
    try {
      const result = await updateRestaurantMutation({
        variables: { updateRestaurantInput: input }
      });
      return result.data?.updateRestaurant || null;
    } catch (error) {
      console.error('Error updating restaurant:', error);
      // Re-throw to let caller handle the error and reset loading states
      throw error;
    }
  };

  const updateRestaurantAdmin = async (input: UpdateRestaurantAdminInput): Promise<Restaurant | null> => {
    try {
      const result = await updateRestaurantAdminMutation({
        variables: { updateRestaurantAdminInput: input }
      });
      return result.data?.updateRestaurantAdmin || null;
    } catch (error) {
      console.error('Error updating restaurant (admin):', error);
      return null;
    }
  };

  const deleteRestaurant = async (id: string): Promise<boolean> => {
    try {
      await deleteRestaurantMutation({
        variables: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      return false;
    }
  };

  const approveRestaurant = async (id: string): Promise<boolean> => {
    try {
      await approveRestaurantMutation({
        variables: { id }
      });
      return true;
    } catch (error) {
      console.error('Error approving restaurant:', error);
      return false;
    }
  };

  const declineRestaurant = async (id: string, reason: string): Promise<boolean> => {
    try {
      await declineRestaurantMutation({
        variables: { id, reason }
      });
      return true;
    } catch (error) {
      console.error('Error declining restaurant:', error);
      return false;
    }
  };

  return {
    createRestaurant,
    updateRestaurant,
    updateRestaurantAdmin,
    deleteRestaurant,
    approveRestaurant,
    declineRestaurant,
    loading: {
      create: createLoading,
      update: updateLoading || updateAdminLoading,
      delete: deleteLoading,
      approve: approveLoading,
      decline: declineLoading
    }
  };
}