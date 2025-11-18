"use client";

import { forwardRef, useImperativeHandle, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { 
  CompanyUsersSection,
  CompanyDetailsSection,
  CompanyNotesSection,
  CompanyAssetCountersSection,
  PlanSelectionSection,
  PaymentMethodSection 
} from "@/app/dashboard/companies/components";
import { usePlansData, useCreateCompany, useUpdateCompany } from "@/app/dashboard/companies/hooks";
import { getInitialFormValues } from "@/app/dashboard/companies/utils";
import { 
  createCompanySchema, 
  type CreateCompanyFormData 
} from "../lib/validations";
import { CompanyDetail } from "@/types/members";

interface CreateCompanyFormProps {
  onCancel: () => void;
  companyData?: CompanyDetail;
  isEditing?: boolean;
  statusOverride?: string;
}

export interface CreateCompanyFormRef {
  handleSubmit: () => void;
}

export const CreateCompanyForm = forwardRef<CreateCompanyFormRef, CreateCompanyFormProps>(
  ({ onCancel, companyData, isEditing = false, statusOverride }, ref) => {
  const { plans, loading: plansLoading } = usePlansData();
  const { createCompany, isLoading: isCreating } = useCreateCompany();
  const { updateCompany, isLoading: isUpdating } = useUpdateCompany(companyData?.id || '');

  const form = useForm<CreateCompanyFormData>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: getInitialFormValues(companyData),
  });

  const onSubmit = useCallback(async (data: CreateCompanyFormData) => {
    if (isEditing && companyData) {
      await updateCompany(data, statusOverride);
    } else {
      await createCompany(data);
    }
  }, [isEditing, companyData, updateCompany, statusOverride, createCompany]);

  const isLoading = isEditing ? isUpdating : isCreating;

  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      form.handleSubmit(onSubmit)();
    }
  }), [form, onSubmit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Users Section */}
        <CompanyUsersSection />

        {/* Company Details Section */}
        <CompanyDetailsSection />

        {/* Plan Selection Section */}
        <PlanSelectionSection 
          plans={plans} 
          isLoading={plansLoading} 
        />

        {/* Asset Management Section - Only show in edit mode */}
        {isEditing && companyData?.id && (
          <CompanyAssetCountersSection 
            companyId={companyData.id}
            currentPlanBenefits={companyData.benefits?.[0]?.benefits}
          />
        )}

        {/* Payment Method Section - Only show in create mode */}
        {!isEditing && (
          <PaymentMethodSection />
        )}

        {/* Company Notes Section - Only show in edit mode (at the end) */}
        {isEditing && companyData?.id && (
          <CompanyNotesSection 
            companyId={companyData.id}
          />
        )}

        {/* Fixed Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Company info */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                {isEditing && companyData && (
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>{companyData.name}</span>
                  </div>
                )}
                {!isEditing && (
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Creating new company</span>
                  </div>
                )}
              </div>

              {/* Right side - Action buttons */}
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="min-w-[100px]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="min-w-[140px] bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading 
                    ? (isEditing ? "Updating..." : "Creating...")
                    : (isEditing ? "Update Company" : "Save Company Info")
                  }
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer to prevent content from being hidden behind fixed bar */}
        <div className="h-20"></div>
      </form>
    </Form>
  );
});

CreateCompanyForm.displayName = "CreateCompanyForm";