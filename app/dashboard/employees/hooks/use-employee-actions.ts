"use client";

import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { 
  CREATE_EMPLOYEE, 
  UPDATE_EMPLOYEE, 
  TOGGLE_EMPLOYEE_STATUS, 
  LIST_EMPLOYEES 
} from '@/lib/graphql/employees';
import { 
  CreateEmployeeMutationVariables, 
  UpdateEmployeeMutationVariables, 
  ToggleEmployeeStatusVariables,
  CreateEmployeeInput,
  UpdateEmployeeInput
} from '@/types/employees';

export function useEmployeeActions() {
  const [createEmployeeMutation, { loading: creating }] = useMutation(CREATE_EMPLOYEE, {
    refetchQueries: [{ query: LIST_EMPLOYEES }],
  });

  const [updateEmployeeMutation, { loading: updating }] = useMutation(UPDATE_EMPLOYEE, {
    refetchQueries: [{ query: LIST_EMPLOYEES }],
  });

  const [toggleStatusMutation, { loading: toggling }] = useMutation(TOGGLE_EMPLOYEE_STATUS, {
    refetchQueries: [{ query: LIST_EMPLOYEES }],
  });

  const loading = creating || updating || toggling;

  const toggleEmployeeStatus = async (employeeId: string, action: 'activate' | 'deactivate') => {
    try {
      const variables: ToggleEmployeeStatusVariables = {
        id: employeeId,
        isActive: action === 'activate',
      };

      await toggleStatusMutation({ variables });
      
      toast.success(`Employee ${action}d successfully`);
    } catch (error: unknown) {
      console.error('Error toggling employee status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update employee status';
      toast.error(errorMessage);
      throw error;
    }
  };

  const createNewEmployee = async (employeeData: CreateEmployeeInput) => {
    try {
      const variables: CreateEmployeeMutationVariables = {
        createEmployeeInput: employeeData,
      };

      const result = await createEmployeeMutation({ variables });
      
      toast.success('Employee created successfully');
      return result.data?.createEmployee;
    } catch (error: unknown) {
      console.error('Error creating employee:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create employee';
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateExistingEmployee = async (employeeId: string, employeeData: UpdateEmployeeInput) => {
    try {
      const variables: UpdateEmployeeMutationVariables = {
        id: employeeId,
        updateEmployeeInput: employeeData,
      };

      const result = await updateEmployeeMutation({ variables });
      
      toast.success('Employee updated successfully');
      return result.data?.updateEmployee;
    } catch (error: unknown) {
      console.error('Error updating employee:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update employee';
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    loading,
    toggleEmployeeStatus,
    createNewEmployee,
    updateExistingEmployee,
  };
}