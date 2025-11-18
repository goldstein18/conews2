"use client";

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ArtsGroupStatus } from '@/types/arts-groups';
import { ART_TYPE_OPTIONS, MARKET_OPTIONS } from '../lib/validations';

interface ArtsGroupsFiltersProps {
  searchTerm: string;
  status: ArtsGroupStatus | 'ALL';
  market: string;
  artType: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ArtsGroupStatus | 'ALL') => void;
  onMarketChange: (value: string) => void;
  onArtTypeChange: (value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function ArtsGroupsFilters({
  searchTerm,
  status,
  market,
  artType,
  onSearchChange,
  onStatusChange,
  onMarketChange,
  onArtTypeChange,
  onReset,
  hasActiveFilters
}: ArtsGroupsFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search arts groups..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Status Filter */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value={ArtsGroupStatus.APPROVED}>Approved</SelectItem>
            <SelectItem value={ArtsGroupStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={ArtsGroupStatus.DECLINED}>Declined</SelectItem>
          </SelectContent>
        </Select>

        {/* Market Filter */}
        <Select value={market || 'all'} onValueChange={onMarketChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Market" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Markets</SelectItem>
            {MARKET_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Art Type Filter */}
        <Select value={artType || 'all'} onValueChange={onArtTypeChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Art Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {ART_TYPE_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
