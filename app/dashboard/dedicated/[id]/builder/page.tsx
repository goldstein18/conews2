'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { DedicatedBuilder } from './components/dedicated-builder';
import { DedicatedBuilderSkeleton } from './components/dedicated-builder-skeleton';
import { GET_DEDICATED } from '@/lib/graphql/dedicated';

export default function DedicatedBuilderPage() {
  const params = useParams();
  const dedicatedId = params?.id as string;

  const { data, loading, error } = useQuery(GET_DEDICATED, {
    variables: { id: dedicatedId },
    skip: !dedicatedId,
    errorPolicy: 'all'
  });

  if (!dedicatedId) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Invalid Dedicated Campaign</h3>
          <p className="text-sm text-muted-foreground">
            No dedicated ID provided.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <DedicatedBuilderSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Error Loading Dedicated Campaign</h3>
          <p className="text-sm text-muted-foreground">
            {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!data?.dedicated) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Dedicated Campaign Not Found</h3>
          <p className="text-sm text-muted-foreground">
            The requested dedicated campaign could not be found.
          </p>
        </div>
      </div>
    );
  }

  return <DedicatedBuilder dedicatedId={dedicatedId} dedicated={data.dedicated} />;
}
