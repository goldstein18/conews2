import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Preview,
  Font
} from '@react-email/components';
import { NewsletterHeader } from './components/newsletter-header';
import { EventCard } from './components/event-card';
import { RestaurantCard } from './components/restaurant-card';
import { BannerSlot } from './components/banner-slot';
import { NewsletterFooter } from './components/newsletter-footer';

export interface ClassicNewsletterProps {
  title?: string;
  previewText?: string;
  upcomingEvents?: Array<{
    id: string;
    title: string;
    imageUrl?: string;
    startDate?: string;
    location?: string;
    description?: string;
    eventUrl?: string;
  }>;
  featuredEvents?: Array<{
    id: string;
    title: string;
    imageUrl?: string;
    startDate?: string;
    location?: string;
    description?: string;
    eventUrl?: string;
    isFeatured?: boolean;
  }>;
  editorialBlocks?: Array<{
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
  }>;
  restaurantPicks?: Array<{
    id: string;
    name: string;
    imageUrl?: string;
    description?: string;
    cuisineType?: string;
    location?: string;
    restaurantUrl?: string;
    isPickOfTheMonth?: boolean;
  }>;
  banners?: Array<{
    id: string;
    imageUrl?: string;
    link?: string;
    alt?: string;
    position: number;
  }>;
  unsubscribeUrl?: string;
}

export const ClassicNewsletter = ({
  title = 'eScoop Newsletter',
  previewText = 'Your weekly food & dining guide',
  upcomingEvents = [],
  featuredEvents = [],
  editorialBlocks = [],
  restaurantPicks = [],
  banners = [],
  unsubscribeUrl = '#'
}: ClassicNewsletterProps) => {
  // Sort banners by position
  const sortedBanners = [...banners].sort((a, b) => a.position - b.position);

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Arial"
          fallbackFontFamily="sans-serif"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={{
        backgroundColor: '#f3f4f6',
        fontFamily: 'Arial, sans-serif',
        margin: 0,
        padding: 0
      }}>
        <Container style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#ffffff'
        }}>
          {/* Header */}
          <NewsletterHeader title={title} />

          {/* Top Banner */}
          {sortedBanners.filter(b => b.position === 0).map((banner) => (
            <BannerSlot
              key={banner.id}
              imageUrl={banner.imageUrl}
              link={banner.link}
              alt={banner.alt}
            />
          ))}

          {/* Upcoming Events Section */}
          {upcomingEvents.length > 0 && (
            <Section style={{ padding: '24px' }}>
              <Text style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 24px 0',
                fontFamily: 'Arial, sans-serif'
              }}>
                Upcoming Events
              </Text>

              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  imageUrl={event.imageUrl}
                  startDate={event.startDate}
                  location={event.location}
                  description={event.description}
                  eventUrl={event.eventUrl}
                  layout="featured"
                />
              ))}
            </Section>
          )}

          {/* Featured Events Section */}
          {featuredEvents.length > 0 && (
            <Section style={{ padding: '24px', backgroundColor: '#f8fafc' }}>
              <Text style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 24px 0',
                fontFamily: 'Arial, sans-serif'
              }}>
                ⭐ Featured Events
              </Text>

              {featuredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  imageUrl={event.imageUrl}
                  startDate={event.startDate}
                  location={event.location}
                  description={event.description}
                  eventUrl={event.eventUrl}
                  layout="featured"
                  isFeatured={event.isFeatured}
                />
              ))}
            </Section>
          )}

          {/* Middle Banner */}
          {sortedBanners.filter(b => b.position === 1).map((banner) => (
            <BannerSlot
              key={banner.id}
              imageUrl={banner.imageUrl}
              link={banner.link}
              alt={banner.alt}
            />
          ))}

          {/* Editorial Blocks Section */}
          {editorialBlocks.length > 0 && (
            <Section style={{ padding: '24px' }}>
              <Text style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 24px 0',
                fontFamily: 'Arial, sans-serif'
              }}>
                📝 Editorial Blocks
              </Text>

              {editorialBlocks.map((editorial) => (
                <Section
                  key={editorial.id}
                  style={{
                    backgroundColor: '#f9fafb',
                    margin: '16px 0',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <Text style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 12px 0',
                    fontFamily: 'Arial, sans-serif'
                  }}>
                    {editorial.title}
                  </Text>
                  <Text style={{
                    fontSize: '14px',
                    color: '#4b5563',
                    margin: '0',
                    fontFamily: 'Arial, sans-serif',
                    lineHeight: '1.5'
                  }}>
                    {editorial.content}
                  </Text>
                </Section>
              ))}
            </Section>
          )}

          {/* Restaurant Picks Section */}
          {restaurantPicks.length > 0 && (
            <Section style={{ padding: '24px' }}>
              <Text style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 24px 0',
                fontFamily: 'Arial, sans-serif'
              }}>
                Restaurant Picks
              </Text>

              {restaurantPicks.map((restaurant, index) => (
                <RestaurantCard
                  key={restaurant.id}
                  name={restaurant.name}
                  imageUrl={restaurant.imageUrl}
                  description={restaurant.description}
                  cuisineType={restaurant.cuisineType}
                  location={restaurant.location}
                  restaurantUrl={restaurant.restaurantUrl}
                  isPickOfTheMonth={restaurant.isPickOfTheMonth || index === 0}
                />
              ))}
            </Section>
          )}

          {/* Bottom Banner */}
          {sortedBanners.filter(b => b.position === 2).map((banner) => (
            <BannerSlot
              key={banner.id}
              imageUrl={banner.imageUrl}
              link={banner.link}
              alt={banner.alt}
            />
          ))}

          {/* Footer */}
          <NewsletterFooter unsubscribeUrl={unsubscribeUrl} />
        </Container>
      </Body>
    </Html>
  );
};