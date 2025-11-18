import { useQuery } from "@apollo/client";
import { GET_COMPANY_DETAIL } from "@/lib/graphql/members";
import { 
  CompanyDetailResponse, 
  CompanyDetailVariables,
} from "@/types/members";

interface UseCompanyDetailProps {
  companyId: string;
}

export function useCompanyDetail({ companyId }: UseCompanyDetailProps) {
  const { data, loading, error, refetch } = useQuery<CompanyDetailResponse, CompanyDetailVariables>(
    GET_COMPANY_DETAIL,
    {
      variables: { companyId },
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
      skip: !companyId,
    }
  );

  // Filter out AbortError from displaying to user
  const displayError = error && !error.message.includes('AbortError') && !error.message.includes('signal is aborted') ? error : null;

  return {
    company: data?.company,
    loading,
    error: displayError,
    refetch,
  };
}