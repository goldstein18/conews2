import { useQuery } from '@apollo/client';
import { LIST_BANNERS, GET_BANNER_STATS, GET_BANNER } from '@/lib/graphql/banners';
import { 
  BannersResponse,
  BannerStats,
  Banner,
  BannerType,
  BannerStatus
} from '@/types/banners';

interface UseBannersDataProps {
  search?: string;
  bannerType?: BannerType | 'ALL';
  status?: BannerStatus | 'ALL';
  market?: string;
  companyId?: string;
  first?: number;
  after?: string;
}

interface UseBannersDataReturn {
  banners: Banner[];
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  fetchMore: (variables: { after?: string }) => Promise<unknown>;
}

interface UseBannerStatsReturn {
  stats: BannerStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseBannerReturn {
  banner: Banner | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useBannersData = ({
  search = '',
  bannerType = 'ALL',
  status = 'ALL',
  market = '',
  companyId,
  first = 20,
  after
}: UseBannersDataProps = {}): UseBannersDataReturn => {
  // Build filter object according to API format (BannersFilterInput)
  const filter: Record<string, string | BannerType | BannerStatus> = {};

  // Add optional filters to the filter object
  if (search.trim()) filter.search = search.trim();
  if (market.trim()) filter.market = market.trim();
  if (companyId) filter.companyId = companyId;
  
  // Map banner type filter
  if (bannerType !== 'ALL') {
    filter.bannerType = bannerType;
  }
  
  // Map status filter
  if (status !== 'ALL') {
    filter.status = status;
  }

  const { data, loading, error, refetch, fetchMore } = useQuery<BannersResponse>(LIST_BANNERS, {
    variables: {
      first,
      after,
      filter,
      includeTotalCount: true
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache' // Redis cache on API handles this
  });

  // Extract banners from edges
  const banners = data?.bannersPaginated?.edges?.map(edge => edge.node) || [];
  
  // Extract page info
  const pageInfo = data?.bannersPaginated?.pageInfo || {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: undefined,
    endCursor: undefined
  };

  const totalCount = pageInfo.totalCount || 0;

  // Enhanced fetchMore function
  const handleFetchMore = (variables: { after?: string }) => {
    return fetchMore({
      variables: {
        first,
        after: variables.after,
        filter,
        includeTotalCount: true
      },
      updateQuery: (prev, { fetchMoreResult }: { fetchMoreResult?: BannersResponse }) => {
        if (!fetchMoreResult) return prev;
        
        return {
          bannersPaginated: {
            ...fetchMoreResult.bannersPaginated,
            edges: [
              ...prev.bannersPaginated.edges,
              ...fetchMoreResult.bannersPaginated.edges
            ]
          }
        };
      }
    });
  };

  return {
    banners,
    totalCount,
    pageInfo,
    loading,
    error: error || null,
    refetch,
    fetchMore: handleFetchMore
  };
};

export const useBannerStats = (companyId?: string): UseBannerStatsReturn => {
  const { data, loading, error, refetch } = useQuery(GET_BANNER_STATS, {
    variables: { companyId },
    errorPolicy: 'all',
    fetchPolicy: 'no-cache' // Redis cache on API handles this
  });

  // Transform the string response to match our BannerStats interface
  // Since the actual API returns strings, we'll parse them or provide defaults
  const stats = data ? {
    totalImpressions: 0, // Parse from data.topPerformingBanners string if needed
    totalClicks: 0,      // Parse from data.topPerformingBanners string if needed  
    averageCTR: 0,       // Parse from data.topPerformingBanners string if needed
    runningBanners: 0,   // Parse from data.bannerStatusSummary string if needed
    totalBanners: 0,     // Parse from data.bannerStatusSummary string if needed
    pendingBanners: 0,   // Parse from data.bannerStatusSummary string if needed
    approvedBanners: 0,  // Parse from data.bannerStatusSummary string if needed
    expiredBanners: 0,   // Parse from data.bannerStatusSummary string if needed
    declinedBanners: 0,  // Parse from data.bannerStatusSummary string if needed
    pausedBanners: 0     // Parse from data.bannerStatusSummary string if needed
  } : null;

  return {
    stats,
    loading,
    error: error || null,
    refetch
  };
};

export const useBanner = (id: string): UseBannerReturn => {
  const { data, loading, error, refetch } = useQuery(GET_BANNER, {
    variables: { id },
    errorPolicy: 'all',
    fetchPolicy: 'no-cache', // Redis cache on API handles this
    skip: !id
  });

  return {
    banner: data?.banner || null,
    loading,
    error: error || null,
    refetch
  };
};