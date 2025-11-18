"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { RevenueStats } from "@/types/dashboard";

interface DashboardRevenueCardProps {
  revenue: RevenueStats;
}

export function DashboardRevenueCard({ revenue }: DashboardRevenueCardProps) {
  const isPositiveGrowth = revenue.growthRate >= 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Revenue (MTD)</CardTitle>
            <CardDescription>Month-to-date financial metrics</CardDescription>
          </div>
          <DollarSign className="h-8 w-8 text-green-600" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Revenue */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              ${revenue.currentMonthRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-sm text-gray-600">Current Month</p>
          </div>
          <div className={`flex items-center space-x-1 ${
            isPositiveGrowth ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositiveGrowth ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            <span className="text-xl font-bold">
              {isPositiveGrowth ? '+' : ''}{revenue.growthRate.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Revenue by Plan */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700">Revenue by Plan</h4>
          <div className="grid grid-cols-2 gap-3">
            {revenue.revenueByPlan.map((plan) => (
              <div key={plan.planName} className="space-y-1">
                <p className="text-xs text-gray-600">{plan.planName}</p>
                <p className="text-lg font-bold text-gray-900">
                  ${plan.revenue.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {plan.companiesCount} {plan.companiesCount === 1 ? 'company' : 'companies'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-gray-600">Avg per Company</p>
            <p className="text-lg font-semibold text-gray-900">
              ${revenue.averageRevenuePerCompany.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Paying Companies</p>
            <p className="text-lg font-semibold text-gray-900">
              {revenue.totalPayingCompanies}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
