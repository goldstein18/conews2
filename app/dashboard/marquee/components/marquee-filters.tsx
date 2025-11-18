'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MarqueeStatus } from '@/types/marquee';
import { MARKET_OPTIONS } from '../lib/validations';

interface MarqueeFiltersProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: MarqueeStatus | undefined) => void;
  onMarketChange: (market: string | undefined) => void;
  initialStatus?: MarqueeStatus;
}

export function MarqueeFilters({
  onSearchChange,
  onStatusChange,
  onMarketChange,
  initialStatus,
}: MarqueeFiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>(initialStatus || 'all');
  const [market, setMarket] = useState<string>('all');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, onSearchChange]);

  // Update status when initialStatus changes
  useEffect(() => {
    if (initialStatus) {
      setStatus(initialStatus);
    }
  }, [initialStatus]);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onStatusChange(value === 'all' ? undefined : (value as MarqueeStatus));
  };

  const handleMarketChange = (value: string) => {
    setMarket(value);
    onMarketChange(value === 'all' ? undefined : value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search marquees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status Filter */}
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value={MarqueeStatus.PENDING}>Pending</SelectItem>
          <SelectItem value={MarqueeStatus.APPROVED}>Approved</SelectItem>
          <SelectItem value={MarqueeStatus.DECLINED}>Declined</SelectItem>
        </SelectContent>
      </Select>

      {/* Market Filter */}
      <Select value={market} onValueChange={handleMarketChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by market" />
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
  );
}
