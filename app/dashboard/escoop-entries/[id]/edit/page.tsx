'use client';

import { useParams } from 'next/navigation';
import { ProtectedPage } from '@/components/protected-page';
import { EditEscoopEntryPageContent } from './components/edit-escoop-entry-page-content';

export default function EditEscoopEntryPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <ProtectedPage
      requiredRoles={['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER', 'DINNING_MEMBER']}
    >
      <EditEscoopEntryPageContent id={id} />
    </ProtectedPage>
  );
}