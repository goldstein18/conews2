"use client";

import { useState } from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import { toast } from 'sonner';
import { GENERATE_LOGO_UPLOAD_URL, UPDATE_COMPANY_LOGO, REMOVE_COMPANY_LOGO, MY_COMPANY_PROFILE } from '@/lib/graphql/settings';
import { useCompanyId } from './use-settings-data';
import { PresignedUrlResponse } from '@/lib/services/s3-upload.service';

export function useUploadLogo() {
  const client = useApolloClient();
  const { companyId } = useCompanyId();
  const [isUploading, setIsUploading] = useState(false);

  const [generateUrl] = useMutation(GENERATE_LOGO_UPLOAD_URL, {
    onError: (error) => {
      console.error('🚨 GraphQL Error generating upload URL:', error);
      console.error('🚨 GraphQL Error details:', JSON.stringify(error, null, 2));
      console.error('🚨 CompanyId being used:', companyId);
      toast.error(`Failed to generate upload URL: ${error.message}`);
    }
  });

  const [updateLogo] = useMutation(UPDATE_COMPANY_LOGO, {
    onCompleted: () => {
      toast.success('Company logo updated successfully');
      // Refetch company profile to get updated logo
      client.refetchQueries({ include: [MY_COMPANY_PROFILE] });
    },
    onError: (error) => {
      console.error('🚨 GraphQL Error updating company logo:', error);
      console.error('🚨 GraphQL Error details:', JSON.stringify(error, null, 2));
      console.error('🚨 CompanyId being used:', companyId);
      toast.error(`Failed to update company logo: ${error.message}`);
    }
  });

  const [removeLogo] = useMutation(REMOVE_COMPANY_LOGO, {
    onCompleted: () => {
      toast.success('Company logo removed successfully');
      // Refetch company profile to get updated logo
      client.refetchQueries({ include: [MY_COMPANY_PROFILE] });
    },
    onError: (error) => {
      console.error('🚨 GraphQL Error removing company logo:', error);
      console.error('🚨 GraphQL Error details:', JSON.stringify(error, null, 2));
      console.error('🚨 CompanyId being used:', companyId);
      toast.error(`Failed to remove company logo: ${error.message}`);
    }
  });

  const generatePresignedUrl = async (
    fileName: string,
    contentType: string,
    fileSize: number
  ): Promise<PresignedUrlResponse> => {
    if (!companyId) {
      throw new Error('Company ID not found');
    }

    try {
      setIsUploading(true);

      const response = await generateUrl({
        variables: {
          companyId,
          generateLogoUploadUrlInput: {
            fileName,
            contentType,
            fileSize
          }
        }
      });

      if (!response.data?.generateLogoUploadUrl) {
        throw new Error('Failed to generate presigned URL');
      }

      const presignedData = response.data.generateLogoUploadUrl;
      
      // Convert recommendedDimensions string to object if needed
      const dimensions = typeof presignedData.recommendedDimensions === 'string' 
        ? { width: 400, height: 400 } // Parse from "400x400px" if needed
        : presignedData.recommendedDimensions;

      return {
        ...presignedData,
        recommendedDimensions: dimensions
      };
    } catch (error) {
      console.error('Generate presigned URL error:', error);
      throw error;
    }
  };

  const handleUploadComplete = async (logoKey: string) => {
    if (!companyId) {
      toast.error('Company ID not found');
      setIsUploading(false);
      return;
    }

    try {
      await updateLogo({
        variables: {
          companyId,
          logoKey
        }
      });
    } catch (error) {
      console.error('Update logo error:', error);
      toast.error('Failed to update logo in database');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    setIsUploading(false);
  };

  const handleRemoveLogo = async () => {
    if (!companyId) {
      toast.error('Company ID not found');
      return;
    }

    try {
      setIsUploading(true);
      await removeLogo({
        variables: {
          companyId
        }
      });
    } catch (error) {
      console.error('Remove logo error:', error);
      toast.error('Failed to remove logo');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    generatePresignedUrl,
    handleUploadComplete,
    handleUploadError,
    handleRemoveLogo,
    isUploading,
    canUpload: Boolean(companyId)
  };
}