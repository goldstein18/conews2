'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  Link as LinkIcon,
  Calendar,
  Palette,
  Monitor,
  Smartphone,
  ImageIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';
import { useMarqueeMediaUpload } from '../../../create/hooks';
import type { Marquee } from '@/types/marquee';
import {
  marqueeEditSchema,
  MarqueeEditFormData,
  MARKET_OPTIONS,
  BUTTON_FONT_WEIGHT_OPTIONS,
} from '../../../lib/validations';

interface MarqueeEditFormProps {
  marquee: Marquee;
  onSubmit: (data: MarqueeEditFormData) => void;
  loading?: boolean;
}

type MediaType = 'image' | 'video' | 'none';

export function MarqueeEditForm({ marquee, onSubmit, loading = false }: MarqueeEditFormProps) {
  const [desktopMediaType, setDesktopMediaType] = useState<MediaType>(
    marquee.desktopImage ? 'image' : marquee.desktopVideo ? 'video' : 'none'
  );
  const [mobileMediaType, setMobileMediaType] = useState<MediaType>(
    marquee.mobileImage ? 'image' : marquee.mobileVideo ? 'video' : 'none'
  );

  const form = useForm<MarqueeEditFormData>({
    resolver: zodResolver(marqueeEditSchema),
    defaultValues: {
      name: marquee.name || '',
      link: marquee.link || '',
      startDate: marquee.startDate ? new Date(marquee.startDate).toISOString().split('T')[0] : '',
      endDate: marquee.endDate ? new Date(marquee.endDate).toISOString().split('T')[0] : '',
      market: marquee.market || 'miami',
      companyId: marquee.companyId || '',
      buttonText: marquee.buttonText || '',
      buttonColor: marquee.buttonColor || '',
      buttonFontWeight: marquee.buttonFontWeight,
      desktopImage: marquee.desktopImage || '',
      desktopVideo: marquee.desktopVideo || '',
      mobileImage: marquee.mobileImage || '',
      mobileVideo: marquee.mobileVideo || '',
    },
  });

  const desktopImageUpload = useMarqueeMediaUpload({
    marqueeId: marquee.id,
    mediaType: 'desktop',
    onUploadComplete: (imageKey) => {
      form.setValue('desktopImage', imageKey);
    },
  });

  const mobileImageUpload = useMarqueeMediaUpload({
    marqueeId: marquee.id,
    mediaType: 'mobile',
    onUploadComplete: (imageKey) => {
      form.setValue('mobileImage', imageKey);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-24">
        {/* Company Info (Read-only) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span>Company Assignment</span>
            </CardTitle>
            <CardDescription>
              Company associated with this marquee (read-only)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Company:</span> {marquee.company?.name || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Marquee Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LinkIcon className="h-5 w-5" />
              <span>Marquee Information</span>
            </CardTitle>
            <CardDescription>Update basic marquee settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marquee Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Summer Festival 2025"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link URL *</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/event"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    URL where users will be directed when clicking
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loading}
                  >
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Display Period */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Display Period</span>
            </CardTitle>
            <CardDescription>Update display dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={loading} />
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
                    <FormLabel>End Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Button Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Button Configuration</span>
            </CardTitle>
            <CardDescription>Update button customization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="buttonText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Text</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Get Tickets Now"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="buttonColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Color</FormLabel>
                    <FormControl>
                      <Input
                        type="color"
                        {...field}
                        disabled={loading}
                        className="h-10"
                      />
                    </FormControl>
                    <FormDescription>Hex color code</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonFontWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font Weight</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select font weight" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BUTTON_FONT_WEIGHT_OPTIONS.map((option) => (
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
            </div>
          </CardContent>
        </Card>

        {/* Desktop Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <span>Desktop Media</span>
            </CardTitle>
            <CardDescription>
              Update media for desktop display (1920x600px recommended)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormItem>
              <FormLabel>Media Type</FormLabel>
              <RadioGroup
                value={desktopMediaType}
                onValueChange={(value) => setDesktopMediaType(value as MediaType)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="edit-desktop-none" />
                  <label htmlFor="edit-desktop-none" className="text-sm cursor-pointer">
                    No media
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="edit-desktop-image" />
                  <label htmlFor="edit-desktop-image" className="text-sm cursor-pointer">
                    Image
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="edit-desktop-video" />
                  <label htmlFor="edit-desktop-video" className="text-sm cursor-pointer">
                    Video (placeholder)
                  </label>
                </div>
              </RadioGroup>
            </FormItem>

            {desktopMediaType === 'image' && (
              <FormField
                control={form.control}
                name="desktopImage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploadAdvanced
                        config={desktopImageUpload.config}
                        generatePresignedUrl={desktopImageUpload.generatePresignedUrl}
                        onUploadComplete={desktopImageUpload.handleUploadComplete}
                        onUploadError={desktopImageUpload.handleUploadError}
                        currentImageUrl={marquee.desktopImageUrl || field.value}
                        label="Desktop Image"
                        description="Upload desktop image (1920x600px)"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Mobile Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Mobile Media</span>
            </CardTitle>
            <CardDescription>
              Update media for mobile display (768x432px recommended)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormItem>
              <FormLabel>Media Type</FormLabel>
              <RadioGroup
                value={mobileMediaType}
                onValueChange={(value) => setMobileMediaType(value as MediaType)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="edit-mobile-none" />
                  <label htmlFor="edit-mobile-none" className="text-sm cursor-pointer">
                    No media
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="edit-mobile-image" />
                  <label htmlFor="edit-mobile-image" className="text-sm cursor-pointer">
                    Image
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="edit-mobile-video" />
                  <label htmlFor="edit-mobile-video" className="text-sm cursor-pointer">
                    Video (placeholder)
                  </label>
                </div>
              </RadioGroup>
            </FormItem>

            {mobileMediaType === 'image' && (
              <FormField
                control={form.control}
                name="mobileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploadAdvanced
                        config={mobileImageUpload.config}
                        generatePresignedUrl={mobileImageUpload.generatePresignedUrl}
                        onUploadComplete={mobileImageUpload.handleUploadComplete}
                        onUploadError={mobileImageUpload.handleUploadError}
                        currentImageUrl={marquee.mobileImageUrl || field.value}
                        label="Mobile Image"
                        description="Upload mobile image (768x432px)"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Info Alert */}
        <Alert className="border-blue-200 bg-blue-50">
          <ImageIcon className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Note:</strong> Changes will be saved when you click the Update button at the bottom of the page.
          </AlertDescription>
        </Alert>
      </form>
    </Form>
  );
}
