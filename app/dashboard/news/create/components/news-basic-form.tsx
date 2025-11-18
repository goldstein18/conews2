'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { NovelEditorField } from '@/components/ui/novel-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { ArrowRight } from 'lucide-react';
import { useCreateNews } from '../../hooks/use-create-news';
import { useNewsCategories } from '../../hooks/use-news-categories';
import {
  newsBasicSchema,
  NewsBasicFormData,
  defaultNewsBasicValues,
  ARTICLE_TYPE_OPTIONS,
  MARKET_OPTIONS
} from '../../lib/validations';
import { NewsArticle } from '@/types/news';

interface NewsBasicFormProps {
  onSubmit: (news: NewsArticle) => void;
  onCancel: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
}

export function NewsBasicForm({
  onSubmit,
  onCancel,
  loading = false,
  onLoadingStart
}: NewsBasicFormProps) {
  const { createNews, isLoading: createLoading } = useCreateNews();
  const { categories, loading: categoriesLoading } = useNewsCategories();

  const form = useForm<NewsBasicFormData>({
    resolver: zodResolver(newsBasicSchema),
    defaultValues: defaultNewsBasicValues
  });

  const activeCategories = categories.filter(cat => cat.isActive);

  const handleSubmit = async (data: NewsBasicFormData) => {
    try {
      if (onLoadingStart) {
        onLoadingStart();
      }

      console.log('🔄 Creating news with basic data:', data);

      // Create news article with basic fields + placeholder image
      const result = await createNews({
        ...data,
        heroImage: 'placeholder', // Placeholder will be replaced in Step 2
      });

      if (result) {
        console.log('✅ News created successfully:', result);
        onSubmit(result);
      }
    } catch (error) {
      console.error('❌ Error creating news:', error);
      throw error;
    }
  };

  const isSubmitting = loading || createLoading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Article Details */}
        <Card>
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
            <CardDescription>
              Provide the essential information for your news article
            </CardDescription>
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
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    A compelling title for your news article (5-200 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Article Type */}
            <FormField
              control={form.control}
              name="articleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select article type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ARTICLE_TYPE_OPTIONS.map((option) => (
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

            {/* Body/Content */}
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <NovelEditorField
                  field={field}
                  label="Article Content *"
                  description="Write your article content with rich formatting (text, images, links, etc.)"
                  placeholder="Start writing your article content here..."
                  disabled={isSubmitting}
                  minHeight="400px"
                />
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
                    <div className="grid grid-cols-2 gap-4 max-h-48 overflow-y-auto border rounded-md p-4">
                      {activeCategories.map((category) => (
                        <FormItem
                          key={category.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(category.id)}
                              disabled={isSubmitting}
                              onCheckedChange={(checked) => {
                                if (checked && field.value.length < 2) {
                                  field.onChange([...field.value, category.id]);
                                } else if (!checked) {
                                  field.onChange(
                                    field.value?.filter((value) => value !== category.id)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
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
                            disabled={isSubmitting}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, market.value]);
                              } else {
                                field.onChange(
                                  field.value?.filter((value) => value !== market.value)
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {market.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[180px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating Article...
              </>
            ) : (
              <>
                Continue to Step 2
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
