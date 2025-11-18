'use client';

import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
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
import { useNewsCategories } from '../../../hooks/use-news-categories';
import {
  newsBasicSchema,
  NewsBasicFormData,
  ARTICLE_TYPE_OPTIONS,
  MARKET_OPTIONS
} from '../../../lib/validations';
import { NewsArticle } from '@/types/news';

export interface NewsBasicEditFormRef {
  submitForm: () => void;
}

interface NewsBasicEditFormProps {
  news: NewsArticle;
  onSubmit: (data: NewsBasicFormData) => Promise<void>;
  onNext: () => void;
  loading?: boolean;
  onDataChange?: (data: NewsBasicFormData) => void;
  onFormChange?: () => void;
}

export const NewsBasicEditForm = forwardRef<NewsBasicEditFormRef, NewsBasicEditFormProps>(
  ({ news, onSubmit, onNext, loading = false, onDataChange, onFormChange }, ref) => {
    const { categories, loading: categoriesLoading } = useNewsCategories();

    const form = useForm<NewsBasicFormData>({
      resolver: zodResolver(newsBasicSchema),
      defaultValues: {
        title: news.title || '',
        body: news.body || '',
        articleType: news.articleType || 'EDITORIAL',
        categoryIds: news.categories?.map(c => c.id) || [],
        publishedMarkets: news.publishedMarkets || []
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
      const subscription = form.watch((data) => {
        onFormChange?.();
        onDataChange?.(data as NewsBasicFormData);
      });
      return () => subscription.unsubscribe();
    }, [form, onFormChange, onDataChange]);

    const activeCategories = categories.filter(cat => cat.isActive);

    const handleSubmit = async (data: NewsBasicFormData) => {
      try {
        console.log('🔄 Updating news basic info:', data);
        await onSubmit(data);
      } catch (error) {
        console.error('❌ Error updating news:', error);
        throw error;
      }
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Article Details */}
          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
              <CardDescription>
                Update the essential information for your news article
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
                        disabled={loading}
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
                      disabled={loading}
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
                    disabled={loading}
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
                                disabled={loading}
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
                              disabled={loading}
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
              onClick={() => window.history.back()}
              disabled={loading}
            >
              Cancel
            </Button>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Article'
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onNext}
                disabled={loading}
              >
                Next to Step 2
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    );
  }
);

NewsBasicEditForm.displayName = 'NewsBasicEditForm';
