"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/types/employees";
import { AlertTriangle, UserCheck, UserX } from "lucide-react";

interface StatusToggleModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (employeeId: string, action: 'activate' | 'deactivate') => Promise<void>;
  loading?: boolean;
}

export function StatusToggleModal({
  employee,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: StatusToggleModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!employee) return null;

  const isActive = employee.isActive;
  const action = isActive ? 'deactivate' : 'activate';
  const actionLabel = isActive ? 'Deactivate' : 'Activate';
  const actionDescription = isActive ? 'deactivated' : 'activated';

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(employee.id, action);
      onClose();
    } catch (error) {
      console.error('Error toggling employee status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Icon = isActive ? UserX : UserCheck;
  const iconColor = isActive ? "text-red-600" : "text-green-600";
  const buttonVariant = isActive ? "destructive" : "default";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${iconColor}`} />
            {actionLabel} Employee
          </DialogTitle>
          <DialogDescription>
            This action will change the employee&apos;s status. Please confirm to proceed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Employee Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">
                  {employee.firstName} {employee.lastName}
                </p>
                <p className="text-sm text-gray-600">{employee.email}</p>
                <p className="text-sm text-gray-600">
                  Role: {employee.role?.name || 'No Role'}
                </p>
              </div>
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">
                {isActive ? 'Deactivation Warning' : 'Activation Notice'}
              </p>
              <p className="text-yellow-700 mt-1">
                {isActive 
                  ? 'This employee will lose access to the system and won&apos;t be able to log in.'
                  : 'This employee will regain access to the system and will be able to log in.'
                }
              </p>
            </div>
          </div>

          {/* Confirmation */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Are you sure you want to {actionDescription.toLowerCase()} <strong>{employee.firstName} {employee.lastName}</strong>?
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting || loading}
          >
            Cancel
          </Button>
          <Button
            variant={buttonVariant}
            onClick={handleConfirm}
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? 'Processing...' : `Yes, ${actionLabel}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}