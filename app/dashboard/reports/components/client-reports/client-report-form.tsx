"use client";

// Form component for generating client asset reports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useLazyQuery } from "@apollo/client";
import { toast } from "sonner";

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, FileText, Loader2 } from "lucide-react";

// Internal Components
import { DatePickerRange, DateRangePresets } from "../common";

// GraphQL and Validation
import { 
  PREVIEW_CLIENT_ASSET_REPORT,
  GENERATE_CLIENT_ASSET_REPORT,
  GenerateClientAssetReportVariables,
  PreviewClientAssetReportVariables 
} from "@/lib/graphql/asset-reports";
import { 
  clientReportSchema, 
  ClientReportFormData, 
  // defaultClientReportValues,
  getDefaultStartDate,
  getDefaultEndDate 
} from "../../lib/validations";

// Store
import { useReportsStore } from "@/store/reports-store";

interface Company {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface ClientReportFormProps {
  companies: Company[];
}

export function ClientReportForm({ companies }: ClientReportFormProps) {
  const {
    clientReports,
    setClientCompany,
    setClientDateRange,
    setIncludeEvents,
    setIncludeBanners,
    setReportStatus,
    setPreviewData,
    setCurrentReportId,
  } = useReportsStore();

  const [previewMutation] = useLazyQuery(PREVIEW_CLIENT_ASSET_REPORT);
  const [generateMutation] = useMutation(GENERATE_CLIENT_ASSET_REPORT);

  const form = useForm<ClientReportFormData>({
    resolver: zodResolver(clientReportSchema),
    defaultValues: {
      companyId: clientReports.selectedCompany || '',
      startDate: clientReports.startDate || getDefaultStartDate(),
      endDate: clientReports.endDate || getDefaultEndDate(),
      includeEvents: clientReports.includeEvents,
      includeBanners: clientReports.includeBanners,
    },
  });

  const { watch, handleSubmit, setValue } = form;
  const watchedValues = watch();

  // Update store when form values change
  const handleCompanyChange = (companyId: string) => {
    setClientCompany(companyId);
    setValue('companyId', companyId);
  };

  const handleDateRangeChange = (startDate: Date | null, endDate: Date | null) => {
    setClientDateRange(startDate, endDate);
    if (startDate) setValue('startDate', startDate);
    if (endDate) setValue('endDate', endDate);
  };

  const handlePresetSelect = (start: Date, end: Date) => {
    handleDateRangeChange(start, end);
  };

  const handleIncludeEventsChange = (checked: boolean) => {
    setIncludeEvents(checked);
    setValue('includeEvents', checked);
  };

  const handleIncludeBannersChange = (checked: boolean) => {
    setIncludeBanners(checked);
    setValue('includeBanners', checked);
  };

  // Preview report
  const handlePreviewReport = async () => {
    const values = form.getValues();
    
    try {
      setReportStatus('previewing');
      setPreviewData(null);

      const variables: PreviewClientAssetReportVariables = {
        companyId: values.companyId,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        includeEvents: values.includeEvents,
        includeBanners: values.includeBanners,
      };

      const { data } = await previewMutation({
        variables,
      });

      if (data?.previewClientAssetReport) {
        setPreviewData(data.previewClientAssetReport);
        setReportStatus('idle');
        toast.success('Report preview generated successfully');
      }
    } catch (error) {
      console.error('Preview error:', error);
      setReportStatus('failed');
      toast.error('Failed to generate report preview. Please try again.');
    }
  };

  // Generate actual report
  const handleGenerateReport = async (data: ClientReportFormData) => {
    try {
      setReportStatus('generating');
      setCurrentReportId(null);

      const variables: GenerateClientAssetReportVariables = {
        companyId: data.companyId,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        includeEvents: data.includeEvents,
        includeBanners: data.includeBanners,
      };

      const { data: result } = await generateMutation({
        variables,
      });

      if (result?.generateClientAssetReport) {
        const report = result.generateClientAssetReport;
        setCurrentReportId(report.id);
        setReportStatus('polling');
        toast.success('Report generation started. We\'ll notify you when it\'s ready.');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setReportStatus('failed');
      toast.error('Failed to generate report. Please try again.');
    }
  };

  const isGenerating = clientReports.reportStatus === 'generating' || clientReports.reportStatus === 'polling';
  const isPreviewing = clientReports.reportStatus === 'previewing';
  
  // Custom validation check that's more reliable than form.formState.isValid
  const isFormValidForPreview = () => {
    const values = watchedValues;
    return (
      values.companyId && 
      values.startDate && 
      values.endDate && 
      values.endDate >= values.startDate &&
      (values.includeEvents || values.includeBanners)
    );
  };
  
  const canPreview = isFormValidForPreview();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Asset Reports</CardTitle>
        <CardDescription>
          Generate detailed asset performance reports for specific organizations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleGenerateReport)} className="space-y-4">
            {/* Company Selection */}
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleCompanyChange}
                    disabled={isGenerating}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{company.name}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              company.status === 'ACTIVE' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {company.status}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Range Selection */}
            <div className="space-y-4">
              <FormLabel>Date Range</FormLabel>
              <DatePickerRange
                startDate={watchedValues.startDate}
                endDate={watchedValues.endDate}
                onStartDateChange={(date) => handleDateRangeChange(date, watchedValues.endDate)}
                onEndDateChange={(date) => handleDateRangeChange(watchedValues.startDate, date)}
                disabled={isGenerating}
              />
              
              {/* Date Range Presets */}
              <DateRangePresets
                onPresetSelect={handlePresetSelect}
                className="mt-2"
              />
            </div>

            {/* Asset Type Selection */}
            <div className="space-y-3">
              <FormLabel>Asset Type (Optional)</FormLabel>
              
              <FormField
                control={form.control}
                name="includeEvents"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={handleIncludeEventsChange}
                        disabled={isGenerating}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Include Events</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="includeBanners"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={handleIncludeBannersChange}
                        disabled={isGenerating}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Include Banners</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviewReport}
                disabled={!canPreview || isPreviewing || isGenerating}
                className="flex-1"
              >
                {isPreviewing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Preview...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Report
                  </>
                )}
              </Button>
              
              <Button
                type="submit"
                disabled={!canPreview || isGenerating || isPreviewing}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}