/**
 * Genre Events Carousel Component
 * Displays events for a specific genre in a horizontal carousel
 * Shows 5 cards on desktop, 3 on tablet, 2 on mobile
 * Similar to FeaturedEventsCarousel but with smaller cards
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GenreEventCard } from './genre-event-card';
import { cn } from '@/lib/utils';
import type { PublicEvent } from '@/types/public-events';
import type { MainGenre } from '@/types/genres';

interface GenreEventsCarouselProps {
  genre: MainGenre;
  events: PublicEvent[];
}

export function GenreEventsCarousel({ genre, events }: GenreEventsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      containScroll: 'trimSnaps',  // Shows exactly 5 cards on desktop
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

  // Don't render if no events for this genre
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8 bg-background">
      {/* Section Header - Centered with container */}
      <div className="container mx-auto px-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">
          {genre.display.toUpperCase()} EVENTS
        </h2>
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
          aria-label={`Previous ${genre.display} events`}
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
          aria-label={`Next ${genre.display} events`}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Embla Viewport - Full width with side padding */}
        <div className="overflow-hidden px-4 md:px-8 lg:px-16" ref={emblaRef}>
          <div className="flex gap-3 md:gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                // Mobile: 2 cards (48% each)
                // Tablet: 3 cards (32% each)
                // Desktop: 5 cards (19% each)
                className="flex-[0_0_48%] min-w-0 sm:flex-[0_0_32%] lg:flex-[0_0_19%]"
              >
                <GenreEventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
