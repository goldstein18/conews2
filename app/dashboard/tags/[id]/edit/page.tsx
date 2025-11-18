"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ProtectedPage, ProtectionPresets } from "@/components/protected-page";

import { GET_TAG, UPDATE_TAG } from "@/lib/graphql/tags";
import { UpdateTagInput } from "@/types/tags";

const updateTagSchema = z.object({
  display: z.string().min(1, "Display name is required"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color").optional().or(z.literal("")),
  description: z.string().optional(),
  order: z.number().int().min(0, "Order must be a non-negative integer"),
  isActive: z.boolean(),
});

type UpdateTagFormData = z.infer<typeof updateTagSchema>;

export default function EditTagPage() {
  return (
    <ProtectedPage {...ProtectionPresets.SuperAdminOnly}>
      <EditTagPageContent />
    </ProtectedPage>
  );
}

function EditTagPageContent() {
  const router = useRouter();
  const params = useParams();
  const tagId = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTagFormData>({
    resolver: zodResolver(updateTagSchema),
  });

  // Fetch tag data
  const { data: tagData, loading: tagLoading, error: tagError } = useQuery(GET_TAG, {
    variables: { id: tagId },
    onCompleted: (data) => {
      if (data?.tag) {
        const tag = data.tag;
        reset({
          display: tag.display,
          color: tag.color || "",
          description: tag.description || "",
          order: tag.order || 0,
          isActive: tag.isActive,
        });
      }
    },
  });

  const [updateTag] = useMutation(UPDATE_TAG, {
    onCompleted: () => {
      toast.success("Tag updated successfully");
      router.push("/dashboard/tags");
    },
    onError: (error) => {
      toast.error(`Failed to update tag: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: UpdateTagFormData) => {
    setIsSubmitting(true);
    
    const input: UpdateTagInput = {
      display: data.display,
      ...(data.color && { color: data.color }),
      ...(data.description && { description: data.description }),
      order: data.order,
      isActive: data.isActive,
    };

    try {
      await updateTag({ 
        variables: { 
          id: tagId,
          updateTagInput: input 
        } 
      });
    } catch {
      // Error handled by onError callback
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/tags");
  };

  if (tagLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading tag...</p>
        </div>
      </div>
    );
  }

  if (tagError || !tagData?.tag) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">
            Error loading tag: {tagError?.message || "Tag not found"}
          </p>
          <Button onClick={handleCancel} className="mt-4">
            Back to Tags
          </Button>
        </div>
      </div>
    );
  }

  const tag = tagData.tag;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tags</span>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Tag</h1>
        <p className="text-muted-foreground">
          Update the tag information. Note: Name and type cannot be changed.
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Tag Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Read-only fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name (Read-only)</Label>
                <Input
                  value={tag.name}
                  disabled
                  className="bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500">
                  Name cannot be changed after creation
                </p>
              </div>

              <div className="space-y-2">
                <Label>Type (Read-only)</Label>
                <Input
                  value={tag.type.replace('_', ' ')}
                  disabled
                  className="bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500">
                  Type cannot be changed after creation
                </p>
              </div>
            </div>

            {tag.mainGenre && (
              <div className="space-y-2">
                <Label>Main Genre (Read-only)</Label>
                <Input
                  value={tag.mainGenre.replace('_', ' ')}
                  disabled
                  className="bg-gray-50 text-gray-500"
                />
              </div>
            )}

            {/* Editable fields */}
            <div className="space-y-2">
              <Label htmlFor="display">Display Name *</Label>
              <Input
                id="display"
                placeholder="e.g. Deep House"
                {...register("display")}
              />
              {errors.display && (
                <p className="text-sm text-red-600">{errors.display.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Color */}
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="color"
                    type="color"
                    className="w-16 h-10 p-1"
                    {...register("color")}
                  />
                  <Input
                    placeholder="#3B82F6"
                    className="flex-1"
                    {...register("color")}
                  />
                </div>
                {errors.color && (
                  <p className="text-sm text-red-600">{errors.color.message}</p>
                )}
              </div>

              {/* Order */}
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  placeholder="0"
                  {...register("order", { valueAsNumber: true })}
                />
                {errors.order && (
                  <p className="text-sm text-red-600">{errors.order.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description of the tag..."
                rows={3}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                {...register("isActive")}
              />
              <Label htmlFor="isActive">Active</Label>
              <p className="text-xs text-gray-500">
                Inactive tags are hidden from public queries
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Tag"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}