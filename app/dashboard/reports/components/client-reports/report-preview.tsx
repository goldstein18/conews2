"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  BarChart3,
  MousePointerClick,
  Eye
} from "lucide-react";
import { useReportsStore } from "@/store/reports-store";
import { GET_CLIENT_ASSET_REPORT } from "@/lib/graphql/asset-reports";
import { toast } from "sonner";
import { format } from "date-fns";

export function ReportPreview() {
  const {
    clientReports,
    setReportStatus,
    // setCurrentReportId,
    // setPollingInterval,
  } = useReportsStore();

  // Poll for report status when generating
  const { data: reportData, startPolling, stopPolling } = useQuery(
    GET_CLIENT_ASSET_REPORT,
    {
      variables: { reportId: clientReports.currentReportId || '' },
      skip: !clientReports.currentReportId || clientReports.reportStatus !== 'polling',
      pollInterval: 5000, // Poll every 5 seconds
      errorPolicy: 'all',
      onCompleted: (data) => {
        if (data?.getClientAssetReport) {
          const report = data.getClientAssetReport;
          
          if (report.status === 'COMPLETED') {
            setReportStatus('completed');
            stopPolling();
            toast.success('Report generated successfully! Ready for download.');
          } else if (report.status === 'FAILED') {
            setReportStatus('failed');
            stopPolling();
            toast.error('Report generation failed. Please try again.');
          }
        }
      },
      onError: (error) => {
        console.error('Polling error:', error);
        setReportStatus('failed');
        stopPolling();
        toast.error('Error checking report status. Please try again.');
      },
    }
  );

  // Handle polling lifecycle
  useEffect(() => {
    if (clientReports.reportStatus === 'polling' && clientReports.currentReportId) {
      startPolling(5000);
    } else {
      stopPolling();
    }

    // Cleanup on unmount
    return () => stopPolling();
  }, [clientReports.reportStatus, clientReports.currentReportId, startPolling, stopPolling]);

  const handleDownloadReport = () => {
    const report = reportData?.getClientAssetReport;
    if (report?.reportUrl) {
      window.open(report.reportUrl, '_blank');
      toast.success('Download started');
    } else {
      toast.error('Download URL not available');
    }
  };

  const renderPreviewContent = () => {
    const { previewData, reportStatus } = clientReports;

    // Show loading state during preview generation
    if (reportStatus === 'previewing') {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">Generating Preview</h3>
            <p className="text-sm text-muted-foreground">
              Analyzing asset performance data...
            </p>
          </div>
        </div>
      );
    }

    // Show report generation status
    if (reportStatus === 'generating' || reportStatus === 'polling') {
      const report = reportData?.getClientAssetReport;
      
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="absolute -bottom-2 -right-2">
              <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                <Loader2 className="h-3 w-3 text-blue-600 animate-spin" />
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Generating Report</h3>
            <p className="text-sm text-muted-foreground">
              {reportStatus === 'generating' 
                ? 'Starting report generation...' 
                : 'Creating PDF and uploading to S3...'
              }
            </p>
            {report && (
              <div className="text-xs text-muted-foreground">
                Report ID: {report.id.slice(0, 8)}...
              </div>
            )}
          </div>
          
          <Progress value={reportStatus === 'generating' ? 25 : 75} className="w-48" />
        </div>
      );
    }

    // Show completed report
    if (reportStatus === 'completed') {
      const report = reportData?.getClientAssetReport;
      
      return (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-700">Report Ready!</h3>
              <p className="text-sm text-muted-foreground">
                Your asset performance report has been generated successfully
              </p>
            </div>
          </div>

          {report && (
            <div className="space-y-4">
              {/* Report Info */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{report.company.name} Report</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(report.startDate), 'MMM dd, yyyy')} - {' '}
                      {format(new Date(report.endDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {report.status}
                  </Badge>
                </div>
                
                {report.fileSize && (
                  <div className="text-xs text-muted-foreground">
                    File size: {(report.fileSize / 1024).toFixed(1)} KB
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Generated on {format(new Date(report.createdAt), 'MMM dd, yyyy \'at\' h:mm a')}
                </div>
              </div>

              {/* Download Button */}
              <Button 
                onClick={handleDownloadReport}
                className="w-full"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          )}
        </div>
      );
    }

    // Show failed state
    if (reportStatus === 'failed') {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-700">Generation Failed</h3>
            <p className="text-sm text-muted-foreground">
              There was an error generating your report. Please try again.
            </p>
          </div>
        </div>
      );
    }

    // Show preview data if available
    if (previewData) {
      return (
        <div className="space-y-6">
          <div className="text-center pb-4 border-b">
            <h3 className="text-lg font-semibold">Report Preview</h3>
            <p className="text-sm text-muted-foreground">
              Preview of the generated report before final export
            </p>
          </div>

          {/* Preview Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">
                {previewData.totalEvents}
              </div>
              <div className="text-sm text-blue-700">Total Events</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">
                {previewData.totalBanners}
              </div>
              <div className="text-sm text-green-700">Total Banners</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Eye className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">
                {previewData.totalBannerImpressions.toLocaleString()}
              </div>
              <div className="text-sm text-purple-700">Impressions</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <MousePointerClick className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">
                {previewData.totalBannerClicks.toLocaleString()}
              </div>
              <div className="text-sm text-orange-700">Clicks</div>
            </div>
          </div>

          {/* CTR */}
          {previewData.averageCtr > 0 && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-900">
                {previewData.averageCtr.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-700">Average CTR</div>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Select &quot;Generate Report&quot; to create a downloadable PDF with detailed analytics
          </p>
        </div>
      );
    }

    // Default empty state
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 text-muted-foreground">
        <FileText className="h-12 w-12" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Report Generated</h3>
          <p className="text-sm">
            Select a client and date range, then click &quot;Preview Report&quot;<br />
            to see a preview of the asset performance report.
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Preview</CardTitle>
        <CardDescription>
          Preview of the generated report before final export
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderPreviewContent()}
      </CardContent>
    </Card>
  );
}