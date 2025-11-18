"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { STATUS_OPTIONS, TYPE_OPTIONS } from "../lib/validations";

interface NewsFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedStatus: string;
  selectedTag: string;
  showArchived: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onShowArchivedChange: (checked: boolean) => void;
}

export function NewsFilters({
  searchTerm,
  selectedCategory,
  selectedStatus,
  selectedTag,
  showArchived,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onTagChange,
  onShowArchivedChange,
}: NewsFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const activeFiltersCount = [
    selectedCategory !== "all",
    selectedStatus !== "all",
    selectedTag !== "all",
    showArchived,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    onCategoryChange("all");
    onStatusChange("all");
    onTagChange("all");
    onShowArchivedChange(false);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search articles by title..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Type
              </label>
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {TYPE_OPTIONS.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status
              </label>
              <Select value={selectedStatus} onValueChange={onStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tag
              </label>
              <Select value={selectedTag} onValueChange={onTagChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {/* Tags would be loaded dynamically */}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Options */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-archived"
                checked={showArchived}
                onCheckedChange={onShowArchivedChange}
              />
              <label
                htmlFor="show-archived"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Include archived articles
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onCategoryChange("all")}>
              Type: {TYPE_OPTIONS.find(c => c.value === selectedCategory)?.label}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          {selectedStatus !== "all" && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onStatusChange("all")}>
              Status: {STATUS_OPTIONS.find(s => s.value === selectedStatus)?.label}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
          {showArchived && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => onShowArchivedChange(false)}>
              Including archived
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}