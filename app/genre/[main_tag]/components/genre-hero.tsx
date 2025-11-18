/**
 * Genre hero/marquee component
 * Displays genre-specific hero with background image and overlay
 */

'use client';

import { cn } from '@/lib/utils';

interface GenreHeroProps {
  title: string;           // e.g., "MUSIC EVENTS"
  description: string;     // e.g., "Discover the best music events near you"
  backgroundImage: string; // Hero background image URL
  className?: string;
}

export function GenreHero({
  title,
  description,
  backgroundImage,
  className
}: GenreHeroProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-light">
            {description}
          </p>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
