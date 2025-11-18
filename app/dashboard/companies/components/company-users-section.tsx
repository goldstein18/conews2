"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateCompanyFormData } from "../lib/validations";

export function CompanyUsersSection() {
  const form = useFormContext<CreateCompanyFormData>();
  const { control, watch } = form;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "users",
  });

  const watchedUsers = watch("users");

  const addUser = () => {
    append({
      name: "",
      email: "",
      role: "admin" as const,
      isOwner: false,
    });
  };

  const removeUser = (index: number) => {
    remove(index);
  };

  const updateUserRole = (index: number, role: "owner" | "admin") => {
    // If changing to owner, make sure no other user is owner
    if (role === "owner") {
      watchedUsers?.forEach((_, i) => {
        if (i !== index) {
          form.setValue(`users.${i}.isOwner`, false);
          form.setValue(`users.${i}.role`, "admin");
        }
      });
    }
  };

  const getOwnerCount = () => {
    return watchedUsers?.filter(user => user.isOwner).length || 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          Add users to the company. One user must be designated as Owner.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => {
          const isOwner = watchedUsers?.[index]?.isOwner || false;
          const canRemove = fields.length > 1 && !isOwner;

          return (
            <div key={field.id} className="grid gap-4 md:grid-cols-3 border rounded-lg p-4">
              <FormField
                control={control}
                name={`users.${index}.name`}
                render={({ field: nameField }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="User Name"
                        {...nameField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`users.${index}.email`}
                render={({ field: emailField }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        {...emailField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-end gap-2">
                <FormField
                  control={control}
                  name={`users.${index}.role`}
                  render={({ field: roleField }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Role</FormLabel>
                      <Select
                        value={roleField.value}
                        onValueChange={(value: "owner" | "admin") => {
                          roleField.onChange(value);
                          // Update isOwner based on role
                          form.setValue(`users.${index}.isOwner`, value === "owner");
                          updateUserRole(index, value);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="admin">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {canRemove && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeUser(index)}
                    className="h-9 w-9 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={addUser}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
          
          {getOwnerCount() === 0 && (
            <p className="text-sm text-destructive">
              At least one user must be designated as Owner
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}