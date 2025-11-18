"use client";

import React, { useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EscoopStatus } from '@/types/escoops';
import { STATUS_OPTIONS, MARKET_OPTIONS } from '../lib/validations';
import { useDebouncedSearch } from '../hooks/use-escoops-filters';
import { cn } from '@/lib/utils';

interface EscoopFiltersProps {
  // Filter values
  search: string;
  status: EscoopStatus | 'ALL';
  market: string;
  sent: boolean | 'ALL';

  // Filter setters
  onSearchChange: (search: string) => void;
  onStatusChange: (status: EscoopStatus | 'ALL') => void;
  onMarketChange: (market: string) => void;
  onSentChange: (sent: boolean | 'ALL') => void;

  // Actions
  onClearFilters: () => void;

  // UI props
  className?: string;
  showAdvanced?: boolean;
  compact?: boolean;
}

// Sent status options
const sentOptions = [
  { value: 'ALL', label: 'All', color: 'bg-gray-100 text-gray-800' },
  { value: 'true', label: 'Sent', color: 'bg-green-100 text-green-800' },
  { value: 'false', label: 'Not Sent', color: 'bg-blue-100 text-blue-800' }
];

export function EscoopFilters({
  search,
  status,
  market,
  sent,
  onSearchChange,
  onStatusChange,
  onMarketChange,
  onSentChange,
  onClearFilters,
  className,
  showAdvanced = true,
  compact = false
}: EscoopFiltersProps) {
  // Debounced search handling
  const [debouncedSearch, setDebouncedSearch] = useDebouncedSearch(search, 300);

  // Update search when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, search, onSearchChange]);

  // Count active filters
  const activeFilterCount = [
    search.trim() && 'search',
    status !== 'ALL' && 'status',
    market && 'market',
    sent !== 'ALL' && 'sent'
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  // Get status badge color
  const getStatusColor = (statusValue: string) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === statusValue);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  // Get sent badge color
  const getSentColor = (sentValue: boolean | 'ALL') => {
    const stringValue = sentValue === 'ALL' ? 'ALL' : sentValue.toString();
    const option = sentOptions.find(opt => opt.value === stringValue);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search escoops..."
            value={debouncedSearch}
            onChange={(e) => setDebouncedSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {showAdvanced && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="h-4 w-4" />
                {hasActiveFilters && (
                  <Badge
                    variant="secondary"
                    className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <AdvancedFilters
                status={status}
                market={market}
                sent={sent}
                onStatusChange={onStatusChange}
                onMarketChange={onMarketChange}
                onSentChange={onSentChange}
                onClearFilters={onClearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and primary filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search escoops by name or title..."
            value={debouncedSearch}
            onChange={(e) => setDebouncedSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick status filter */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      option.color.replace('bg-', 'bg-').replace('text-', 'bg-').split(' ')[0]
                    )}
                  />
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Advanced filters and active filter display */}
      {showAdvanced && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Market filter */}
            <Select value={market || 'ALL_MARKETS'} onValueChange={(value) => {
              onMarketChange(value === 'ALL_MARKETS' ? '' : value);
            }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_MARKETS">All Markets</SelectItem>
                {MARKET_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sent filter */}
            <Select
              value={sent === 'ALL' ? 'ALL' : sent.toString()}
              onValueChange={(value: string) => {
                if (value === 'ALL') {
                  onSentChange('ALL');
                } else {
                  onSentChange(value === 'true');
                }
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {sentOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active filters and clear button */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              <div className="flex flex-wrap gap-1">
                {search.trim() && (
                  <Badge variant="secondary" className="text-xs">
                    Search: {search.slice(0, 10)}...
                  </Badge>
                )}
                {status !== 'ALL' && (
                  <Badge variant="secondary" className={cn("text-xs", getStatusColor(status))}>
                    {STATUS_OPTIONS.find(opt => opt.value === status)?.label}
                  </Badge>
                )}
                {market && (
                  <Badge variant="secondary" className="text-xs">
                    {MARKET_OPTIONS.find(opt => opt.value === market)?.label}
                  </Badge>
                )}
                {sent !== 'ALL' && (
                  <Badge variant="secondary" className={cn("text-xs", getSentColor(sent))}>
                    {sentOptions.find(opt => opt.value === sent.toString())?.label}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-6 px-2 text-xs"
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Advanced filters component for popover
function AdvancedFilters({
  status,
  market,
  sent,
  onStatusChange,
  onMarketChange,
  onSentChange,
  onClearFilters,
  hasActiveFilters
}: {
  status: EscoopStatus | 'ALL';
  market: string;
  sent: boolean | 'ALL';
  onStatusChange: (status: EscoopStatus | 'ALL') => void;
  onMarketChange: (market: string) => void;
  onSentChange: (sent: boolean | 'ALL') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Filters</Label>
        <Separator />
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Market</Label>
          <Select value={market || 'ALL_MARKETS'} onValueChange={(value) => {
            onMarketChange(value === 'ALL_MARKETS' ? '' : value);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="All Markets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_MARKETS">All Markets</SelectItem>
              {MARKET_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Send Status</Label>
          <Select
            value={sent === 'ALL' ? 'ALL' : sent.toString()}
            onValueChange={(value: string) => {
              if (value === 'ALL') {
                onSentChange('ALL');
              } else {
                onSentChange(value === 'true');
              }
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sentOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}