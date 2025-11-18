"use client";

import { Filter, Users, UserCheck, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlanStat {
  planName: string;
  planSlug: string;
  count: number;
  color: string | null;
}

interface CompaniesSummary {
  totalCompanies: number;
  activeCompanies: number;
  pendingCompanies: number;
  expiringThisMonth: number;
}

interface MembersStatsProps {
  planStats: PlanStat[];
  summary: CompaniesSummary;
  statsLoading: boolean;
  statsError: Error | null;
  selectedPlan: string;
  selectedSummaryFilter: string;
  onPlanClick: (planSlug: string) => void;
  onSummaryClick: (filterType: string) => void;
  onClearPlanFilter: () => void;
  onClearSummaryFilter: () => void;
}

export function MembersStats({
  planStats,
  summary,
  statsLoading,
  statsError,
  selectedPlan,
  selectedSummaryFilter,
  onPlanClick,
  onSummaryClick,
  onClearPlanFilter,
  onClearSummaryFilter,
}: MembersStatsProps) {
  return (
    <div className="space-y-6">
      {/* Plan Totals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Plan Totals</h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Select Market</span>
          </div>
        </div>
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="text-center">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : statsError ? (
          <div className="text-center py-4">
            <p className="text-destructive">Error loading plan statistics: {statsError.message}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {planStats.map((planStat) => (
              <Card 
                key={planStat.planSlug} 
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedPlan === planStat.planSlug 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onPlanClick(planStat.planSlug)}
              >
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{planStat.planName}</div>
                  <div className={`text-2xl font-bold ${
                    selectedPlan === planStat.planSlug ? 'text-blue-700' : 'text-blue-600'
                  }`}>
                    {planStat.count}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className={`border-l-4 border-l-blue-500 cursor-pointer transition-all hover:shadow-md ${
            selectedSummaryFilter === "all" ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => onSummaryClick("all")}
        >
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Companies</p>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
              ) : (
                <p className={`text-2xl font-bold ${
                  selectedSummaryFilter === "all" ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {summary.totalCompanies.toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`border-l-4 border-l-green-500 cursor-pointer transition-all hover:shadow-md ${
            selectedSummaryFilter === "active" ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => onSummaryClick("active")}
        >
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mr-4">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Companies</p>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
              ) : (
                <p className={`text-2xl font-bold ${
                  selectedSummaryFilter === "active" ? 'text-green-700' : 'text-gray-900'
                }`}>
                  {summary.activeCompanies.toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`border-l-4 border-l-yellow-500 cursor-pointer transition-all hover:shadow-md ${
            selectedSummaryFilter === "pending" ? 'ring-2 ring-yellow-500 bg-yellow-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => onSummaryClick("pending")}
        >
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Companies</p>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
              ) : (
                <p className={`text-2xl font-bold ${
                  selectedSummaryFilter === "pending" ? 'text-yellow-700' : 'text-gray-900'
                }`}>
                  {summary.pendingCompanies.toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`border-l-4 border-l-orange-500 cursor-pointer transition-all hover:shadow-md ${
            selectedSummaryFilter === "expiring" ? 'ring-2 ring-orange-500 bg-orange-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => onSummaryClick("expiring")}
        >
          <CardContent className="flex items-center p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mr-4">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring This Month</p>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
              ) : (
                <p className={`text-2xl font-bold ${
                  selectedSummaryFilter === "expiring" ? 'text-orange-700' : 'text-gray-900'
                }`}>
                  {summary.expiringThisMonth.toLocaleString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Filters Indicator */}
      {(selectedPlan !== "all" || selectedSummaryFilter !== "all") && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Active filters:</span>
          {selectedPlan !== "all" && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Plan: {planStats.find(p => p.planSlug === selectedPlan)?.planName || selectedPlan}
              <button 
                onClick={onClearPlanFilter}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedSummaryFilter !== "all" && (
            <Badge variant="secondary" className={`${
              selectedSummaryFilter === "active" ? "bg-green-100 text-green-700" :
              selectedSummaryFilter === "pending" ? "bg-yellow-100 text-yellow-700" :
              "bg-orange-100 text-orange-700"
            }`}>
              {selectedSummaryFilter === "active" ? "Active Companies" :
               selectedSummaryFilter === "pending" ? "Pending Companies" :
               "Expiring This Month"}
              <button 
                onClick={onClearSummaryFilter}
                className="ml-1 hover:opacity-75"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}