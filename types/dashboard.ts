// Overall Platform Statistics
export interface OverallStats {
  totalCompanies: number;
  activeCompanies: number;
  pendingCompanies: number;
  suspendedCompanies: number;
  totalSubscribers: number;
  totalCalendarMembers: number;
  totalVenues: number;
  totalRestaurants: number;
  totalActiveEvents: number;
  totalFeaturedEvents: number;
}

// Revenue Statistics
export interface RevenueByPlan {
  planName: string;
  revenue: number;
  companiesCount: number;
}

export interface RevenueStats {
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  growthRate: number;
  averageRevenuePerCompany: number;
  totalPayingCompanies: number;
  revenueByPlan: RevenueByPlan[];
}

// Companies Insights
export interface CompanyLastCreated {
  id: string;
  name: string;
  email: string;
  city: string;
  market: string;
  status: string;
  planName: string;
  createdAt: string;
  ownerName: string;
  ownerEmail: string;
}

export interface CompanyExpiring {
  id: string;
  name: string;
  email: string;
  expiryDate: string;
  daysUntilExpiry: number;
  planName: string;
}

export interface CompanyByCity {
  city: string;
  count: number;
  activeCount: number;
}

export interface CompanyByPlan {
  planName: string;
  count: number;
}

export interface CompanyByStatus {
  status: string;
  count: number;
}

export interface CompaniesInsights {
  lastCreated: CompanyLastCreated[];
  expiringThisMonth: CompanyExpiring[];
  byCity: CompanyByCity[];
  byPlan: CompanyByPlan[];
  byStatus: CompanyByStatus[];
}

// Events by City
export interface CityEventStats {
  city: string;
  runningEvents: number;
  featuredEvents: number;
  pendingEvents: number;
  totalApprovedEvents: number;
}

export interface EventsByCity {
  citiesStats: CityEventStats[];
  totalRunningEvents: number;
  totalFeaturedEvents: number;
}

// Growth Metrics
export interface GrowthMetrics {
  newCompaniesThisMonth: number;
  newCompaniesLastMonth: number;
  companiesGrowthRate: number;
  newUsersThisMonth: number;
  newUsersLastMonth: number;
  usersGrowthRate: number;
  newEventsThisMonth: number;
  newEventsLastMonth: number;
  eventsGrowthRate: number;
}

// Users Demographics
export interface UsersByMarket {
  market: string;
  count: number;
}

export interface UsersStats {
  totalSubscribers: number;
  totalCalendarMembers: number;
  activeUsers: number;
  inactiveUsers: number;
  byMarket: UsersByMarket[];
}

// Main Dashboard Data
export interface AdminDashboardData {
  overall: OverallStats;
  revenue: RevenueStats;
  companies: CompaniesInsights;
  eventsByCity: EventsByCity;
  growth: GrowthMetrics;
  users: UsersStats;
  generatedAt: string;
  market: string | null;
}

// GraphQL Response
export interface AdminDashboardResponse {
  adminDashboard: AdminDashboardData;
}

// GraphQL Variables
export interface AdminDashboardVariables {
  market?: string;
}
