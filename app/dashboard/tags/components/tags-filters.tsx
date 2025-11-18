"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { TagType } from "@/types/tags";

const TAG_TYPE_LABELS: Record<TagType, string> = {
  [TagType.MAIN_GENRE]: 'Main Genre',
  [TagType.SUBGENRE]: 'Sub Genre', 
  [TagType.SUPPORTING]: 'Supporting',
  [TagType.AUDIENCE]: 'Audience'
};

// Common main genres - you can extend this list based on your data
const MAIN_GENRES = [
  'ELECTRONIC',
  'ROCK',
  'POP',
  'HIP_HOP',
  'JAZZ',
  'CLASSICAL',
  'REGGAE',
  'LATIN',
  'COUNTRY',
  'R&B',
  'FOLK',
  'BLUES',
  'FUNK'
];

interface TagsFiltersProps {
  searchTerm: string;
  selectedType?: TagType;
  selectedMainGenre?: string;
  selectedStatus?: string;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: TagType | undefined) => void;
  onMainGenreChange: (value: string | undefined) => void;
  onStatusChange: (value: string | undefined) => void;
  onClearAllFilters: () => void;
}

export function TagsFilters({
  searchTerm,
  selectedType,
  selectedMainGenre,
  selectedStatus,
  hasActiveFilters,
  onSearchChange,
  onTypeChange,
  onMainGenreChange,
  onStatusChange,
  onClearAllFilters,
}: TagsFiltersProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Search Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by display name..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tag Type Filter */}
            <div className="space-y-2">
              <Label>Tag Type</Label>
              <Select 
                value={selectedType || "all"} 
                onValueChange={(value) => onTypeChange(value === "all" ? undefined : value as TagType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(TAG_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={selectedStatus || "all"} 
                onValueChange={(value) => onStatusChange(value === "all" ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Main Genre Filter Row (only show if SUBGENRE is selected) */}
          {(selectedType === TagType.SUBGENRE || selectedMainGenre) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Main Genre (for Sub Genres)</Label>
                <Select 
                  value={selectedMainGenre || "all"} 
                  onValueChange={(value) => onMainGenreChange(value === "all" ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Main Genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Main Genres</SelectItem>
                    {MAIN_GENRES.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                {hasActiveFilters && (
                  <Button 
                    variant="outline" 
                    onClick={onClearAllFilters}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Clear Filters Button (when no main genre filter is shown) */}
          {selectedType !== TagType.SUBGENRE && !selectedMainGenre && hasActiveFilters && (
            <div className="flex justify-start">
              <Button 
                variant="outline" 
                onClick={onClearAllFilters}
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}