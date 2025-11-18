'use client';

import { ExternalLink, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PublicRestaurant } from '@/types/public-restaurants';

interface RestaurantLocationProps {
  restaurant: PublicRestaurant;
}

/**
 * Location section with Google Maps embed
 * Full width map with address and directions button
 */
export function RestaurantLocation({ restaurant }: RestaurantLocationProps) {
  const fullAddress = `${restaurant.address}, ${restaurant.city}, ${restaurant.state} ${restaurant.zipcode}`;
  const encodedAddress = encodeURIComponent(fullAddress);

  // Google Maps embed URL (doesn't require API key for basic embed)
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;

  // Google Maps directions URL
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="space-y-6">
        {/* Section Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Location</h2>
          <div className="flex items-start gap-2 text-lg text-gray-600">
            <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
            <span>{fullAddress}</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg bg-gray-100">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map location of ${restaurant.name}`}
          />
        </div>

        {/* Get Directions Button */}
        <div className="flex justify-center pt-2">
          <Button
            asChild
            size="lg"
            className="gap-2"
          >
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
