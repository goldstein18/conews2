'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Filter,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { BannerType, BannerStatus } from '@/types/banners';
import { cn } from '@/lib/utils';

interface BannerFiltersProps {
  search: string;
  bannerType: BannerType | 'ALL';
  status: BannerStatus | 'ALL';
  market: string;
  onSearchChange: (search: string) => void;
  onBannerTypeChange: (bannerType: BannerType | 'ALL') => void;
  onStatusChange: (status: BannerStatus | 'ALL') => void;
  onMarketChange: (market: string) => void;
  onClearFilters: () => void;
  hasActiveFilters?: boolean;
  showAdvanced?: boolean;
  className?: string;
}

const BANNER_TYPE_OPTIONS = [
  { value: 'ALL', label: 'All Types', color: 'default' },
  { value: 'ROS', label: 'ROS', color: 'blue' },
  { value: 'PREMIUM', label: 'Premium', color: 'purple' },
  { value: 'BLUE', label: 'Blue', color: 'blue' },
  { value: 'GREEN', label: 'Green', color: 'green' },
  { value: 'RED', label: 'Red', color: 'red' },
  { value: 'ESCOOP', label: 'Escoop', color: 'orange' }
] as const;

const BANNER_STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Status', color: 'default' },
  { value: 'PENDING', label: 'Pending', color: 'yellow' },
  { value: 'APPROVED', label: 'Approved', color: 'green' },
  { value: 'RUNNING', label: 'Running', color: 'blue' },
  { value: 'EXPIRED', label: 'Expired', color: 'gray' },
  { value: 'DECLINED', label: 'Declined', color: 'red' },
  { value: 'PAUSED', label: 'Paused', color: 'orange' }
] as const;

const MARKET_OPTIONS = [
  { value: '', label: 'All Markets' },
  { value: 'miami', label: 'Miami' },
  { value: 'atlanta', label: 'Atlanta' },
  { value: 'tampa', label: 'Tampa' },
  { value: 'orlando', label: 'Orlando' }
] as const;

export function BannerFilters({
  search,
  bannerType,
  status,
  market,
  onSearchChange,
  onBannerTypeChange,
  onStatusChange,
  onMarketChange,
  onClearFilters,
  hasActiveFilters = false,
  showAdvanced = true,
  className
}: BannerFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(search);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchInput);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    // Debounced search - call onChange after user stops typing
    const timeoutId = setTimeout(() => {
      onSearchChange(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  const activeFiltersCount = [
    search.trim() ? 1 : 0,
    bannerType !== 'ALL' ? 1 : 0,
    status !== 'ALL' ? 1 : 0,
    market.trim() ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  const currentBannerTypeLabel = BANNER_TYPE_OPTIONS.find(opt => opt.value === bannerType)?.label || 'All Types';
  const currentStatusLabel = BANNER_STATUS_OPTIONS.find(opt => opt.value === status)?.label || 'All Status';
  const currentMarketLabel = MARKET_OPTIONS.find(opt => opt.value === market)?.label || 'All Markets';

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search and primary filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search banners..."
                  value={searchInput}
                  onChange={(e) => {
                    const cleanup = handleSearchChange(e.target.value);
                    return cleanup;
                  }}
                  className="pl-9"
                />
              </div>
            </form>

            {/* Quick filters */}
            <div className="flex gap-2 flex-wrap">
              {/* Banner Type Filter */}
              <Select value={bannerType} onValueChange={onBannerTypeChange}>
                <SelectTrigger className="w-auto min-w-[120px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {BANNER_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <span>{option.label}</span>
                        {option.value !== 'ALL' && (
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs",
                              option.color === 'blue' && "border-blue-200 text-blue-700",
                              option.color === 'purple' && "border-purple-200 text-purple-700",
                              option.color === 'green' && "border-green-200 text-green-700",
                              option.color === 'red' && "border-red-200 text-red-700",
                              option.color === 'orange' && "border-orange-200 text-orange-700"
                            )}
                          >
                            {option.value}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={status} onValueChange={onStatusChange}>
                <SelectTrigger className="w-auto min-w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {BANNER_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <span>{option.label}</span>
                        {option.value !== 'ALL' && (
                          <Badge 
                            variant="outline"
                            className={cn(
                              "text-xs",
                              option.color === 'yellow' && "border-yellow-200 text-yellow-700",
                              option.color === 'green' && "border-green-200 text-green-700",
                              option.color === 'blue' && "border-blue-200 text-blue-700",
                              option.color === 'gray' && "border-gray-200 text-gray-700",
                              option.color === 'red' && "border-red-200 text-red-700",
                              option.color === 'orange' && "border-orange-200 text-orange-700"
                            )}
                          >
                            {option.value}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Advanced Filters Toggle */}
              {showAdvanced && (
                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="gap-2"
                >
                  Advanced
                  {showAdvancedFilters ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              )}

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={onClearFilters}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                  Clear ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && showAdvancedFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              {/* Market Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Market</label>
                <Select value={market} onValueChange={onMarketChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select market" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARKET_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional filters can be added here */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium mb-2 block">Quick Actions</label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusChange(BannerStatus.RUNNING)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    Show Running
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusChange(BannerStatus.PENDING)}
                    className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                  >
                    Show Pending
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onBannerTypeChange(BannerType.ROS)}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    ROS Only
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              
              {search.trim() && (
                <Badge variant="secondary" className="gap-1">
                  Search: &quot;{search}&quot;
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => onSearchChange('')}
                  />
                </Badge>
              )}
              
              {bannerType !== 'ALL' && (
                <Badge variant="secondary" className="gap-1">
                  Type: {currentBannerTypeLabel}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => onBannerTypeChange('ALL')}
                  />
                </Badge>
              )}
              
              {status !== 'ALL' && (
                <Badge variant="secondary" className="gap-1">
                  Status: {currentStatusLabel}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => onStatusChange('ALL')}
                  />
                </Badge>
              )}
              
              {market.trim() && (
                <Badge variant="secondary" className="gap-1">
                  Market: {currentMarketLabel}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => onMarketChange('')}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}