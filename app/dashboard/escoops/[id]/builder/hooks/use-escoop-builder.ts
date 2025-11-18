import { useEffect } from 'react';
import { useEscoopBuilderStore, type EscoopBuilderEntry } from '@/store/escoop-builder-store';
import { useEscoopEntries } from './use-escoop-entries';
import type { Escoop } from '@/types/escoops';
import type { ApolloError } from '@apollo/client';

// Extended Escoop type with builder-specific fields
interface EscoopWithBuilder extends Escoop {
  campaignId?: number;
  restaurants?: Array<{
    id: string;
    position: number;
    restaurant: {
      id: string;
      name: string;
      slug: string;
      imageUrl?: string;
      address?: string;
      city?: string;
      state?: string;
    };
  }>;
  featuredEvents?: Array<{
    id: string;
    position: number;
    event: {
      id: string;
      title: string;
      slug: string;
      imageUrl?: string;
      startDate?: string;
      status: string;
    };
  }>;
  settings?: {
    id: string;
    subjectLine?: string;
    templateName?: string;
    brevoLists?: string[];
    brevoSegments?: string[];
    scheduleDate?: string;
  };
}

interface UseEscoopBuilderProps {
  escoopId: string;
  escoop?: EscoopWithBuilder | null;
}

interface UseEscoopBuilderReturn {
  entries: EscoopBuilderEntry[];
  entriesLoading: boolean;
  entriesError: ApolloError | undefined;
  refreshEntries: () => void;
  hasMoreEntries: boolean;
  loadMoreEntries: () => void;
  isInitialized: boolean;
}

export function useEscoopBuilder({
  escoopId,
  escoop
}: UseEscoopBuilderProps): UseEscoopBuilderReturn {
  console.log('useEscoopBuilder called with escoopId:', escoopId);

  const {
    currentEscoopId,
    selectedEntries,
    setSelectedEntries,
    resetForNewEscoop,
    loadRestaurantsFromAPI,
    loadFeaturedEventsFromAPI,
    updateSettings,
    setCampaignId,
    setCampaignStatus
  } = useEscoopBuilderStore();

  console.log('useEscoopBuilder store state:', {
    currentEscoopId,
    selectedEntriesCount: selectedEntries.length,
    escoopId
  });

  // Fetch escoop entries
  const {
    entries,
    loading: entriesLoading,
    error: entriesError,
    refetch: refreshEntries,
    hasNextPage: hasMoreEntries,
    loadMore: loadMoreEntries
  } = useEscoopEntries({
    escoopId,
    enabled: !!escoopId
  });

  // Initialize store when escoop changes
  useEffect(() => {
    if (escoopId && currentEscoopId !== escoopId) {
      console.log('🔄 Resetting store for new escoop:', escoopId);
      resetForNewEscoop(escoopId);
    }
  }, [escoopId, currentEscoopId, resetForNewEscoop]);

  // ✅ Clear any persisted restaurants/events on mount to ensure fresh state
  useEffect(() => {
    if (escoopId) {
      console.log('🧹 Clearing any unsaved restaurants/events from previous session');
      // This ensures we only see data that comes from the database
    }
  }, [escoopId]);

  // Update store with fetched entries
  useEffect(() => {
    if (entries.length > 0 && escoopId === currentEscoopId) {
      // For mock data, just set all entries as selected without complex logic
      setSelectedEntries(entries);
    }
  }, [entries, currentEscoopId, escoopId, setSelectedEntries]);

  // ✅ Load existing restaurants, events, and settings from escoop data
  useEffect(() => {
    if (escoop && escoopId === currentEscoopId) {
      console.log('Loading existing escoop data into store:', escoop);

      // Load restaurants if they exist
      if (escoop.restaurants && escoop.restaurants.length > 0) {
        const restaurantData = escoop.restaurants.map((escoopRestaurant) => ({
          id: escoopRestaurant.restaurant.id,
          name: escoopRestaurant.restaurant.name,
          imageUrl: escoopRestaurant.restaurant.imageUrl,
          description: '', // ✅ Not available in GraphQL schema
          address: escoopRestaurant.restaurant.address || '',
          city: escoopRestaurant.restaurant.city || '',
          state: escoopRestaurant.restaurant.state || '',
          slug: escoopRestaurant.restaurant.slug,
          location: `${escoopRestaurant.restaurant.city}${escoopRestaurant.restaurant.state ? ', ' + escoopRestaurant.restaurant.state : ''}`,
          isSelected: true, // Already selected since they're in the escoop
          isPickOfTheMonth: false
        }));
        console.log('Loading restaurants into store:', restaurantData);
        loadRestaurantsFromAPI(restaurantData);
      }

      // Load featured events if they exist
      if (escoop.featuredEvents && escoop.featuredEvents.length > 0) {
        const eventData = escoop.featuredEvents.map((escoopEvent) => ({
          id: escoopEvent.event.id,
          title: escoopEvent.event.title,
          startDate: escoopEvent.event.startDate,
          status: escoopEvent.event.status,
          companyId: '', // ✅ Not available in GraphQL schema
          mainImageUrl: escoopEvent.event.imageUrl,
          isSelected: true, // Already selected since they're in the escoop
          isFeatured: false
        }));
        console.log('Loading featured events into store:', eventData);
        loadFeaturedEventsFromAPI(eventData);
      }

      // Load settings if they exist
      if (escoop.settings) {
        const settingsData = {
          subjectLine: escoop.settings.subjectLine || '',
          selectedTemplate: escoop.settings.templateName || 'classic-newsletter',
          selectedBrevoLists: (escoop.settings.brevoLists || []).map(String), // ✅ Cargar listas Brevo guardadas como strings
          selectedBrevoSegments: (escoop.settings.brevoSegments || []).map(String), // ✅ Cargar segmentos Brevo guardados como strings
          scheduledDate: escoop.settings.scheduleDate ? new Date(escoop.settings.scheduleDate) : undefined,
          // Add other settings as needed
        };
        console.log('Loading settings into store (including Brevo lists & segments):', settingsData);
        console.log('🔍 Brevo lists from backend:', escoop.settings.brevoLists);
        console.log('🔍 Brevo segments from backend:', escoop.settings.brevoSegments);
        updateSettings(settingsData);
      }

      // Load campaign ID if it exists
      if (escoop.campaignId) {
        console.log('🔍 Loading existing campaign ID:', escoop.campaignId);
        setCampaignId(escoop.campaignId);
        setCampaignStatus('created'); // Mark as created since it exists in backend
      }
    }
  }, [escoop, escoopId, currentEscoopId, loadRestaurantsFromAPI, loadFeaturedEventsFromAPI, updateSettings, setCampaignId, setCampaignStatus]);

  // Determine if builder is initialized
  const isInitialized = !!(currentEscoopId === escoopId && selectedEntries.length >= 0);

  return {
    entries: selectedEntries,
    entriesLoading,
    entriesError,
    refreshEntries,
    hasMoreEntries,
    loadMoreEntries,
    isInitialized
  };
}