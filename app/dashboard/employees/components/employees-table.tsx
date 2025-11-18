"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { SortableTableHeader, NonSortableTableHeader } from "@/components/ui/sortable-table-header";
import { Employee } from "@/types/employees";
import { SortField, SortDirection } from "@/types/members";
import { MARKET_LABELS } from "@/types/employees";
import { Edit, Link as LinkIcon, Power } from "lucide-react";
import { StatusToggleModal } from "./status-toggle-modal";
import { useEmployeeActions } from "../hooks";

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
  totalCount?: number;
}

interface EmployeesTableProps {
  employees: Employee[];
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

export function EmployeesTable({
  employees,
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
}: EmployeesTableProps) {
  const router = useRouter();
  const { toggleEmployeeStatus, loading: actionLoading } = useEmployeeActions();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleStatusToggle = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleConfirmStatusToggle = async (employeeId: string, action: 'activate' | 'deactivate') => {
    await toggleEmployeeStatus(employeeId, action);
    setModalOpen(false);
    setSelectedEmployee(null);
  };

  const formatMarkets = (markets: Employee['employeeMarkets']) => {
    if (!markets || markets.length === 0) return '-';
    
    return markets
      .map(m => MARKET_LABELS[m.market] || m.market)
      .join(', ');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Employees ({totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading employees...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <p className="text-destructive">Error loading employees: {error.message}</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHeader
                    sortField="FIRST_NAME"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={onSort}
                  >
                    Name
                  </SortableTableHeader>
                  <SortableTableHeader
                    sortField="EMAIL"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={onSort}
                  >
                    Email
                  </SortableTableHeader>
                  <SortableTableHeader
                    sortField="ROLE"
                    currentSortField={sortField}
                    currentSortDirection={sortDirection}
                    onSort={onSort}
                  >
                    Role
                  </SortableTableHeader>
                  <NonSortableTableHeader>
                    Markets
                  </NonSortableTableHeader>
                  <NonSortableTableHeader>
                    Status
                  </NonSortableTableHeader>
                  <NonSortableTableHeader className="text-right">
                    Actions
                  </NonSortableTableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">{employee.email}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{employee.role?.name || 'No Role'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 max-w-48">
                        {formatMarkets(employee.employeeMarkets)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={employee.isActive ? "default" : "secondary"}>
                        {employee.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/dashboard/employees/${employee.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={employee.isActive ? "text-red-600" : "text-green-600"}
                          onClick={() => handleStatusToggle(employee)}
                          disabled={actionLoading}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {employees.length === 0 && !loading && (
            <div className="text-center py-6 text-muted-foreground">
              No employees found matching your criteria.
            </div>
          )}

          {/* Pagination Controls */}
          {employees.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-500">
                Showing {employees.length} employees
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

      <StatusToggleModal
        employee={selectedEmployee}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEmployee(null);
        }}
        onConfirm={handleConfirmStatusToggle}
        loading={actionLoading}
      />
    </>
  );
}