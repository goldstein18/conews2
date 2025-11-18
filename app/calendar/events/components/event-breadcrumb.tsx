/**
 * Breadcrumb navigation for event pages
 * Includes JSON-LD structured data for SEO
 */

'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { getSiteUrl } from '@/lib/seo-utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface EventBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function EventBreadcrumb({ items }: EventBreadcrumbProps) {
  const siteUrl = getSiteUrl();

  // Generate JSON-LD structured data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Events',
        item: `${siteUrl}/calendar/events`
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 3,
        name: item.label,
        ...(item.href && { item: `${siteUrl}${item.href}` })
      }))
    ]
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Visual breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
        {/* Home */}
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Home className="h-4 w-4" />
        </Link>

        <ChevronRight className="h-4 w-4 text-gray-400" />

        {/* Events */}
        <Link
          href="/calendar/events"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Events
        </Link>

        {/* Additional items */}
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
