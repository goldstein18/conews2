"use client";

import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventsFiltersProps {
  searchTerm: string;
  selectedStatus: string;
  selectedMarket: string;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: string) => void;
  onMarketChange: (market: string) => void;
  onClearAllFilters: () => void;
}

export function EventsFilters({
  searchTerm,
  selectedStatus,
  selectedMarket,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onMarketChange,
  onClearAllFilters,
}: EventsFiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'LIVE', label: 'Live' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAST', label: 'Past' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  const marketOptions = [
    { value: 'all', label: 'All Markets' },
    { value: 'miami', label: 'Miami' },
    { value: 'atlanta', label: 'Atlanta' },
    { value: 'tampa', label: 'Tampa' },
    { value: 'palm-beach', label: 'Palm Beach' },
    { value: 'orlando', label: 'Orlando' },
    { value: 'naples', label: 'Naples' },
    { value: 'fort-lauderdale', label: 'Fort Lauderdale' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">Filters</span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Market Filter */}
        <Select value={selectedMarket} onValueChange={onMarketChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by market" />
          </SelectTrigger>
          <SelectContent>
            {marketOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
              Search: &quot;{searchTerm}&quot;
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:text-blue-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {selectedStatus !== 'all' && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
              Status: {statusOptions.find(opt => opt.value === selectedStatus)?.label}
              <button
                onClick={() => onStatusChange('all')}
                className="ml-1 hover:text-green-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {selectedMarket !== 'all' && (
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md">
              Market: {marketOptions.find(opt => opt.value === selectedMarket)?.label}
              <button
                onClick={() => onMarketChange('all')}
                className="ml-1 hover:text-purple-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}