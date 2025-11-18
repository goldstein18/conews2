"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ProtectedPage, ProtectionPresets } from "@/components/protected-page";

import { CREATE_TAG } from "@/lib/graphql/tags";
import { TagType, CreateTagInput } from "@/types/tags";

const createTagSchema = z.object({
  name: z.string().min(1, "Name is required").regex(/^[a-z0-9_]+$/, "Name must be lowercase with underscores only"),
  display: z.string().min(1, "Display name is required"),
  type: z.nativeEnum(TagType).refine((val) => val, { message: "Type is required" }),
  mainGenre: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex color").optional().or(z.literal("")),
  description: z.string().optional(),
  order: z.number().int().min(0, "Order must be a non-negative integer"),
  isActive: z.boolean(),
});

type CreateTagFormData = z.infer<typeof createTagSchema>;

const TAG_TYPE_OPTIONS = [
  { value: TagType.MAIN_GENRE, label: 'Main Genre' },
  { value: TagType.SUBGENRE, label: 'Sub Genre' },
  { value: TagType.SUPPORTING, label: 'Supporting' },
  { value: TagType.AUDIENCE, label: 'Audience' },
];

const MAIN_GENRE_OPTIONS = [
  'ELECTRONIC',
  'ROCK',
  'POP',
  'HIP_HOP',
  'JAZZ',
  'CLASSICAL',
  'REGGAE',
  'LATIN',
  'COUNTRY',
  'R&B',
  'FOLK',
  'BLUES',
  'FUNK'
];

export default function CreateTagPage() {
  return (
    <ProtectedPage {...ProtectionPresets.SuperAdminOnly}>
      <CreateTagPageContent />
    </ProtectedPage>
  );
}

function CreateTagPageContent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateTagFormData>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      order: 0,
      isActive: true,
    },
  });

  const watchedType = watch("type");

  const [createTag] = useMutation(CREATE_TAG, {
    onCompleted: () => {
      toast.success("Tag created successfully");
      router.push("/dashboard/tags");
    },
    onError: (error) => {
      toast.error(`Failed to create tag: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: CreateTagFormData) => {
    setIsSubmitting(true);
    
    const input: CreateTagInput = {
      name: data.name,
      display: data.display,
      type: data.type,
      ...(data.mainGenre && { mainGenre: data.mainGenre }),
      ...(data.color && { color: data.color }),
      ...(data.description && { description: data.description }),
      order: data.order,
      isActive: data.isActive,
    };

    try {
      await createTag({ variables: { createTagInput: input } });
    } catch {
      // Error handled by onError callback
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/tags");
  };

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
        <h1 className="text-3xl font-bold tracking-tight">Create New Tag</h1>
        <p className="text-muted-foreground">
          Add a new tag to the music classification system.
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Tag Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. deep_house"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Lowercase with underscores only (used in API)
                </p>
              </div>

              {/* Display Name */}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Tag Type *</Label>
                <Select
                  onValueChange={(value) => setValue("type", value as TagType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAG_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              {/* Main Genre (only for SUBGENRE) */}
              {watchedType === TagType.SUBGENRE && (
                <div className="space-y-2">
                  <Label htmlFor="mainGenre">Main Genre *</Label>
                  <Select
                    onValueChange={(value) => setValue("mainGenre", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select main genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {MAIN_GENRE_OPTIONS.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                {isSubmitting ? "Creating..." : "Create Tag"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}