import { CreateNewsFormData } from "../lib/validations";
import { NewsDetail } from "@/types/news";

/**
 * Transforms news API response data into form data format for editing
 */
export function transformNewsToFormData(news: NewsDetail): CreateNewsFormData {
  return {
    title: news.title,
    body: news.body,
    heroImage: news.heroImage,
    heroImageAlt: news.heroImageAlt,
    authorName: news.authorName,
    articleType: news.articleType,
    publishedMarkets: news.publishedMarkets,
    categoryIds: news.categories.map(cat => cat.id),
    tagIds: news.tags?.map(tag => tag.id) || [],
    publishedAt: news.publishedAt,
    featuredUntil: news.featuredUntil,
    videoUrl: news.videoUrl,
    metaTitle: news.metaTitle,
    metaDescription: news.metaDescription,
  };
}

/**
 * Helper to get initial form values - either default or transformed news data
 */
export function getInitialNewsFormValues(newsData?: NewsDetail): CreateNewsFormData {
  if (newsData) {
    return transformNewsToFormData(newsData);
  }

  // Return default values for create mode
  return {
    title: '',
    body: '',
    heroImage: undefined,
    heroImageAlt: '',
    authorName: '',
    articleType: 'EDITORIAL',
    publishedMarkets: ['miami'],
    categoryIds: [],
    tagIds: [],
    publishedAt: undefined,
    featuredUntil: undefined,
    videoUrl: '',
    metaTitle: '',
    metaDescription: '',
  };
}