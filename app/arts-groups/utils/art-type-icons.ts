/**
 * Art Type Icons and Display Utilities
 * Functions for mapping art types to icons and display labels
 */

import {
  Theater,
  Music,
  Users,
  Eye,
  Palette,
  type LucideIcon,
} from 'lucide-react';

// Match the art types from dashboard validations
export type ArtTypeValue =
  | 'Dance'
  | 'Folk Arts'
  | 'Music'
  | 'Visual Arts'
  | 'Theater'
  | 'Other';

/**
 * Map art types to their display icons
 */
export const ART_TYPE_ICONS: Record<ArtTypeValue, LucideIcon> = {
  'Dance': Users,
  'Folk Arts': Eye,
  'Music': Music,
  'Visual Arts': Palette,
  'Theater': Theater,
  'Other': Theater,
};

/**
 * Map art types to display labels
 */
export const ART_TYPE_LABELS: Record<ArtTypeValue, string> = {
  'Dance': 'Dance',
  'Folk Arts': 'Folk Arts',
  'Music': 'Music',
  'Visual Arts': 'Visual Arts',
  'Theater': 'Theater',
  'Other': 'Other',
};

/**
 * Map art types to color classes (for badges, etc.)
 */
export const ART_TYPE_COLORS: Record<ArtTypeValue, string> = {
  'Dance': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  'Folk Arts': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'Music': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Visual Arts': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Theater': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'Other': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

/**
 * Get icon component for an art type
 */
export function getArtTypeIcon(artType?: string): LucideIcon {
  if (!artType) return Theater;
  // Try exact match first
  if (artType in ART_TYPE_ICONS) {
    return ART_TYPE_ICONS[artType as ArtTypeValue];
  }
  return Theater;
}

/**
 * Get display label for an art type
 */
export function getArtTypeLabel(artType?: string): string {
  if (!artType) return 'Arts Group';
  // Try exact match first
  if (artType in ART_TYPE_LABELS) {
    return ART_TYPE_LABELS[artType as ArtTypeValue];
  }
  // Return as-is if not found
  return artType;
}

/**
 * Get color classes for an art type badge
 */
export function getArtTypeColor(artType?: string): string {
  if (!artType) return ART_TYPE_COLORS['Other'];
  // Try exact match first
  if (artType in ART_TYPE_COLORS) {
    return ART_TYPE_COLORS[artType as ArtTypeValue];
  }
  return ART_TYPE_COLORS['Other'];
}

/**
 * Get all available art types for filtering
 */
export function getAllArtTypes(): { value: ArtTypeValue; label: string; icon: LucideIcon }[] {
  return Object.entries(ART_TYPE_LABELS).map(([value, label]) => ({
    value: value as ArtTypeValue,
    label,
    icon: ART_TYPE_ICONS[value as ArtTypeValue],
  }));
}

/**
 * Check if a string is a valid art type
 */
export function isValidArtType(artType: string): artType is ArtTypeValue {
  return artType in ART_TYPE_LABELS;
}
