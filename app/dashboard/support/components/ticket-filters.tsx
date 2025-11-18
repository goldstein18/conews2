import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { TicketStatus, TicketPriority, TicketCategory } from '@/types/ticket';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, CATEGORY_OPTIONS } from '../lib/validations';

interface TicketFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedStatus: TicketStatus | 'ALL';
  setSelectedStatus: (value: TicketStatus | 'ALL') => void;
  selectedPriority: TicketPriority | 'ALL';
  setSelectedPriority: (value: TicketPriority | 'ALL') => void;
  selectedCategory: TicketCategory | 'ALL';
  setSelectedCategory: (value: TicketCategory | 'ALL') => void;
  hasActiveFilters: boolean;
  resetFilters: () => void;
  showCompanyFilter?: boolean;
  selectedCompany?: string | 'ALL';
  setSelectedCompany?: (value: string | 'ALL') => void;
  companies?: Array<{ id: string; name: string }>;
}

export function TicketFilters({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
  selectedCategory,
  setSelectedCategory,
  hasActiveFilters,
  resetFilters,
  showCompanyFilter = false,
  selectedCompany,
  setSelectedCompany,
  companies = [],
}: TicketFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tickets by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Status
              </label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as TicketStatus | 'ALL')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Priority
              </label>
              <Select
                value={selectedPriority}
                onValueChange={(value) => setSelectedPriority(value as TicketPriority | 'ALL')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Priorities</SelectItem>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as TicketCategory | 'ALL')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company Filter (Super Admin only) */}
            {showCompanyFilter && setSelectedCompany && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Company
                </label>
                <Select
                  value={selectedCompany}
                  onValueChange={(value) => setSelectedCompany(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Companies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Companies</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="text-gray-600"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
