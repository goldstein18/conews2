"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { useAuthStore } from "@/store/auth-store";
import { canManageEmployees } from "@/lib/permissions-dynamic";
import { GET_EMPLOYEE } from "@/lib/graphql/employees";
import { EmployeeResponse, EmployeeVariables } from "@/types/employees";
import { EmployeeForm } from "../../components/employee-form";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const employeeId = params.id as string;

  // Check permissions
  const hasAccess = canManageEmployees(user);

  // Fetch the specific employee data
  const { data, loading, error } = useQuery<EmployeeResponse, EmployeeVariables>(GET_EMPLOYEE, {
    variables: { id: employeeId },
    skip: !hasAccess, // Don't fetch if user doesn't have permission
  });

  const employee = data?.employee;

  const handleSuccess = () => {
    router.push('/dashboard/employees');
  };

  const handleCancel = () => {
    router.push('/dashboard/employees');
  };

  // Permission check
  if (!hasAccess) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Access denied. Required permissions: user:update or user:manage</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Employee</h1>
          <p className="text-sm text-gray-600 mt-1">Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Employee</h1>
          <p className="text-sm text-red-600 mt-1">Error loading employee: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Employee</h1>
          <p className="text-sm text-red-600 mt-1">Employee not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Employee</h1>
        <p className="text-sm text-gray-600 mt-1">Update employee information</p>
      </div>

      {/* Form */}
      <EmployeeForm
        employee={employee}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}