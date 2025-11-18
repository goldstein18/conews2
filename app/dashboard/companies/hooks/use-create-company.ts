import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { CREATE_COMPANY_WITH_USERS } from "@/lib/graphql/companies";
import { LIST_COMPANY_OWNERS, MEMBERS_DASHBOARD_STATS } from "@/lib/graphql/members";
import { CreateCompanyFormData } from "../lib/validations";
import { showErrorToast, showSuccessToast } from "@/lib/toast-utils";

interface CreateCompanyWithUsersInput {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyZipcode: string;
  market: string;
  planSlug: string;
  users: Array<{
    name: string;
    email: string;
    role: string;
    isOwner: boolean;
  }>;
}

export function useCreateCompany() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [createCompanyMutation] = useMutation(CREATE_COMPANY_WITH_USERS, {
    // Refetch companies list and dashboard stats after creating
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
      }
    ],
    awaitRefetchQueries: true, // Wait for refetch to complete
  });

  const createCompany = async (formData: CreateCompanyFormData) => {
    setIsLoading(true);
    
    try {
      // Transform form data to match API expectations
      const input: CreateCompanyWithUsersInput = {
        companyName: formData.companyName,
        companyEmail: formData.companyEmail,
        companyPhone: formData.companyPhone,
        companyAddress: formData.companyAddress,
        companyCity: formData.companyCity,
        companyState: formData.companyState,
        companyZipcode: formData.companyZipcode,
        market: formData.market,
        planSlug: formData.planSlug,
        users: formData.users.map(user => ({
          name: user.name,
          email: user.email,
          role: user.role,
          isOwner: user.isOwner,
        })),
      };

      const result = await createCompanyMutation({
        variables: {
          createCompanyWithUsersInput: input,
        },
      });

      if (result.data?.createCompanyWithUsers) {
        showSuccessToast("Company created successfully!");
        
        // Use a small delay to ensure mutations and refetches complete
        // before navigating to prevent AbortError
        setTimeout(() => {
          router.replace('/dashboard/companies'); // Use replace instead of push
        }, 100);
      }
    } catch (error: unknown) {
      console.error('Create company error:', error);
      let errorMessage = 'Failed to create company';
      
      if (error && typeof error === 'object') {
        const err = error as { graphQLErrors?: Array<{ message: string }>; message?: string };
        errorMessage = err.graphQLErrors?.[0]?.message || err.message || errorMessage;
      }
      
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCompany,
    isLoading,
  };
}