"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Search } from "lucide-react";
import { DatePickerRange, DateRangePresets } from "../common";
import { useReportsStore, AssetType } from "@/store/reports-store";
import { 
  analyticsSchema, 
  AnalyticsFormData, 
  ASSET_TYPE_OPTIONS,
  getDefaultStartDate,
  getDefaultEndDate 
} from "../../lib/validations";
import { toast } from "sonner";

export function AnalyticsFilters() {
  const {
    analytics,
    setAnalyticsDateRange,
    setAnalyticsAssetType,
    setAnalyticsLoading,
    setAnalyticsData,
  } = useReportsStore();

  const form = useForm<AnalyticsFormData>({
    resolver: zodResolver(analyticsSchema),
    defaultValues: {
      startDate: analytics.startDate || getDefaultStartDate(),
      endDate: analytics.endDate || getDefaultEndDate(),
      assetType: analytics.assetType,
    },
  });

  const { watch, setValue } = form;
  const watchedValues = watch();

  // Update store when form values change
  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    setAnalyticsDateRange(startDate, endDate);
    if (startDate) setValue('startDate', startDate);
    if (endDate) setValue('endDate', endDate);
  };

  const handleAssetTypeChange = (assetType: AssetType) => {
    setAnalyticsAssetType(assetType);
    setValue('assetType', assetType);
  };

  const handlePresetSelect = (start: Date, end: Date) => {
    handleDateRangeChange(start, end);
  };

  // Simulate loading analytics data
  const handleLoadAnalytics = async () => {
    if (!form.formState.isValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setAnalyticsLoading(true);
      setAnalyticsData(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock data for demonstration
      const mockData = {
        totalAssets: Math.floor(Math.random() * 500) + 200,
        totalReach: Math.floor(Math.random() * 3000000) + 1000000,
        totalClicks: Math.floor(Math.random() * 100000) + 20000,
        topPerformingAsset: {
          type: watchedValues.assetType === 'ALL' ? 'Premium Banner' : 
                watchedValues.assetType === 'EVENTS' ? 'Featured Event' : 'Premium Banner',
          name: watchedValues.assetType === 'EVENTS' ? 'Miami Art Week 2024' : 'Premium Brand Campaign',
          ctr: Math.random() * 5 + 1,
        },
        monthlyPerformance: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
          impressions: Math.floor(Math.random() * 300000) + 100000,
          clicks: Math.floor(Math.random() * 15000) + 3000,
          ctr: Math.random() * 4 + 1,
        })),
        topAssetTypes: [
          {
            type: 'Premium Banner',
            activeAssets: 45,
            impressions: Math.floor(Math.random() * 500000) + 200000,
            clicks: Math.floor(Math.random() * 25000) + 10000,
            ctr: 3.2,
          },
          {
            type: 'eScoop',
            activeAssets: 12,
            impressions: Math.floor(Math.random() * 300000) + 100000,
            clicks: Math.floor(Math.random() * 15000) + 5000,
            ctr: 2.8,
          },
          {
            type: 'Calendar Featured Event',
            activeAssets: 28,
            impressions: Math.floor(Math.random() * 200000) + 80000,
            clicks: Math.floor(Math.random() * 10000) + 3000,
            ctr: 2.5,
          },
          {
            type: 'ROS Banner',
            activeAssets: 35,
            impressions: Math.floor(Math.random() * 400000) + 150000,
            clicks: Math.floor(Math.random() * 20000) + 7000,
            ctr: 2.1,
          },
          {
            type: 'Blue Banner',
            activeAssets: 16,
            impressions: Math.floor(Math.random() * 150000) + 50000,
            clicks: Math.floor(Math.random() * 8000) + 2000,
            ctr: 1.8,
          },
        ],
      };

      setAnalyticsData(mockData);
      toast.success('Analytics data loaded successfully');
    } catch (error) {
      console.error('Analytics error:', error);
      toast.error('Failed to load analytics data. Please try again.');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!analytics.statsData) {
      toast.error('No data available for export');
      return;
    }

    toast.success('CSV export feature coming soon');
  };

  const handleExportPDF = () => {
    if (!analytics.statsData) {
      toast.error('No data available for export');
      return;
    }

    toast.success('PDF export feature coming soon');
  };

  const isLoadingDisabled = analytics.loading;
  const hasData = !!analytics.statsData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Analytics</CardTitle>
        <CardDescription>
          View asset performance across all placements and clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-6">
            {/* Date Range and Asset Type Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Date Range - spans 2 columns on large screens */}
              <div className="lg:col-span-2 space-y-4">
                <FormLabel>Date Range</FormLabel>
                <DatePickerRange
                  startDate={watchedValues.startDate}
                  endDate={watchedValues.endDate}
                  onStartDateChange={(date) => handleDateRangeChange(date, watchedValues.endDate)}
                  onEndDateChange={(date) => handleDateRangeChange(watchedValues.startDate, date)}
                  disabled={isLoadingDisabled}
                />
                
                {/* Date Range Presets */}
                <DateRangePresets
                  onPresetSelect={handlePresetSelect}
                />
              </div>

              {/* Asset Type */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="assetType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={handleAssetTypeChange}
                        disabled={isLoadingDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select asset type..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ASSET_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Export Buttons - only show when data is available */}
                {hasData && (
                  <div className="space-y-2 pt-4">
                    <FormLabel className="text-sm">Export Data</FormLabel>
                    <div className="flex flex-col space-y-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleExportCSV}
                        className="justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleExportPDF}
                        className="justify-start"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Load Analytics Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="button"
                onClick={handleLoadAnalytics}
                disabled={!form.formState.isValid || isLoadingDisabled}
                size="lg"
                className="min-w-48"
              >
                {isLoadingDisabled ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Loading Analytics...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Load Analytics
                  </>
                )}
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}