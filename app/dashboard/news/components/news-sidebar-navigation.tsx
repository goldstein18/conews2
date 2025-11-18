'use client';

import { FileText, Image } from 'lucide-react';
import { CreationSidebarNavigation, StepConfig, PreviewCardData } from '@/app/dashboard/shared/components';
import type { NewsArticle } from '@/types/news';

interface NewsSidebarNavigationProps {
  currentStep: number;
  totalSteps: number;
  news?: NewsArticle | null;
  onStepClick?: (stepNumber: number) => void;
  canNavigateToStep?: (stepNumber: number) => boolean;
  className?: string;
  // Edit mode specific props
  isEditMode?: boolean;
  onUpdate?: () => void;
  updateLoading?: boolean;
  hasUnsavedChanges?: boolean;
  onStatusChange?: (newStatus: string) => void;
}

export function NewsSidebarNavigation({
  currentStep,
  totalSteps,
  news,
  onStepClick,
  canNavigateToStep,
  className,
  // Edit mode props
  isEditMode = false,
  onUpdate,
  updateLoading = false,
  hasUnsavedChanges = false,
  onStatusChange
}: NewsSidebarNavigationProps) {

  const steps: StepConfig[] = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Add title, content, type and categories',
      icon: FileText
    },
    {
      id: 2,
      title: 'Advanced Details',
      description: 'Upload hero image and add metadata',
      icon: Image
    }
  ];

  const getNewsImage = () => {
    if (!news) return undefined;

    // Follow the priority logic: heroImageUrl -> heroImage (S3 key)
    return news.heroImageUrl ||
           (news.heroImage && news.heroImage !== 'placeholder' ? news.heroImage : '') ||
           undefined;
  };

  const getNewsSubtitle = () => {
    if (!news) return undefined;

    const parts = [];
    if (news.articleType) {
      parts.push(news.articleType === 'EDITORIAL' ? 'Editorial' : 'Industry');
    }
    if (news.categories && news.categories.length > 0) {
      parts.push(news.categories.map(cat => cat.name).join(', '));
    }

    return parts.length > 0 ? parts.join(' • ') : 'No category set';
  };

  const getNewsStatus = () => {
    if (!news?.status) return 'draft';

    switch (news.status.toUpperCase()) {
      case 'APPROVED': return 'approved';
      case 'PENDING': return 'pending';
      case 'DECLINED': return 'rejected';
      case 'DRAFT':
      default: return 'draft';
    }
  };

  const previewCard: PreviewCardData = {
    title: news?.title || 'Untitled Article',
    subtitle: getNewsSubtitle(),
    status: getNewsStatus(),
    image: getNewsImage(),
    fallbackIcon: FileText,
    // Edit mode specific fields
    lastUpdated: news?.updatedAt ? new Date(news.updatedAt).toLocaleDateString() : undefined
  };

  return (
    <CreationSidebarNavigation
      currentStep={currentStep}
      totalSteps={totalSteps}
      steps={steps}
      previewCard={previewCard}
      backLink="/dashboard/news"
      backLinkText="Back to news"
      moduleName="Article"
      colorScheme={{
        primary: 'blue-500',
        secondary: 'blue-100',
        gradient: 'from-blue-100 to-indigo-100'
      }}
      onStepClick={onStepClick}
      canNavigateToStep={canNavigateToStep}
      className={className}
      // Edit mode props
      isEditMode={isEditMode}
      onUpdate={onUpdate}
      updateLoading={updateLoading}
      hasUnsavedChanges={hasUnsavedChanges}
      // Status toggle props
      currentStatus={news?.status}
      onStatusChange={onStatusChange}
      entityType="news article"
    />
  );
}
