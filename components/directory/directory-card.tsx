/**
 * DirectoryCard Component
 * Global reusable card for all directory modules (venues, restaurants, arts groups, events, etc.)
 *
 * Features:
 * - Consistent 4:5 aspect ratio
 * - Location overlay with gradient
 * - Hover zoom effect
 * - Flexible badge system
 * - Optional metadata and description
 * - Automatic fallback to owl logo for broken images
 */

'use client';

import Link from 'next/link';
import { MapPin, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

export interface DirectoryCardBadge {
  icon: LucideIcon;
  label: string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string; // For custom colors (e.g., arts groups art types)
}

export interface DirectoryCardMetadata {
  icon: LucideIcon;
  label: string;
}

export interface DirectoryCardProps {
  href: string;
  imageUrl: string;
  title: string;
  location: string; // City or address for overlay
  badge: DirectoryCardBadge;
  secondaryBadge?: DirectoryCardBadge;
  metadata?: DirectoryCardMetadata[];
  description?: string; // Optional description text
  footer?: React.ReactNode; // Optional footer content
}

export function DirectoryCard({
  href,
  imageUrl,
  title,
  location,
  badge,
  secondaryBadge,
  metadata,
  description,
  footer,
}: DirectoryCardProps) {
  const BadgeIcon = badge.icon;
  const SecondaryBadgeIcon = secondaryBadge?.icon;

  return (
    <Link href={href} className="block group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-gray-200 h-full">
        {/* Image container with zoom effect and fallback */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />

          {/* Location overlay with gradient */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 z-10">
            <div className="flex items-center gap-1.5 text-white text-sm font-medium">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {/* Card content */}
        <CardContent className="p-4 space-y-2">
          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Optional description */}
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={badge.variant || 'secondary'}
              className={`flex items-center gap-1.5 ${badge.className || ''}`}
            >
              <BadgeIcon className="h-3.5 w-3.5" />
              <span>{badge.label}</span>
            </Badge>

            {secondaryBadge && SecondaryBadgeIcon && (
              <Badge
                variant={secondaryBadge.variant || 'outline'}
                className={`flex items-center gap-1.5 ${secondaryBadge.className || ''}`}
              >
                <SecondaryBadgeIcon className="h-3.5 w-3.5" />
                <span>{secondaryBadge.label}</span>
              </Badge>
            )}
          </div>

          {/* Optional metadata */}
          {metadata && metadata.length > 0 && (
            <div className="space-y-1 text-sm text-muted-foreground pt-1">
              {metadata.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Optional footer */}
          {footer}
        </CardContent>
      </Card>
    </Link>
  );
}
