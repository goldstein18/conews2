import { useMutation } from '@apollo/client';
import {
  CREATE_MARQUEE,
  UPDATE_MARQUEE,
  UPDATE_MARQUEE_STATUS,
  LIST_MARQUEES_PAGINATED,
  GET_MARQUEE_STATS,
} from '@/lib/graphql/marquee';
import { MarqueeStatus } from '@/types/marquee';
import type {
  CreateMarqueeInput,
  UpdateMarqueeInput,
  UpdateMarqueeStatusInput,
  Marquee,
} from '@/types/marquee';

export function useMarqueeActions() {

  const [createMarqueeMutation, { loading: creating }] = useMutation(CREATE_MARQUEE, {
    refetchQueries: [
      { query: LIST_MARQUEES_PAGINATED, variables: { first: 10, includeTotalCount: true } },
      { query: GET_MARQUEE_STATS },
    ],
  });

  const [updateMarqueeMutation, { loading: updating }] = useMutation(UPDATE_MARQUEE, {
    refetchQueries: [
      { query: LIST_MARQUEES_PAGINATED, variables: { first: 10, includeTotalCount: true } },
      { query: GET_MARQUEE_STATS },
    ],
  });

  const [updateMarqueeStatusMutation, { loading: updatingStatus }] = useMutation(
    UPDATE_MARQUEE_STATUS,
    {
      refetchQueries: [
        { query: LIST_MARQUEES_PAGINATED, variables: { first: 10, includeTotalCount: true } },
        { query: GET_MARQUEE_STATS },
      ],
    }
  );

  const createMarquee = async (input: CreateMarqueeInput): Promise<Marquee | null> => {
    try {
      const { data } = await createMarqueeMutation({
        variables: {
          createMarqueeInput: input,
        },
      });

      return data?.createMarquee || null;
    } catch (error) {
      console.error('Error creating marquee:', error);
      throw error;
    }
  };

  const updateMarquee = async (input: UpdateMarqueeInput): Promise<Marquee | null> => {
    try {
      const { data } = await updateMarqueeMutation({
        variables: {
          updateMarqueeInput: input,
        },
      });

      return data?.updateMarquee || null;
    } catch (error) {
      console.error('Error updating marquee:', error);
      throw error;
    }
  };

  const updateMarqueeStatus = async (
    input: UpdateMarqueeStatusInput
  ): Promise<Marquee | null> => {
    try {
      const { data } = await updateMarqueeStatusMutation({
        variables: input,
      });

      return data?.updateMarqueeStatus || null;
    } catch (error) {
      console.error('Error updating marquee status:', error);
      throw error;
    }
  };

  const approveMarquee = async (id: string): Promise<Marquee | null> => {
    return updateMarqueeStatus({ id, status: MarqueeStatus.APPROVED });
  };

  const declineMarquee = async (id: string, reason: string): Promise<Marquee | null> => {
    return updateMarqueeStatus({
      id,
      status: MarqueeStatus.DECLINED,
      declinedReason: reason,
    });
  };

  return {
    createMarquee,
    updateMarquee,
    updateMarqueeStatus,
    approveMarquee,
    declineMarquee,
    creating,
    updating,
    updatingStatus,
  };
}
