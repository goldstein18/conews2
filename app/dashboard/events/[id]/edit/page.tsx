import { notFound } from 'next/navigation';
import { EventCreationWizard } from '../../create/components';

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    draft?: string;
  }>;
}

export default async function EditEventPage({ params, searchParams }: EditEventPageProps) {
  const { id: eventId } = await params;
  const { draft } = await searchParams;
  const isDraft = draft === 'true';

  // Validate event ID format
  if (!eventId || eventId === 'undefined' || eventId === 'null') {
    notFound();
  }

  return (
    <EventCreationWizard 
      eventId={eventId}
      isDraft={isDraft}
      mode={isDraft ? 'draft' : 'edit'}
    />
  );
}