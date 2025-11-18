'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { EscoopBuilder } from './components/escoop-builder';
import { EscoopBuilderSkeleton } from './components/escoop-builder-skeleton';
import { GET_ESCOOP } from '@/lib/graphql/escoops';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface EscoopBuilderPageProps {}

export default function EscoopBuilderPage({}: EscoopBuilderPageProps) {
  const params = useParams();
  const escoopId = params?.id as string;

  const { data, loading, error } = useQuery(GET_ESCOOP, {
    variables: { id: escoopId },
    skip: !escoopId,
    errorPolicy: 'all'
  });

  if (!escoopId) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Invalid Escoop</h3>
          <p className="text-sm text-muted-foreground">
            No escoop ID provided.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <EscoopBuilderSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Error Loading Escoop</h3>
          <p className="text-sm text-muted-foreground">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  return <EscoopBuilder escoopId={escoopId} escoop={data?.escoop} />;
}