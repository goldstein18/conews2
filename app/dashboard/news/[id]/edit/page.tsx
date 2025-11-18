'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProtectedPage } from '@/components/protected-page';

import { NewsEditSkeleton } from '../../components';
import { NewsEditWizard } from './components';
import { useNewsDetail } from '../../hooks/use-news-detail';
import { useNewsActions } from '../../hooks/use-news-actions';
import type { CreateNewsFormData } from '../../lib/validations';
import { NewsType } from '@/types/news';

export default function EditNewsPage() {
  return (
    <ProtectedPage
      requiredRoles={['SUPER_ADMIN', 'ADMIN', 'EDITORIAL_WRITER']}
    >
      <EditNewsPageContent />
    </ProtectedPage>
  );
}

function EditNewsPageContent() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;

  const { updateNews, loading: updateLoading } = useNewsActions();
  const { news, loading: newsLoading, error } = useNewsDetail(newsId);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateNewsFormData) => {
    try {
      setIsSubmitting(true);

      // Helper function to convert empty strings to undefined
      const nullifyEmptyString = (value: string | undefined) => {
        return value && value.trim() !== '' ? value : undefined;
      };

      const updateInput = {
        id: newsId,
        title: data.title,
        body: data.body,
        articleType: data.articleType as NewsType,
        publishedMarkets: data.publishedMarkets,
        categoryIds: data.categoryIds,
        ...(data.tagIds && data.tagIds.length > 0 && { tagIds: data.tagIds }),
        ...(nullifyEmptyString(data.heroImage) && { heroImage: nullifyEmptyString(data.heroImage) }),
        ...(nullifyEmptyString(data.heroImageAlt) && { heroImageAlt: nullifyEmptyString(data.heroImageAlt) }),
        ...(nullifyEmptyString(data.authorName) && { authorName: nullifyEmptyString(data.authorName) }),
        ...(nullifyEmptyString(data.videoUrl) && { videoUrl: nullifyEmptyString(data.videoUrl) }),
        ...(nullifyEmptyString(data.metaTitle) && { metaTitle: nullifyEmptyString(data.metaTitle) }),
        ...(nullifyEmptyString(data.metaDescription) && { metaDescription: nullifyEmptyString(data.metaDescription) }),
        ...(data.publishedAt && { publishedAt: data.publishedAt }),
        ...(data.featuredUntil && { featuredUntil: data.featuredUntil })
      };

      console.log('🔧 Update input:', updateInput);

      await updateNews(updateInput);
      router.push('/dashboard/news');
    } catch (error) {
      console.error('❌ Update news error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (newsLoading) {
    return <NewsEditSkeleton />;
  }

  // Error state
  if (error || !news) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Error Loading Article</h1>
            <p className="text-sm text-muted-foreground">
              Unable to load the article for editing
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertDescription>
            {error?.message || 'The article could not be found or you do not have permission to edit it.'}
          </AlertDescription>
        </Alert>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <NewsEditWizard
      news={news}
      onSubmit={handleSubmit}
      loading={isSubmitting || updateLoading}
    />
  );
}
