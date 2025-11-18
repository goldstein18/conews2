/**
 * Date filter dropdown component
 * Displays a dropdown menu for selecting date filters
 */

'use client';

import { Calendar, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DATE_FILTER_OPTIONS, type DateFilterType } from '@/types/public-events';

interface DateFilterDropdownProps {
  selectedDateFilter: DateFilterType;
  onDateFilterChange: (filter: DateFilterType) => void;
}

export function DateFilterDropdown({
  selectedDateFilter,
  onDateFilterChange
}: DateFilterDropdownProps) {
  // Get label for selected filter
  const selectedLabel = DATE_FILTER_OPTIONS.find(
    opt => opt.value === selectedDateFilter
  )?.label || 'All Dates';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={selectedDateFilter ? 'default' : 'outline'}
          size="sm"
          className="gap-2 h-9"
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">{selectedLabel}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {DATE_FILTER_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onDateFilterChange(option.value as DateFilterType)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span>{option.label}</span>
              {selectedDateFilter === option.value && (
                <Check className="h-4 w-4" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
