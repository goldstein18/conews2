import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { EventTagSelector } from './tag-selector';

interface EventCategoriesCardProps {
  form: UseFormReturn<FieldValues>;
}

export function EventCategoriesCard({ form }: EventCategoriesCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <EventTagSelector
          mainGenreId={form.watch('mainGenreId')}
          onMainGenreChange={(value) => {
            form.setValue('mainGenreId', value as string);
            // Clear subgenre when main genre changes
            if (form.watch('subgenreId')) {
              form.setValue('subgenreId', '');
            }
          }}
          subgenreId={form.watch('subgenreId')}
          onSubgenreChange={(value) => form.setValue('subgenreId', value as string)}
          supportingTagIds={form.watch('supportingTagIds') || []}
          onSupportingTagsChange={(value) => form.setValue('supportingTagIds', value as string[])}
          audienceTagIds={form.watch('audienceTagIds') || []}
          onAudienceTagsChange={(value) => form.setValue('audienceTagIds', value as string[])}
          errors={{
            mainGenreId: form.formState.errors.mainGenreId?.message as string | undefined,
            subgenreId: form.formState.errors.subgenreId?.message as string | undefined,
            supportingTagIds: form.formState.errors.supportingTagIds?.message as string | undefined,
            audienceTagIds: form.formState.errors.audienceTagIds?.message as string | undefined
          }}
        />
      </CardContent>
    </Card>
  );
}