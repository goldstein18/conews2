import {
  Theater,
  Palette,
  Building2,
  Landmark,
  Users,
  Calendar,
  Frame,
  Home,
  Building,
  Camera,
  type LucideIcon
} from 'lucide-react';
import { VenueType } from '@/types/public-venues';

/**
 * Icon mappings for each venue type
 * Used in the venue type filter chips and venue cards
 */
export const VENUE_TYPE_ICONS: Record<VenueType, LucideIcon> = {
  [VenueType.AMPHITHEATRE]: Theater,
  [VenueType.ART_CENTER]: Palette,
  [VenueType.ARTIST_COMPLEX]: Building2,
  [VenueType.ATTRACTION]: Landmark,
  [VenueType.COMMUNITY_CENTER]: Users,
  [VenueType.EVENT_SPACE]: Calendar,
  [VenueType.GALLERY]: Frame,
  [VenueType.HISTORIC_HOMES]: Home,
  [VenueType.MUSEUM]: Building,
  [VenueType.STUDIO]: Camera,
  [VenueType.THEATER]: Theater,
  [VenueType.PERFORMING_ARTS_CENTER]: Theater,
  [VenueType.Z_OTHER]: Building2
};

/**
 * Get the icon component for a venue type
 */
export const getVenueTypeIcon = (type: VenueType): LucideIcon => {
  return VENUE_TYPE_ICONS[type] || Building2;
};

/**
 * Get display name for venue type
 * Reuses the helper from dashboard but exposed for public use
 */
export const getVenueTypeDisplayName = (type: VenueType): string => {
  switch (type) {
    case VenueType.THEATER:
      return 'Theater';
    case VenueType.ART_CENTER:
      return 'Art Center';
    case VenueType.PERFORMING_ARTS_CENTER:
      return 'Performing Arts Center';
    case VenueType.GALLERY:
      return 'Gallery';
    case VenueType.MUSEUM:
      return 'Museum';
    case VenueType.EVENT_SPACE:
      return 'Event Space';
    case VenueType.AMPHITHEATRE:
      return 'Amphitheatre';
    case VenueType.STUDIO:
      return 'Studio';
    case VenueType.ARTIST_COMPLEX:
      return 'Artist Complex';
    case VenueType.COMMUNITY_CENTER:
      return 'Community Center';
    case VenueType.HISTORIC_HOMES:
      return 'Historic Homes';
    case VenueType.ATTRACTION:
      return 'Attraction';
    case VenueType.Z_OTHER:
      return 'Other';
    default:
      return 'Unknown';
  }
};

/**
 * All venue types for filter chips
 * Ordered by popularity/common usage
 */
export const ALL_VENUE_TYPES = [
  VenueType.THEATER,
  VenueType.MUSEUM,
  VenueType.ART_CENTER,
  VenueType.GALLERY,
  VenueType.AMPHITHEATRE,
  VenueType.PERFORMING_ARTS_CENTER,
  VenueType.EVENT_SPACE,
  VenueType.COMMUNITY_CENTER,
  VenueType.ARTIST_COMPLEX,
  VenueType.STUDIO,
  VenueType.HISTORIC_HOMES,
  VenueType.ATTRACTION,
  VenueType.Z_OTHER
] as const;
