import type { NewsHeaderCategory } from '@/app/news/components/news-header';

export const INDUSTRY_NEWS_HEADER_CATEGORIES: NewsHeaderCategory[] = [
  { id: 'arts-marketing-lab', name: 'Arts Marketing Lab', slug: 'arts-marketing-lab' },
  { id: 'community', name: 'Community', slug: 'community' },
  { id: 'tools-features', name: 'Tools & Features', slug: 'tools-features' },
  { id: 'behind-the-owl', name: 'Behind the Owl', slug: 'behind-the-owl' }
];

export const INDUSTRY_CATEGORY_TITLE_MAP: Record<string, string> =
  INDUSTRY_NEWS_HEADER_CATEGORIES.reduce<Record<string, string>>((map, category) => {
    map[category.id] = category.name;
    map[category.slug] = category.name;
    return map;
  }, {});

const INDUSTRY_TITLE_OVERRIDES: Record<string, string> = {
  art: 'Arts Marketing Lab',
  'art-museums': 'Arts Marketing Lab',
  'arts & museums': 'Arts Marketing Lab',
  'arts & museums ': 'Arts Marketing Lab',
  'arts-museums': 'Arts Marketing Lab',
  'things-to-do': 'Community',
  'things to do': 'Community',
  culinary: 'Tools & Features',
  dance: 'Tools & Features',
  'festivals-and-fairs': 'Community',
  festivals: 'Community',
  film: 'Behind the Owl',
  music: 'Arts Marketing Lab',
  theater: 'Behind the Owl',
  'city-guides': 'Tools & Features',
  'cultural-news': 'Arts Marketing Lab',
  'Industry News': 'Arts Marketing Lab',
  'Cultural News': 'Arts Marketing Lab'
};

Object.assign(INDUSTRY_CATEGORY_TITLE_MAP, INDUSTRY_TITLE_OVERRIDES);

export const INDUSTRY_CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'arts-marketing-lab': 'Industry insights, strategies, and data for arts organizations.',
  community: 'Human-centered coverage of people, opportunities, and community updates.',
  'tools-features':
    'Modern resources designed to help cultural organizations grow visibility, deepen engagement, and elevate their impact.',
  'behind-the-owl': 'Platform updates, case studies, and insider access to the CultureOwl ecosystem.'
};

export const INDUSTRY_CATEGORY_TOPICS: Record<
  string,
  {
    intro: string;
    topics: Array<{ title: string; detail: string }>;
  }
> = {
  'arts-marketing-lab': {
    intro: 'Industry insights, strategies, and data for arts organizations.',
    topics: [
      {
        title: 'News & Trends',
        detail: 'sector updates, market shifts, audience behavior, cultural research'
      },
      {
        title: 'Funding & Grants',
        detail: 'grant opportunities, philanthropy reports, fundraising strategy'
      },
      {
        title: 'Policy & Advocacy',
        detail: 'legislation, public funding debates, cultural policy issues'
      },
      {
        title: 'Audience Development',
        detail: 'research and strategies for reaching and growing audiences'
      }
    ]
  },
  community: {
    intro: 'Human-centered coverage of people, opportunities, and community updates.',
    topics: [
      {
        title: 'Calls & Auditions',
        detail: 'open calls, submissions, auditions, artist opportunities'
      },
      {
        title: 'Opportunities',
        detail: 'residencies, fellowships, commissions, prizes'
      },
      {
        title: 'People On The Move',
        detail: 'appointments, promotions, leadership transitions'
      }
    ]
  },
  'tools-features': {
    intro: 'Modern resources designed to help cultural organizations grow visibility, deepen engagement, and elevate their impact.',
    topics: [
      {
        title: 'Growth & Visibility',
        detail: 'Strategies and guides for boosting reach, attendance, and cultural relevance.'
      },
      {
        title: 'Cultural Marketing Resources',
        detail: 'Creative frameworks and storytelling tools tailored for arts programming.'
      },
      {
        title: 'Data & Insights Hub',
        detail: 'Audience trends, cultural reports, and performance analytics.'
      },
      {
        title: 'Learning & Support',
        detail: 'Workshops, tutorials, and hands-on help for mastering CultureOwl tools.'
      }
    ]
  },
  'behind-the-owl': {
    intro: 'Platform updates, case studies, and insider access to the CultureOwl ecosystem.',
    topics: [
      {
        title: 'Case Studies',
        detail: 'real-world success stories from CultureOwl partners'
      },
      {
        title: 'Product Updates',
        detail: 'new features, roadmap previews, platform announcements'
      },
      {
        title: 'Behind-the-Scenes',
        detail: 'team stories, mission updates, cultural vision'
      }
    ]
  }
};

