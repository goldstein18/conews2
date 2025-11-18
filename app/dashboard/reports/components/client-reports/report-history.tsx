"use client";

import { useQuery } from "@apollo/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  Calendar, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Loader2,
  RefreshCw
} from "lucide-react";
import { LIST_CLIENT_ASSET_REPORTS, ClientAssetReport } from "@/lib/graphql/asset-reports";
import { format } from "date-fns";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface ReportHistoryProps {
  companyId: string;
}

export function ReportHistory({ companyId }: ReportHistoryProps) {
  const { data, loading, error, refetch } = useQuery(LIST_CLIENT_ASSET_REPORTS, {
    variables: {
      companyId,
      first: 10,
    },
    errorPolicy: 'all',
  });

  const reports: ClientAssetReport[] = data?.listClientAssetReports || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'GENERATING':
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'FAILED':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'GENERATING':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDownload = (reportUrl: string) => {
    if (reportUrl) {
      window.open(reportUrl, '_blank');
      toast.success('Download started');
    } else {
      toast.error('Download URL not available');
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Report history refreshed');
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report History</CardTitle>
          <CardDescription>Previous reports generated for this client</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-700">Error Loading History</h3>
              <p className="text-sm text-muted-foreground">
                Failed to load report history. Please try refreshing.
              </p>
            </div>
            <Button variant="outline" onClick={handleRefresh} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Report History</CardTitle>
            <CardDescription>Previous reports generated for this client</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 text-muted-foreground">
            <FileText className="h-12 w-12" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">No Reports Generated</h3>
              <p className="text-sm">
                No reports have been generated for this client yet.<br />
                Generate your first report using the form above.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    {/* Status and Date Range */}
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(report.status)}
                      <Badge variant="outline" className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <span className="text-sm font-medium">
                        {format(new Date(report.startDate), 'MMM dd')} - {' '}
                        {format(new Date(report.endDate), 'MMM dd, yyyy')}
                      </span>
                    </div>

                    {/* Generated by and date */}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>
                          {report.user.firstName} {report.user.lastName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {format(new Date(report.createdAt), 'MMM dd, yyyy \'at\' h:mm a')}
                        </span>
                      </div>
                      {report.fileSize && (
                        <span>
                          {(report.fileSize / 1024).toFixed(1)} KB
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {report.status === 'COMPLETED' && report.reportUrl ? (
                      <Button
                        size="sm"
                        onClick={() => handleDownload(report.reportUrl!)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    ) : report.status === 'GENERATING' || report.status === 'PENDING' ? (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : report.status === 'FAILED' ? (
                      <Badge variant="destructive" className="text-xs">
                        Failed
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {report.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {reports.length >= 10 && (
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing last 10 reports. Contact support if you need access to older reports.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}