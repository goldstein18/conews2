import { useQuery } from "@apollo/client";
import { GET_PLANS } from "@/lib/graphql/plans";
import { Plan } from "@/types/members";

interface PlansResponse {
  plans: Plan[];
}

export function usePlansData() {
  const { data, loading, error } = useQuery<PlansResponse>(GET_PLANS, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  // Filter out AbortError from displaying to user
  const displayError = error && !error.message.includes('AbortError') && !error.message.includes('signal is aborted') ? error : null;

  return {
    plans: data?.plans || [],
    loading,
    error: displayError,
  };
}