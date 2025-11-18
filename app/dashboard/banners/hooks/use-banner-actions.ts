import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  CREATE_BANNER,
  UPDATE_BANNER,
  DELETE_BANNER,
  APPROVE_BANNER,
  DECLINE_BANNER,
  PAUSE_BANNER,
  RESUME_BANNER,
  UPDATE_BANNER_IMAGE
} from '@/lib/graphql/banners';
import {
  CreateBannerInput,
  UpdateBannerInput,
  UpdateBannerImageInput,
  ApproveBannerInput,
  DeclineBannerInput,
  Banner
} from '@/types/banners';

interface UseBannerActionsReturn {
  createBanner: (input: CreateBannerInput) => Promise<Banner | null>;
  updateBanner: (input: UpdateBannerInput) => Promise<Banner | null>;
  updateBannerImage: (input: UpdateBannerImageInput) => Promise<Banner | null>;
  deleteBanner: (bannerId: string) => Promise<boolean>;
  approveBanner: (input: ApproveBannerInput) => Promise<Banner | null>;
  declineBanner: (input: DeclineBannerInput) => Promise<Banner | null>;
  pauseBanner: (bannerId: string) => Promise<Banner | null>;
  resumeBanner: (bannerId: string) => Promise<Banner | null>;
  loading: {
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    approving: boolean;
    declining: boolean;
    pausing: boolean;
    resuming: boolean;
    updatingImage: boolean;
  };
}

export const useBannerActions = (): UseBannerActionsReturn => {
  const [createBannerMutation, { loading: creating }] = useMutation(CREATE_BANNER);
  const [updateBannerMutation, { loading: updating }] = useMutation(UPDATE_BANNER);
  const [updateBannerImageMutation, { loading: updatingImage }] = useMutation(UPDATE_BANNER_IMAGE);
  const [deleteBannerMutation, { loading: deleting }] = useMutation(DELETE_BANNER);
  const [approveBannerMutation, { loading: approving }] = useMutation(APPROVE_BANNER);
  const [declineBannerMutation, { loading: declining }] = useMutation(DECLINE_BANNER);
  const [pauseBannerMutation, { loading: pausing }] = useMutation(PAUSE_BANNER);
  const [resumeBannerMutation, { loading: resuming }] = useMutation(RESUME_BANNER);

  const createBanner = async (input: CreateBannerInput): Promise<Banner | null> => {
    try {
      const { data } = await createBannerMutation({
        variables: { input: input }
      });

      if (data?.createBanner) {
        toast.success('Banner created successfully');
        return data.createBanner;
      }
      
      return null;
    } catch (error: unknown) {
      console.error('Error creating banner:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create banner');
      return null;
    }
  };

  const updateBanner = async (input: UpdateBannerInput): Promise<Banner | null> => {
    try {
      const { data } = await updateBannerMutation({
        variables: { input: input }
      });

      if (data?.updateBanner) {
        toast.success('Banner updated successfully');
        return data.updateBanner;
      }
      
      return null;
    } catch (error: unknown) {
      console.error('Error updating banner:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update banner');
      return null;
    }
  };

  const updateBannerImage = async (input: UpdateBannerImageInput): Promise<Banner | null> => {
    try {
      const { data } = await updateBannerImageMutation({
        variables: { input: input }
      });

      if (data?.updateBannerImage) {
        toast.success('Banner image updated successfully');
        return data.updateBannerImage;
      }
      
      return null;
    } catch (error: unknown) {
      console.error('Error updating banner image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update banner image');
      return null;
    }
  };

  const deleteBanner = async (bannerId: string): Promise<boolean> => {
    try {
      await deleteBannerMutation({
        variables: { bannerId }
      });

      toast.success('Banner deleted successfully');
      return true;
    } catch (error: unknown) {
      console.error('Error deleting banner:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete banner');
      return false;
    }
  };

  const approveBanner = async (input: ApproveBannerInput): Promise<Banner | null> => {
    try {
      const { data } = await approveBannerMutation({
        variables: { input: input }
      });

      if (data?.approveBanner) {
        toast.success('Banner approved successfully');
        return data.approveBanner;
      }
      
      return null;
    } catch (error: unknown) {
      console.error('Error approving banner:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to approve banner');
      return null;
    }
  };

  const declineBanner = async (input: DeclineBannerInput): Promise<Banner | null> => {
    try {
      const { data } = await declineBannerMutation({
        variables: { input: input }
      });

      if (data?.declineBanner) {
        toast.success('Banner declined successfully');
        return data.declineBanner;
      }
      
      return null;
    } catch (error: unknown) {
      console.error('Error declining banner:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to decline banner');
      return null;
    }
  };

  const pauseBanner = async (bannerId: string): Promise<Banner | null> => {
    try {
      const { data } = await pauseBannerMutation({
        variables: { bannerId }
      });

      if (data?.pauseBanner) {
        toast.success('Banner paused successfully');
        return data.pauseBanner;
      }
      
      return null;
    } catch (error: unknown) {
      console.error('Error pausing banner:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to pause banner');
      return null;
    }
  };

  const resumeBanner = async (bannerId: string): Promise<Banner | null> => {
    try {
      const { data } = await resumeBannerMutation({
        variables: { bannerId }
      });

      if (data?.resumeBanner) {
        toast.success('Banner resumed successfully');
        return data.resumeBanner;
      }
      
      return null;
    } catch (error: unknown) {
      console.error('Error resuming banner:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to resume banner');
      return null;
    }
  };

  return {
    createBanner,
    updateBanner,
    updateBannerImage,
    deleteBanner,
    approveBanner,
    declineBanner,
    pauseBanner,
    resumeBanner,
    loading: {
      creating,
      updating,
      deleting,
      approving,
      declining,
      pausing,
      resuming,
      updatingImage
    }
  };
};