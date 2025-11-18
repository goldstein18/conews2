import { gql } from '@apollo/client';

export const LIST_NEWS_ARTICLES = gql`
  query ListNewsArticles($filter: NewsFilterInput) {
    news(filter: $filter) {
      id
      title
      slug
      body
      heroImage
      heroImageUrl
      heroImageAlt
      authorName
      articleType
      status
      publishedMarkets
      publishedAt
      featuredUntil
      videoUrl
      metaTitle
      metaDescription
      createdAt
      updatedAt
      categories {
        id
        name
        slug
        description
      }
      tags {
        id
        name
        display
      }
    }
  }
`;

export const GET_NEWS_DETAIL = gql`
  query GetNewsDetail($id: ID!) {
    newsById(id: $id) {
      id
      title
      slug
      body
      heroImage
      heroImageUrl
      heroImageAlt
      authorName
      articleType
      status
      publishedMarkets
      publishedAt
      featuredUntil
      videoUrl
      metaTitle
      metaDescription
      declinedReason
      createdAt
      updatedAt
      categories {
        id
        name
        slug
        description
      }
      tags {
        id
        name
        display
        color
      }
    }
  }
`;

export const GET_NEWS_BY_SLUG = gql`
  query GetNewsBySlug($slug: String!) {
    newsBySlug(slug: $slug) {
      id
      title
      slug
      body
      heroImageUrl
      heroImageAlt
      authorName
      articleType
      publishedMarkets
      publishedAt
      videoUrl
      metaTitle
      metaDescription
      createdAt
      categories {
        name
        slug
      }
      tags {
        name
      }
    }
  }
`;

export const CREATE_NEWS_ARTICLE = gql`
  mutation CreateNewsArticle($createNewsInput: CreateNewsInput!) {
    createNews(createNewsInput: $createNewsInput) {
      id
      title
      slug
      body
      heroImage
      heroImageUrl
      heroImageAlt
      authorName
      articleType
      status
      publishedMarkets
      publishedAt
      featuredUntil
      videoUrl
      metaTitle
      metaDescription
      createdAt
      updatedAt
      categories {
        id
        name
        slug
      }
      tags {
        id
        name
        display
      }
    }
  }
`;

export const UPDATE_NEWS_ARTICLE = gql`
  mutation UpdateNewsArticle($updateNewsInput: UpdateNewsInput!) {
    updateNews(updateNewsInput: $updateNewsInput) {
      id
      title
      slug
      body
      heroImage
      heroImageUrl
      heroImageAlt
      authorName
      articleType
      status
      publishedMarkets
      publishedAt
      featuredUntil
      videoUrl
      metaTitle
      metaDescription
      updatedAt
      categories {
        id
        name
        slug
      }
      tags {
        id
        name
        display
      }
    }
  }
`;

export const DELETE_NEWS_ARTICLE = gql`
  mutation DeleteNewsArticle($id: ID!) {
    removeNews(id: $id) {
      id
      status
    }
  }
`;

export const GET_NEWS_CATEGORIES = gql`
  query GetNewsCategories {
    postCategories {
      id
      name
      slug
      description
      order
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACTIVE_NEWS_CATEGORIES = gql`
  query GetActiveNewsCategories {
    activePostCategories {
      id
      name
      slug
    }
  }
`;

export const UPDATE_NEWS_STATUS = gql`
  mutation UpdateNewsStatus($updateNewsStatusInput: UpdateNewsStatusInput!) {
    updateNewsStatus(updateNewsStatusInput: $updateNewsStatusInput) {
      id
      status
      declinedReason
    }
  }
`;

// Note: News uses the global tags system from /lib/graphql/tags.ts

// Note: Comments, engagement stats, and other extended functionality
// are not yet implemented in the API

// Placeholder queries for comments (not yet implemented in API)
export const GET_NEWS_COMMENTS = gql`
  query GetNewsComments($newsId: ID!) {
    newsComments(newsId: $newsId) {
      id
      content
      createdAt
    }
  }
`;

export const ADD_NEWS_COMMENT = gql`
  mutation AddNewsComment($newsId: ID!, $content: String!) {
    addNewsComment(newsId: $newsId, content: $content) {
      id
      content
      createdAt
    }
  }
`;

export const DELETE_NEWS_COMMENT = gql`
  mutation DeleteNewsComment($commentId: ID!) {
    deleteNewsComment(commentId: $commentId) {
      id
    }
  }
`;

// Placeholder query for engagement stats (not yet implemented in API)
export const GET_NEWS_ENGAGEMENT_STATS = gql`
  query GetNewsEngagementStats($newsId: ID!, $timeRange: String = "month") {
    newsEngagementStats(newsId: $newsId, timeRange: $timeRange) {
      views
      likes
      shares
      comments
      readTime
      bounceRate
      clickThroughRate
    }
  }
`;

// Image upload mutations for news
export const GENERATE_NEWS_IMAGE_UPLOAD_URL = gql`
  mutation GenerateHeroImageUploadUrl($generateHeroImageUploadUrlInput: GenerateHeroImageUploadUrlInput!) {
    generateHeroImageUploadUrl(generateHeroImageUploadUrlInput: $generateHeroImageUploadUrlInput) {
      uploadUrl
      key
      expiresIn
      maxFileSize
      recommendedDimensions
    }
  }
`;

// ==================== NEWS DRAFT OPERATIONS ====================

export const CREATE_NEWS_DRAFT = gql`
  mutation CreateNewsDraft($input: CreateNewsDraftInput!) {
    createNewsDraft(input: $input) {
      id
      draftTitle
      draftData
      version
      isAutoSave
      lastSaved
      createdAt
      author {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const UPDATE_NEWS_DRAFT = gql`
  mutation UpdateNewsDraft($input: UpdateNewsDraftInput!) {
    updateNewsDraft(input: $input) {
      id
      draftTitle
      draftData
      version
      isAutoSave
      lastSaved
      updatedAt
      author {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const GET_MY_NEWS_DRAFTS = gql`
  query GetMyNewsDrafts($limit: Int = 10, $cursor: String) {
    myNewsDrafts(limit: $limit, cursor: $cursor) {
      id
      draftTitle
      draftData
      version
      isAutoSave
      lastSaved
      createdAt
      updatedAt
      author {
        id
        firstName
        lastName
      }
      publishedNews {
        id
        title
        slug
        status
        publishedAt
      }
    }
  }
`;

export const GET_NEWS_DRAFT = gql`
  query GetNewsDraft($draftId: String!) {
    newsDraft(draftId: $draftId) {
      id
      draftTitle
      draftData
      version
      isAutoSave
      lastSaved
      createdAt
      updatedAt
      author {
        id
        firstName
        lastName
        email
      }
      publishedNews {
        id
        title
        slug
        status
        publishedAt
      }
    }
  }
`;

export const VALIDATE_DRAFT = gql`
  query ValidateDraft($draftId: String!) {
    validateDraft(draftId: $draftId) {
      isValid
      errors
      warnings
      missingRequiredFields
    }
  }
`;

export const PUBLISH_DRAFT = gql`
  mutation PublishDraft($input: PublishDraftInput!) {
    publishDraft(input: $input) {
      newsArticle {
        id
        title
        slug
        status
        publishedAt
        author {
          id
          firstName
          lastName
        }
      }
      validationResult {
        isValid
        errors
        warnings
        missingRequiredFields
      }
    }
  }
`;

export const DELETE_NEWS_DRAFT = gql`
  mutation DeleteDraft($draftId: String!) {
    deleteDraft(draftId: $draftId) {
      success
    }
  }
`;