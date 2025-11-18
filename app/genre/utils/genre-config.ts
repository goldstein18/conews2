/**
 * Genre configuration for hero images and descriptions
 * Maps genre names to their display information
 */

export interface GenreConfig {
  name: string;
  displayName: string;
  description: string;
  heroImage: string;
  keywords: string[];
}

/**
 * Genre configurations with hero images and descriptions
 * Currently using music_genre.png for all genres as placeholder
 * TODO: Add genre-specific images later
 */
export const GENRE_CONFIGS: Record<string, GenreConfig> = {
  'MUSIC': {
    name: 'MUSIC',
    displayName: 'Music',
    description: 'Discover the best music events near you',
    heroImage: '/images/music_genre.png',
    keywords: ['concerts', 'live music', 'music festivals', 'performances']
  },
  'VISUAL_ARTS': {
    name: 'VISUAL_ARTS',
    displayName: 'Visual Arts',
    description: 'Explore stunning visual arts exhibitions near you',
    heroImage: '/images/music_genre.png',
    keywords: ['art exhibitions', 'galleries', 'art shows', 'visual arts']
  },
  'PERFORMING_ARTS': {
    name: 'PERFORMING_ARTS',
    displayName: 'Performing Arts',
    description: 'Experience captivating performing arts shows near you',
    heroImage: '/images/music_genre.png',
    keywords: ['performances', 'shows', 'live entertainment', 'performing arts']
  },
  'DANCE': {
    name: 'DANCE',
    displayName: 'Dance',
    description: 'Witness amazing dance performances near you',
    heroImage: '/images/music_genre.png',
    keywords: ['dance shows', 'ballet', 'contemporary dance', 'dance performances']
  },
  'THEATER': {
    name: 'THEATER',
    displayName: 'Theater',
    description: 'Experience captivating theater performances near you',
    heroImage: '/images/music_genre.png',
    keywords: ['plays', 'theater shows', 'drama', 'theater performances']
  },
  'FESTIVAL': {
    name: 'FESTIVAL',
    displayName: 'Festival',
    description: 'Join exciting festivals and celebrations near you',
    heroImage: '/images/music_genre.png',
    keywords: ['festivals', 'celebrations', 'cultural events', 'community events']
  },
  'MUSEUM': {
    name: 'MUSEUM',
    displayName: 'Museum',
    description: 'Explore fascinating museum exhibitions near you',
    heroImage: '/images/music_genre.png',
    keywords: ['museums', 'exhibitions', 'collections', 'cultural institutions']
  },
  'CLASS': {
    name: 'CLASS',
    displayName: 'Class',
    description: 'Learn through engaging classes and workshops near you',
    heroImage: '/images/music_genre.png',
    keywords: ['classes', 'workshops', 'learning', 'educational events']
  },
  'KIDS': {
    name: 'KIDS',
    displayName: 'Kids',
    description: 'Find fun and educational events for kids near you',
    heroImage: '/images/music_genre.png',
    keywords: ['kids events', 'family events', 'children activities', 'family fun']
  },
  'ART': {
    name: 'ART',
    displayName: 'Art',
    description: 'Discover inspiring art events and exhibitions near you',
    heroImage: '/images/music_genre.png',
    keywords: ['art events', 'art shows', 'exhibitions', 'art galleries']
  },
  'FILM': {
    name: 'FILM',
    displayName: 'Film',
    description: 'Enjoy exceptional film screenings and festivals near you',
    heroImage: '/images/music_genre.png',
    keywords: ['film festivals', 'movie screenings', 'cinema', 'film events']
  },
  'LITERARY': {
    name: 'LITERARY',
    displayName: 'Literary',
    description: 'Engage with literary events and book readings near you',
    heroImage: '/images/music_genre.png',
    keywords: ['book readings', 'author events', 'literary festivals', 'writing workshops']
  },
  'CULINARY': {
    name: 'CULINARY',
    displayName: 'Culinary',
    description: 'Savor culinary experiences and food events near you',
    heroImage: '/images/music_genre.png',
    keywords: ['food events', 'culinary festivals', 'cooking classes', 'tasting events']
  }
};

/**
 * Default fallback configuration for genres not in the map
 */
export const DEFAULT_GENRE_CONFIG: GenreConfig = {
  name: 'EVENTS',
  displayName: 'Events',
  description: 'Discover amazing cultural events near you',
  heroImage: '/images/music_genre.png',
  keywords: ['events', 'cultural events', 'entertainment', 'activities']
};

/**
 * Get genre configuration by genre name
 */
export function getGenreConfig(genreName: string): GenreConfig {
  const normalized = genreName.toUpperCase();
  return GENRE_CONFIGS[normalized] || DEFAULT_GENRE_CONFIG;
}

/**
 * Get hero title for genre
 * Example: "MUSIC" -> "MUSIC EVENTS"
 */
export function getGenreHeroTitle(genreName: string): string {
  const config = getGenreConfig(genreName);
  return `${config.displayName.toUpperCase()} EVENTS`;
}
