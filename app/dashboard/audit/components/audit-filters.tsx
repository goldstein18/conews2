"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  EntityTypeOption, 
  ActionTypeOption, 
  ENTITY_TYPE_OPTIONS, 
  ACTION_TYPE_OPTIONS 
} from "@/types/audit";

interface AuditFiltersProps {
  searchTerm: string;
  selectedEntityTypes: EntityTypeOption[];
  selectedActions: ActionTypeOption[];
  dateFrom: string;
  dateTo: string;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onEntityTypeChange: (entityType: EntityTypeOption, checked: boolean) => void;
  onActionChange: (action: ActionTypeOption, checked: boolean) => void;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onClearFilters: () => void;
  onClearEntityTypes: () => void;
  onClearActions: () => void;
  onClearDateRange: () => void;
}

export function AuditFilters({
  searchTerm,
  selectedEntityTypes,
  selectedActions,
  dateFrom,
  dateTo,
  hasActiveFilters,
  onSearchChange,
  onEntityTypeChange,
  onActionChange,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
  onClearEntityTypes,
  onClearActions,
  onClearDateRange,
}: AuditFiltersProps) {
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
            placeholder="Search users, actions, or entities..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Date Range</label>
            {(dateFrom || dateTo) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearDateRange}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Clear
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">From</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">To</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Entity Types */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Entity Types</label>
            {selectedEntityTypes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearEntityTypes}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedEntityTypes.map(entityType => (
              <Badge 
                key={entityType} 
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => onEntityTypeChange(entityType, false)}
              >
                {entityType}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ENTITY_TYPE_OPTIONS.map((entityType) => (
              <div key={entityType} className="flex items-center space-x-2">
                <Checkbox
                  id={`entity-${entityType}`}
                  checked={selectedEntityTypes.includes(entityType)}
                  onCheckedChange={(checked) => 
                    onEntityTypeChange(entityType, checked as boolean)
                  }
                />
                <label 
                  htmlFor={`entity-${entityType}`}
                  className="text-sm cursor-pointer"
                >
                  {entityType}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Actions</label>
            {selectedActions.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearActions}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedActions.map(action => (
              <Badge 
                key={action} 
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => onActionChange(action, false)}
              >
                {action.replace('_', ' ')}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-1">
            {ACTION_TYPE_OPTIONS.map((action) => (
              <div key={action} className="flex items-center space-x-2">
                <Checkbox
                  id={`action-${action}`}
                  checked={selectedActions.includes(action)}
                  onCheckedChange={(checked) => 
                    onActionChange(action, checked as boolean)
                  }
                />
                <label 
                  htmlFor={`action-${action}`}
                  className="text-sm cursor-pointer"
                >
                  {action.replace('_', ' ')}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}