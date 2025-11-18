import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { UPDATE_COMPANY_PROFILE } from "@/lib/graphql/settings";
import { LIST_COMPANY_OWNERS, MEMBERS_DASHBOARD_STATS, GET_COMPANY_DETAIL } from "@/lib/graphql/members";
import { CreateCompanyFormData } from "../lib/validations";
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils";

interface UpdateCompanyInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  status?: string;
}

export function useUpdateCompany(companyId: string) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const [updateCompanyMutation] = useMutation(UPDATE_COMPANY_PROFILE, {
    // Refetch companies list, dashboard stats, and company details after updating
    refetchQueries: [
      {
        query: LIST_COMPANY_OWNERS,
        variables: {
          first: 20,
          sort: { field: 'createdAt', direction: 'desc' }
        }
      },
      {
        query: MEMBERS_DASHBOARD_STATS
      },
      {
        query: GET_COMPANY_DETAIL,
        variables: { companyId }
      }
    ],
    awaitRefetchQueries: true,
  });

  const updateCompany = async (formData: CreateCompanyFormData, statusOverride?: string) => {
    setIsLoading(true);
    
    try {
      // Transform form data to match API expectations
      const input: UpdateCompanyInput = {
        name: formData.companyName,
        email: formData.companyEmail,
        phone: formData.companyPhone,
        address: formData.companyAddress,
        city: formData.companyCity,
        state: formData.companyState,
        zipcode: formData.companyZipcode,
      };

      // Add status if provided (from toggle or form)
      if (statusOverride || pendingStatus) {
        input.status = statusOverride || pendingStatus!;
      }

      const result = await updateCompanyMutation({
        variables: {
          companyId,
          updateCompanyInput: input,
        },
      });

      if (result.data?.updateCompany) {
        showSuccessToast("Company updated successfully!");
        
        // Clear pending status after successful update
        setPendingStatus(null);
        
        // Use a small delay to ensure mutations and refetches complete
        // before navigating to prevent AbortError
        setTimeout(() => {
          router.replace(`/dashboard/companies/${companyId}`);
        }, 100);
      }
    } catch (error: unknown) {
      console.error('Update company error:', error);
      let errorMessage = 'Failed to update company';
      
      if (error && typeof error === 'object') {
        const err = error as { graphQLErrors?: Array<{ message: string }>; message?: string };
        errorMessage = err.graphQLErrors?.[0]?.message || err.message || errorMessage;
      }
      
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const setStatus = (status: string) => {
    setPendingStatus(status);
  };

  return {
    updateCompany,
    isLoading,
    setStatus,
    pendingStatus,
  };
}