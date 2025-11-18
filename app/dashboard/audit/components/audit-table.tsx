"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NonSortableTableHeader } from "@/components/ui/sortable-table-header";
import { TableHead } from "@/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { AuditEntry, AuditSortField, SortDirection } from "@/types/audit";
import { cn } from "@/lib/utils";
import {
  formatAuditDate,
  formatActionName,
  getUserDisplayName,
  getEntityDisplayName,
  getActionColor,
  getEntityTypeColor,
  getAuditDescription,
  hasAuditDetails,
} from "../utils/audit-helpers";

interface AuditSortableHeaderProps {
  children: React.ReactNode;
  sortField: AuditSortField;
  currentSortField?: AuditSortField;
  currentSortDirection?: SortDirection;
  onSort: (field: AuditSortField) => void;
  className?: string;
}

function AuditSortableHeader({
  children,
  sortField,
  currentSortField,
  currentSortDirection,
  onSort,
  className,
}: AuditSortableHeaderProps) {
  const isSorted = currentSortField === sortField;
  const isAsc = isSorted && currentSortDirection === 'asc';
  const isDesc = isSorted && currentSortDirection === 'desc';

  const handleClick = () => {
    onSort(sortField);
  };

  return (
    <TableHead 
      className={cn(
        "cursor-pointer select-none hover:bg-gray-50 transition-colors",
        isSorted && "bg-gray-50",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <span>{children}</span>
        <div className="ml-2 flex flex-col">
          {!isSorted && (
            <ChevronsUpDown className="h-4 w-4 text-gray-400" />
          )}
          {isAsc && (
            <ChevronUp className="h-4 w-4 text-blue-600" />
          )}
          {isDesc && (
            <ChevronDown className="h-4 w-4 text-blue-600" />
          )}
        </div>
      </div>
    </TableHead>
  );
}

interface AuditTableProps {
  auditEntries: AuditEntry[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  sortField: AuditSortField;
  sortDirection: SortDirection;
  onSort: (field: AuditSortField) => void;
  onEntryClick?: (entry: AuditEntry) => void;
}

export function AuditTable({
  auditEntries,
  loading,
  error,
  totalCount,
  sortField,
  sortDirection,
  onSort,
  onEntryClick,
}: AuditTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log ({totalCount})</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading audit entries...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <p className="text-destructive">Error loading audit entries: {error.message}</p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <AuditSortableHeader
                  sortField="createdAt"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                >
                  When
                </AuditSortableHeader>
                <AuditSortableHeader
                  sortField="userId"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                >
                  User
                </AuditSortableHeader>
                <AuditSortableHeader
                  sortField="action"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                >
                  Action
                </AuditSortableHeader>
                <AuditSortableHeader
                  sortField="entityType"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                >
                  Entity
                </AuditSortableHeader>
                <NonSortableTableHeader>
                  Description
                </NonSortableTableHeader>
                <NonSortableTableHeader className="text-right">
                  Details
                </NonSortableTableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditEntries.map((entry, index) => {
                const canShowDetails = hasAuditDetails(entry);
                
                return (
                  <TableRow 
                    key={`${entry.action}-${entry.createdAt}-${index}`}
                    className={canShowDetails && onEntryClick ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={canShowDetails && onEntryClick ? () => onEntryClick(entry) : undefined}
                  >
                    <TableCell>
                      <div className="text-sm">
                        {formatAuditDate(entry.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {getUserDisplayName(entry)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getActionColor(entry.action)}>
                        {formatActionName(entry.action)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getEntityTypeColor(entry.entityType)}>
                        {getEntityDisplayName(entry.entityType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {getAuditDescription(entry)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {canShowDetails && onEntryClick ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEntryClick(entry);
                          }}
                        >
                          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {auditEntries.length === 0 && !loading && (
          <div className="text-center py-6 text-muted-foreground">
            No audit entries found matching your criteria.
          </div>
        )}

        {/* Simple pagination info */}
        {auditEntries.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {auditEntries.length} audit entries
              {totalCount > 0 && ` of ${totalCount.toLocaleString()}`}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}