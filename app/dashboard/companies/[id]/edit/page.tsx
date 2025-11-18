"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

import { Button } from "@/components/ui/button";
import { CreateCompanyForm, CompanyEditSkeleton, CompanyEditHeader } from "@/app/dashboard/companies/components";
import { useCompanyDetail } from "../hooks";

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  const { user } = useAuthStore();
  const [statusOverride, setStatusOverride] = useState<string | undefined>();

  const { company, loading, error } = useCompanyDetail({ companyId });

  // Check if user has access before running any hooks
  const hasAccess = user && ['SUPER_ADMIN', 'ADMIN'].includes(user.role?.name || '');

  // Role-based access control - redirect early if no access
  useEffect(() => {
    if (user && !hasAccess) {
      router.push('/dashboard');
    }
  }, [user, hasAccess, router]);

  // Early return if no access
  if (user && !hasAccess) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Access denied. ADMIN or SUPER_ADMIN role required.</p>
        </div>
      </div>
    );
  }

  // Don't render anything until we know the user has access
  if (!user || !hasAccess) {
    return <CompanyEditSkeleton />;
  }

  // Show loading state while fetching company data
  if (loading) {
    return <CompanyEditSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading company: {error.message}</p>
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/companies')}
            className="mt-4"
          >
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!company) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Company not found</p>
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/companies')}
            className="mt-4"
          >
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  const handleCancel = () => {
    router.push(`/dashboard/companies/${companyId}`);
  };

  const handleToggleStatus = (active: boolean) => {
    // Handle status toggle logic here
    const newStatus = active ? 'ACTIVE' : 'PENDING';
    console.log('Toggle status:', newStatus);
    setStatusOverride(newStatus);
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <CompanyEditHeader
        company={company}
        onBack={handleCancel}
        onToggleStatus={handleToggleStatus}
      />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <CreateCompanyForm 
          onCancel={handleCancel} 
          companyData={company}
          isEditing={true}
          statusOverride={statusOverride}
        />
      </div>
    </div>
  );
}