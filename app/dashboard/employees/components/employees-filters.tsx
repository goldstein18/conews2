"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { MARKET_LABELS, ROLE_LABELS } from "@/types/employees";

interface EmployeesFiltersProps {
  searchTerm: string;
  selectedMarket?: string;
  selectedRole?: string;
  selectedStatus?: string;
  onSearchChange: (value: string) => void;
  onMarketChange: (value: string | undefined) => void;
  onRoleChange: (value: string | undefined) => void;
  onStatusChange: (value: string | undefined) => void;
}

export function EmployeesFilters({
  searchTerm,
  selectedMarket,
  selectedRole,
  selectedStatus,
  onSearchChange,
  onMarketChange,
  onRoleChange,
  onStatusChange,
}: EmployeesFiltersProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Market Filter */}
          <div className="space-y-2">
            <Label>Market</Label>
            <Select 
              value={selectedMarket || "all"} 
              onValueChange={(value) => onMarketChange(value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Markets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                {Object.entries(MARKET_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Role Filter */}
          <div className="space-y-2">
            <Label>Role</Label>
            <Select 
              value={selectedRole || "all"} 
              onValueChange={(value) => onRoleChange(value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
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
      </CardContent>
    </Card>
  );
}