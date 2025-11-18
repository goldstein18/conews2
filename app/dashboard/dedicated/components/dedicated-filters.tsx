'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { STATUS_OPTIONS, MARKET_OPTIONS } from '../lib/validations';

interface DedicatedFiltersProps {
  searchTerm: string;
  status: string;
  market: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onMarketChange: (value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function DedicatedFilters({
  searchTerm,
  status,
  market,
  onSearchChange,
  onStatusChange,
  onMarketChange,
  onReset,
  hasActiveFilters
}: DedicatedFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search and Filters Row */}
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Market Filter */}
            <Select value={market || 'all'} onValueChange={onMarketChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Markets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                {MARKET_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchTerm}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => onSearchChange('')}
                  />
                </Badge>
              )}
              {status !== 'ALL' && (
                <Badge variant="secondary" className="gap-1">
                  Status: {STATUS_OPTIONS.find(opt => opt.value === status)?.label}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => onStatusChange('ALL')}
                  />
                </Badge>
              )}
              {market && market !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Market: {MARKET_OPTIONS.find(opt => opt.value === market)?.label}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => onMarketChange('all')}
                  />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
