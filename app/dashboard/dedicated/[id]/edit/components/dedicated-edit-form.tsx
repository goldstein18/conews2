'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Mail, Link as LinkIcon, Calendar, MapPin, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { useImageUploadStore } from '@/store/image-upload-store';
import { Dedicated } from '@/types/dedicated';
import { useDedicatedActions, useDedicatedImageUpload } from '../../../hooks';
import { dedicatedEditBasicSchema, DedicatedEditBasicFormData, MARKET_OPTIONS } from '../../../lib/validations';

interface DedicatedEditFormProps {
  dedicated: Dedicated;
}

export function DedicatedEditForm({ dedicated }: DedicatedEditFormProps) {
  const router = useRouter();
  const { updateDedicated } = useDedicatedActions();
  const imageUploadStore = useImageUploadStore();
  const [isLoading, setIsLoading] = React.useState(false);

  // Image upload configuration
  const {
    config: imageConfig,
    generatePresignedUrl,
    onUploadError
  } = useDedicatedImageUpload({
    dedicatedId: dedicated.id
  });

  const form = useForm<DedicatedEditBasicFormData>({
    resolver: zodResolver(dedicatedEditBasicSchema),
    defaultValues: {
      subject: dedicated.subject,
      alternateText: dedicated.alternateText,
      link: dedicated.link,
      sendDate: dedicated.sendDate,
      market: dedicated.market,
      image: dedicated.image || ''
    }
  });

  // Watch the image field to control what image to display
  const currentImageValue = form.watch('image');

  const handleSubmit = async (data: DedicatedEditBasicFormData) => {
    try {
      setIsLoading(true);

      // Handle temporary image upload if needed
      let finalImageKey = data.image;
      if (data.image && imageUploadStore.isTemporaryImage(data.image)) {
        finalImageKey = await imageUploadStore.uploadPendingImage(
          data.image,
          generatePresignedUrl
        );
      }

      // Update dedicated
      const updated = await updateDedicated({
        id: dedicated.id,
        subject: data.subject,
        alternateText: data.alternateText,
        link: data.link,
        sendDate: data.sendDate,
        market: data.market,
        ...(finalImageKey && finalImageKey !== 'placeholder' && { image: finalImageKey })
      });

      if (updated) {
        router.push('/dashboard/dedicated');
      }
    } catch (error) {
      console.error('Error updating dedicated:', error);
      form.setError('root', {
        message: 'Failed to update campaign. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/dedicated');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Email Campaign Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Campaign Details
            </CardTitle>
            <CardDescription>
              Update the basic details for your dedicated email campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Subject *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email subject line"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    The subject line that will appear in the recipient&apos;s inbox
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Alternate Text */}
            <FormField
              control={form.control}
              name="alternateText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Text *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter alternate text for the image"
                      className="resize-none"
                      rows={3}
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Descriptive text shown when images can&apos;t be displayed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Link */}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link URL *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        className="pl-9"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    URL where users will be directed when clicking the image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Send Date */}
            <FormField
              control={form.control}
              name="sendDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Date *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="datetime-local"
                        className="pl-9"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Schedule when this campaign should be sent
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Market */}
            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select market" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MARKET_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Campaign Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Campaign Image
            </CardTitle>
            <CardDescription>
              Update the image for your dedicated email campaign
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
                      onUploadComplete={(imageKey) => form.setValue('image', imageKey)}
                      onUploadError={onUploadError}
                      onRemove={() => form.setValue('image', '')}
                      currentImageUrl={
                        currentImageValue && currentImageValue !== '' && currentImageValue !== 'placeholder'
                          ? dedicated.imageUrl || undefined
                          : undefined
                      }
                      label="Dedicated Campaign Image"
                      description="Upload image (700px width minimum, any height). The image will be clickable in the email."
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {form.formState.errors.root && (
          <div className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Updating...
              </>
            ) : (
              'Update Campaign'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
