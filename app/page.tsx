"use client";
import { HomeHero } from "@/app/components/home-hero";
import { HomeGenreNavigation } from "@/app/components/home-genre-navigation";
import { HomeLocationSearch } from "@/app/components/home-location-search";
import { FeaturedEventsCarousel } from "@/app/components/featured-events";
import { GenreEventsSection } from "@/app/components/genre-events";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-background to-muted">
      {/* Hero/Marquee Section */}
      <HomeHero
        title="Discover Florida's Cultural Events"
        subtitle="Explore music, art, theater, and more happening across Florida"
        ctaText="Explore Events"
        ctaHref="/calendar/events"
      />

      {/* Genre Navigation Section */}
      <HomeGenreNavigation />

      {/* Location Search Section */}
      <HomeLocationSearch />

      {/* Featured Events Carousel */}
      <FeaturedEventsCarousel />

      {/* Genre Events Sections */}
      <GenreEventsSection />

      {/* Footer is now in root layout */}
    </div>
  );
}
