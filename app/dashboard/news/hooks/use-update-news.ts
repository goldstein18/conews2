import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { UPDATE_NEWS_ARTICLE, LIST_NEWS_ARTICLES, GET_NEWS_DETAIL } from "@/lib/graphql/news";
import { CreateNewsFormData } from "../lib/validations";
import { UpdateNewsInput, NewsType } from "@/types/news";
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils";

export function useUpdateNews(newsId: string) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [updateNewsMutation] = useMutation(UPDATE_NEWS_ARTICLE, {
    // Refetch news list and news details after updating
    refetchQueries: [
      {
        query: LIST_NEWS_ARTICLES,
        variables: {
          filter: {}
        }
      },
      {
        query: GET_NEWS_DETAIL,
        variables: { id: newsId }
      }
    ],
    awaitRefetchQueries: true,
  });

  const updateNews = async (formData: CreateNewsFormData) => {
    setIsLoading(true);

    try {
      // Transform form data to match API expectations
      const input: UpdateNewsInput = {
        id: newsId,
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

      const result = await updateNewsMutation({
        variables: {
          updateNewsInput: input,
        },
      });

      if (result.data?.updateNews) {
        showSuccessToast("News article updated successfully!");

        // Use a small delay to ensure mutations and refetches complete
        // before navigating to prevent AbortError
        setTimeout(() => {
          router.replace(`/dashboard/news/${newsId}`);
        }, 100);
      }
    } catch (error: unknown) {
      console.error('Update news error:', error);
      let errorMessage = 'Failed to update news article';

      if (error && typeof error === 'object') {
        const err = error as { graphQLErrors?: Array<{ message: string }>; message?: string };
        errorMessage = err.graphQLErrors?.[0]?.message || err.message || errorMessage;
      }

      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateNews,
    isLoading,
  };
}