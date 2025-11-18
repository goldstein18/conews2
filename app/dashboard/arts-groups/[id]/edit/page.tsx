"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArtsGroupEditWizard } from './components';
import { useArtsGroupData } from '../../hooks/use-arts-groups-data';
import { useArtsGroupActions } from '../../hooks/use-arts-group-actions';
import { ArtsGroupFormSkeleton } from '../../components';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UpdateArtsGroupFormData } from '../../lib/validations';
import type { UpdateArtsGroupInput } from '@/types/arts-groups';
import { ArtsGroupStatus } from '@/types/arts-groups';

export default function EditArtsGroupPage() {
  const params = useParams();
  const router = useRouter();
  const artsGroupId = params.id as string;

  const { artsGroup, loading, error } = useArtsGroupData({ id: artsGroupId });
  const { updateArtsGroup, loading: updateLoading } = useArtsGroupActions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: UpdateArtsGroupFormData) => {
    try {
      setIsSubmitting(true);

      // Prepare update input - only send defined fields
      const updateInput: UpdateArtsGroupInput = {
        id: artsGroupId
      };

      // Add only defined fields
      if (data.name) updateInput.name = data.name;
      if (data.address) updateInput.address = data.address;
      if (data.market) updateInput.market = data.market;
      if (data.artType) updateInput.artType = data.artType;
      if (data.phone) updateInput.phone = data.phone;
      if (data.email) updateInput.email = data.email;
      if (data.website) updateInput.website = data.website;
      if (data.description) updateInput.description = data.description;
      if (data.memberCount) updateInput.memberCount = data.memberCount;
      if (data.foundedYear) updateInput.foundedYear = data.foundedYear;
      if (data.image && data.image !== 'placeholder') updateInput.image = data.image;
      if (data.status) updateInput.status = data.status as ArtsGroupStatus; // Include status from toggle

      console.log('🔍 Updating arts group:', updateInput);

      const result = await updateArtsGroup(updateInput);

      if (result) {
        console.log('✅ Arts group updated successfully');
        router.push('/dashboard/arts-groups');
      }
    } catch (error) {
      console.error('❌ Update arts group error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <ArtsGroupFormSkeleton />;
  }

  if (error || !artsGroup) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Error Loading Arts Group</h1>
            <p className="text-sm text-muted-foreground">
              Unable to load the arts group for editing
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'The arts group could not be found or you do not have permission to edit it.'}
          </AlertDescription>
        </Alert>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ArtsGroupEditWizard
      artsGroup={artsGroup}
      onSubmit={handleSubmit}
      loading={isSubmitting || updateLoading}
    />
  );
}
