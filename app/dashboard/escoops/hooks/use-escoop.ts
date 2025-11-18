"use client";

import { useQuery } from '@apollo/client';
import { GET_ESCOOP } from '@/lib/graphql/escoops';
import { Escoop } from '@/types/escoops';

interface UseEscoopProps {
  id: string;
  enabled?: boolean;
}

export function useEscoop({ id, enabled = true }: UseEscoopProps) {
  const {
    data,
    loading,
    error,
    refetch
  } = useQuery<{ escoop: Escoop }>(GET_ESCOOP, {
    variables: { id },
    errorPolicy: 'all',
    skip: !enabled || !id,
    fetchPolicy: 'cache-and-network'
  });

  const escoop = data?.escoop;

  return {
    escoop,
    loading,
    error,
    refetch
  };
}