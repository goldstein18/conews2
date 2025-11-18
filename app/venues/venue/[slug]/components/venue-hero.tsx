'use client';

import Image from 'next/image';
import { MapPin, Phone, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PublicVenue } from '@/types/public-venues';
import { getVenueTypeDisplayName, getVenueTypeIcon } from '@/app/venues/utils';

interface VenueHeroProps {
  venue: PublicVenue;
}

/**
 * Hero section for venue detail page
 * Square image on left, venue info on right (desktop)
 * Stacked on mobile
 */
export function VenueHero({ venue }: VenueHeroProps) {
  const VenueTypeIcon = getVenueTypeIcon(venue.venueType);
  const venueTypeName = getVenueTypeDisplayName(venue.venueType);
  const imageUrl = venue.imageBigUrl || venue.imageUrl || '/images/venue-placeholder.jpg';
  const fullAddress = `${venue.address}, ${venue.city}, ${venue.state} ${venue.zipcode}`;

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-0">
        {/* Image - Square aspect, 30% width */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={venue.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 30vw"
            priority
          />
        </div>

        {/* Venue Information - Black Background (70% width) */}
        <div className="bg-black text-white p-6 lg:p-10 xl:p-12 space-y-4 flex flex-col justify-center">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight uppercase">
              {venue.name}
            </h1>

            {/* Venue Type Badge */}
            <Badge variant="outline" className="flex items-center gap-1.5 w-fit px-2.5 py-1 text-sm border-white text-white hover:bg-white hover:text-black transition-colors">
              <VenueTypeIcon className="h-3.5 w-3.5" />
              <span>{venueTypeName}</span>
            </Badge>
          </div>

          {/* Description */}
          {venue.description && (
            <div>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed whitespace-pre-line line-clamp-3">
                {venue.description}
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-1.5 text-gray-300 text-sm">
            {/* Address */}
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
              <span>{fullAddress}</span>
            </div>

            {/* Phone */}
            {venue.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <a
                  href={`tel:${venue.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {venue.phone}
                </a>
              </div>
            )}

            {/* Website */}
            {venue.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <a
                  href={venue.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors underline"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>

          {/* Private Events Badge */}
          {venue.hostsPrivateEvents && (
            <div>
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                Available for Private Events
              </Badge>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
