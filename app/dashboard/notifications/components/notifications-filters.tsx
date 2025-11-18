import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { NotificationType } from '@/types/notification';

interface NotificationsFiltersProps {
  searchTerm: string;
  selectedType: NotificationType | 'all';
  readFilter: 'all' | 'read' | 'unread';
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: NotificationType | 'all') => void;
  onReadFilterChange: (value: 'all' | 'read' | 'unread') => void;
  onClearFilters: () => void;
}

export function NotificationsFilters({
  searchTerm,
  selectedType,
  readFilter,
  hasActiveFilters,
  onSearchChange,
  onTypeChange,
  onReadFilterChange,
  onClearFilters,
}: NotificationsFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <Select
            value={selectedType}
            onValueChange={(value) => onTypeChange(value as NotificationType | 'all')}
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={NotificationType.GLOBAL}>Global</SelectItem>
              <SelectItem value={NotificationType.DIRECT}>Direct</SelectItem>
              <SelectItem value={NotificationType.SYSTEM}>System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Read Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={readFilter}
            onValueChange={(value) => onReadFilterChange(value as 'all' | 'read' | 'unread')}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
