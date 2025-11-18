"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

import { Button } from "@/components/ui/button";
import { CreateCompanyForm } from "@/app/dashboard/companies/components";

export default function CreateCompanyPage() {
  const router = useRouter();
  const { user } = useAuthStore();

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
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleCancel = () => {
    router.push('/dashboard/companies');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Companies</span>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Company</h1>
        <p className="text-muted-foreground">
          Set up a new company profile, plan, and assets.
        </p>
      </div>

      {/* Main Form */}
      <CreateCompanyForm onCancel={handleCancel} />
    </div>
  );
}