/**
 * ArtsGroupCard Component
 * Card component for displaying arts group in grid view
 * Uses global DirectoryCard component for consistency with venues/restaurants
 */

'use client';

import { Users, Calendar } from 'lucide-react';
import type { PublicArtsGroup } from '@/types/public-arts-groups';
import { getArtTypeLabel, getArtTypeColor, getArtTypeIcon } from '../utils';
import { DirectoryCard, type DirectoryCardMetadata } from '@/components/directory';
import { DEFAULT_IMAGE } from '@/lib/constants/images';

interface ArtsGroupCardProps {
  artsGroup: PublicArtsGroup;
}

export function ArtsGroupCard({ artsGroup }: ArtsGroupCardProps) {
  const ArtTypeIcon = getArtTypeIcon(artsGroup.artType);
  const artTypeLabel = getArtTypeLabel(artsGroup.artType);
  const artTypeColor = getArtTypeColor(artsGroup.artType);

  const imageUrl = artsGroup.imageBigUrl || artsGroup.imageUrl || DEFAULT_IMAGE;

  // Extract city from address for location overlay
  // Address format is typically "Street, City, State ZIP"
  const extractCity = (address: string): string => {
    const parts = address.split(',');
    if (parts.length >= 2) {
      // Second part is usually the city
      return parts[1].trim();
    }
    // If no comma, use the market as fallback
    return artsGroup.market.charAt(0).toUpperCase() + artsGroup.market.slice(1);
  };

  const locationDisplay = extractCity(artsGroup.address);

  // Build metadata array for additional info
  const metadata: DirectoryCardMetadata[] = [];

  if (artsGroup.memberCount !== undefined && artsGroup.memberCount > 0) {
    metadata.push({
      icon: Users,
      label: `${artsGroup.memberCount} ${artsGroup.memberCount === 1 ? 'member' : 'members'}`,
    });
  }

  if (artsGroup.foundedYear) {
    metadata.push({
      icon: Calendar,
      label: `Founded ${artsGroup.foundedYear}`,
    });
  }

  return (
    <DirectoryCard
      href={`/arts-groups/arts-group/${artsGroup.slug}`}
      imageUrl={imageUrl}
      title={artsGroup.name}
      location={locationDisplay}
      badge={{
        icon: ArtTypeIcon,
        label: artTypeLabel,
        variant: 'default',
        className: artTypeColor,
      }}
      metadata={metadata.length > 0 ? metadata : undefined}
      description={artsGroup.description}
    />
  );
}
