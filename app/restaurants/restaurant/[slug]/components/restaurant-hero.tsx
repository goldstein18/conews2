'use client';

import Image from 'next/image';
import { MapPin, Phone, Globe, UtensilsCrossed } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PublicRestaurant } from '@/types/public-restaurants';
import { getPriceRangeSymbol, getPriceRangeName } from '../../../utils';

interface RestaurantHeroProps {
  restaurant: PublicRestaurant;
}

/**
 * Hero section for restaurant detail page
 * Square image on left, restaurant info on right (desktop)
 * Stacked on mobile
 */
export function RestaurantHero({ restaurant }: RestaurantHeroProps) {
  const {
    name,
    imageBigUrl,
    imageUrl,
    description,
    address,
    city,
    state,
    zipcode,
    phone,
    website,
    restaurantType,
    priceRange,
    menuLink
  } = restaurant;

  const displayImage = imageBigUrl || imageUrl || '/images/default-restaurant.jpg';
  const cuisineType = restaurantType?.name || 'Restaurant';
  const priceSymbol = getPriceRangeSymbol(priceRange);
  const priceName = getPriceRangeName(priceRange);
  const fullAddress = `${address}, ${city}, ${state} ${zipcode}`;

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-0">
        {/* Image - Square aspect, 30% width */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 30vw"
            priority
          />
        </div>

        {/* Restaurant Information - Black Background (70% width) */}
        <div className="bg-black text-white p-6 lg:p-10 xl:p-12 space-y-4 flex flex-col justify-center">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight uppercase">
              {name}
            </h1>

            {/* Restaurant Type & Price Range Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1.5 w-fit px-2.5 py-1 text-sm border-white text-white hover:bg-white hover:text-black transition-colors">
                <UtensilsCrossed className="h-3.5 w-3.5" />
                <span>{cuisineType}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1.5 w-fit px-2.5 py-1 text-sm border-white text-white hover:bg-white hover:text-black transition-colors">
                <span>{priceSymbol}</span>
                <span>{priceName}</span>
              </Badge>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed whitespace-pre-line line-clamp-3">
                {description}
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
            {phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <a
                  href={`tel:${phone}`}
                  className="hover:text-white transition-colors"
                >
                  {phone}
                </a>
              </div>
            )}

            {/* Website */}
            {website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors underline"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>

          {/* Menu Link Badge */}
          {menuLink && (
            <div>
              <a
                href={menuLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-300 hover:bg-white hover:text-black transition-colors cursor-pointer">
                  View Menu Online
                </Badge>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
