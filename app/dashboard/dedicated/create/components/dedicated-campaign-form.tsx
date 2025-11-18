'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { ImageIcon, Mail, Send, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { useImageUploadStore } from '@/store/image-upload-store';
import { Dedicated } from '@/types/dedicated';
import { useDedicatedActions, useDedicatedImageUpload } from '../../hooks';
import { useBrevoLists, useBrevoSegments } from '@/app/dashboard/escoops/[id]/builder/hooks/use-brevo-campaigns';
import { dedicatedCampaignSchema, DedicatedCampaignFormData, defaultDedicatedCampaignValues } from '../../lib/validations';
import { generateDedicatedHtmlContent } from '../../utils';
import type { BrevoList, BrevoSegment } from '@/app/dashboard/escoops/[id]/builder/hooks/use-brevo-campaigns';

interface DedicatedCampaignFormProps {
  dedicated: Dedicated;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
}

export function DedicatedCampaignForm({
  dedicated,
  onBack,
  loading = false,
  onLoadingStart
}: DedicatedCampaignFormProps) {
  const router = useRouter();
  const { updateDedicated, createDedicatedCampaign } = useDedicatedActions();
  const imageUploadStore = useImageUploadStore();
  const [campaignCreated, setCampaignCreated] = useState(false);

  // Brevo lists and segments
  const { lists, loading: listsLoading } = useBrevoLists();
  const { segments, loading: segmentsLoading } = useBrevoSegments();

  // Image upload configuration
  const {
    config: imageConfig,
    generatePresignedUrl,
    onUploadError
  } = useDedicatedImageUpload({
    dedicatedId: dedicated.id
  });

  const form = useForm<DedicatedCampaignFormData>({
    resolver: zodResolver(dedicatedCampaignSchema),
    defaultValues: {
      ...defaultDedicatedCampaignValues,
      image: dedicated.image || ''
    }
  });

  const watchedImage = form.watch('image');
  const watchedLists = form.watch('selectedBrevoLists');
  const watchedSegments = form.watch('selectedBrevoSegments');

  // Calculate total subscribers from selected lists
  const getTotalSubscribers = () => {
    if (!watchedLists || watchedLists.length === 0) return 0;
    return lists
      .filter((list: BrevoList) => watchedLists.includes(list.id))
      .reduce((total: number, list: BrevoList) => total + list.uniqueSubscribers, 0);
  };

  const handleImageUploadComplete = (imageKey: string) => {
    form.setValue('image', imageKey);
  };

  const handleSubmit = async (data: DedicatedCampaignFormData) => {
    try {
      if (onLoadingStart) {
        onLoadingStart();
      }

      // Step 1: Handle temporary image upload if needed
      let finalImageKey = data.image;
      if (data.image && imageUploadStore.isTemporaryImage(data.image)) {
        finalImageKey = await imageUploadStore.uploadPendingImage(
          data.image,
          generatePresignedUrl
        );
      }

      // Step 2: Update dedicated with real image S3 key
      const updatedDedicated = await updateDedicated({
        id: dedicated.id,
        image: finalImageKey
      });

      if (!updatedDedicated || !updatedDedicated.imageUrl) {
        throw new Error('Failed to update dedicated with image');
      }

      // Step 3: Generate HTML content for email
      const htmlContent = generateDedicatedHtmlContent({
        ...dedicated,
        image: finalImageKey,
        imageUrl: updatedDedicated.imageUrl
      });

      // Step 4: Create Brevo campaign
      const campaignResult = await createDedicatedCampaign({
        dedicatedId: dedicated.id,
        subject: dedicated.subject,
        htmlContent,
        listIds: data.selectedBrevoLists,
        segmentIds: data.selectedBrevoSegments,
        exclusionListIds: data.exclusionListIds,
        scheduledAt: dedicated.sendDate,
        sender: {
          name: 'CultureOwl',
          email: 'no-reply@cultureowl.com'
        }
      });

      if (campaignResult?.success) {
        setCampaignCreated(true);
        // Redirect to list after short delay
        setTimeout(() => {
          router.push('/dashboard/dedicated');
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      form.setError('root', {
        message: 'Failed to create campaign. Please try again.'
      });
    }
  };

  const isFormValid = () => {
    return (
      watchedImage &&
      watchedImage !== 'placeholder' &&
      watchedLists &&
      watchedLists.length > 0
    );
  };

  if (campaignCreated) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Campaign Created Successfully!</h3>
              <p className="text-sm text-muted-foreground">
                Your dedicated campaign has been created and scheduled.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to campaigns list...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Campaign Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Campaign Image
            </CardTitle>
            <CardDescription>
              Upload the image for your dedicated email campaign (700px width minimum)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormControl>
                    <ImageUploadAdvanced
                      config={imageConfig}
                      generatePresignedUrl={generatePresignedUrl}
                      onUploadComplete={handleImageUploadComplete}
                      onUploadError={onUploadError}
                      currentImageUrl={dedicated.imageUrl || undefined}
                      label="Dedicated Campaign Image"
                      description="Upload image (700px width minimum, any height). The image will be clickable in the email."
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Brevo Campaign Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Campaign Recipients
            </CardTitle>
            <CardDescription>
              Select Brevo lists and segments for your campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Brevo Lists */}
            <FormField
              control={form.control}
              name="selectedBrevoLists"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Brevo Lists *
                    </FormLabel>
                    <FormDescription>
                      Select at least one list to send the campaign to
                    </FormDescription>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4">
                    {listsLoading ? (
                      <p className="text-sm text-muted-foreground">Loading lists...</p>
                    ) : lists.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No lists available</p>
                    ) : (
                      lists.map((list: BrevoList) => (
                        <FormField
                          key={list.id}
                          control={form.control}
                          name="selectedBrevoLists"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(list.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    const newValue = checked
                                      ? [...currentValue, list.id]
                                      : currentValue.filter((id) => id !== list.id);
                                    field.onChange(newValue);
                                  }}
                                  disabled={loading}
                                />
                              </FormControl>
                              <div className="flex-1 leading-none">
                                <Label className="text-sm font-medium cursor-pointer">
                                  {list.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  {list.uniqueSubscribers.toLocaleString()} subscribers
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                      ))
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Brevo Segments (Optional) */}
            <FormField
              control={form.control}
              name="selectedBrevoSegments"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Brevo Segments (Optional)
                    </FormLabel>
                    <FormDescription>
                      Optionally select segments to further refine your audience
                    </FormDescription>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4">
                    {segmentsLoading ? (
                      <p className="text-sm text-muted-foreground">Loading segments...</p>
                    ) : segments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No segments available</p>
                    ) : (
                      segments.map((segment: BrevoSegment) => (
                        <FormField
                          key={segment.id}
                          control={form.control}
                          name="selectedBrevoSegments"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(segment.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    const newValue = checked
                                      ? [...currentValue, segment.id]
                                      : currentValue.filter((id) => id !== segment.id);
                                    field.onChange(newValue);
                                  }}
                                  disabled={loading}
                                />
                              </FormControl>
                              <div className="flex-1 leading-none">
                                <Label className="text-sm font-medium cursor-pointer">
                                  {segment.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  {segment.categoryName}
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                      ))
                    )}
                  </div>
                </FormItem>
              )}
            />

            <Separator />

            {/* Campaign Summary */}
            {isFormValid() && (
              <div className="rounded-lg border p-4 bg-muted space-y-2">
                <h4 className="font-medium">Campaign Summary</h4>
                <div className="text-sm space-y-1">
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Selected Lists:</span>
                    <span className="font-medium">{watchedLists?.length || 0}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Selected Segments:</span>
                    <span className="font-medium">{watchedSegments?.length || 0}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Total Subscribers:</span>
                    <span className="font-medium text-primary">{getTotalSubscribers().toLocaleString()}</span>
                  </p>
                </div>
              </div>
            )}

            {form.formState.errors.root && (
              <div className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
            Back to Step 1
          </Button>
          <Button type="submit" disabled={!isFormValid() || loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating Campaign...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Create & Schedule Campaign
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
