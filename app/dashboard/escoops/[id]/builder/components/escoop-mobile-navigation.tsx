'use client';

import { ArrowLeft, Eye, Settings, Edit3, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Escoop } from '@/types/escoops';

interface EscoopMobileNavigationProps {
  currentSection: string;
  escoop?: Escoop | null;
  onBack?: () => void;
  className?: string;
}

export function EscoopMobileNavigation({
  currentSection,
  escoop,
  onBack,
  className
}: EscoopMobileNavigationProps) {

  const getSectionInfo = (section: string) => {
    switch (section) {
      case 'content-builder':
        return { title: 'Content Builder', icon: Edit3, step: 1 };
      case 'live-preview':
        return { title: 'Live Preview', icon: Eye, step: 2 };
      case 'escoop-settings':
        return { title: 'eScoop Settings', icon: Settings, step: 3 };
      case 'campaign-actions':
        return { title: 'Campaign Actions', icon: Send, step: 4 };
      default:
        return { title: 'Content Builder', icon: Edit3, step: 1 };
    }
  };

  const sectionInfo = getSectionInfo(currentSection);
  const progress = (sectionInfo.step / 4) * 100;

  const getEscoopStatus = () => {
    if (!escoop?.status) return 'draft';

    switch (escoop.status.toLowerCase()) {
      case 'published': return 'active';
      case 'scheduled': return 'pending';
      case 'draft':
      default: return 'draft';
    }
  };

  const getStatusVariant = () => {
    const status = getEscoopStatus();
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'draft':
      default: return 'outline';
    }
  };

  const getStatusLabel = () => {
    const status = getEscoopStatus();
    switch (status) {
      case 'active': return 'Published';
      case 'pending': return 'Scheduled';
      case 'draft':
      default: return 'Draft';
    }
  };

  return (
    <div className={`lg:hidden bg-white border-b border-gray-200 p-4 ${className}`}>
      {/* Top Row - Back link and progress */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {onBack ? (
            <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          ) : (
            <Link href="/dashboard/escoops" className="flex items-center">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <div className="text-sm text-muted-foreground">
            Step {sectionInfo.step} of 3
          </div>
        </div>
        <Badge variant={getStatusVariant()} className="text-xs">
          {getStatusLabel()}
        </Badge>
      </div>

      {/* Progress bar */}
      <Progress value={progress} className="h-1.5 mb-3" />

      {/* eScoop info and current section */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <sectionInfo.icon className="h-4 w-4 text-purple-500 flex-shrink-0" />
            <h2 className="text-sm font-medium text-gray-900 truncate">
              {sectionInfo.title}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {escoop?.title || 'eScoop Newsletter'}
          </p>
        </div>
      </div>
    </div>
  );
}