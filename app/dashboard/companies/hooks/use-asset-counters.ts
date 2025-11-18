import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { 
  GET_COMPANY_ASSET_COUNTERS,
  ADD_COMPANY_ASSET,
  CONSUME_COMPANY_ASSET
} from "@/lib/graphql/company-assets";
import { GET_COMPANY_DETAIL } from "@/lib/graphql/members";
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils";

interface AssetCounter {
  assetType: string;
  planAllowed: number;
  individuallyAdded: number;
  totalAvailable: number;
  totalConsumed: number;
  totalRemaining: number;
  usagePercentage: number;
  consumedThisMonth: number;
  lastConsumedDate?: string;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

interface AddAssetInput {
  type: string;
  quantity: number;
  duration?: string;
  notes?: string;
}

interface ConsumeAssetInput {
  assetType: string;
  quantity: number;
  context?: string;
}

interface UseAssetCountersProps {
  companyId: string;
}

export function useAssetCounters({ companyId }: UseAssetCountersProps) {
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [isConsumingAsset, setIsConsumingAsset] = useState(false);

  // Fetch asset counters
  const { data: countersData, loading: countersLoading, error: countersError, refetch: refetchCounters } = useQuery(
    GET_COMPANY_ASSET_COUNTERS,
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
        query: GET_COMPANY_ASSET_COUNTERS,
        variables: { companyId }
      },
      {
        query: GET_COMPANY_DETAIL,
        variables: { companyId }
      }
    ],
    awaitRefetchQueries: true,
  });

  // Consume asset mutation
  const [consumeAssetMutation] = useMutation(CONSUME_COMPANY_ASSET, {
    refetchQueries: [
      {
        query: GET_COMPANY_ASSET_COUNTERS,
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

    setIsAddingAsset(true);
    
    try {
      const result = await addAssetMutation({
        variables: {
          companyId,
          type: assetInput.type,
          quantity: assetInput.quantity,
          duration: assetInput.duration,
          notes: assetInput.notes || `Added ${assetInput.quantity} ${assetInput.type} asset(s)`
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
      setIsAddingAsset(false);
    }

    return false;
  };

  const consumeAsset = async (consumeInput: ConsumeAssetInput) => {
    if (!consumeInput.assetType || consumeInput.quantity <= 0) {
      showErrorToast("Invalid consumption data");
      return false;
    }

    setIsConsumingAsset(true);
    
    try {
      const result = await consumeAssetMutation({
        variables: {
          companyId,
          assetType: consumeInput.assetType,
          quantity: consumeInput.quantity,
          context: consumeInput.context || `Consumed ${consumeInput.quantity} ${consumeInput.assetType}`
        },
      });

      if (result.data?.consumeCompanyAsset?.success) {
        const { consumed, remainingAfter } = result.data.consumeCompanyAsset;
        showSuccessToast(`Consumed ${consumed} ${consumeInput.assetType}. ${remainingAfter} remaining.`);
        return true;
      }
    } catch (error: unknown) {
      console.error('Consume asset error:', error);
      let errorMessage = 'Failed to consume asset';
      
      if (error && typeof error === 'object') {
        const err = error as { graphQLErrors?: Array<{ message: string }>; message?: string };
        errorMessage = err.graphQLErrors?.[0]?.message || err.message || errorMessage;
      }
      
      showErrorToast(errorMessage);
    } finally {
      setIsConsumingAsset(false);
    }

    return false;
  };

  // Helper functions
  const getCounterByType = (assetType: string): AssetCounter | undefined => {
    return assetCounters.find(counter => counter.assetType === assetType);
  };

  const getUsageColor = (usagePercentage: number, isLowStock: boolean, isOutOfStock: boolean) => {
    if (isOutOfStock) return "bg-red-500";
    if (isLowStock) return "bg-yellow-500";
    if (usagePercentage > 75) return "bg-orange-500";
    return "bg-blue-500";
  };

  const formatLastUsed = (dateString?: string) => {
    if (!dateString) return "Never used";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const assetCounters: AssetCounter[] = countersData?.getCompanyAssetCounters || [];

  // Filter out AbortError from displaying to user
  const displayError = countersError && !countersError.message.includes('AbortError') && !countersError.message.includes('signal is aborted') ? countersError : null;

  return {
    assetCounters,
    loading: countersLoading,
    error: displayError,
    isAddingAsset,
    isConsumingAsset,
    addAsset,
    consumeAsset,
    refetchCounters,
    getCounterByType,
    getUsageColor,
    formatLastUsed,
  };
}