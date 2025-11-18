'use client';

import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useDedicatedBuilderStore } from '@/store/dedicated-builder-store';
import { GET_DEDICATED } from '@/lib/graphql/dedicated';
import type { Dedicated } from '@/types/dedicated';

interface UseDedicatedBuilderProps {
  dedicatedId: string;
  dedicated?: Dedicated | null;
}

/**
 * Main hook for dedicated builder
 * Initializes and manages builder state
 */
export function useDedicatedBuilder({ dedicatedId, dedicated }: UseDedicatedBuilderProps) {
  const {
    setCurrentDedicatedId,
    setGeneratedHtml,
    setCampaignId,
    setCampaignStatus,
    setSelectedBrevoLists,
    setSelectedBrevoSegments,
    reset
  } = useDedicatedBuilderStore();

  // Fetch dedicated data if not provided
  const { data, loading: dedicatedLoading, error } = useQuery(GET_DEDICATED, {
    variables: { id: dedicatedId },
    skip: !!dedicated || !dedicatedId,
    errorPolicy: 'all'
  });

  const dedicatedData = dedicated || data?.dedicated;

  // Initialize builder with dedicated ID
  useEffect(() => {
    if (dedicatedId) {
      setCurrentDedicatedId(dedicatedId);
    }

    // Cleanup on unmount
    return () => {
      reset();
    };
  }, [dedicatedId, setCurrentDedicatedId, reset]);

  // Load existing campaign data if present
  useEffect(() => {
    if (dedicatedData?.campaign) {
      const campaign = dedicatedData.campaign;

      console.log('Loading existing campaign:', campaign);

      // Set campaign ID (Brevo campaign ID)
      setCampaignId(campaign.brevoCampaignId);

      // Set campaign status based on Brevo status
      if (campaign.status === 'sent') {
        setCampaignStatus('sent');
      } else if (campaign.status === 'scheduled' || campaign.scheduledAt) {
        setCampaignStatus('created'); // Scheduled counts as created
      } else {
        setCampaignStatus('created'); // Draft also counts as created
      }

      // Load selected lists and segments
      // Convert numbers to strings since Brevo API returns numbers but we use strings
      if (campaign.brevoLists && campaign.brevoLists.length > 0) {
        const listIds = campaign.brevoLists.map((id: string | number) => String(id));
        setSelectedBrevoLists(listIds);
      }

      if (campaign.brevoSegments && campaign.brevoSegments.length > 0) {
        const segmentIds = campaign.brevoSegments.map((id: string | number) => String(id));
        setSelectedBrevoSegments(segmentIds);
      }
    }
  }, [dedicatedData, setCampaignId, setCampaignStatus, setSelectedBrevoLists, setSelectedBrevoSegments]);

  // Generate initial HTML when dedicated data is loaded
  useEffect(() => {
    if (dedicatedData && dedicatedData.imageUrl && dedicatedData.imageUrl !== 'placeholder') {
      // The HTML will be generated in the preview panel
      console.log('Dedicated data loaded:', dedicatedData);
    }
  }, [dedicatedData, setGeneratedHtml]);

  return {
    dedicated: dedicatedData,
    loading: dedicatedLoading,
    error,
    isInitialized: !!dedicatedData
  };
}
