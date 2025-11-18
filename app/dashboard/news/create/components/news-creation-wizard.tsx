'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { NewsSidebarNavigation, NewsMobileNavigation } from '@/app/dashboard/news/components';
import { NewsArticle } from '@/types/news';
import { NewsBasicForm } from './news-basic-form';
import { NewsAdvancedForm } from './news-advanced-form';

interface NewsCreationWizardProps {
  onCancel: () => void;
}

export function NewsCreationWizard({ onCancel }: NewsCreationWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [createdNews, setCreatedNews] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 2;

  const handleStep1Start = () => {
    setIsLoading(true);
  };

  const handleStep1Complete = async (news: NewsArticle) => {
    console.log('✅ Step 1 completed, news created:', news);
    setCreatedNews(news);
    setCurrentStep(2);
    setIsLoading(false); // Reset loading after step completion
  };

  const handleStep2Start = () => {
    setIsLoading(true);
  };

  const handleStep2Complete = async () => {
    console.log('✅ Step 2 completed, navigating to news list');
    setIsLoading(true);
    router.push('/dashboard/news');
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  // Step navigation functions for sidebar
  const canNavigateToStep = (stepNumber: number): boolean => {
    // Allow navigation to step 1 always, step 2 only if news is created
    if (stepNumber === 1) return true;
    if (stepNumber === 2) return !!createdNews;
    return false;
  };

  const handleStepClick = (stepNumber: number) => {
    if (canNavigateToStep(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  return (
    <div className="bg-gray-50 min-h-full flex flex-col">
      {/* Mobile Navigation */}
      <NewsMobileNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        news={createdNews}
        onBack={currentStep > 1 ? handleBackToStep1 : undefined}
      />

      {/* Split-screen layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - Fixed position, hidden on mobile */}
        <NewsSidebarNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          news={createdNews}
          onStepClick={handleStepClick}
          canNavigateToStep={canNavigateToStep}
        />

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          {/* Main Content Container */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Page Header - Only show on desktop */}
              <div className="hidden lg:block mb-6">
                <h1 className="text-2xl font-semibold tracking-tight mb-2">Add New Article</h1>
                <p className="text-sm text-muted-foreground">
                  {currentStep === 1
                    ? 'Provide basic article information to get started'
                    : 'Add hero image and advanced details'
                  }
                </p>
              </div>

              {/* Form Content */}
              <Card>
                <CardContent className="p-6">
                  {currentStep === 1 && (
                    <NewsBasicForm
                      onSubmit={handleStep1Complete}
                      onCancel={onCancel}
                      loading={isLoading}
                      onLoadingStart={handleStep1Start}
                    />
                  )}

                  {currentStep === 2 && createdNews && (
                    <NewsAdvancedForm
                      news={createdNews}
                      onSubmit={handleStep2Complete}
                      onBack={handleBackToStep1}
                      loading={isLoading}
                      onLoadingStart={handleStep2Start}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
