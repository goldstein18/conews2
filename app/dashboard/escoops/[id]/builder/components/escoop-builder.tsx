'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EscoopSidebarNavigation } from './escoop-sidebar-navigation';
import { EscoopMobileNavigation } from './escoop-mobile-navigation';
import { EscoopCreatorPanel } from './escoop-creator-panel';
import { EscoopPreviewPanel } from './escoop-preview-panel';
import { EscoopSettingsPanel } from './escoop-settings-panel';
import { EscoopCampaignPanel } from './escoop-campaign-panel';
import { useEscoopBuilder } from '../hooks';
import { useEscoopBuilderStore } from '@/store/escoop-builder-store';
import type { Escoop } from '@/types/escoops';

interface EscoopBuilderProps {
  escoopId: string;
  escoop?: Escoop | null;
}

export function EscoopBuilder({ escoopId, escoop }: EscoopBuilderProps) {
  const [activeSection, setActiveSection] = useState('content-builder');

  const { generatedHtml, isGeneratingPreview, generatePreviewHtml } = useEscoopBuilderStore();

  // Initialize the builder data
  const { isInitialized, entriesLoading } = useEscoopBuilder({
    escoopId,
    escoop
  });

  // Auto-generate preview when builder is initialized and no HTML exists
  useEffect(() => {
    if (isInitialized && !generatedHtml && !isGeneratingPreview) {
      console.log('🔄 Auto-generating initial preview...');
      generatePreviewHtml();
    }
  }, [isInitialized, generatedHtml, isGeneratingPreview, generatePreviewHtml]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'content-builder':
        return <EscoopCreatorPanel escoopId={escoopId} />;
      case 'live-preview':
        return (
          <div className="bg-gray-100 min-h-full">
            <EscoopPreviewPanel escoopId={escoopId} />
          </div>
        );
      case 'escoop-settings':
        return <EscoopSettingsPanel />;
      case 'campaign-actions':
        return <EscoopCampaignPanel escoopId={escoopId} />;
      default:
        return <EscoopCreatorPanel escoopId={escoopId} />;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'content-builder':
        return 'Content Builder';
      case 'live-preview':
        return 'Live Preview';
      case 'escoop-settings':
        return 'eScoop Settings';
      case 'campaign-actions':
        return 'Campaign Actions';
      default:
        return 'Content Builder';
    }
  };

  const getSectionDescription = () => {
    switch (activeSection) {
      case 'content-builder':
        return 'Build and customize your newsletter content';
      case 'live-preview':
        return 'Preview how your newsletter will look to recipients';
      case 'escoop-settings':
        return 'Configure newsletter settings and preferences';
      case 'campaign-actions':
        return 'Create and send your campaign to subscribers';
      default:
        return 'Build and customize your newsletter content';
    }
  };

  return (
    <div className="bg-gray-50 min-h-full flex flex-col">
      {/* Mobile Navigation */}
      <EscoopMobileNavigation
        currentSection={activeSection}
        escoop={escoop}
      />

      {/* Split-screen layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - Fixed position, hidden on mobile */}
        <EscoopSidebarNavigation
          currentSection={activeSection}
          escoop={escoop}
          onSectionClick={handleSectionChange}
        />

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          {/* Main Content Container */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              {/* Page Header - Only show on desktop */}
              <div className="hidden lg:block mb-6">
                <h1 className="text-2xl font-semibold tracking-tight mb-2">
                  {getSectionTitle()}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {getSectionDescription()}
                </p>
              </div>

              {/* Section Content */}
              {activeSection === 'content-builder' || activeSection === 'escoop-settings' || activeSection === 'campaign-actions' ? (
                <Card>
                  <CardContent className="p-6">
                    {renderSectionContent()}
                  </CardContent>
                </Card>
              ) : (
                <div className="bg-white rounded-lg border">
                  <div className="p-6">
                    {renderSectionContent()}
                  </div>
                </div>
              )}

              {/* Debug Info (remove in production) */}
              {process.env.NODE_ENV === 'development' && (
                <Card className="bg-gray-50 mt-6">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium mb-2">Debug Info</h3>
                    <div className="text-xs space-y-1 text-gray-600">
                      <div>Current Section: {activeSection}</div>
                      <div>eScoop ID: {escoopId}</div>
                      <div>eScoop Title: {escoop?.title || 'Not loaded'}</div>
                      <div>Builder Initialized: {isInitialized ? 'Yes' : 'No'}</div>
                      <div>Entries Loading: {entriesLoading ? 'Yes' : 'No'}</div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}