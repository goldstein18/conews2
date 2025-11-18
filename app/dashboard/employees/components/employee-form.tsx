"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  AVAILABLE_MARKETS, 
  MARKET_LABELS, 
  EMPLOYEE_ROLES, 
  ROLE_LABELS,
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput
} from "@/types/employees";
import { useEmployeeActions } from "../hooks";

// Create a function to generate the schema based on mode
const getEmployeeSchema = (isEdit: boolean) => z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: isEdit 
    ? z.string().optional() 
    : z.string().min(6, "Password must be at least 6 characters"),
  markets: z.array(z.string()).min(1, "At least one market must be selected"),
  defaultMarket: z.string().min(1, "Default market is required"),
  roles: z.array(z.string()).min(1, "At least one role must be selected"),
  department: z.string().optional(),
  position: z.string().optional(),
});

type FormData = z.infer<ReturnType<typeof getEmployeeSchema>>;

interface EmployeeFormProps {
  employee?: Employee;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EmployeeForm({ employee, onSuccess, onCancel }: EmployeeFormProps) {
  const { createNewEmployee, updateExistingEmployee, loading } = useEmployeeActions();
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(
    employee?.employeeMarkets?.map(m => m.market) || []
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    employee?.role ? [employee.role.name] : []
  );

  const isEdit = !!employee;

  // Find the default market for editing
  const getDefaultMarket = () => {
    if (!employee?.employeeMarkets) return "";
    const defaultMarket = employee.employeeMarkets.find(m => m.isDefault);
    return defaultMarket?.market || employee.employeeMarkets[0]?.market || "";
  };

  const form = useForm<FormData>({
    resolver: zodResolver(getEmployeeSchema(isEdit)),
    defaultValues: {
      firstName: employee?.firstName || "",
      lastName: employee?.lastName || "",
      email: employee?.email || "",
      password: "",
      markets: selectedMarkets,
      defaultMarket: getDefaultMarket(),
      roles: selectedRoles,
      department: employee?.employeeProfile?.department || "",
      position: employee?.employeeProfile?.position || "",
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;

  const watchedDefaultMarket = watch("defaultMarket");

  const handleMarketChange = (market: string, checked: boolean) => {
    let newMarkets: string[];
    
    if (checked) {
      newMarkets = [...selectedMarkets, market];
    } else {
      newMarkets = selectedMarkets.filter(m => m !== market);
    }
    
    setSelectedMarkets(newMarkets);
    setValue("markets", newMarkets);
    
    // If default market was unchecked, reset it
    if (!checked && watchedDefaultMarket === market && newMarkets.length > 0) {
      setValue("defaultMarket", newMarkets[0]);
    }
  };

  const handleRoleChange = (role: string, checked: boolean) => {
    let newRoles: string[];
    
    if (checked) {
      newRoles = [...selectedRoles, role];
    } else {
      newRoles = selectedRoles.filter(r => r !== role);
    }
    
    setSelectedRoles(newRoles);
    setValue("roles", newRoles);
  };

  const onSubmit = async (data: FormData) => {
    console.log('Form submission started', data);
    try {
      if (isEdit) {
        const updateData: UpdateEmployeeInput = {
          ...(data.firstName && { firstName: data.firstName }),
          ...(data.lastName && { lastName: data.lastName }),
          ...(data.roles.length > 0 && { role: data.roles[0] }),
          ...(data.department && { department: data.department }),
          ...(data.position && { position: data.position }),
          ...(data.markets.length > 0 && {
            markets: data.markets,
            defaultMarket: data.defaultMarket
          }),
        };

        await updateExistingEmployee(employee.id, updateData);
      } else {
        const createData: CreateEmployeeInput = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password || '',
          role: data.roles[0],
          markets: data.markets,
          defaultMarket: data.defaultMarket,
          ...(data.department && { department: data.department }),
          ...(data.position && { position: data.position }),
        };

        console.log('Creating employee with data:', createData);
        await createNewEmployee(createData);
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error in form submission:', error);
      // Error handling is done in the hook
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Form-level validation errors */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              {errors.firstName && <li>First name is required</li>}
              {errors.lastName && <li>Last name is required</li>}
              {errors.email && <li>Valid email is required</li>}
              {errors.password && <li>{errors.password.message}</li>}
              {errors.markets && <li>{errors.markets.message}</li>}
              {errors.defaultMarket && <li>Default market must be selected</li>}
              {errors.roles && <li>{errors.roles.message}</li>}
            </ul>
          </div>
        )}

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <p className="text-sm text-gray-600">Profile information for the Employee.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Carlos"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Rodriguez"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="carlos@cultureowl.com"
                disabled={isEdit}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Enter secure password"
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visible Markets */}
        <Card>
          <CardHeader>
            <CardTitle>Visible Markets</CardTitle>
            <p className="text-sm text-gray-600">Which markets can the employee manage.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_MARKETS.map((market) => (
                <div key={market} className="flex items-center space-x-2">
                  <Checkbox
                    id={`market-${market}`}
                    checked={selectedMarkets.includes(market)}
                    onCheckedChange={(checked) => 
                      handleMarketChange(market, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`market-${market}`}
                    className="text-sm font-normal"
                  >
                    {MARKET_LABELS[market]}
                  </Label>
                </div>
              ))}
            </div>
            
            {selectedMarkets.length > 0 && (
              <div className="space-y-2">
                <Label>Default Market</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedMarkets.map((market) => (
                    <Badge
                      key={market}
                      variant={watchedDefaultMarket === market ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setValue("defaultMarket", market)}
                    >
                      {MARKET_LABELS[market]}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {errors.markets && (
              <p className="text-sm text-red-600">{errors.markets.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Employee Roles */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Roles</CardTitle>
            <p className="text-sm text-gray-600">Select the roles for the employee.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EMPLOYEE_ROLES.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role}`}
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={(checked) => 
                      handleRoleChange(role, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`role-${role}`}
                    className="text-sm font-normal"
                  >
                    {ROLE_LABELS[role]}
                  </Label>
                </div>
              ))}
            </div>
            
            {errors.roles && (
              <p className="text-sm text-red-600">{errors.roles.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <p className="text-sm text-gray-600">Optional employee details.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  {...register("department")}
                  placeholder="Marketing"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  {...register("position")}
                  placeholder="Marketing Manager"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
          </Button>
        </div>
      </form>
    </div>
  );
}