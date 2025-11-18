import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { 
  GET_COMPANY_ADDITIONAL_ASSETS, 
  GET_COMPANY_ASSET_HISTORY, 
  ADD_COMPANY_ASSET, 
  UPDATE_COMPANY_ASSET 
} from "@/lib/graphql/company-assets";
import { GET_COMPANY_DETAIL } from "@/lib/graphql/members";
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils";

interface CompanyAsset {
  id: string;
  type: string;
  quantity: number;
  duration?: string;
  notes?: string;
  addedBy: {
    firstName: string;
    lastName: string;
  };
  addedDate: string;
  updatedDate: string;
}

interface AssetHistoryEntry {
  id: string;
  assetType: string;
  quantity: number;
  duration?: string;
  action: string;
  addedBy: {
    firstName: string;
    lastName: string;
  };
  date: string;
  notes?: string;
}

interface AddAssetInput {
  type: string;
  quantity: number;
  duration?: string;
  notes?: string;
}

interface UpdateAssetInput {
  assetId: string;
  quantity: number;
  notes?: string;
}

interface UseCompanyAssetsProps {
  companyId: string;
}

export function useCompanyAssets({ companyId }: UseCompanyAssetsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch company assets
  const { data: assetsData, loading: assetsLoading, error: assetsError, refetch: refetchAssets } = useQuery(
    GET_COMPANY_ADDITIONAL_ASSETS,
    {
      variables: { companyId },
      skip: !companyId,
      errorPolicy: "all",
    }
  );

  // Add asset mutation
  const [addAssetMutation] = useMutation(ADD_COMPANY_ASSET, {
    refetchQueries: [
      {
        query: GET_COMPANY_ADDITIONAL_ASSETS,
        variables: { companyId }
      },
      {
        query: GET_COMPANY_DETAIL,
        variables: { companyId }
      }
    ],
    awaitRefetchQueries: true,
  });

  // Update asset mutation
  const [updateAssetMutation] = useMutation(UPDATE_COMPANY_ASSET, {
    refetchQueries: [
      {
        query: GET_COMPANY_ADDITIONAL_ASSETS,
        variables: { companyId }
      },
      {
        query: GET_COMPANY_DETAIL,
        variables: { companyId }
      }
    ],
    awaitRefetchQueries: true,
  });

  const addAsset = async (assetInput: AddAssetInput) => {
    if (!assetInput.type || assetInput.quantity <= 0) {
      showErrorToast("Invalid asset data");
      return false;
    }

    setIsAdding(true);
    
    try {
      const result = await addAssetMutation({
        variables: {
          companyId,
          type: assetInput.type,
          quantity: assetInput.quantity,
          duration: assetInput.duration,
          notes: assetInput.notes
        },
      });

      if (result.data?.addCompanyAsset) {
        showSuccessToast(`Added ${assetInput.quantity} ${assetInput.type} asset(s)!`);
        return true;
      }
    } catch (error: unknown) {
      console.error('Add asset error:', error);
      let errorMessage = 'Failed to add asset';
      
      if (error && typeof error === 'object') {
        const err = error as { graphQLErrors?: Array<{ message: string }>; message?: string };
        errorMessage = err.graphQLErrors?.[0]?.message || err.message || errorMessage;
      }
      
      showErrorToast(errorMessage);
    } finally {
      setIsAdding(false);
    }

    return false;
  };

  const updateAsset = async (updateInput: UpdateAssetInput) => {
    if (!updateInput.assetId || updateInput.quantity <= 0) {
      showErrorToast("Invalid asset update data");
      return false;
    }

    setIsUpdating(true);
    
    try {
      const result = await updateAssetMutation({
        variables: {
          companyId,
          assetId: updateInput.assetId,
          quantity: updateInput.quantity,
          notes: updateInput.notes
        },
      });

      if (result.data?.updateCompanyAsset) {
        showSuccessToast("Asset updated successfully!");
        return true;
      }
    } catch (error: unknown) {
      console.error('Update asset error:', error);
      let errorMessage = 'Failed to update asset';
      
      if (error && typeof error === 'object') {
        const err = error as { graphQLErrors?: Array<{ message: string }>; message?: string };
        errorMessage = err.graphQLErrors?.[0]?.message || err.message || errorMessage;
      }
      
      showErrorToast(errorMessage);
    } finally {
      setIsUpdating(false);
    }

    return false;
  };

  // Helper to get asset name with duration
  const getAssetDisplayName = (type: string, duration?: string) => {
    if (duration) {
      return `${type} (${duration})`;
    }
    return type;
  };

  // Helper to get full name
  const getFullName = (person: { firstName: string; lastName: string }) => {
    return `${person.firstName} ${person.lastName}`.trim();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const assets: CompanyAsset[] = assetsData?.getCompanyAdditionalAssets || [];

  // Filter out AbortError from displaying to user
  const displayError = assetsError && !assetsError.message.includes('AbortError') && !assetsError.message.includes('signal is aborted') ? assetsError : null;

  return {
    assets,
    loading: assetsLoading,
    error: displayError,
    isAdding,
    isUpdating,
    addAsset,
    updateAsset,
    refetchAssets,
    getAssetDisplayName,
    getFullName,
    formatDate,
  };
}

// Hook specifically for asset history
export function useCompanyAssetHistory({ companyId }: UseCompanyAssetsProps) {
  const { data, loading, error, refetch } = useQuery(GET_COMPANY_ASSET_HISTORY, {
    variables: { 
      companyId,
      limit: 50.0 // Get recent 50 entries - use Float type
    },
    skip: !companyId,
    errorPolicy: "all",
  });

  const assetHistory: AssetHistoryEntry[] = data?.getCompanyAssetHistory || [];

  // Sort by date (most recent first)
  const sortedHistory = [...assetHistory].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Get full name
  const getFullName = (person: { firstName: string; lastName: string }) => {
    return `${person.firstName} ${person.lastName}`.trim();
  };

  // Filter out AbortError from displaying to user
  const displayError = error && !error.message.includes('AbortError') && !error.message.includes('signal is aborted') ? error : null;

  return {
    assetHistory: sortedHistory,
    loading,
    error: displayError,
    refetch,
    formatDate,
    getFullName,
  };
}