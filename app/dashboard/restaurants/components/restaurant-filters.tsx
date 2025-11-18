'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { RestaurantStatus, PriceRange } from '@/types/restaurants';
import { RESTAURANT_STATUS_OPTIONS, PRICE_RANGE_OPTIONS, MARKET_OPTIONS } from '../lib/validations';

interface RestaurantFiltersProps {
  search: string;
  status: RestaurantStatus | 'ALL';
  priceRange: PriceRange | 'ALL';
  city: string;
  market: string;
  cuisineType: string;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: RestaurantStatus | 'ALL') => void;
  onPriceRangeChange: (priceRange: PriceRange | 'ALL') => void;
  onCityChange: (city: string) => void;
  onMarketChange: (market: string) => void;
  onCuisineTypeChange: (cuisineType: string) => void;
  onClearFilters: () => void;
  showAdvanced?: boolean;
}

export function RestaurantFilters({
  search,
  status,
  priceRange,
  city,
  market,
  cuisineType,
  onSearchChange,
  onStatusChange,
  onPriceRangeChange,
  onCityChange,
  onMarketChange,
  onCuisineTypeChange,
  onClearFilters,
  showAdvanced = true
}: RestaurantFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (search.trim()) count++;
    if (status !== 'ALL') count++;
    if (priceRange !== 'ALL') count++;
    if (city.trim()) count++;
    if (market.trim()) count++;
    if (cuisineType.trim()) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const clearIndividualFilter = (filterType: string) => {
    switch (filterType) {
      case 'search':
        onSearchChange('');
        break;
      case 'status':
        onStatusChange('ALL');
        break;
      case 'priceRange':
        onPriceRangeChange('ALL');
        break;
      case 'city':
        onCityChange('');
        break;
      case 'market':
        onMarketChange('');
        break;
      case 'cuisineType':
        onCuisineTypeChange('');
        break;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Main Filter Row */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search restaurants..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2">
            {/* Status Filter */}
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                {RESTAURANT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Advanced Filters Toggle */}
            {showAdvanced && (
              <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Advanced Filters</h4>
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onClearFilters}
                          className="h-auto p-1 text-xs"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>

                    {/* Price Range Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price Range</label>
                      <Select value={priceRange} onValueChange={onPriceRangeChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select price range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Price Ranges</SelectItem>
                          {PRICE_RANGE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Market Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Market</label>
                      <Select value={market} onValueChange={onMarketChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select market" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Markets</SelectItem>
                          {MARKET_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* City Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) => onCityChange(e.target.value)}
                      />
                    </div>

                    {/* Cuisine Type Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cuisine Type</label>
                      <Input
                        placeholder="Enter cuisine type"
                        value={cuisineType}
                        onChange={(e) => onCuisineTypeChange(e.target.value)}
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {search.trim() && (
              <Badge variant="secondary" className="gap-1">
                Search: &quot;{search}&quot;
                <button
                  onClick={() => clearIndividualFilter('search')}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {status !== 'ALL' && (
              <Badge variant="secondary" className="gap-1">
                Status: {RESTAURANT_STATUS_OPTIONS.find(opt => opt.value === status)?.label}
                <button
                  onClick={() => clearIndividualFilter('status')}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {priceRange !== 'ALL' && (
              <Badge variant="secondary" className="gap-1">
                Price: {PRICE_RANGE_OPTIONS.find(opt => opt.value === priceRange)?.label}
                <button
                  onClick={() => clearIndividualFilter('priceRange')}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {market.trim() && (
              <Badge variant="secondary" className="gap-1">
                Market: {MARKET_OPTIONS.find(opt => opt.value === market)?.label || market}
                <button
                  onClick={() => clearIndividualFilter('market')}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {city.trim() && (
              <Badge variant="secondary" className="gap-1">
                City: {city}
                <button
                  onClick={() => clearIndividualFilter('city')}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {cuisineType.trim() && (
              <Badge variant="secondary" className="gap-1">
                Cuisine: {cuisineType}
                <button
                  onClick={() => clearIndividualFilter('cuisineType')}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}