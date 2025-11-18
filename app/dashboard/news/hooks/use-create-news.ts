import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_NEWS_ARTICLE, LIST_NEWS_ARTICLES } from "@/lib/graphql/news";
import { CreateNewsFormData } from "../lib/validations";
import { CreateNewsInput, NewsType } from "@/types/news";
import { showErrorToast, showSuccessToast } from "@/lib/toast-utils";

export function useCreateNews() {
  const [isLoading, setIsLoading] = useState(false);

  const [createNewsMutation] = useMutation(CREATE_NEWS_ARTICLE, {
    // Refetch news list after creating
    refetchQueries: [
      {
        query: LIST_NEWS_ARTICLES,
        variables: {
          filter: {}
        }
      }
    ],
    awaitRefetchQueries: true,
  });

  const createNews = async (formData: Partial<CreateNewsFormData>) => {
    setIsLoading(true);

    try {
      // Transform form data to match API expectations
      const input: Partial<CreateNewsInput> = {
        title: formData.title,
        body: formData.body,
        heroImage: formData.heroImage,
        heroImageAlt: formData.heroImageAlt,
        authorName: formData.authorName,
        articleType: formData.articleType as NewsType,
        publishedMarkets: formData.publishedMarkets,
        categoryIds: formData.categoryIds || [],
        tagIds: formData.tagIds,
        publishedAt: formData.publishedAt,
        featuredUntil: formData.featuredUntil,
        videoUrl: formData.videoUrl || undefined,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
      };

      const result = await createNewsMutation({
        variables: {
          createNewsInput: input,
        },
      });

      if (result.data?.createNews) {
        showSuccessToast("News article created successfully!");
        return result.data.createNews; // Return the created article
      }
    } catch (error: unknown) {
      console.error('Create news error:', error);
      let errorMessage = 'Failed to create news article';

      if (error && typeof error === 'object') {
        const err = error as { graphQLErrors?: Array<{ message: string }>; message?: string };
        errorMessage = err.graphQLErrors?.[0]?.message || err.message || errorMessage;
      }

      showErrorToast(errorMessage);
      throw error; // Re-throw to handle in form
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createNews,
    isLoading,
  };
}