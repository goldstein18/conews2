'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getSiteUrl } from '@/lib/seo-utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface RestaurantBreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb navigation component with JSON-LD structured data
 * Enhances SEO and provides clear navigation hierarchy
 */
export function RestaurantBreadcrumb({ items }: RestaurantBreadcrumbProps) {
  const siteUrl = getSiteUrl();

  // Generate BreadcrumbList JSON-LD
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
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
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
      <nav aria-label="Breadcrumb" className="py-4">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          <li>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
