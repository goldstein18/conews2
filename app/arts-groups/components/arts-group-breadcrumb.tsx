/**
 * ArtsGroupBreadcrumb Component
 * Breadcrumb navigation with JSON-LD structured data
 */

'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getSiteUrl } from '@/lib/seo-utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ArtsGroupBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function ArtsGroupBreadcrumb({ items }: ArtsGroupBreadcrumbProps) {
  const siteUrl = getSiteUrl();

  // Generate JSON-LD structured data for breadcrumbs
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        ...(item.href && { item: `${siteUrl}${item.href}` }),
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4" />
              {item.href ? (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
