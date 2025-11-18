/**
 * Arts Group Detail Content (Client Component)
 * Client-side content for arts group detail page
 */

'use client';

import { use } from 'react';
import { ArtsGroupBreadcrumb } from '../../components';
import {
  ArtsGroupHero,
  ArtsGroupStructuredData,
  ArtsGroupDetailSkeleton,
} from './components';
import { useArtsGroupDetail } from '../../hooks';

interface ArtsGroupDetailContentProps {
  params: Promise<{ slug: string }>;
}

export default function ArtsGroupDetailContent({ params }: ArtsGroupDetailContentProps) {
  const { slug } = use(params);
  const { artsGroup, loading, error } = useArtsGroupDetail(slug);

  if (loading) {
    return <ArtsGroupDetailSkeleton />;
  }

  if (error || !artsGroup) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
            <span className="text-4xl">🎭</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Arts Group Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The arts group you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data for SEO */}
      <ArtsGroupStructuredData artsGroup={artsGroup} />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <ArtsGroupBreadcrumb
            items={[
              { label: 'Arts Groups', href: '/arts-groups' },
              { label: artsGroup.name },
            ]}
          />
        </div>
      </div>

      {/* Hero Section - Contains all information */}
      <ArtsGroupHero artsGroup={artsGroup} />
    </div>
  );
}
