'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { getSiteUrl } from '@/lib/seo-utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface VenueBreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb navigation for venues pages
 * Shows hierarchical navigation path with links
 * Includes JSON-LD structured data for search engines
 *
 * @example
 * <VenueBreadcrumb items={[
 *   { label: 'Venues', href: '/venues' },
 *   { label: 'Miami, FL' }
 * ]} />
 */
export function VenueBreadcrumb({ items }: VenueBreadcrumbProps) {
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
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Visual Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {/* Home icon link - goes to site homepage */}
        <li>
          <Link
            href="/"
            className="flex items-center hover:text-foreground transition-colors"
            aria-label="Go to homepage"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center space-x-2">
              {/* Separator */}
              <ChevronRight className="h-4 w-4" aria-hidden="true" />

              {/* Item */}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-medium text-foreground' : ''}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
    </>
  );
}
