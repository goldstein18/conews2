"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Key } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SortableTableHeader, NonSortableTableHeader } from "@/components/ui/sortable-table-header";
import { Member, SortField, SortDirection } from "@/types/members";
import { getCompanyInfo, getPlanInfo, getExpirationInfo } from "../utils/members-helpers";
import { useImpersonationActions } from "@/app/dashboard/impersonate/hooks";

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
  totalCount?: number;
}

interface MembersTableProps {
  members: Member[];
  loading: boolean;
  error: Error | null;
  totalCount: number;
  sortField: SortField;
  sortDirection: SortDirection;
  pageInfo?: PageInfo;
  onSort: (field: SortField) => void;
  onPreviousPage: () => void;  
  onNextPage: () => void;
  onLoadMore: () => void;
}

export function MembersTable({
  members,
  loading,
  error,
  totalCount,
  sortField,
  sortDirection,
  pageInfo,
  onSort,
  onPreviousPage,
  onNextPage,
  onLoadMore,
}: MembersTableProps) {
  const { startImpersonation, loading: impersonationLoading } = useImpersonationActions();

  const handleImpersonate = (member: Member) => {
    const companyName = member.ownedCompany?.name || 'Unknown Company';
    const reason = `Impersonating company owner: ${companyName}`;

    startImpersonation(member.id, reason);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Companies ({totalCount})</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading companies...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <p className="text-destructive">Error loading companies: {error.message}</p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHeader
                  sortField="OWNER_EMAIL"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                >
                  Owner
                </SortableTableHeader>
                <SortableTableHeader
                  sortField="COMPANY_NAME"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                >
                  Company
                </SortableTableHeader>
                <SortableTableHeader
                  sortField="OWNER_MARKET"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                >
                  Market
                </SortableTableHeader>
                <SortableTableHeader
                  sortField="STATUS"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                >
                  Status
                </SortableTableHeader>
                <SortableTableHeader
                  sortField="PLAN_NAME"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                >
                  Plan
                </SortableTableHeader>
                <SortableTableHeader
                  sortField="BENEFITS_END_DATE"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                >
                  Expiration Date
                </SortableTableHeader>
                <SortableTableHeader
                  sortField="OWNER_LAST_LOGIN"
                  currentSortField={sortField}
                  currentSortDirection={sortDirection}
                  onSort={onSort}
                >
                  Last Login
                </SortableTableHeader>
                <NonSortableTableHeader className="text-right">
                  Actions
                </NonSortableTableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const companyInfo = getCompanyInfo(member);
                const planInfo = getPlanInfo(member);
                const expirationInfo = getExpirationInfo(member);

                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.firstName} {member.lastName}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {companyInfo ? (
                        <div>
                          <Link 
                            href={`/dashboard/companies/${companyInfo.id}`}
                            className="text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors"
                          >
                            {companyInfo.name}
                          </Link>
                          <div className="text-xs text-gray-500">{companyInfo.userCount} users</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{member.market}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={companyInfo?.status === "ACTIVE" ? "default" : "secondary"}>
                        {companyInfo?.status || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{planInfo?.name || 'No Plan'}</div>
                        {planInfo?.price && (
                          <div className="text-xs text-gray-500">${(planInfo.price / 100).toFixed(2)}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {expirationInfo ? (
                        <div>
                          <div className="text-sm">{expirationInfo.date}</div>
                          <div className="text-xs text-gray-500">{expirationInfo.daysLeft}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400">-</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <Link
                          href={`/dashboard/companies/${companyInfo?.id}/edit`}
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleImpersonate(member)}
                          disabled={impersonationLoading || !member.ownedCompany}
                          className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={member.ownedCompany ? `Impersonate ${member.firstName} ${member.lastName}` : 'No company to impersonate'}
                        >
                          <Key className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {members.length === 0 && !loading && (
          <div className="text-center py-6 text-muted-foreground">
            No companies found matching your criteria.
          </div>
        )}

        {/* Pagination Controls */}
        {members.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {members.length} companies
              {totalCount > 0 && ` of ${totalCount.toLocaleString()}`}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onPreviousPage}
                disabled={!pageInfo?.hasPreviousPage}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onNextPage}
                disabled={!pageInfo?.hasNextPage}
              >
                Next
              </Button>
              {pageInfo?.hasNextPage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLoadMore}
                  className="text-blue-600"
                >
                  Load More
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}