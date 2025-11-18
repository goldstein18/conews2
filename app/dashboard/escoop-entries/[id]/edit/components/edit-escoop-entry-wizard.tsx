'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { EditEscoopEntryFormContent } from './edit-escoop-entry-form-content';
import { EditEscoopEntrySidebarNavigation } from './edit-escoop-entry-sidebar-navigation';
import type { EscoopEntry, EscoopSearchResult, EventFullData } from '@/types/escoop-entries';

interface EditEscoopEntryWizardProps {
  escoopEntry: EscoopEntry;
  onCancel: () => void;
}

export function EditEscoopEntryWizard({ escoopEntry, onCancel }: EditEscoopEntryWizardProps) {
  const router = useRouter();
  const [selectedEscoop, setSelectedEscoop] = useState<EscoopSearchResult | null>({
    id: escoopEntry.escoop.id,
    name: escoopEntry.escoop.name,
    status: escoopEntry.escoop.status,
    remaining: escoopEntry.escoop.remaining,
    market: '',
  });
  const [selectedEvent, setSelectedEvent] = useState<EventFullData | null>({
    id: escoopEntry.event.id,
    title: escoopEntry.event.title,
    companyId: escoopEntry.event.companyId,
    slug: escoopEntry.event.slug,
    startDate: escoopEntry.event.startDate || '',
    status: escoopEntry.event.status,
    image: escoopEntry.event.image,
    mainImageUrl: escoopEntry.event.mainImageUrl,
  });
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>('');

  const handleSuccess = () => {
    router.push('/dashboard/escoop-entries');
  };

  const handleEscoopSelect = (escoop: EscoopSearchResult) => {
    setSelectedEscoop(escoop);
  };

  const handleEventSelect = (event: EventFullData) => {
    setSelectedEvent(event);
  };

  const handleCompanySelect = (companyName: string) => {
    setSelectedCompanyName(companyName);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
        <EditEscoopEntrySidebarNavigation
          currentStep={1}
          totalSteps={1}
          selectedEscoop={selectedEscoop}
          selectedEvent={selectedEvent}
          companyName={selectedCompanyName}
          escoopEntry={escoopEntry}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <EditEscoopEntryFormContent
          escoopEntry={escoopEntry}
          onSubmit={handleSuccess}
          onCancel={onCancel}
          onEscoopSelect={handleEscoopSelect}
          onEventSelect={handleEventSelect}
          onCompanySelect={handleCompanySelect}
        />
      </div>
    </div>
  );
}