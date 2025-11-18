'use client';

import { Eye, Settings, Edit3, Send } from 'lucide-react';
import { CreationSidebarNavigation, StepConfig, PreviewCardData } from '@/app/dashboard/shared/components';
import { useSaveEscoop } from '../hooks';
import { useEscoopBuilderStore } from '@/store/escoop-builder-store';
import type { Escoop } from '@/types/escoops';

interface EscoopSidebarNavigationProps {
  currentSection: string;
  escoop?: Escoop | null;
  onSectionClick?: (section: string) => void;
  className?: string;
}

export function EscoopSidebarNavigation({
  currentSection,
  escoop,
  onSectionClick,
  className
}: EscoopSidebarNavigationProps) {

  // Hook para crear/guardar escoop (detecta automáticamente si es update o create)
  const { saveEscoop, loading: saveLoading } = useSaveEscoop({
    escoopData: escoop ? {
      id: escoop.id,    // ✅ Incluir ID para UPDATE
      name: escoop.name,
      title: escoop.title,
      sendDate: escoop.sendDate,
      remaining: escoop.remaining,
      bannersRemaining: escoop.bannersRemaining,
      market: escoop.market,
      locations: escoop.locations || []
    } : {
      // Sin ID = CREATE
      name: 'New eScoop Newsletter',
      title: 'eScoop Newsletter',
      remaining: 5000,
      bannersRemaining: 3,
      market: 'miami',
      locations: ['downtown']
    }
  });

  const handleSave = async () => {
    // Debug: Verificar estado del store antes de guardar
    console.log('🔍 ANTES DE GUARDAR - Store State:');
    console.log('EscoopSidebarNavigation - selectedRestaurants from store:', useEscoopBuilderStore.getState().selectedRestaurants);
    console.log('EscoopSidebarNavigation - selectedFeaturedEvents from store:', useEscoopBuilderStore.getState().selectedFeaturedEvents);
    console.log('EscoopSidebarNavigation - settings from store:', useEscoopBuilderStore.getState().settings);

    const success = await saveEscoop();
    if (success) {
      console.log('eScoop saved successfully');
    }
  };

  const sections: StepConfig[] = [
    {
      id: 1,
      title: 'Content Builder',
      description: 'Build newsletter content, add events and editorial blocks',
      icon: Edit3
    },
    {
      id: 2,
      title: 'Live Preview',
      description: 'Preview your newsletter before sending',
      icon: Eye
    },
    {
      id: 3,
      title: 'eScoop Settings',
      description: 'Configure newsletter settings and preferences',
      icon: Settings
    },
    {
      id: 4,
      title: 'Campaign Actions',
      description: 'Create and send your campaign to subscribers',
      icon: Send
    }
  ];

  const getSectionNumber = (section: string): number => {
    switch (section) {
      case 'content-builder': return 1;
      case 'live-preview': return 2;
      case 'escoop-settings': return 3;
      case 'campaign-actions': return 4;
      default: return 1;
    }
  };

  const getSectionFromNumber = (stepNumber: number): string => {
    switch (stepNumber) {
      case 1: return 'content-builder';
      case 2: return 'live-preview';
      case 3: return 'escoop-settings';
      case 4: return 'campaign-actions';
      default: return 'content-builder';
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (onSectionClick) {
      const section = getSectionFromNumber(stepNumber);
      onSectionClick(section);
    }
  };

  const canNavigateToSection = (): boolean => {
    // Allow navigation to all sections
    return true;
  };

  const getEscoopSubtitle = () => {
    if (!escoop) return 'New eScoop Newsletter';

    const parts = [];

    // Add remaining count
    if (escoop.remaining !== undefined) {
      parts.push(`${escoop.remaining} remaining`);
    }

    // Add locations
    if (escoop.locations && escoop.locations.length > 0) {
      parts.push(escoop.locations.join(', '));
    }

    return parts.length > 0 ? parts.join(' • ') : 'Draft Newsletter';
  };

  const getFormattedSendDate = () => {
    if (!escoop?.sendDate) return null;

    try {
      const date = new Date(escoop.sendDate);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return null;
    }
  };

  const getEscoopStatus = (): 'draft' | 'active' | 'pending' | 'approved' | 'rejected' | 'scheduled' | 'sent' => {
    if (!escoop?.status) return 'draft';

    // Map escoop status to valid PreviewCardData status
    const statusMap: Record<string, 'draft' | 'active' | 'pending' | 'approved' | 'rejected' | 'scheduled' | 'sent'> = {
      'DRAFT': 'draft',
      'SCHEDULED': 'scheduled',
      'SENT': 'sent'
    };

    return statusMap[escoop.status] || 'draft';
  };

  const previewCard: PreviewCardData = {
    title: escoop?.name || 'eScoop Newsletter',
    subtitle: getEscoopSubtitle(),
    status: getEscoopStatus(),
    image: undefined, // Not showing image preview
    fallbackIcon: Edit3,
    companyName: undefined, // No company field in current schema
    lastUpdated: escoop?.updatedAt ? new Date(escoop.updatedAt).toLocaleDateString() : undefined,
    sendDate: getFormattedSendDate() || undefined
  };

  return (
    <CreationSidebarNavigation
      currentStep={getSectionNumber(currentSection)}
      totalSteps={4}
      steps={sections}
      previewCard={previewCard}
      backLink="/dashboard/escoops"
      backLinkText="Back to eScoops"
      moduleName="eScoop"
      colorScheme={{
        primary: 'purple-500',
        secondary: 'purple-100',
        gradient: 'from-purple-100 to-pink-100'
      }}
      onStepClick={handleStepClick}
      canNavigateToStep={canNavigateToSection}
      className={className}
      // Save functionality
      onSave={handleSave}
      saveLoading={saveLoading}
      canSave={!saveLoading}
    />
  );
}