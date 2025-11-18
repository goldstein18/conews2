import { NewsArticle } from "@/types/news";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
};

export const getNewsInfo = (article: NewsArticle) => {
  return {
    id: article.id,
    title: article.title,
    excerpt: article.body?.substring(0, 150), // Generate excerpt from body
    status: article.status,
    articleType: article.articleType,
    publishedAt: article.publishedAt,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
};

export const getTypeInfo = (article: NewsArticle) => {
  return {
    articleType: article.articleType,
    typeLabel: article.articleType.charAt(0).toUpperCase() + article.articleType.slice(1).toLowerCase(),
  };
};

export const getStatusInfo = (article: NewsArticle) => {
  const statusMap = {
    DRAFT: { label: 'Draft', color: 'yellow' },
    SCHEDULED: { label: 'Scheduled', color: 'blue' },
    PUBLISHED: { label: 'Published', color: 'green' },
  };

  return statusMap[article.status as keyof typeof statusMap] || statusMap.DRAFT;
};

export const getEngagementInfo = () => {
  // Engagement stats not yet available in API
  return {
    views: 0,
    likes: 0,
    shares: 0,
    comments: 0,
  };
};

export const getReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return readingTime;
};

export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncateContent = (content: string, maxLength: number = 150) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
};