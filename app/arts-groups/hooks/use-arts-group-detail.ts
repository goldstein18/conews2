/**
 * useArtsGroupDetail Hook
 * Hook for fetching single arts group detail data
 */

'use client';

import { useQuery } from '@apollo/client';
import { PUBLIC_ARTS_GROUP } from '@/lib/graphql/public-arts-groups';
import type {
  PublicArtsGroupResponse,
  PublicArtsGroupVariables,
} from '@/types/public-arts-groups';

export const useArtsGroupDetail = (identifier: string) => {
  const { data, loading, error } = useQuery<
    PublicArtsGroupResponse,
    PublicArtsGroupVariables
  >(PUBLIC_ARTS_GROUP, {
    variables: { identifier },
    skip: !identifier,
  });

  return {
    artsGroup: data?.publicArtsGroup || null,
    loading,
    error,
  };
};
