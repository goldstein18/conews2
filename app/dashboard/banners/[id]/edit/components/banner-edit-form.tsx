"use client";

import { useState, forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as LinkIcon, Info, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { useQuery } from '@apollo/client';
import { useAuthStore } from '@/store/auth-store';
import { isSuperAdmin, isAdmin } from '@/lib/roles';
import { GET_ALL_COMPANIES_FOR_DROPDOWN } from '@/lib/graphql/banners';
import { useBannerImageUpload } from '../../../create/hooks/use-banner-image-upload';
import { Banner, BannerType } from '@/types/banners';
import { 
  bannerEditSchema, 
  BannerEditFormData, 
  MARKET_OPTIONS 
} from '../../../lib/validations';
import { getBannerDimensions } from '../../../utils';


// Helper function to format date for input
const formatDateForInput = (date: string): string => {
  return new Date(date).toISOString().split('T')[0];
};


export interface BannerEditFormProps {
  banner: Banner;
  onSubmit: (data: BannerEditFormData) => void;
  loading?: boolean;
}

export interface BannerEditFormRef {
  handleSubmit: () => void;
}

export const BannerEditForm = forwardRef<BannerEditFormRef, BannerEditFormProps>(({
  banner,
  onSubmit,
  loading = false
}, ref) => {
  const { user } = useAuthStore();
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Determine if user can select company
  const canSelectCompany = user && (isSuperAdmin(user) || isAdmin(user));

  // Companies dropdown data (for super admin/admin)
  const { data: companiesData, loading: companiesLoading } = useQuery(GET_ALL_COMPANIES_FOR_DROPDOWN, {
    skip: !canSelectCompany,
    errorPolicy: 'all'
  });

  const editSchema = bannerEditSchema();
  
  const form = useForm<BannerEditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: banner.name || '',
      market: banner.market || '',
      link: banner.link || '',
      startDate: formatDateForInput(banner.startDate),
      endDate: formatDateForInput(banner.endDate),
      companyId: banner.companyId || '',
      zoneId: banner.zoneId || '',
      image: banner.image || ''
    }
  });

  // Set up image upload hook
  const {
    config,
    generatePresignedUrl,
    handleUploadComplete,
    handleUploadError
  } = useBannerImageUpload({
    bannerId: banner.id,
    bannerType: banner.bannerType,
    onUploadComplete: (imageKey) => {
      form.setValue('image', imageKey);
      setUploadError(null);
    },
    onUploadError: (error) => {
      setUploadError(error);
    }
  });

  useImperativeHandle(ref, () => ({
    handleSubmit: () => {
      form.handleSubmit(onSubmit)();
    }
  }));

  // Get banner type display info from MODULE_CONFIGS
  const bannerTypeInfo = getBannerDimensions(banner.bannerType);

  return (
    <div className="space-y-8 pb-24"> {/* Add bottom padding for fixed action bar */}
      {/* Banner Type Display */}
      <div className="rounded-lg border bg-green-50 border-green-200 p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-100 rounded-md">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">{bannerTypeInfo.label}</h3>
            <p className="text-sm text-green-700">
              {bannerTypeInfo.dimensions} - {bannerTypeInfo.description}
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Company Assignment Section (only for super admin/admin) */}
          {canSelectCompany && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <span>Company Assignment</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Change which company this banner belongs to
                </p>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a company" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companiesLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading companies...
                            </SelectItem>
                          ) : (
                            companiesData?.companies?.map((company: { id: string; name: string }) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This banner will be managed under the selected company
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Banner Configuration Section */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Update basic banner settings and details
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Banner Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter banner name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose a clear name to identify this banner
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Market and Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Select Market */}
                <FormField
                  control={form.control}
                  name="market"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a market" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MARKET_OPTIONS.map((market) => (
                            <SelectItem key={market.value} value={market.value}>
                              {market.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the market where this banner runs
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Banner Link URL */}
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Link URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="https://example.com"
                            className="pl-9"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Where users go when clicking the banner
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              {/* Display Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Zone ID for specific banner types */}
              {(['BLUE', 'GREEN', 'RED'] as BannerType[]).includes(banner.bannerType) && (
                <FormField
                  control={form.control}
                  name="zoneId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre Page (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter genre page ID"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Specific page or zone ID for {banner.bannerType.toLowerCase()} banner placement
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Banner Image Section */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Image</CardTitle>
              <p className="text-sm text-muted-foreground">
                Update the banner image (optional)
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploadAdvanced
                        config={config}
                        generatePresignedUrl={generatePresignedUrl}
                        onUploadComplete={(imageKey) => {
                          field.onChange(imageKey);
                          handleUploadComplete(imageKey);
                        }}
                        onUploadError={(error) => {
                          setUploadError(error);
                          handleUploadError(error);
                        }}
                        currentImageUrl={banner.imageUrl || field.value}
                        disabled={loading}
                        description={`Upload a banner image (${bannerTypeInfo.dimensions})`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {uploadError && (
                <Alert className="border-red-200 bg-red-50">
                  <Info className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {uploadError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Best Practice Notice */}
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Best Practice:</strong> Use little text on banners - they link to the information. 
                  Banners with a lot of text (address, website, etc.) look unprofessional and don&apos;t perform as well.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
});

BannerEditForm.displayName = 'BannerEditForm';