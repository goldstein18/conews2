"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';

import { useUpdateCompanyProfile, useUpdateSocialChannels } from '../hooks';
import { useUploadLogo } from '../hooks/use-upload-logo';
import { formatPhoneNumber, normalizeUrl, validateUrl, getSocialPlatformName, getSocialPlatformPlaceholder } from '../utils';
import { CompanyProfile, SocialChannels } from '../hooks/use-settings-data';

const organizationSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  organizationType: z.string().min(1, 'Organization type is required'),
  website: z.string().optional(),
  phone: z.string().optional(),
});

const socialChannelsSchema = z.object({
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  website: z.string().optional(),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;
type SocialChannelsFormData = z.infer<typeof socialChannelsSchema>;

const organizationTypes = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Non-profit',
  'Government',
  'Retail',
  'Manufacturing',
  'Entertainment',
  'Other'
];

interface OrganizationProfileProps {
  profile?: CompanyProfile;
  socialNetworks?: SocialChannels;
}

export function OrganizationProfile({ profile, socialNetworks }: OrganizationProfileProps) {
  const { updateCompanyProfile, loading: updateLoading } = useUpdateCompanyProfile();
  const { updateSocialChannels, loading: socialLoading } = useUpdateSocialChannels();
  const { generatePresignedUrl, handleUploadComplete, handleUploadError, handleRemoveLogo, isUploading } = useUploadLogo();

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSocial, setIsEditingSocial] = useState(false);

  // Organization form with proper default values
  const organizationForm = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    values: {
      name: profile?.name || '',
      organizationType: 'Technology',
      website: '',
      phone: profile?.phone || '',
    },
  });

  // Social channels form with proper default values
  // Use data from props (socialNetworks or fallback to profile.network.socialNetworks)
  const existingSocialNetworks = socialNetworks || profile?.network?.socialNetworks || {};
  
  const socialForm = useForm<SocialChannelsFormData>({
    resolver: zodResolver(socialChannelsSchema),
    values: {
      facebook: existingSocialNetworks?.facebook || '',
      instagram: existingSocialNetworks?.instagram || '',
      twitter: existingSocialNetworks?.twitter || '',
      linkedin: existingSocialNetworks?.linkedin || '',
      youtube: existingSocialNetworks?.youtube || '',
      tiktok: existingSocialNetworks?.tiktok || '',
      website: existingSocialNetworks?.website || '',
    },
  });

  const onOrganizationSubmit = async (data: OrganizationFormData) => {
    await updateCompanyProfile({
      name: data.name,
      phone: data.phone,
    });
    setIsEditing(false);
  };

  const onSocialSubmit = async (data: SocialChannelsFormData) => {
    // Normalize URLs
    const normalizedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value && validateUrl(value)) {
        acc[key] = normalizeUrl(value);
      } else if (value) {
        acc[key] = value; // Keep as is if not a valid URL (could be username)
      }
      return acc;
    }, {} as Record<string, string>);

    await updateSocialChannels(normalizedData);
    setIsEditingSocial(false); // Exit edit mode after successful save
  };

  const handlePhoneChange = (value: string, onChange: (value: string) => void) => {
    const formatted = formatPhoneNumber(value);
    onChange(formatted);
  };

  return (
    <div className="space-y-6">
      {/* Company Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Company Logo</CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.logoUrl ? (
            // Show current logo with remove option
            <div className="text-center space-y-4">
              <div className="mx-auto relative border border-gray-200 overflow-hidden bg-gray-50 w-48 h-32 rounded-lg">
                <Image
                  src={profile.logoUrl}
                  alt="Company Logo"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 192px"
                />
              </div>
              <p className="text-sm text-muted-foreground">Current company logo</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveLogo}
                disabled={isUploading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {isUploading ? 'Removing...' : 'Remove Logo'}
              </Button>
            </div>
          ) : (
            // Show upload area when no logo
            <FileUpload
              variant="logo"
              shape="square"
              generatePresignedUrl={generatePresignedUrl}
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              currentImageUrl={undefined} // Force no current image when in upload mode
              disabled={isUploading}
              description="JPEG or PNG, no larger than 10MB"
              label="Drag & drop or click to add company logo."
            />
          )}
        </CardContent>
      </Card>

      {/* Organization Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Organization Details</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            disabled={updateLoading}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...organizationForm}>
            <form onSubmit={organizationForm.handleSubmit(onOrganizationSubmit)} className="space-y-4">
              <FormField
                control={organizationForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Brooklyn Arts Collective"
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={organizationForm.control}
                name="organizationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {organizationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={organizationForm.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. https://www.brooklynarts.com"
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={organizationForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. (123) 456-7890"
                        disabled={!isEditing}
                        onChange={(e) => handlePhoneChange(e.target.value, field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEditing && (
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={updateLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateLoading}>
                    {updateLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Social Channels */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Social Channels</CardTitle>
            <p className="text-sm text-muted-foreground">
              Connect your social accounts to enhance your profile and reach more audiences.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingSocial(!isEditingSocial)}
            disabled={socialLoading}
          >
            {isEditingSocial ? 'Cancel' : 'Edit'}
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...socialForm}>
            <form onSubmit={socialForm.handleSubmit(onSocialSubmit)} className="space-y-4">
              {(['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'website'] as const).map((platform) => (
                <FormField
                  key={platform}
                  control={socialForm.control}
                  name={platform}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <span>{getSocialPlatformName(platform)}</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={getSocialPlatformPlaceholder(platform)}
                          disabled={!isEditingSocial}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {isEditingSocial && (
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingSocial(false)}
                    disabled={socialLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={socialLoading}>
                    {socialLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {socialLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Ambassador Support */}
      <Card>
        <CardHeader>
          <CardTitle>Ambassador Support</CardTitle>
          <p className="text-sm text-muted-foreground">
            Request a visit from our Ambassador team for promotion and support opportunities.
          </p>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100">
            Request Ambassador Visit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}