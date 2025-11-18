'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_DEDICATED } from '@/lib/graphql/dedicated';
import { DedicatedEditForm } from './components/dedicated-edit-form';
import { DedicatedEditSkeleton } from './components/dedicated-edit-skeleton';
import { DedicatedSidebarNavigation } from '../../components/dedicated-sidebar-navigation';
import { DedicatedMobileNavigation } from '../../components/dedicated-mobile-navigation';

export default function EditDedicatedPage() {
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
            No campaign ID provided.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <DedicatedEditSkeleton />;
  }

  if (error || !data?.dedicated) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Error Loading Campaign</h3>
          <p className="text-sm text-muted-foreground">
            {error?.message || 'Campaign not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full flex flex-col">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <DedicatedMobileNavigation
          currentStep={1}
          totalSteps={1}
          dedicated={data.dedicated}
          isEditMode={true}
        />
      </div>

      {/* Desktop Layout */}
      <div className="flex-1 flex">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <DedicatedSidebarNavigation
            currentStep={1}
            totalSteps={1}
            dedicated={data.dedicated}
            isEditMode={true}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Edit Dedicated Campaign</h1>
              <p className="text-muted-foreground mt-2">
                Update campaign details and image
              </p>
            </div>

            <DedicatedEditForm dedicated={data.dedicated} />
          </div>
        </div>
      </div>
    </div>
  );
}
