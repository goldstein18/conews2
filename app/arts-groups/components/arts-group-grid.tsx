/**
 * ArtsGroupGrid Component
 * Grid layout for displaying arts groups
 * Matches venue grid layout with 5 columns on XL screens
 */

'use client';

import type { PublicArtsGroup } from '@/types/public-arts-groups';
import { ArtsGroupCard } from './arts-group-card';

interface ArtsGroupGridProps {
  artsGroups: PublicArtsGroup[];
}

export function ArtsGroupGrid({ artsGroups }: ArtsGroupGridProps) {
  if (artsGroups.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <span className="text-3xl">🎭</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No arts groups found
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Try adjusting your filters or search term to find more arts groups.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {artsGroups.map((artsGroup) => (
        <ArtsGroupCard key={artsGroup.id} artsGroup={artsGroup} />
      ))}
    </div>
  );
}
