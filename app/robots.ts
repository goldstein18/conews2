import { MetadataRoute } from 'next';
import { isProductionEnvironment, getSiteUrl } from '@/lib/seo-utils';

/**
 * Generates robots.txt dynamically based on environment
 *
 * Staging (.vercel.app): Blocks all crawlers
 * Production (custom domain): Allows crawling with sitemap
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  if (isProductionEnvironment()) {
    // PRODUCTION: Allow all crawlers
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/api/',
            '/dashboard/',
            '/_next/',
            '/admin/',
          ],
        },
        {
          userAgent: 'GPTBot',
          disallow: '/',
        },
        {
          userAgent: 'ChatGPT-User',
          disallow: '/',
        },
      ],
      sitemap: `${siteUrl}/sitemap.xml`,
    };
  }

  // STAGING: Block all crawlers
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}
