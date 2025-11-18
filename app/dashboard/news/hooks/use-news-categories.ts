import { useQuery } from "@apollo/client";
import { GET_NEWS_CATEGORIES, GET_ACTIVE_NEWS_CATEGORIES } from "@/lib/graphql/news";
import { NewsCategoriesResponse, ActiveNewsCategoriesResponse } from "@/types/news";

interface UseNewsCategoriesProps {
  activeOnly?: boolean;
}

export function useNewsCategories({ activeOnly = false }: UseNewsCategoriesProps = {}) {
  const { data, loading, error } = useQuery<NewsCategoriesResponse | ActiveNewsCategoriesResponse>(
    activeOnly ? GET_ACTIVE_NEWS_CATEGORIES : GET_NEWS_CATEGORIES,
    {
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    }
  );

  const categories = activeOnly
    ? (data as ActiveNewsCategoriesResponse)?.activePostCategories || []
    : (data as NewsCategoriesResponse)?.postCategories || [];

  return {
    categories,
    loading,
    error,
  };
}