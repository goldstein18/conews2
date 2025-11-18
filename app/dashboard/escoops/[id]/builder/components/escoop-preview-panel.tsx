'use client';

import { useEffect, useState } from 'react';
import { render } from '@react-email/render';
import { useEscoopBuilderStore } from '@/store/escoop-builder-store';
import { ClassicNewsletter } from '../lib/email-templates/classic-newsletter';
import { Loader2 } from 'lucide-react';
import { useEscoopBuilder } from '../hooks';

interface EscoopPreviewPanelProps {
  escoopId: string;
}

export function EscoopPreviewPanel({ escoopId }: EscoopPreviewPanelProps) {
  const {
    settings,
    selectedEntries,
    selectedRestaurants,
    selectedEditorials,
    selectedFeaturedEvents,
    banners,
    bannerOrder,
    generatedHtml,
    setGeneratedHtml,
    isGeneratingPreview,
    setIsGeneratingPreview
  } = useEscoopBuilderStore();

  const { isInitialized } = useEscoopBuilder({ escoopId });

  const [previewKey, setPreviewKey] = useState(0);

  // Generate preview HTML when content changes
  useEffect(() => {
    // Only generate preview if data is initialized
    if (!isInitialized) return;

    const generatePreview = async () => {
      setIsGeneratingPreview(true);

      try {
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

        setGeneratedHtml(html);
        setPreviewKey(prev => prev + 1); // Force iframe refresh
      } catch (error) {
        console.error('Error generating preview:', error);
      } finally {
        setIsGeneratingPreview(false);
      }
    };

    generatePreview();
  }, [
    isInitialized,
    settings,
    selectedEntries,
    selectedRestaurants,
    selectedEditorials,
    selectedFeaturedEvents,
    banners,
    bannerOrder,
    setGeneratedHtml,
    setIsGeneratingPreview
  ]);

  if (isGeneratingPreview) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-lg border">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Generating preview...</span>
        </div>
      </div>
    );
  }

  if (!generatedHtml) {
    return (
      <div className="h-full bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="bg-green-600 text-white px-4 py-2 rounded text-center">
            <h2 className="font-bold text-lg">eScoop Newsletter</h2>
            <p className="text-sm">Your weekly food & dining guide</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Loading Newsletter Preview</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your newsletter preview will appear here once events are loaded
            </p>
            <div className="text-xs text-muted-foreground">
              {selectedEntries.length > 0
                ? `${selectedEntries.length} events available`
                : 'Loading events...'
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-lg border overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="bg-green-600 text-white px-4 py-2 rounded text-center">
          <h2 className="font-bold text-lg">eScoop Newsletter</h2>
          <p className="text-sm">Your weekly food & dining guide</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <iframe
          key={previewKey}
          srcDoc={generatedHtml}
          title="Email Preview"
          className="w-full h-full border-0"
          style={{ minHeight: '800px' }}
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}