import { useQuery } from "@apollo/client";
import { ADMIN_DASHBOARD, MY_COMPANY_DASHBOARD } from "@/lib/graphql/dashboard";
import {
  AdminDashboardResponse,
  AdminDashboardVariables
} from "@/types/dashboard";
import { useAuthStore } from "@/store/auth-store";

interface UseDashboardDataProps {
  selectedMarket?: string;
}

export function useDashboardData({ selectedMarket }: UseDashboardDataProps = {}) {
  const { user, isInitializing } = useAuthStore();

  // ✅ Only query admin dashboard if user has SUPER_ADMIN or ADMIN role
  const canAccessAdminDashboard = user?.role?.name === 'SUPER_ADMIN' || user?.role?.name === 'ADMIN';

  // Query variables
  const variables: AdminDashboardVariables = {
    ...(selectedMarket && selectedMarket !== "all" && { market: selectedMarket }),
  };

  console.log('🎯 Dashboard hook - User:', {
    email: user?.email,
    role: user?.role?.name,
    isInitializing,
    canAccessAdminDashboard,
    skipAdminDashboard: isInitializing || !user || !canAccessAdminDashboard,
    skipCompanyDashboard: isInitializing || !user || canAccessAdminDashboard,
  });

  // ✅ Admin Dashboard query
  const { data: adminData, loading: adminLoading, error: adminError } = useQuery<AdminDashboardResponse>(
    ADMIN_DASHBOARD,
    {
      variables,
      fetchPolicy: "network-only", // ✅ Always fetch from network to avoid stale cache
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
      skip: isInitializing || !user || !canAccessAdminDashboard, // ✅ Skip if initializing OR no user OR non-admin
      context: {
        errorPolicy: 'all',
        headers: {
          'x-user-role': user?.role?.name || '', // ✅ Include role in request context
        }
      }
    }
  );

  // ✅ Company Dashboard query
  const { data: companyData, loading: companyLoading, error: companyError } = useQuery(
    MY_COMPANY_DASHBOARD,
    {
      variables,
      fetchPolicy: "network-only", // ✅ Always fetch from network to avoid stale cache
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
      skip: isInitializing || !user || canAccessAdminDashboard, // ✅ Skip if initializing OR no user OR admin
      context: {
        errorPolicy: 'all',
        headers: {
          'x-user-role': user?.role?.name || '', // ✅ Include role in request context
        }
      }
    }
  );

  // Select correct data based on user role
  const data = canAccessAdminDashboard ? adminData : companyData;
  const loading = canAccessAdminDashboard ? adminLoading : companyLoading;
  const error = canAccessAdminDashboard ? adminError : companyError;

  // Process data with defaults based on dashboard type
  const dashboardData = canAccessAdminDashboard
    ? (data?.adminDashboard || {
        overall: {
          totalCompanies: 0,
          activeCompanies: 0,
          pendingCompanies: 0,
          suspendedCompanies: 0,
          totalSubscribers: 0,
          totalCalendarMembers: 0,
          totalVenues: 0,
          totalRestaurants: 0,
          totalActiveEvents: 0,
          totalFeaturedEvents: 0,
        },
        revenue: {
          currentMonthRevenue: 0,
          previousMonthRevenue: 0,
          growthRate: 0,
          averageRevenuePerCompany: 0,
          totalPayingCompanies: 0,
          revenueByPlan: [],
        },
        companies: {
          lastCreated: [],
          expiringThisMonth: [],
          byCity: [],
          byPlan: [],
          byStatus: [],
        },
        eventsByCity: {
          citiesStats: [],
          totalRunningEvents: 0,
          totalFeaturedEvents: 0,
        },
        growth: {
          newCompaniesThisMonth: 0,
          newCompaniesLastMonth: 0,
          companiesGrowthRate: 0,
          newUsersThisMonth: 0,
          newUsersLastMonth: 0,
          usersGrowthRate: 0,
          newEventsThisMonth: 0,
          newEventsLastMonth: 0,
          eventsGrowthRate: 0,
        },
        users: {
          totalSubscribers: 0,
          totalCalendarMembers: 0,
          activeUsers: 0,
          inactiveUsers: 0,
          byMarket: [],
        },
        generatedAt: new Date().toISOString(),
        market: null,
      })
    : (data?.myCompanyDashboard || {
        company: null,
        events: {
          totalEvents: 0,
          pendingEvents: 0,
          liveEvents: 0,
          draftEvents: 0,
          pastEvents: 0,
          rejectedEvents: 0,
          featuredCount: 0,
        },
        banners: {
          totalClicks: 0,
          totalImpressions: 0,
          ctr: 0,
          activeBanners: 0,
          totalBanners: 0,
          pendingBanners: 0,
          approvedBanners: 0,
        },
        featuredEvents: [],
        assets: {
          totalAvailable: 0,
          totalConsumed: 0,
          totalRemaining: 0,
          usagePercentage: 0,
          lowStockAssets: 0,
          outOfStockAssets: 0,
        },
        team: {
          totalMembers: 0,
          activeMembers: 0,
          owners: 0,
          admins: 0,
        },
        generatedAt: new Date().toISOString(),
        market: null,
      });

  // Filter out AbortError and similar navigation-related errors
  const isAbortError = (err: Error | null | undefined) => {
    if (!err) return false;
    const message = err.message || '';
    return message.includes('AbortError') ||
           message.includes('signal is aborted') ||
           message.includes('operation was aborted') ||
           message.includes('Request aborted') ||
           err.name === 'AbortError';
  };

  const displayError = error && !isAbortError(error) ? error : null;

  return {
    data: dashboardData,
    loading,
    error: displayError,
    rawData: data,
    canAccessAdminDashboard, // ✅ Return access flag for conditional rendering
    isInitializing, // ✅ Return initialization state
  };
}
