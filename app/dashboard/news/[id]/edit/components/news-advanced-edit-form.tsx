'use client';

import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, Image as ImageIcon, Tag, Calendar, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { NewsArticle } from '@/types/news';
import { useNewsImageUpload } from '../../../hooks/use-news-image-upload';
import { useNewsTags } from '../../../hooks/use-news-tags';
import { useImageUploadStore } from '@/store/image-upload-store';
import {
  newsAdvancedSchema,
  NewsAdvancedFormData
} from '../../../lib/validations';

export interface NewsAdvancedEditFormRef {
  submitForm: () => void;
}

interface NewsAdvancedEditFormProps {
  news: NewsArticle;
  formData?: Record<string, unknown>;
  onSubmit: (data: NewsAdvancedFormData) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
  onFormChange?: () => void;
}

export const NewsAdvancedEditForm = forwardRef<NewsAdvancedEditFormRef, NewsAdvancedEditFormProps>(
  ({ news, formData, onSubmit, onBack, loading = false, onFormChange }, ref) => {
    const imageUploadStore = useImageUploadStore();
    const { tags, loading: tagsLoading } = useNewsTags();

    const [contentMediaOpen, setContentMediaOpen] = useState(false);
    const [categorizationOpen, setCategorizationOpen] = useState(false);
    const [seoSettingsOpen, setSeoSettingsOpen] = useState(false);

    const form = useForm<NewsAdvancedFormData>({
      resolver: zodResolver(newsAdvancedSchema),
      defaultValues: {
        heroImage: news.heroImage || '',
        heroImageAlt: news.heroImageAlt || '',
        authorName: news.authorName || '',
        tagIds: news.tags?.map(t => t.id) || [],
        videoUrl: news.videoUrl || '',
        publishedAt: news.publishedAt || undefined,
        featuredUntil: news.featuredUntil || undefined,
        metaTitle: news.metaTitle || '',
        metaDescription: news.metaDescription || ''
      }
    });

    const {
      config,
      generatePresignedUrl,
      handleUploadComplete,
      handleUploadError
    } = useNewsImageUpload({
      newsId: news.id,
      onUploadComplete: (imageKey) => {
        form.setValue('heroImage', imageKey);
      }
    });

    // Expose submitForm method to parent via ref
    useImperativeHandle(ref, () => ({
      submitForm: () => {
        form.handleSubmit(handleSubmit)();
      }
    }));

    // Track form changes
    useEffect(() => {
      const subscription = form.watch(() => {
        onFormChange?.();
      });
      return () => subscription.unsubscribe();
    }, [form, onFormChange]);

    const activeTags = tags.filter(tag => tag.isActive);

    const handleSubmit = async (data: NewsAdvancedFormData) => {
      try {
        console.log('🔄 Updating news with advanced details:', data);

        // Merge with formData from Step 1 if available
        const fullData = { ...formData, ...data };

        // Handle temporary image upload FIRST
        let finalImageKey = data.heroImage;
        if (data.heroImage && imageUploadStore.isTemporaryImage(data.heroImage)) {
          console.log('📤 Uploading temporary image to S3...');
          try {
            finalImageKey = await imageUploadStore.uploadPendingImage(data.heroImage, generatePresignedUrl);
            console.log('✅ Temporary image uploaded to S3:', finalImageKey);
          } catch (uploadError) {
            console.error('❌ Failed to upload image to S3:', uploadError);
            throw new Error('Failed to upload image. Please try again.');
          }
        }

        await onSubmit({ ...fullData, heroImage: finalImageKey } as NewsAdvancedFormData);
      } catch (error) {
        console.error('❌ Error updating news:', error);
        throw error;
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

          {/* Hero Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Hero Image</span>
              </CardTitle>
              <CardDescription>
                Upload or update the hero image for this article
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="heroImage"
                render={({ field }) => (
                  <FormItem>
                    <ImageUploadAdvanced
                      config={config}
                      generatePresignedUrl={generatePresignedUrl}
                      onUploadComplete={handleUploadComplete}
                      onUploadError={handleUploadError}
                      currentImageUrl={news.heroImageUrl || field.value}
                      disabled={loading}
                      label="News Hero Image"
                      description={`Upload a high-quality hero image. Minimum size: ${config.minWidth}x${config.minHeight}px`}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroImageAlt"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Hero Image Alt Text</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Describe the image for accessibility..."
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>
                      Alternative text for screen readers and SEO
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Content & Media */}
          <Collapsible open={contentMediaOpen} onOpenChange={setContentMediaOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>Content & Media</span>
                    </div>
                    {contentMediaOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                  <CardDescription>
                    Author, video, and publication settings
                  </CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="authorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Writer Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="By John Doe"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional byline for the article author
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormDescription>
                          Embed a video from YouTube or Vimeo
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="publishedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publication Date</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : '')}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormDescription>
                          Set or update the publication date
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featuredUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Until</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : '')}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormDescription>
                          Set a date until which this article should be featured
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Categorization */}
          <Collapsible open={categorizationOpen} onOpenChange={setCategorizationOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Tag className="h-5 w-5" />
                      <span>Categorization</span>
                    </div>
                    {categorizationOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                  <CardDescription>
                    Add or update tags to help organize and discover content
                  </CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="tagIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (Optional)</FormLabel>
                        <FormDescription>
                          Select up to 2 tags for this article
                        </FormDescription>
                        {tagsLoading ? (
                          <div className="text-sm text-muted-foreground">Loading tags...</div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4 max-h-48 overflow-y-auto border rounded-md p-4">
                            {activeTags.map((tag) => (
                              <FormItem
                                key={tag.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(tag.id)}
                                    disabled={loading}
                                    onCheckedChange={(checked) => {
                                      const currentValue = field.value || [];
                                      if (checked && currentValue.length < 2) {
                                        field.onChange([...currentValue, tag.id]);
                                      } else if (!checked) {
                                        field.onChange(
                                          currentValue.filter((value) => value !== tag.id)
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {tag.display || tag.name}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* SEO Settings */}
          <Collapsible open={seoSettingsOpen} onOpenChange={setSeoSettingsOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <SettingsIcon className="h-5 w-5" />
                      <span>SEO Settings</span>
                    </div>
                    {seoSettingsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </CardTitle>
                  <CardDescription>
                    Optimize your article for search engines
                  </CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SEO-optimized title..."
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormDescription>
                          Title that appears in search results (max 70 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description for search results..."
                            className="min-h-[80px] resize-y"
                            {...field}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormDescription>
                          Description that appears in search results (max 160 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={loading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Step 1
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="min-w-[180px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Updating Article...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Update Article
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    );
  }
);

NewsAdvancedEditForm.displayName = 'NewsAdvancedEditForm';
