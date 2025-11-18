"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { Upload, FolderOpen, Settings } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { showErrorToast, showSuccessToast } from "@/lib/toast-utils";
import { ImageUploadAdvanced } from "@/components/ui/image-upload-advanced";

import {
  createNewsSchema,
  CreateNewsFormData,
  defaultNewsFormData,
  TYPE_OPTIONS,
  MARKET_OPTIONS
} from "../lib/validations";
import { useCreateNews } from "../hooks/use-create-news";
import { useNewsCategories } from "../hooks/use-news-categories";
import { useNewsTags } from "../hooks/use-news-tags";
// import { useNewsDraft } from "../hooks/use-news-draft";
// import { NewsDraftsSidebar } from "./news-drafts-sidebar";
// import { AutoSaveIndicator } from "./auto-save-indicator";
import { GENERATE_NEWS_IMAGE_UPLOAD_URL } from "@/lib/graphql/news";
import { NewsType } from "@/types/news";

interface CreateNewsFormProps {
  onCancel: () => void;
  newsData?: Partial<CreateNewsFormData>;
  isEditing?: boolean;
}

export function CreateNewsForm({ 
  onCancel, 
  newsData, 
  isEditing = false
}: CreateNewsFormProps) {
  const [selectedType, setSelectedType] = useState<NewsType>(NewsType.EDITORIAL);
  // const [showDrafts, setShowDrafts] = useState(false);
  // const [isAutoSaving, setIsAutoSaving] = useState(false);
  // const [lastAutoSaved, setLastAutoSaved] = useState<Date | undefined>();
  const [generatePresignedUrl] = useMutation(GENERATE_NEWS_IMAGE_UPLOAD_URL);
  
  const { createNews, isLoading } = useCreateNews();
  const { categories, loading: categoriesLoading } = useNewsCategories({ activeOnly: true });
  const { tags, loading: tagsLoading } = useNewsTags();

  const form = useForm<CreateNewsFormData>({
    resolver: zodResolver(createNewsSchema),
    defaultValues: {
      ...defaultNewsFormData,
      ...newsData,
    },
    mode: "onChange",
  });

  // Draft functionality disabled - API doesn't support drafts yet
  // TODO: Implement draft system when backend is ready
  // const {
  //   saveAsDraft,
  //   loadDraft,
  //   deleteDraft,
  //   drafts,
  //   currentDraftId,
  //   autoSaveEnabled,
  //   setAutoSaveEnabled,
  // } = useNewsDraft({
  //   form,
  //   isEditing,
  //   onAutoSaveStart: () => setIsAutoSaving(true),
  //   onAutoSaveComplete: (date) => {
  //     setIsAutoSaving(false);
  //     setLastAutoSaved(date);
  //   }
  // });

  const watchType = form.watch("articleType");

  React.useEffect(() => {
    if (watchType && watchType !== selectedType) {
      setSelectedType(watchType as NewsType);
      // Clear categories when type changes
      form.setValue("categoryIds", []);
    }
  }, [watchType, selectedType, form]);

  const handleImageUploadComplete = (imageKey: string) => {
    form.setValue("heroImage", imageKey);
    showSuccessToast("Hero image uploaded successfully");
  };

  const handleImageUploadError = (error: string) => {
    showErrorToast(`Image upload failed: ${error}`);
  };

  const handleGeneratePresignedUrl = async (fileName: string, contentType: string, fileSize: number) => {
    try {
      const response = await generatePresignedUrl({
        variables: {
          generateNewsImageUploadUrlInput: {
            fileName,
            contentType,
            fileSize,
            imageType: 'hero'
          }
        }
      });
      return response.data.generateNewsImageUploadUrl;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw error;
    }
  };

  const onSubmit = async (data: CreateNewsFormData) => {
    console.log('Form onSubmit triggered with data:', data);
    console.log('Form validation state:', form.formState.errors);

    try {
      console.log('Calling createNews...');
      await createNews(data);
      console.log('createNews completed successfully');
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const activeCategories = categories.filter(cat => cat.isActive);
  const activeTags = tags.filter(tag => tag.isActive);

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Auto-save Indicator - DISABLED (draft system not supported by API) */}
            {/* {!isEditing && autoSaveEnabled && (
              <div className="flex justify-end">
                <AutoSaveIndicator
                  isAutoSaving={isAutoSaving}
                  lastSaved={lastAutoSaved}
                  autoSaveEnabled={autoSaveEnabled}
                />
              </div>
            )} */}

            <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Content & Media
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter article title..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A compelling title for your news article (5-200 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type */}
                <FormField
                  control={form.control}
                  name="articleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select article type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Editorial: Consumer-facing content | Industry: B2B content
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Published Markets */}
                <FormField
                  control={form.control}
                  name="publishedMarkets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Published Markets *</FormLabel>
                      <FormDescription>
                        Select the markets where this article will be published
                      </FormDescription>
                      <div className="grid grid-cols-2 gap-4">
                        {MARKET_OPTIONS.map((market) => (
                          <FormItem
                            key={market.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(market.value)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, market.value]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter((value: string) => value !== market.value)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {market.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Categories */}
                <FormField
                  control={form.control}
                  name="categoryIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories *</FormLabel>
                      <FormDescription>
                        Select 1-2 categories for this article
                      </FormDescription>
                      {categoriesLoading ? (
                        <div className="text-sm text-muted-foreground">Loading categories...</div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4 max-h-48 overflow-y-auto">
                          {activeCategories.map((category) => (
                            <FormItem
                              key={category.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(category.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked && field.value.length < 2) {
                                      field.onChange([...field.value, category.id]);
                                    } else if (!checked) {
                                      field.onChange(
                                        field.value?.filter((id: string) => id !== category.id)
                                      );
                                    }
                                  }}
                                  disabled={!field.value?.includes(category.id) && field.value.length >= 2}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal flex items-center gap-2">
                                {category.name}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tagIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormDescription>
                        Select up to 2 tags for this article (optional)
                      </FormDescription>
                      {tagsLoading ? (
                        <div className="text-sm text-muted-foreground">Loading tags...</div>
                      ) : (
                        <div className="grid grid-cols-3 gap-4 max-h-48 overflow-y-auto">
                          {activeTags.map((tag) => (
                            <FormItem
                              key={tag.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(tag.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked && (field.value?.length || 0) < 2) {
                                      field.onChange([...(field.value || []), tag.id]);
                                    } else if (!checked) {
                                      field.onChange(
                                        field.value?.filter((id: string) => id !== tag.id)
                                      );
                                    }
                                  }}
                                  disabled={!field.value?.includes(tag.id) && (field.value?.length || 0) >= 2}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal flex items-center gap-2">
                                {tag.color && (
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: tag.color }}
                                  />
                                )}
                                {tag.name}
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
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content & Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Content */}
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article Content *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your article content here..."
                          className="min-h-[300px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The main content of your article (minimum 50 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Hero Image */}
                <FormField
                  control={form.control}
                  name="heroImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Image *</FormLabel>
                      <FormControl>
                        <ImageUploadAdvanced
                          config={{
                            module: 'news',
                            minWidth: 1200,
                            minHeight: 628,
                            aspectRatio: 1200/628,
                            allowRotation: true,
                            allowZoom: true
                          }}
                          generatePresignedUrl={handleGeneratePresignedUrl}
                          onUploadComplete={handleImageUploadComplete}
                          onUploadError={handleImageUploadError}
                          currentImageUrl={field.value}
                          label="News Hero Image"
                          description="Upload a high-quality hero image (min 1200x628px)"
                        />
                      </FormControl>
                      <FormDescription>
                        The main image for your article. Recommended size: 1200x628 pixels
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Hero Image Alt Text */}
                <FormField
                  control={form.control}
                  name="heroImageAlt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hero Image Alt Text</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Describe the image for accessibility..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Alternative text for screen readers and SEO
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Video URL */}
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
                        />
                      </FormControl>
                      <FormDescription>
                        Embed a video from YouTube or Vimeo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Video Type - Not yet implemented in API */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Author Name */}
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
                        />
                      </FormControl>
                      <FormDescription>
                        Optional byline for the article author
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Published At */}
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
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty to save as draft. Future dates will schedule the article.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* SEO Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">SEO Settings</h4>
                  
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
                          />
                        </FormControl>
                        <FormDescription>
                          Description that appears in search results (max 160 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 border-t">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>

                {/* Show Drafts button disabled - API doesn't support drafts yet */}
                {/* {!isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDrafts(!showDrafts)}
                    disabled={isLoading}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {showDrafts ? 'Hide' : 'Show'} Drafts
                  </Button>
                )} */}
              </div>
              
              <div className="flex gap-3">
                {/* Draft button disabled - API doesn't support drafts yet */}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {isEditing ? "Update Article" : "Create Article"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* Drafts Sidebar disabled - API doesn't support drafts yet */}
      {/* {!isEditing && showDrafts && (
        <NewsDraftsSidebar
          drafts={drafts}
          currentDraftId={currentDraftId}
          onLoadDraft={loadDraft}
          onDeleteDraft={deleteDraft}
          onSaveAsDraft={saveAsDraft}
          autoSaveEnabled={autoSaveEnabled}
          onToggleAutoSave={setAutoSaveEnabled}
          isLoading={isLoading}
        />
      )} */}
    </div>
  );
}