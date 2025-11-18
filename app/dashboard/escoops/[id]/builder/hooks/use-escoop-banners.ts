import { useQuery } from '@apollo/client';
import { GET_ESCOOP_BANNERS, type EscoopBanner, type GetEscoopBannersVariables, type GetEscoopBannersData } from '@/lib/graphql/escoop-banners';
import type { ApolloError } from '@apollo/client';

interface UseEscoopBannersProps {
  escoopId: string;
  take?: number;
  enabled?: boolean;
}

interface UseEscoopBannersReturn {
  banners: EscoopBanner[];
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
}

export function useEscoopBanners({
  escoopId,
  take = 10,
  enabled = true
}: UseEscoopBannersProps): UseEscoopBannersReturn {
  const { data, loading, error, refetch } = useQuery<GetEscoopBannersData, GetEscoopBannersVariables>(
    GET_ESCOOP_BANNERS,
    {
      variables: {
        escoopId,
        take
      },
      skip: !enabled || !escoopId,
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true
    }
  );

  return {
    banners: data?.escoopBannersByEscoopId || [],
    loading,
    error,
    refetch
  };
}