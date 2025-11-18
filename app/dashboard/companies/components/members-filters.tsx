"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MembersFiltersProps {
  searchTerm: string;
  selectedMarket: string;
  selectedStatus: string;
  showDeleted: boolean;
  onSearchChange: (value: string) => void;
  onMarketChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onShowDeletedChange: (value: boolean) => void;
}

export function MembersFilters({
  searchTerm,
  selectedMarket,
  selectedStatus,
  showDeleted,
  onSearchChange,
  onMarketChange,
  onStatusChange,
  onShowDeletedChange,
}: MembersFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search companies, owners, or emails..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedMarket}
          onChange={(e) => onMarketChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Markets</option>
          <option value="miami">Miami</option>
          <option value="new-york">New York</option>
          <option value="los-angeles">Los Angeles</option>
          <option value="chicago">Chicago</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Filter by Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => onShowDeletedChange(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span>Show Deleted</span>
        </label>
      </div>
    </div>
  );
}