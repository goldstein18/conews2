"use client";

import { Clock, Calendar, FileText, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EventsSummary } from "@/types/events";

interface EventsStatsProps {
  summary: EventsSummary;
  statsLoading: boolean;
  statsError: Error | null;
  selectedStatus: string;
  onStatusClick: (status: string) => void;
  onClearStatusFilter: () => void;
}

export function EventsStats({
  summary,
  statsLoading,
  statsError,
  selectedStatus,
  onStatusClick,
}: EventsStatsProps) {
  const statsCards = [
    {
      key: 'PENDING',
      label: 'Pending',
      value: summary.pendingEvents,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      hoverColor: 'hover:bg-yellow-100',
      selectedColor: 'ring-2 ring-yellow-500 bg-yellow-100',
    },
    {
      key: 'LIVE', 
      label: 'Running',
      value: summary.liveEvents,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
      selectedColor: 'ring-2 ring-green-500 bg-green-100',
    },
    {
      key: 'DRAFT',
      label: 'Draft',
      value: summary.draftEvents,
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      hoverColor: 'hover:bg-gray-100',
      selectedColor: 'ring-2 ring-gray-500 bg-gray-100',
    },
    {
      key: 'PAST',
      label: 'Past',
      value: summary.pastEvents,
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100',
      selectedColor: 'ring-2 ring-blue-500 bg-blue-100',
    },
  ];

  if (statsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card) => (
          <Card key={card.key} className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
            <div>
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="text-center py-4">
        <p className="text-destructive">Error loading event statistics: {statsError.message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedStatus === card.key;
        
        return (
          <Card 
            key={card.key}
            className={`p-6 cursor-pointer transition-all hover:shadow-md border ${
              isSelected 
                ? card.selectedColor
                : `${card.bgColor} ${card.borderColor} ${card.hoverColor}`
            }`}
            onClick={() => onStatusClick(card.key)}
          >
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                {card.label}
              </p>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                isSelected ? card.color : card.color
              }`}>
                {card.value}
              </p>
              <p className="text-xs text-muted-foreground">
                {card.value === 1 ? 'event' : 'events'}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}