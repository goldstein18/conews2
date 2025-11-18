import { MetadataRoute } from 'next';
import { isProductionEnvironment, getSiteUrl } from '@/lib/seo-utils';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { PUBLIC_VENUES_PAGINATED } from '@/lib/graphql/public-venues';
import { PublicVenuesResponse, PublicVenuesQueryVariables } from '@/types/public-venues';
import { PUBLIC_RESTAURANTS_PAGINATED } from '@/lib/graphql/public-restaurants';
import { PublicRestaurantsResponse, PublicRestaurantsQueryVariables } from '@/types/public-restaurants';
import { PUBLIC_ARTS_GROUPS_PAGINATED } from '@/lib/graphql/public-arts-groups';
import { PublicArtsGroupsPaginatedResponse, PublicArtsGroupsQueryVariables } from '@/types/public-arts-groups';
import { PUBLIC_EVENTS_PAGINATED } from '@/lib/graphql/public-events';
import { PublicEventsResponse, PublicEventsQueryVariables } from '@/types/public-events';

/**
 * Generates dynamic sitemap with venues, restaurants, arts groups, and events
 *
 * Only generated in production environment
 * Fetches all approved venues, restaurants, arts groups, and events from GraphQL API
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  // Base static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/venues`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/restaurants`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/arts-groups`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/calendar/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Only fetch venues and restaurants in production
  if (!isProductionEnvironment()) {
    return staticPages;
  }

  try {
    // Create Apollo Client for server-side data fetching
    const client = new ApolloClient({
      uri: `${siteUrl}/api/graphql`,
      cache: new InMemoryCache(),
    });

    // Fetch all approved venues (paginated)
    let allVenues: Array<{ slug: string; updatedAt?: string }> = [];
    let hasNextPage = true;
    let after: string | undefined;

    while (hasNextPage) {
      const { data } = await client.query<PublicVenuesResponse, PublicVenuesQueryVariables>({
        query: PUBLIC_VENUES_PAGINATED,
        variables: {
          first: 100,
          after,
          // No filters = all approved venues
        },
      });

      const venues = data.publicVenuesPaginated.edges.map((edge) => ({
        slug: edge.node.slug,
        updatedAt: edge.node.createdAt, // Use createdAt as proxy for lastModified
      }));

      allVenues = [...allVenues, ...venues];

      hasNextPage = data.publicVenuesPaginated.pageInfo.hasNextPage;
      after = data.publicVenuesPaginated.pageInfo.endCursor;
    }

    // Generate venue pages
    const venuePages: MetadataRoute.Sitemap = allVenues.map((venue) => ({
      url: `${siteUrl}/venues/venue/${venue.slug}`,
      lastModified: venue.updatedAt ? new Date(venue.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Fetch all approved restaurants (paginated)
    let allRestaurants: Array<{ slug: string; updatedAt?: string }> = [];
    let hasNextPageRestaurants = true;
    let afterRestaurants: string | undefined = undefined;

    while (hasNextPageRestaurants) {
      const result: { data: PublicRestaurantsResponse } = await client.query<PublicRestaurantsResponse, PublicRestaurantsQueryVariables>({
        query: PUBLIC_RESTAURANTS_PAGINATED,
        variables: {
          first: 100,
          after: afterRestaurants,
          // No filters = all approved restaurants
        },
      });

      const restaurants = result.data.publicRestaurantsPaginated.edges.map((edge) => ({
        slug: edge.node.slug,
        updatedAt: edge.node.createdAt, // Use createdAt as proxy for lastModified
      }));

      allRestaurants = [...allRestaurants, ...restaurants];

      hasNextPageRestaurants = result.data.publicRestaurantsPaginated.pageInfo.hasNextPage;
      afterRestaurants = result.data.publicRestaurantsPaginated.pageInfo.endCursor;
    }

    // Generate restaurant pages
    const restaurantPages: MetadataRoute.Sitemap = allRestaurants.map((restaurant) => ({
      url: `${siteUrl}/restaurants/restaurant/${restaurant.slug}`,
      lastModified: restaurant.updatedAt ? new Date(restaurant.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Generate location pages (shared between venues and restaurants)
    const locations = [
      { slug: 'miami-fl', name: 'Miami, FL' },
      { slug: 'orlando-fl', name: 'Orlando, FL' },
      { slug: 'tampa-fl', name: 'Tampa, FL' },
      { slug: 'jacksonville-fl', name: 'Jacksonville, FL' },
      { slug: 'palm-beach-fl', name: 'Palm Beach, FL' },
    ];

    const venueLocationPages: MetadataRoute.Sitemap = locations.map((location) => ({
      url: `${siteUrl}/venues/location/${location.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));

    const restaurantLocationPages: MetadataRoute.Sitemap = locations.map((location) => ({
      url: `${siteUrl}/restaurants/location/${location.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));

    const artsGroupLocationPages: MetadataRoute.Sitemap = locations.map((location) => ({
      url: `${siteUrl}/arts-groups/location/${location.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));

    const eventLocationPages: MetadataRoute.Sitemap = locations.map((location) => ({
      url: `${siteUrl}/calendar/events/location/${location.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    }));

    // Generate genre pages for events
    // IMPORTANT: Slugs must match GENRE_SLUG_MAP in genre-routing.ts
    const eventGenres = [
      { slug: 'music', name: 'Music' },
      { slug: 'visual-arts', name: 'Visual Arts' },
      { slug: 'performing-arts', name: 'Performing Arts' },
      { slug: 'dance', name: 'Dance' },
      { slug: 'theater', name: 'Theater' },
      { slug: 'festival', name: 'Festival' },  // Singular
      { slug: 'museum', name: 'Museum' },      // Singular
      { slug: 'class', name: 'Class' },        // Singular
      { slug: 'kids', name: 'Kids' },
      { slug: 'art', name: 'Art' },
      { slug: 'film', name: 'Film' },
      { slug: 'literary', name: 'Literary' },
      { slug: 'culinary', name: 'Culinary' },
    ];

    const eventGenrePages: MetadataRoute.Sitemap = eventGenres.map((genre) => ({
      url: `${siteUrl}/calendar/events/${genre.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.88,
    }));

    // Generate genre + location combination pages (high-value SEO pages)
    const eventGenreLocationPages: MetadataRoute.Sitemap = [];
    eventGenres.forEach((genre) => {
      locations.forEach((location) => {
        eventGenreLocationPages.push({
          url: `${siteUrl}/calendar/events/${genre.slug}/location/${location.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.9,
        });
      });
    });

    // Fetch all approved arts groups (paginated)
    let allArtsGroups: Array<{ slug: string; updatedAt?: string }> = [];
    let hasNextPageArtsGroups = true;
    let afterArtsGroups: string | undefined = undefined;

    while (hasNextPageArtsGroups) {
      const result: { data: PublicArtsGroupsPaginatedResponse } = await client.query<PublicArtsGroupsPaginatedResponse, PublicArtsGroupsQueryVariables>({
        query: PUBLIC_ARTS_GROUPS_PAGINATED,
        variables: {
          first: 100,
          after: afterArtsGroups,
          // No filters = all approved arts groups
        },
      });

      const artsGroups = result.data.publicArtsGroupsPaginated.edges.map((edge) => ({
        slug: edge.node.slug,
        updatedAt: edge.node.createdAt, // Use createdAt as proxy for lastModified
      }));

      allArtsGroups = [...allArtsGroups, ...artsGroups];

      hasNextPageArtsGroups = result.data.publicArtsGroupsPaginated.pageInfo.hasNextPage;
      afterArtsGroups = result.data.publicArtsGroupsPaginated.pageInfo.endCursor || undefined;
    }

    // Generate arts group pages
    const artsGroupPages: MetadataRoute.Sitemap = allArtsGroups.map((artsGroup) => ({
      url: `${siteUrl}/arts-groups/arts-group/${artsGroup.slug}`,
      lastModified: artsGroup.updatedAt ? new Date(artsGroup.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Fetch all events (paginated)
    let allEvents: Array<{ slug: string; updatedAt?: string }> = [];
    let hasNextPageEvents = true;
    let afterEvents: string | undefined = undefined;

    while (hasNextPageEvents) {
      const result: { data: PublicEventsResponse } = await client.query<PublicEventsResponse, PublicEventsQueryVariables>({
        query: PUBLIC_EVENTS_PAGINATED,
        variables: {
          first: 100,
          after: afterEvents,
          // No filters = all events
        },
      });

      const events = result.data.publicEventsPaginated.edges.map((edge) => ({
        slug: edge.node.slug,
        updatedAt: edge.node.startDate || undefined, // Use startDate for events, fallback to undefined
      }));

      allEvents = [...allEvents, ...events];

      hasNextPageEvents = result.data.publicEventsPaginated.pageInfo.hasNextPage;
      afterEvents = result.data.publicEventsPaginated.pageInfo.endCursor || undefined;
    }

    // Generate event pages
    const eventPages: MetadataRoute.Sitemap = allEvents.map((event) => ({
      url: `${siteUrl}/calendar/events/event/${event.slug}`,
      lastModified: event.updatedAt ? new Date(event.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [
      ...staticPages,
      ...venueLocationPages,
      ...restaurantLocationPages,
      ...artsGroupLocationPages,
      ...eventLocationPages,
      ...eventGenrePages,
      ...eventGenreLocationPages,
      ...venuePages,
      ...restaurantPages,
      ...artsGroupPages,
      ...eventPages,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages on error
    return staticPages;
  }
}
