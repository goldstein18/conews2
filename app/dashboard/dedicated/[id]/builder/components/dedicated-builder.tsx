'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { DedicatedSidebarNavigation } from './dedicated-sidebar-navigation';
import { DedicatedMobileNavigation } from './dedicated-mobile-navigation';
import { DedicatedPreviewPanel } from './dedicated-preview-panel';
import { DedicatedCampaignPanel } from './dedicated-campaign-panel';
import { useDedicatedBuilder } from '../hooks';
import type { Dedicated } from '@/types/dedicated';

interface DedicatedBuilderProps {
  dedicatedId: string;
  dedicated?: Dedicated | null;
}

export function DedicatedBuilder({ dedicatedId, dedicated }: DedicatedBuilderProps) {
  const [activeSection, setActiveSection] = useState('preview');

  // Initialize the builder data
  const { dedicated: dedicatedData, loading } = useDedicatedBuilder({
    dedicatedId,
    dedicated
  });

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderSectionContent = () => {
    if (!dedicatedData) {
      return (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No dedicated data available</p>
        </Card>
      );
    }

    switch (activeSection) {
      case 'preview':
        return <DedicatedPreviewPanel dedicated={dedicatedData} />;
      case 'campaign':
        return <DedicatedCampaignPanel dedicated={dedicatedData} />;
      default:
        return <DedicatedPreviewPanel dedicated={dedicatedData} />;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'preview':
        return 'Email Preview';
      case 'campaign':
        return 'Campaign Management';
      default:
        return 'Email Preview';
    }
  };

  const getSectionDescription = () => {
    switch (activeSection) {
      case 'preview':
        return 'Preview how your dedicated campaign will appear to recipients';
      case 'campaign':
        return 'Create and send your campaign to Brevo subscribers';
      default:
        return 'Preview your dedicated campaign';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dedicated builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full flex flex-col">
      {/* Mobile Navigation */}
      <DedicatedMobileNavigation
        currentSection={activeSection}
        dedicated={dedicatedData}
      />

      {/* Split-screen layout */}
      <div className="flex-1 flex">
        {/* Sidebar - Desktop only */}
        <div className="hidden lg:block">
          <DedicatedSidebarNavigation
            currentSection={activeSection}
            dedicated={dedicatedData}
            onSectionClick={handleSectionChange}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {/* Mobile Section Header */}
            <div className="lg:hidden p-4 bg-white border-b sticky top-0 z-10">
              <h2 className="font-semibold">{getSectionTitle()}</h2>
              <p className="text-sm text-muted-foreground">{getSectionDescription()}</p>
            </div>

            {/* Section Content */}
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
