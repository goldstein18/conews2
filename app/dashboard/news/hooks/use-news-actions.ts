import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  UPDATE_NEWS_ARTICLE,
  LIST_NEWS_ARTICLES
} from '@/lib/graphql/news';
import { NewsArticle, UpdateNewsInput } from '@/types/news';
import { showErrorToast, showSuccessToast } from '@/lib/toast-utils';
import { getErrorMessage } from '@/lib/error-handler';

interface UseNewsActionsReturn {
  updateNews: (input: UpdateNewsInput) => Promise<NewsArticle | null>;
  loading: boolean;
  updateLoading: boolean;
}

export const useNewsActions = (): UseNewsActionsReturn => {
  const [loading, setLoading] = useState(false);

  const [updateNewsMutation, { loading: updateLoading }] = useMutation(UPDATE_NEWS_ARTICLE, {
    refetchQueries: [
      { query: LIST_NEWS_ARTICLES, variables: { filter: {} } }
    ],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error('Update news error:', error);
      showErrorToast(`Failed to update article: ${getErrorMessage(error)}`);
    }
  });

  const updateNews = async (input: UpdateNewsInput): Promise<NewsArticle | null> => {
    try {
      setLoading(true);
      const { data } = await updateNewsMutation({
        variables: { updateNewsInput: input }
      });

      if (data?.updateNews) {
        showSuccessToast('Article updated successfully');
        return data.updateNews;
      }

      showErrorToast('Failed to update article');
      return null;
    } catch (error) {
      console.error('Update news error:', error);
      showErrorToast(`Failed to update article: ${getErrorMessage(error)}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateNews,
    loading,
    updateLoading
  };
};
