'use client';

import Link from 'next/link';
import { ArrowLeft, Eye, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Dedicated } from '@/types/dedicated';

interface DedicatedMobileNavigationProps {
  currentSection: string;
  dedicated?: Dedicated | null;
}

export function DedicatedMobileNavigation({
  currentSection,
  dedicated
}: DedicatedMobileNavigationProps) {
  const getSectionIcon = () => {
    switch (currentSection) {
      case 'preview':
        return <Eye className="h-4 w-4" />;
      case 'campaign':
        return <Send className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getSectionTitle = () => {
    switch (currentSection) {
      case 'preview':
        return 'Email Preview';
      case 'campaign':
        return 'Campaign Management';
      default:
        return 'Email Preview';
    }
  };

  const getStatusBadge = () => {
    if (!dedicated?.status) return null;

    const statusColors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      SCHEDULED: 'bg-blue-100 text-blue-800',
      SENT: 'bg-green-100 text-green-800',
      DELETED: 'bg-red-100 text-red-800'
    };

    const color = statusColors[dedicated.status] || 'bg-gray-100 text-gray-800';

    return (
      <Badge className={color} variant="secondary">
        {dedicated.status}
      </Badge>
    );
  };

  return (
    <div className="lg:hidden">
      <Card className="rounded-none border-x-0 border-t-0">
        <div className="p-4 space-y-4">
          {/* Back button */}
          <Link href="/dashboard/dedicated">
            <Button variant="ghost" size="sm" className="pl-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dedicated
            </Button>
          </Link>

          {/* Dedicated Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-lg line-clamp-1">
                {dedicated?.subject || 'Dedicated Campaign'}
              </h1>
              {getStatusBadge()}
            </div>
            {dedicated?.market && (
              <p className="text-sm text-muted-foreground">
                Market: {dedicated.market.toUpperCase()}
              </p>
            )}
          </div>

          {/* Current Section */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {getSectionIcon()}
            <span>{getSectionTitle()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
