"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { canManageEmployees } from "@/lib/permissions-dynamic";
import { EmployeeForm } from "../components/employee-form";

export default function CreateEmployeePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Check if user has access before running any hooks
  const hasAccess = canManageEmployees(user);

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
          <p className="text-muted-foreground">Access denied. Required permissions: user:create or user:manage</p>
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

  const handleSuccess = () => {
    router.push('/dashboard/employees');
  };

  const handleCancel = () => {
    router.push('/dashboard/employees');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Create New Employee</h1>
        <p className="text-sm text-gray-600 mt-1">Add a new employee to your organization</p>
      </div>

      {/* Form */}
      <EmployeeForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}