export interface PlanAllowances {
  id: string;
  appBanners: number;
  banners: number;
  createdAt: string;
  dedicated: number;
  eMags: number;
  editorials: number;
  escoopBanners: number;
  escoopFeature: number;
  escoops: number;
  eventFeaturedHp: number;
  events: number;
  fbCarousels: number;
  fbCovers: number;
  fbSocialAd: number;
  fbSocialBoost: number;
  genreBlue: number;
  genreBlue6: number;
  genreBlue12: number;
  genreGreen: number;
  genreGreen6: number;
  genreGreen12: number;
  genreRed: number;
  lbhBanners: number;
  lbvBanners: number;
  mainFeatures: number;
  marquee: number;
  pageAd: number;
  restaurants: number;
  updatedAt: string;
  venues: number;
}

export interface Plan {
  id: string;
  plan: string;
  planSlug: string;
  price: number;
  priceLong: number;
  stripeId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  description?: string;
  status?: PlanStatus;
  allowances: PlanAllowances;
}

export interface PlansResponse {
  plans: Plan[];
}

export interface CreatePlanWithStripeInput {
  plan: string;
  planSlug: string;
  price: number;
  priceLong: string;
  allowances: Omit<PlanAllowances, 'id' | 'createdAt' | 'updatedAt'>;
}

export interface CreatePlanResponse {
  createPlanWithStripe: Omit<Plan, 'allowances'>;
}

export enum PlanStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface UpdatePlanInput {
  description?: string;
  status?: PlanStatus;
}

export interface UpdatePlanResponse {
  updatePlan: {
    id: string;
    plan: string;
    description?: string;
    status: PlanStatus;
    updatedAt: string;
  };
}