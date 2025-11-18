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
import { VenueStatus, VenuePriority } from '@/types/venues';
import { useDebouncedSearch } from '../hooks/use-venues-filters';
import { cn } from '@/lib/utils';

interface VenueFiltersProps {
  // Filter values
  search: string;
  status: VenueStatus | 'ALL';
  priority: VenuePriority | 'ALL';
  city: string;
  
  // Filter setters
  onSearchChange: (search: string) => void;
  onStatusChange: (status: VenueStatus | 'ALL') => void;
  onPriorityChange: (priority: VenuePriority | 'ALL') => void;
  onCityChange: (city: string) => void;
  
  // Actions
  onClearFilters: () => void;
  
  // UI props
  className?: string;
  showAdvanced?: boolean;
  compact?: boolean;
}

// Status options for the filter
const statusOptions = [
  { value: 'ALL', label: 'All Status', color: 'bg-gray-100 text-gray-800' },
  { value: 'APPROVED', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'PENDING', label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'PENDING_REVIEW', label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'SUSPENDED', label: 'Suspended', color: 'bg-orange-100 text-orange-800' }
];

// Priority options for the filter
const priorityOptions = [
  { value: 'ALL', label: 'All Priorities', color: 'bg-gray-100 text-gray-800' },
  { value: 'HIGH', label: 'High Priority', color: 'bg-red-100 text-red-800' },
  { value: 'MEDIUM', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'LOW', label: 'Low Priority', color: 'bg-green-100 text-green-800' }
];

export function VenueFilters({
  search,
  status,
  priority,
  city,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCityChange,
  onClearFilters,
  className,
  showAdvanced = true,
  compact = false
}: VenueFiltersProps) {
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
    priority !== 'ALL' && 'priority',
    city.trim() && 'city'
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  // Get status badge color
  const getStatusOption = (value: string) => 
    statusOptions.find(option => option.value === value) || statusOptions[0];

  const getPriorityOption = (value: string) => 
    priorityOptions.find(option => option.value === value) || priorityOptions[0];

  if (compact) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search venues..."
            value={debouncedSearch}
            onChange={(e) => setDebouncedSearch(e.target.value)}
            className="pl-9 pr-8"
          />
          {debouncedSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDebouncedSearch('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Advanced Filters Popover */}
        {showAdvanced && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <AdvancedFilters
                status={status}
                priority={priority}
                city={city}
                onStatusChange={onStatusChange}
                onPriorityChange={onPriorityChange}
                onCityChange={onCityChange}
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
      {/* Quick Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search venues by name, location, or client..."
            value={debouncedSearch}
            onChange={(e) => setDebouncedSearch(e.target.value)}
            className="pl-9 pr-8"
          />
          {debouncedSearch && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDebouncedSearch('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Status Filter */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center space-x-2">
                  <div className={cn("w-2 h-2 rounded-full", option.color.split(' ')[0])} />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center space-x-2">
                  <div className={cn("w-2 h-2 rounded-full", option.color.split(' ')[0])} />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters Row */}
      {showAdvanced && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* City Filter */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Input
                placeholder="Filter by city..."
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                className="pr-8"
              />
              {city && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCityChange('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {search.trim() && (
            <FilterBadge
              label={`Search: "${search}"`}
              onRemove={() => setDebouncedSearch('')}
            />
          )}
          
          {status !== 'ALL' && (
            <FilterBadge
              label={`Status: ${getStatusOption(status).label}`}
              onRemove={() => onStatusChange('ALL')}
            />
          )}
          
          {priority !== 'ALL' && (
            <FilterBadge
              label={`Priority: ${getPriorityOption(priority).label}`}
              onRemove={() => onPriorityChange('ALL')}
            />
          )}
          
          {city.trim() && (
            <FilterBadge
              label={`City: ${city}`}
              onRemove={() => onCityChange('')}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Advanced Filters Component for Popover
function AdvancedFilters({
  status,
  priority,
  city,
  onStatusChange,
  onPriorityChange,
  onCityChange,
  onClearFilters,
  hasActiveFilters
}: {
  status: VenueStatus | 'ALL';
  priority: VenuePriority | 'ALL';
  city: string;
  onStatusChange: (status: VenueStatus | 'ALL') => void;
  onPriorityChange: (priority: VenuePriority | 'ALL') => void;
  onCityChange: (city: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Advanced Filters</h4>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <Separator />

      {/* Status Filter */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center space-x-2">
                  <div className={cn("w-2 h-2 rounded-full", option.color.split(' ')[0])} />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Priority Filter */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Priority</Label>
        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center space-x-2">
                  <div className={cn("w-2 h-2 rounded-full", option.color.split(' ')[0])} />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Filter */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">City</Label>
        <Input
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
        />
      </div>
    </div>
  );
}

// Filter Badge Component
function FilterBadge({
  label,
  onRemove
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <Badge variant="secondary" className="flex items-center space-x-1 pr-1">
      <span className="text-xs">{label}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-4 w-4 p-0 hover:bg-muted-foreground/20"
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );
}