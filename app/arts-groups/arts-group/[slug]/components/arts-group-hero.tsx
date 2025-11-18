/**
 * ArtsGroupHero Component
 * Hero section for arts group detail page
 * Square image on left, arts group info on right (desktop)
 * Stacked on mobile
 * Matches venue hero design pattern
 */

'use client';

import Image from 'next/image';
import { MapPin, Phone, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PublicArtsGroup } from '@/types/public-arts-groups';
import { getArtTypeLabel, getArtTypeIcon } from '../../../utils';

interface ArtsGroupHeroProps {
  artsGroup: PublicArtsGroup;
}

export function ArtsGroupHero({ artsGroup }: ArtsGroupHeroProps) {
  const ArtTypeIcon = getArtTypeIcon(artsGroup.artType);
  const artTypeLabel = getArtTypeLabel(artsGroup.artType);
  const imageUrl = artsGroup.imageBigUrl || artsGroup.imageUrl || '/images/default-arts-group.jpg';

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-0">
        {/* Image - Square aspect, 30% width */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={artsGroup.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 30vw"
            priority
          />
        </div>

        {/* Arts Group Information - Black Background (70% width) */}
        <div className="bg-black text-white p-6 lg:p-10 xl:p-12 space-y-4 flex flex-col justify-center">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight uppercase">
              {artsGroup.name}
            </h1>

            {/* Art Type Badge */}
            {artsGroup.artType && (
              <Badge variant="outline" className="flex items-center gap-1.5 w-fit px-2.5 py-1 text-sm border-white text-white hover:bg-white hover:text-black transition-colors">
                <ArtTypeIcon className="h-3.5 w-3.5" />
                <span>{artTypeLabel}</span>
              </Badge>
            )}
          </div>

          {/* Description */}
          {artsGroup.description && (
            <div>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed whitespace-pre-line line-clamp-3">
                {artsGroup.description}
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-1.5 text-gray-300 text-sm">
            {/* Address */}
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
              <span>{artsGroup.address}</span>
            </div>

            {/* Phone */}
            {artsGroup.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <a
                  href={`tel:${artsGroup.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {artsGroup.phone}
                </a>
              </div>
            )}

            {/* Website */}
            {artsGroup.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <a
                  href={artsGroup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors underline"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>

          {/* Founded Year & Member Count */}
          {(artsGroup.foundedYear || (artsGroup.memberCount && artsGroup.memberCount > 0)) && (
            <div className="flex flex-wrap gap-3 text-gray-400 text-xs">
              {artsGroup.foundedYear && (
                <span>Founded {artsGroup.foundedYear}</span>
              )}
              {artsGroup.memberCount && artsGroup.memberCount > 0 && (
                <span>
                  {artsGroup.foundedYear && '• '}
                  {artsGroup.memberCount} {artsGroup.memberCount === 1 ? 'Member' : 'Members'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
