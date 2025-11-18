import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { render } from '@react-email/render';

// Types for builder state
export interface EscoopBuilderBanner {
  id: string;
  name: string;
  imageUrl?: string;
  link: string;
  position: number;
  isActive: boolean;
}

export interface EscoopBuilderEntry {
  id: string;
  eventId: string;
  event: {
    id: string;
    title: string;
    startDate?: string;
    mainImageUrl?: string;
    status: string;
  };
  status: string;
  locations: string[];
  isSelected: boolean;
}

export interface EscoopBuilderRestaurant {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  slug?: string;
  cuisineType?: string;
  location?: string;
  isSelected: boolean;
  isPickOfTheMonth?: boolean;
}

export interface EscoopBuilderEditorial {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  isSelected: boolean;
}

export interface EscoopBuilderFeaturedEvent {
  id: string;
  title: string;
  startDate?: string;
  status: string;
  companyId?: string;
  mainImageUrl?: string;
  isSelected: boolean;
  isFeatured?: boolean;
}

export interface EscoopBuilderTemplate {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface EscoopBuilderSettings {
  subjectLine: string;
  newsletterName: string;
  selectedTemplate: string;
  selectedBrevoLists: string[];
  selectedBrevoSegments: string[];
  proofRecipients: string[];
  sendNow: boolean;
  scheduledDate?: Date;
}

export interface EscoopCampaignState {
  campaignId: number | null;
  campaignStatus: 'not_created' | 'created' | 'test_sent' | 'sent' | 'error';
  lastError?: string;
}

export interface EscoopBuilderState {
  // Current escoop being edited
  currentEscoopId: string | null;

  // Content selections
  selectedEntries: EscoopBuilderEntry[];
  selectedRestaurants: EscoopBuilderRestaurant[];
  selectedEditorials: EscoopBuilderEditorial[];
  selectedFeaturedEvents: EscoopBuilderFeaturedEvent[];

  // Banner management
  banners: EscoopBuilderBanner[];
  bannerOrder: string[];

  // Template and settings
  availableTemplates: EscoopBuilderTemplate[];
  settings: EscoopBuilderSettings;

  // Preview state
  generatedHtml: string | null;
  isGeneratingPreview: boolean;

  // Campaign state
  campaign: EscoopCampaignState;

  // Actions
  setCurrentEscoopId: (id: string) => void;

  // Entry management
  setSelectedEntries: (entries: EscoopBuilderEntry[]) => void;
  toggleEntrySelection: (entryId: string) => void;
  loadEntriesFromAPI: (apiEntries: any[]) => void;

  // Restaurant management
  setSelectedRestaurants: (restaurants: EscoopBuilderRestaurant[]) => void;
  toggleRestaurantSelection: (restaurantId: string) => void;
  addRestaurant: (restaurant: EscoopBuilderRestaurant) => void;
  removeRestaurant: (restaurantId: string) => void;
  loadRestaurantsFromAPI: (apiRestaurants: any[]) => void;
  toggleRestaurantPickOfTheMonth: (restaurantId: string) => void;

  // Editorial management
  setSelectedEditorials: (editorials: EscoopBuilderEditorial[]) => void;
  toggleEditorialSelection: (editorialId: string) => void;

  // Featured events management
  setSelectedFeaturedEvents: (events: EscoopBuilderFeaturedEvent[]) => void;
  toggleFeaturedEventSelection: (eventId: string) => void;
  addFeaturedEvent: (event: EscoopBuilderFeaturedEvent) => void;
  removeFeaturedEvent: (eventId: string) => void;
  loadFeaturedEventsFromAPI: (apiEvents: any[]) => void;
  toggleEventFeatured: (eventId: string) => void;

  // Banner management
  setBanners: (banners: EscoopBuilderBanner[]) => void;
  updateBannerOrder: (newOrder: string[]) => void;
  toggleBannerActive: (bannerId: string) => void;

  // Settings management
  updateSettings: (settings: Partial<EscoopBuilderSettings>) => void;
  updateSubjectLine: (subjectLine: string) => void;
  updateNewsletterName: (name: string) => void;
  updateSelectedTemplate: (templateId: string) => void;
  updateBrevoLists: (listIds: string[]) => void;
  updateBrevoSegments: (segmentIds: string[]) => void;
  updateProofRecipients: (emails: string[]) => void;

  // Preview management
  setGeneratedHtml: (html: string) => void;
  setIsGeneratingPreview: (isGenerating: boolean) => void;
  generatePreviewHtml: () => Promise<void>;

  // Campaign management
  setCampaignId: (campaignId: number) => void;
  setCampaignStatus: (status: EscoopCampaignState['campaignStatus']) => void;
  setCampaignError: (error: string) => void;
  clearCampaignError: () => void;
  resetCampaign: () => void;

  // Reset
  reset: () => void;
  resetForNewEscoop: (escoopId: string) => void;
}

const initialSettings: EscoopBuilderSettings = {
  subjectLine: '',
  newsletterName: 'eScoop Newsletter',
  selectedTemplate: 'classic-newsletter',
  selectedBrevoLists: [],
  selectedBrevoSegments: [],
  proofRecipients: [],
  sendNow: true,
};

const initialCampaignState: EscoopCampaignState = {
  campaignId: null,
  campaignStatus: 'not_created',
  lastError: undefined,
};

export const useEscoopBuilderStore = create<EscoopBuilderState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentEscoopId: null,
      selectedEntries: [],
      selectedRestaurants: [],
      selectedEditorials: [],
      selectedFeaturedEvents: [],
      banners: [],
      bannerOrder: [],
      availableTemplates: [
        {
          id: 'classic-newsletter',
          name: 'Classic Newsletter',
          description: 'Traditional newsletter layout with sections',
          isActive: true,
        },
      ],
      settings: initialSettings,
      generatedHtml: null,
      isGeneratingPreview: false,
      campaign: initialCampaignState,

      // Actions
      setCurrentEscoopId: (id) => set({ currentEscoopId: id }),

      // Entry management
      setSelectedEntries: (entries) => set({ selectedEntries: entries }),
      toggleEntrySelection: (entryId) =>
        set((state) => ({
          selectedEntries: state.selectedEntries.map((entry) =>
            entry.id === entryId
              ? { ...entry, isSelected: !entry.isSelected }
              : entry
          ),
        })),
      loadEntriesFromAPI: (apiEntries) => {
        const entries = apiEntries.map(entry => ({
          id: entry.id,
          eventId: entry.eventId,
          event: {
            id: entry.event.id,
            title: entry.event.title,
            startDate: entry.event.startDate,
            mainImageUrl: entry.event.imageUrl || entry.event.mainImageUrl,
            status: entry.event.status
          },
          status: entry.status,
          locations: entry.locations || [],
          isSelected: true // Auto-select all entries for preview
        }));
        set({ selectedEntries: entries });
      },

      // Restaurant management
      setSelectedRestaurants: (restaurants) => set({ selectedRestaurants: restaurants }),
      toggleRestaurantSelection: (restaurantId) =>
        set((state) => ({
          selectedRestaurants: state.selectedRestaurants.map((restaurant) =>
            restaurant.id === restaurantId
              ? { ...restaurant, isSelected: !restaurant.isSelected }
              : restaurant
          ),
        })),
      addRestaurant: (restaurant) =>
        set((state) => {
          // Check if restaurant already exists
          const exists = state.selectedRestaurants.find(r => r.id === restaurant.id);
          if (exists) return state;

          return {
            selectedRestaurants: [...state.selectedRestaurants, { ...restaurant, isSelected: true }]
          };
        }),
      removeRestaurant: (restaurantId) =>
        set((state) => ({
          selectedRestaurants: state.selectedRestaurants.filter(r => r.id !== restaurantId)
        })),
      loadRestaurantsFromAPI: (apiRestaurants) => {
        const restaurants = apiRestaurants.map(restaurant => ({
          id: restaurant.id,
          name: restaurant.name,
          imageUrl: restaurant.imageUrl,
          description: restaurant.description,
          address: restaurant.address,
          city: restaurant.city,
          state: restaurant.state,
          slug: restaurant.slug,
          location: `${restaurant.city}${restaurant.state ? ', ' + restaurant.state : ''}`,
          isSelected: true,
          isPickOfTheMonth: false
        }));
        set({ selectedRestaurants: restaurants });
      },
      toggleRestaurantPickOfTheMonth: (restaurantId) =>
        set((state) => ({
          selectedRestaurants: state.selectedRestaurants.map((restaurant) =>
            restaurant.id === restaurantId
              ? { ...restaurant, isPickOfTheMonth: !restaurant.isPickOfTheMonth }
              : restaurant
          ),
        })),

      // Editorial management
      setSelectedEditorials: (editorials) => set({ selectedEditorials: editorials }),
      toggleEditorialSelection: (editorialId) =>
        set((state) => ({
          selectedEditorials: state.selectedEditorials.map((editorial) =>
            editorial.id === editorialId
              ? { ...editorial, isSelected: !editorial.isSelected }
              : editorial
          ),
        })),

      // Featured events management
      setSelectedFeaturedEvents: (events) => set({ selectedFeaturedEvents: events }),
      toggleFeaturedEventSelection: (eventId) =>
        set((state) => ({
          selectedFeaturedEvents: state.selectedFeaturedEvents.map((event) =>
            event.id === eventId
              ? { ...event, isSelected: !event.isSelected }
              : event
          ),
        })),
      addFeaturedEvent: (event) =>
        set((state) => {
          // Check if event already exists
          const exists = state.selectedFeaturedEvents.find(e => e.id === event.id);
          if (exists) return state;

          return {
            selectedFeaturedEvents: [...state.selectedFeaturedEvents, { ...event, isSelected: true }]
          };
        }),
      removeFeaturedEvent: (eventId) =>
        set((state) => ({
          selectedFeaturedEvents: state.selectedFeaturedEvents.filter(e => e.id !== eventId)
        })),
      loadFeaturedEventsFromAPI: (apiEvents) => {
        const events = apiEvents.map(event => ({
          id: event.id,
          title: event.title,
          startDate: event.startDate,
          status: event.status,
          companyId: event.companyId,
          mainImageUrl: event.mainImageUrl,
          isSelected: true,
          isFeatured: false
        }));
        set({ selectedFeaturedEvents: events });
      },
      toggleEventFeatured: (eventId) =>
        set((state) => ({
          selectedFeaturedEvents: state.selectedFeaturedEvents.map((event) =>
            event.id === eventId
              ? { ...event, isFeatured: !event.isFeatured }
              : event
          ),
        })),

      // Banner management
      setBanners: (banners) =>
        set({
          banners,
          bannerOrder: banners.map((b) => b.id),
        }),
      updateBannerOrder: (newOrder) => set({ bannerOrder: newOrder }),
      toggleBannerActive: (bannerId) =>
        set((state) => ({
          banners: state.banners.map((banner) =>
            banner.id === bannerId
              ? { ...banner, isActive: !banner.isActive }
              : banner
          ),
        })),

      // Settings management
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      updateSubjectLine: (subjectLine) =>
        set((state) => ({
          settings: { ...state.settings, subjectLine },
        })),
      updateNewsletterName: (newsletterName) =>
        set((state) => ({
          settings: { ...state.settings, newsletterName },
        })),
      updateSelectedTemplate: (templateId) =>
        set((state) => ({
          settings: { ...state.settings, selectedTemplate: templateId },
        })),
      updateBrevoLists: (listIds) =>
        set((state) => ({
          settings: { ...state.settings, selectedBrevoLists: listIds },
        })),
      updateBrevoSegments: (segmentIds) =>
        set((state) => ({
          settings: { ...state.settings, selectedBrevoSegments: segmentIds },
        })),
      updateProofRecipients: (emails) =>
        set((state) => ({
          settings: { ...state.settings, proofRecipients: emails },
        })),

      // Preview management
      setGeneratedHtml: (html) => set({ generatedHtml: html }),
      setIsGeneratingPreview: (isGenerating) => set({ isGeneratingPreview: isGenerating }),
      generatePreviewHtml: async () => {
        const state = get();
        const {
          settings,
          selectedEntries,
          selectedRestaurants,
          selectedEditorials,
          selectedFeaturedEvents,
          banners,
          bannerOrder
        } = state;

        // Don't generate if already generating
        if (state.isGeneratingPreview) return;

        set({ isGeneratingPreview: true });

        try {
          // Import ClassicNewsletter dynamically to avoid circular dependency
          const { ClassicNewsletter } = await import('../app/dashboard/escoops/[id]/builder/lib/email-templates/classic-newsletter');

          // Prepare data for template - show all entries automatically
          const upcomingEvents = selectedEntries
            .map(entry => ({
              id: entry.id,
              title: entry.event.title,
              imageUrl: entry.event.mainImageUrl || '/placeholder-event.jpg',
              startDate: entry.event.startDate,
              location: entry.locations.join(', '),
              description: `Join us for ${entry.event.title}`,
              eventUrl: `#event-${entry.event.id}`,
              formattedDate: entry.event.startDate
                ? new Date(entry.event.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'Date TBD'
            }));

          // Prepare featured events from manual selection
          const featuredEvents = selectedFeaturedEvents
            .filter(event => event.isSelected)
            .map(event => ({
              id: event.id,
              title: event.title,
              imageUrl: event.mainImageUrl || '/placeholder-event.jpg',
              startDate: event.startDate,
              location: 'Event Location', // Default location for featured events
              description: `Don't miss ${event.title}`,
              eventUrl: `#featured-event-${event.id}`,
              formattedDate: event.startDate
                ? new Date(event.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'Date TBD',
              isFeatured: event.isFeatured
            }));

          const editorialBlocks = selectedEditorials
            .filter(editorial => editorial.isSelected)
            .map(editorial => ({
              id: editorial.id,
              title: editorial.title,
              content: editorial.content,
              imageUrl: editorial.imageUrl
            }));

          const restaurantPicks = selectedRestaurants
            .filter(restaurant => restaurant.isSelected)
            .map(restaurant => ({
              id: restaurant.id,
              name: restaurant.name,
              imageUrl: restaurant.imageUrl,
              description: restaurant.description,
              cuisineType: restaurant.cuisineType || 'Restaurant',
              location: restaurant.location,
              restaurantUrl: `#restaurant-${restaurant.id}`,
              isPickOfTheMonth: restaurant.isPickOfTheMonth
            }));

          const sortedBanners = bannerOrder
            .map(bannerId => banners.find(b => b.id === bannerId))
            .filter((banner): banner is NonNullable<typeof banner> => Boolean(banner))
            .filter(banner => banner.isActive)
            .map((banner, index) => ({
              id: banner.id,
              imageUrl: banner.imageUrl,
              link: banner.link,
              alt: banner.name,
              position: index
            }));

          // Render the email template
          const html = await render(ClassicNewsletter({
            title: settings.subjectLine || 'eScoop Newsletter',
            previewText: 'Your weekly food & dining guide',
            upcomingEvents, // Events from escoop entries
            featuredEvents, // Manually selected featured events
            editorialBlocks,
            restaurantPicks,
            banners: sortedBanners,
            unsubscribeUrl: '#unsubscribe'
          }));

          set({ generatedHtml: html });
          console.log('✅ Preview HTML generated successfully');
        } catch (error) {
          console.error('Error generating preview:', error);
        } finally {
          set({ isGeneratingPreview: false });
        }
      },

      // Campaign management
      setCampaignId: (campaignId) =>
        set((state) => ({
          campaign: { ...state.campaign, campaignId, campaignStatus: 'created' },
        })),
      setCampaignStatus: (campaignStatus) =>
        set((state) => ({
          campaign: { ...state.campaign, campaignStatus },
        })),
      setCampaignError: (lastError) =>
        set((state) => ({
          campaign: { ...state.campaign, campaignStatus: 'error', lastError },
        })),
      clearCampaignError: () =>
        set((state) => ({
          campaign: { ...state.campaign, lastError: undefined },
        })),
      resetCampaign: () =>
        set({ campaign: initialCampaignState }),

      // Reset functions
      reset: () =>
        set({
          currentEscoopId: null,
          selectedEntries: [],
          selectedRestaurants: [],
          selectedEditorials: [],
          selectedFeaturedEvents: [],
          banners: [],
          bannerOrder: [],
          settings: initialSettings,
          generatedHtml: null,
          isGeneratingPreview: false,
          campaign: initialCampaignState,
        }),
      resetForNewEscoop: (escoopId) =>
        set({
          currentEscoopId: escoopId,
          selectedEntries: [],
          selectedRestaurants: [],
          selectedEditorials: [],
          selectedFeaturedEvents: [],
          banners: [],
          bannerOrder: [],
          settings: {
            ...initialSettings,
            subjectLine: '',
            selectedBrevoLists: [],  // Explicitly ensure lists are empty
            selectedBrevoSegments: [], // Explicitly ensure segments are empty
            proofRecipients: []      // Explicitly ensure test emails are empty
          },
          generatedHtml: null,
          isGeneratingPreview: false,
          campaign: initialCampaignState,
        }),
    }),
    {
      name: 'escoop-builder-storage',
      // ✅ Only persist essential data, NOT unsaved restaurants/events
      partialize: (state) => ({
        currentEscoopId: state.currentEscoopId,
        settings: {
          ...state.settings,
          selectedBrevoLists: [], // Don't persist lists - they should be empty by default
          selectedBrevoSegments: [], // Don't persist segments - they should be empty by default
          proofRecipients: []     // Don't persist test emails - they should be empty by default
        },
        bannerOrder: state.bannerOrder,
        // ❌ Don't persist restaurants/events - they should only come from database
        // selectedRestaurants: state.selectedRestaurants,
        // selectedFeaturedEvents: state.selectedFeaturedEvents,
        // selectedEntries: state.selectedEntries,
      }),
    }
  )
);;