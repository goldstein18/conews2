import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Control, FieldValues } from 'react-hook-form';

interface DescriptionFieldProps {
  control: Control<FieldValues>;
}

export function DescriptionField({ control }: DescriptionFieldProps) {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Event Description</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Provide a detailed description of your event..."
              rows={5}
              {...field}
            />
          </FormControl>
          <FormDescription>
            Tell your audience what to expect. Include key details about the experience, artists, activities, and what makes this event special.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}