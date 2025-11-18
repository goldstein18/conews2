"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Building } from "lucide-react";
import { CompaniesInsights } from "@/types/dashboard";
import moment from "moment";

interface DashboardRecentActivityProps {
  companies: CompaniesInsights;
}

const statusColors: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; className: string }> = {
  ACTIVE: { variant: "default", className: "bg-green-100 text-green-700 hover:bg-green-200" },
  PENDING: { variant: "secondary", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
  SUSPENDED: { variant: "destructive", className: "bg-red-100 text-red-700 hover:bg-red-200" },
};

export function DashboardRecentActivity({ companies }: DashboardRecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Recent Activity</span>
        </CardTitle>
        <CardDescription>Latest companies created on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {companies.lastCreated.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No recent companies</p>
            </div>
          ) : (
            companies.lastCreated.map((company) => {
              const statusConfig = statusColors[company.status] || statusColors.PENDING;

              return (
                <div
                  key={company.id}
                  className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium leading-none text-gray-900">
                          {company.name}
                        </p>
                        <Badge variant={statusConfig.variant} className={statusConfig.className}>
                          {company.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {company.email} • {company.city}, {company.market}
                      </p>
                      <p className="text-xs text-gray-500">
                        Owner: {company.ownerName} ({company.ownerEmail})
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {company.planName}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      {moment(company.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Expiring Companies Alert */}
        {companies.expiringThisMonth.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-medium text-orange-700 mb-3 flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Expiring This Month ({companies.expiringThisMonth.length})</span>
            </h4>
            <div className="space-y-2">
              {companies.expiringThisMonth.slice(0, 3).map((company) => (
                <div key={company.id} className="flex items-center justify-between text-sm p-2 bg-orange-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{company.name}</p>
                    <p className="text-xs text-gray-600">{company.email}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                      {company.daysUntilExpiry} days left
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{company.planName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
