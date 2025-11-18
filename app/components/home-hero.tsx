/**
 * Home page hero/marquee component
 * Displays hero section with background image, title, and CTA button
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeHeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: string;
  className?: string;
}

export function HomeHero({
  title,
  subtitle,
  ctaText = "Explore Events",
  ctaHref = "/calendar/events",
  backgroundImage = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop",
  className
}: HomeHeroProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-28 lg:py-36">
        <div className="max-w-4xl">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-light mb-8 max-w-2xl">
            {subtitle}
          </p>

          {/* CTA Button */}
          <Link href={ctaHref}>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
