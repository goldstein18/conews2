'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetEscoopEntry } from '../../../hooks';
import { EditEscoopEntryWizard } from './edit-escoop-entry-wizard';

interface EditEscoopEntryPageContentProps {
  id: string;
}

function EditEscoopEntryPageContentSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>

      {/* Form skeleton */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Status field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>

          {/* Approval reason */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EditEscoopEntryPageContent({ id }: EditEscoopEntryPageContentProps) {
  const router = useRouter();
  const { escoopEntry, loading, error } = useGetEscoopEntry(id);

  const handleBack = () => {
    router.push('/dashboard/escoop-entries');
  };

  if (loading) {
    return <EditEscoopEntryPageContentSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-600">
              Error loading escoop entry: {error.message}
            </div>
            <div className="text-center mt-4">
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Escoop Entries
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!escoopEntry) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Escoop entry not found
            </div>
            <div className="text-center mt-4">
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Escoop Entries
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <EditEscoopEntryWizard
      escoopEntry={escoopEntry}
      onCancel={handleBack}
    />
  );
}