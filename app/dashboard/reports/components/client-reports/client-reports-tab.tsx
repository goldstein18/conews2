"use client";

import { useQuery } from "@apollo/client";
import { GET_ALL_COMPANIES_FOR_DROPDOWN } from "@/lib/graphql/banners";
import { useReportsStore } from "@/store/reports-store";
import { ClientReportForm } from "./client-report-form";
import { ReportPreview } from "./report-preview";
import { ReportHistory } from "./report-history";
import { ClientReportFormSkeleton, ReportPreviewSkeleton } from "../common";
// import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ClientReportsTab() {
  const { clientReports } = useReportsStore();
  
  // Fetch companies for dropdown
  const { data: companiesData, loading: companiesLoading, error: companiesError } = useQuery(
    GET_ALL_COMPANIES_FOR_DROPDOWN,
    {
      errorPolicy: 'all',
    }
  );

  // Show loading state
  if (companiesLoading) {
    return (
      <div className="space-y-6">
        {/* Form and Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClientReportFormSkeleton />
          <ReportPreviewSkeleton />
        </div>
      </div>
    );
  }

  // Show error state
  if (companiesError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load companies. Please refresh the page to try again.
        </AlertDescription>
      </Alert>
    );
  }

  const companies = companiesData?.companies || [];

  return (
    <div className="space-y-6">
      {/* Form and Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Form */}
        <ClientReportForm companies={companies} />
        
        {/* Report Preview/Status */}
        <ReportPreview />
      </div>

      {/* Report History */}
      {clientReports.selectedCompany && (
        <ReportHistory companyId={clientReports.selectedCompany} />
      )}
    </div>
  );
}