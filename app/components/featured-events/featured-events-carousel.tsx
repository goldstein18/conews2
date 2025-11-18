/**
 * Featured Events Carousel Component
 * Netflix-style horizontal carousel using Embla Carousel
 * Shows 3 events at a time on desktop, responsive for mobile/tablet
 * Now uses real API data instead of mock events
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FeaturedEventCard } from './featured-event-card';
import { usePublicEvents } from '@/app/calendar/events/hooks/use-public-events';
import { cn } from '@/lib/utils';

export function FeaturedEventsCarousel() {
  // Fetch real featured events from API (no date filter = all upcoming events by default)
  const { events: eventEdges, loading, error } = usePublicEvents({
    first: 20
  });

  // Extract event nodes from edges
  const events = eventEdges.map(edge => edge.node);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      containScroll: 'trimSnaps',  // Prevents excessive scroll, shows exactly 3 cards
      dragFree: false,              // Snap to exact positions
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 1 },
        '(min-width: 1024px)': { slidesToScroll: 1 }
      }
    },
    [
      WheelGesturesPlugin({
        forceWheelAxis: 'x'  // Enable horizontal scroll with Mac trackpad (two-finger gestures)
      })
    ]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Loading state with skeleton placeholders
  if (loading) {
    return (
      <section className="w-full py-16 bg-background overflow-hidden">
        <div className="container mx-auto px-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Featured Events
          </h2>
          <p className="text-muted-foreground text-lg">
            Don&apos;t miss these upcoming highlights
          </p>
        </div>
        <div className="overflow-hidden px-4 md:px-8 lg:px-16">
          <div className="flex gap-3 md:gap-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex-[0_0_90%] min-w-0 sm:flex-[0_0_48%] lg:flex-[0_0_33.333%]"
              >
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    console.error('Error loading featured events:', error);
    return null;
  }

  // No events state
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 bg-background overflow-hidden">
      {/* Section Header - Centered with container */}
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Featured Events
        </h2>
        <p className="text-muted-foreground text-lg">
          Don&apos;t miss these upcoming highlights
        </p>
      </div>

      {/* Carousel Container - Full Width */}
      <div className="relative group">
        {/* Previous Button - Hidden on mobile */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute left-4 md:left-8 lg:left-16 top-1/2 -translate-y-1/2 z-10",
            "hidden md:flex",
            "bg-white/90 hover:bg-white shadow-lg",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          )}
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label="Previous events"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Next Button - Hidden on mobile */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "absolute right-4 md:right-8 lg:right-16 top-1/2 -translate-y-1/2 z-10",
            "hidden md:flex",
            "bg-white/90 hover:bg-white shadow-lg",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          )}
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Next events"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Embla Viewport - Full width with side padding */}
        <div className="overflow-hidden px-4 md:px-8 lg:px-16" ref={emblaRef}>
          <div className="flex gap-3 md:gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex-[0_0_90%] min-w-0 sm:flex-[0_0_48%] lg:flex-[0_0_33.333%]"
              >
                <FeaturedEventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dots (Optional) */}
      <div className="flex justify-center gap-2 mt-6 md:hidden">
        {events.slice(0, 10).map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === 0 ? "bg-primary w-6" : "bg-gray-300"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
