/**
 * Mock events data for Featured Events carousel
 * 20 sample events with placeholder images and realistic data
 */

import type { PublicEvent } from '@/types/public-events';

export const mockEvents: PublicEvent[] = [
  {
    id: 'mock-1',
    title: 'Miami Art Basel 2024',
    slug: 'miami-art-basel-2024',
    bigImageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
    city: 'Miami',
    state: 'FL',
    startDate: '2024-12-06T10:00:00Z',
    endDate: '2024-12-10T22:00:00Z',
    free: false,
    virtual: false,
    description: 'The most prestigious contemporary art show in the Americas, featuring leading galleries from around the world.',
    summary: 'Premier contemporary art fair',
    venue: {
      id: 'venue-1',
      name: 'Miami Beach Convention Center',
      city: 'Miami Beach',
      state: 'FL'
    },
    eventTags: [],
    eventDates: [
      { id: 'date-1', date: '2024-12-06', startTime: '10:00', endTime: '20:00', soldOut: false, cancelled: false },
      { id: 'date-2', date: '2024-12-07', startTime: '10:00', endTime: '20:00', soldOut: false, cancelled: false }
    ]
  },
  {
    id: 'mock-2',
    title: 'Jazz Under The Stars',
    slug: 'jazz-under-the-stars',
    bigImageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&q=80',
    city: 'Orlando',
    state: 'FL',
    startDate: '2024-11-20T19:00:00Z',
    endDate: '2024-11-20T23:00:00Z',
    free: true,
    virtual: false,
    description: 'Free outdoor jazz concert featuring local and international artists under the Florida night sky.',
    summary: 'Outdoor jazz concert',
    venue: {
      id: 'venue-2',
      name: 'Lake Eola Park',
      city: 'Orlando',
      state: 'FL'
    },
    eventTags: [],
    eventDates: []
  },
  {
    id: 'mock-3',
    title: 'Digital Art & NFT Exhibition',
    slug: 'digital-art-nft-exhibition',
    bigImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    city: 'Tampa',
    state: 'FL',
    startDate: '2024-11-25T12:00:00Z',
    endDate: '2024-11-25T20:00:00Z',
    free: false,
    virtual: true,
    description: 'Explore the future of art in this groundbreaking virtual exhibition showcasing digital creators and NFT artists.',
    summary: 'Virtual digital art showcase',
    eventTags: [],
    eventDates: []
  },
  {
    id: 'mock-4',
    title: 'Shakespeare in the Park: Hamlet',
    slug: 'shakespeare-park-hamlet',
    bigImageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
    city: 'Jacksonville',
    state: 'FL',
    startDate: '2024-11-18T20:00:00Z',
    endDate: '2024-11-18T22:30:00Z',
    free: true,
    virtual: false,
    description: 'A modern interpretation of Shakespeare classic tragedy performed under the stars.',
    summary: 'Outdoor theater performance',
    venue: {
      id: 'venue-3',
      name: 'Metropolitan Park',
      city: 'Jacksonville',
      state: 'FL'
    },
    eventTags: [],
    eventDates: [
      { id: 'date-3', date: '2024-11-18', startTime: '20:00', endTime: '22:30', soldOut: false, cancelled: false },
      { id: 'date-4', date: '2024-11-19', startTime: '20:00', endTime: '22:30', soldOut: false, cancelled: false },
      { id: 'date-5', date: '2024-11-20', startTime: '20:00', endTime: '22:30', soldOut: false, cancelled: false }
    ]
  },
  {
    id: 'mock-5',
    title: 'Electronic Music Festival 2024',
    slug: 'electronic-music-festival-2024',
    bigImageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    city: 'Miami',
    state: 'FL',
    startDate: '2024-12-15T18:00:00Z',
    endDate: '2024-12-16T04:00:00Z',
    free: false,
    virtual: false,
    description: 'Two-day electronic music extravaganza featuring world-class DJs and producers.',
    summary: 'EDM festival with top DJs',
    venue: {
      id: 'venue-4',
      name: 'Bayfront Park',
      city: 'Miami',
      state: 'FL'
    },
    eventTags: [],
    eventDates: [
      { id: 'date-6', date: '2024-12-15', startTime: '18:00', endTime: '04:00', soldOut: false, cancelled: false },
      { id: 'date-7', date: '2024-12-16', startTime: '18:00', endTime: '04:00', soldOut: false, cancelled: false }
    ]
  },
  {
    id: 'mock-6',
    title: 'Food & Wine Festival',
    slug: 'food-wine-festival',
    bigImageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    city: 'Orlando',
    state: 'FL',
    startDate: '2024-11-22T11:00:00Z',
    endDate: '2024-11-24T21:00:00Z',
    free: false,
    virtual: false,
    description: 'Celebrate culinary excellence with tastings from renowned chefs and sommeliers.',
    summary: 'Culinary festival',
    venue: {
      id: 'venue-5',
      name: 'Orange County Convention Center',
      city: 'Orlando',
      state: 'FL'
    },
    eventTags: [],
    eventDates: []
  },
  {
    id: 'mock-7',
    title: 'Kids Art Workshop: Painting Fun',
    slug: 'kids-art-workshop-painting',
    bigImageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
    city: 'Tampa',
    state: 'FL',
    startDate: '2024-11-16T10:00:00Z',
    endDate: '2024-11-16T12:00:00Z',
    free: true,
    virtual: false,
    description: 'Creative painting workshop for children ages 5-12. All materials provided.',
    summary: 'Free kids art workshop',
    venue: {
      id: 'venue-6',
      name: 'Tampa Museum of Art',
      city: 'Tampa',
      state: 'FL'
    },
    eventTags: [],
    eventDates: []
  },
  {
    id: 'mock-8',
    title: 'Indie Film Showcase',
    slug: 'indie-film-showcase',
    bigImageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    city: 'Miami',
    state: 'FL',
    startDate: '2024-11-28T19:00:00Z',
    endDate: '2024-11-28T23:00:00Z',
    free: false,
    virtual: false,
    description: 'Screening of award-winning independent films from emerging filmmakers.',
    summary: 'Independent cinema night',
    venue: {
      id: 'venue-7',
      name: 'O Cinema',
      city: 'Miami',
      state: 'FL'
    },
    eventTags: [],
    eventDates: []
  },
  {
    id: 'mock-9',
    title: 'Contemporary Dance Performance',
    slug: 'contemporary-dance-performance',
    bigImageUrl: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&q=80',
    city: 'Jacksonville',
    state: 'FL',
    startDate: '2024-12-01T20:00:00Z',
    endDate: '2024-12-01T22:00:00Z',
    free: false,
    virtual: false,
    description: 'Mesmerizing contemporary dance by acclaimed choreographers and performers.',
    summary: 'Modern dance showcase',
    venue: {
      id: 'venue-8',
      name: 'Times-Union Center',
      city: 'Jacksonville',
      state: 'FL'
    },
    eventTags: [],
    eventDates: []
  },
  {
    id: 'mock-10',
    title: 'Tech Innovation Conference',
    slug: 'tech-innovation-conference',
    bigImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    city: 'Orlando',
    state: 'FL',
    startDate: '2024-12-05T09:00:00Z',
    endDate: '2024-12-05T18:00:00Z',
    free: false,
    virtual: true,
    description: 'Virtual conference featuring tech leaders discussing AI, blockchain, and future innovations.',
    summary: 'Virtual tech conference',
    eventTags: [],
    eventDates: []
  },
  {
    id: 'mock-11',
    title: 'Latin Music Night',
    slug: 'latin-music-night',
    bigImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    city: 'Miami',
    state: 'FL',
    startDate: '2024-11-23T21:00:00Z',
    endDate: '2024-11-24T02:00:00Z',
    free: false,
    virtual: false,
    description: 'Celebrate Latin culture with live salsa, bachata, and reggaeton performances.',
    summary: 'Latin music celebration',
    venue: {
      id: 'venue-9',
      name: 'Ball & Chain',
      city: 'Miami',
      state: 'FL'
    },
    eventTags: [],
    eventDates: []
  },
  {
    id: 'mock-12',
    title: 'Photography Exhibition: Urban Landscapes',
    slug: 'photography-urban-landscapes',
    bigImageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80',
    city: 'Tampa',
    state: 'FL',
    startDate: '2024-11-17T10:00:00Z',
    endDate: '2024-12-17T18:00:00Z',
    free: true,
    virtual: false,
    description: 'Month-long photography exhibition exploring the beauty of urban architecture.',
    summary: 'Urban photography showcase',
    venue: {
      id: 'venue-10',
      name: 'Tampa Bay History Center',
      city: 'Tampa',
      state: 'FL'
    },
    eventTags: [],
    eventDates: []
  },
  {
    id: 'mock-13',
    title: 'Comedy Night: Stand-Up Showcase',
    slug: 'comedy-night-standup',
    bigImageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    city: 'Jacksonville',
    state: 'FL',
    startDate: '2024-11-19T20:00:00Z',
    endDate: '2024-11-19T22:30:00Z',
    free: false,
    virtual: false,
    description: 'Hilarious evening with top stand-up comedians from across the country.',
    summary: 'Stand-up comedy show',
    venue: {
      id: 'venue-11',
      name: 'Comedy Zone',
      city: 'Jacksonville',
      state: 'FL'
    },
    eventTags: [],
    eventDates: []
  },
  {
    id: 'mock-14',
    title: 'Classical Orchestra Concert',
    slug: 'classical-orchestra-concert',
    bigImageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80',
    city: 'Orlando',
    state: 'FL',
    startDate: '2024-12-08T19:30:00Z',
    endDate: '2024-12-08T21:30:00Z',
    free: false,
    virtual: false,
    description: 'Symphony orchestra performing Beethoven, Mozart, and contemporary classical pieces.',
    summary: 'Classical music performance',
    venue: {
      id: 'venue-12',
      name: 'Dr. Phillips Center',
      city: 'Orlando',
      state: 'FL'
    },
    eventTags: [],
    eventDates: []
  },
  {
    id: 'mock-15',
    title: 'Street Art Festival',
    slug: 'street-art-festival',
    bigImageUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&q=80',
    city: 'Miami',
    state: 'FL',
    startDate: '2024-11-30T10:00:00Z',
    endDate: '2024-12-01T22:00:00Z',
    free: true,
    virtual: false,
    description: 'Live murals, graffiti artists, and urban art installations throughout Wynwood.',
    summary: 'Urban art celebration',
    venue: {
      id: 'venue-13',
      name: 'Wynwood Walls',
      city: 'Miami',
      state: 'FL'
    },
    eventTags: [],
    eventDates: []
  },
  {
    id: 'mock-16',
    title: 'Virtual Reality Gaming Tournament',
    slug: 'vr-gaming-tournament',
    bigImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    city: 'Tampa',
    state: 'FL',
    startDate: '2024-12-10T14:00:00Z',
    endDate: '2024-12-10T22:00:00Z',
    free: false,
    virtual: false,
    description: 'Compete in VR esports with cash prizes and latest gaming technology.',
    summary: 'VR gaming competition',
    venue: {
      id: 'venue-14',
      name: 'Tampa Convention Center',
      city: 'Tampa',
      state: 'FL'
    },
    eventTags: [],
    eventDates: []
  },
  {
    id: 'mock-17',
    title: 'Yoga & Wellness Festival',
    slug: 'yoga-wellness-festival',
    bigImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    city: 'Jacksonville',
    state: 'FL',
    startDate: '2024-11-24T08:00:00Z',
    endDate: '2024-11-24T18:00:00Z',
    free: true,
    virtual: false,
    description: 'Free yoga classes, meditation sessions, and wellness workshops for all levels.',
    summary: 'Wellness and mindfulness event',
    venue: {
      id: 'venue-15',
      name: 'Riverside Park',
      city: 'Jacksonville',
      state: 'FL'
    },
    eventTags: [],
    eventDates: []
  },
  {
    id: 'mock-18',
    title: 'Broadway Musical: The Phantom',
    slug: 'broadway-musical-phantom',
    bigImageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80',
    city: 'Orlando',
    state: 'FL',
    startDate: '2024-12-12T19:00:00Z',
    endDate: '2024-12-12T22:00:00Z',
    free: false,
    virtual: false,
    description: 'Award-winning Broadway production with world-class performers and stunning sets.',
    summary: 'Broadway theater show',
    venue: {
      id: 'venue-16',
      name: 'Orlando Performing Arts Center',
      city: 'Orlando',
      state: 'FL'
    },
    eventTags: [],
    eventDates: [
      { id: 'date-8', date: '2024-12-12', startTime: '19:00', endTime: '22:00', soldOut: false, cancelled: false },
      { id: 'date-9', date: '2024-12-13', startTime: '19:00', endTime: '22:00', soldOut: false, cancelled: false },
      { id: 'date-10', date: '2024-12-14', startTime: '14:00', endTime: '17:00', soldOut: false, cancelled: false }
    ]
  },
  {
    id: 'mock-19',
    title: 'Craft Beer Tasting Festival',
    slug: 'craft-beer-tasting-festival',
    bigImageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&q=80',
    city: 'Miami',
    state: 'FL',
    startDate: '2024-12-07T15:00:00Z',
    endDate: '2024-12-07T21:00:00Z',
    free: false,
    virtual: false,
    description: 'Sample craft beers from local and national breweries with food pairings.',
    summary: 'Craft beer festival',
    venue: {
      id: 'venue-17',
      name: 'FTX Arena Plaza',
      city: 'Miami',
      state: 'FL'
    },
    eventTags: [],
    eventDates: []
  },
  {
    id: 'mock-20',
    title: 'Science & Technology Expo',
    slug: 'science-tech-expo',
    bigImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    mainImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    city: 'Tampa',
    state: 'FL',
    startDate: '2024-11-21T10:00:00Z',
    endDate: '2024-11-21T17:00:00Z',
    free: true,
    virtual: false,
    description: 'Interactive exhibits, robotics demonstrations, and hands-on science experiments for all ages.',
    summary: 'Free science expo',
    venue: {
      id: 'venue-18',
      name: 'MOSI - Museum of Science & Industry',
      city: 'Tampa',
      state: 'FL'
    },
    eventTags: [],
    eventDates: []
  }
];
