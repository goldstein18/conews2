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

interface SummaryFieldProps {
  control: Control<FieldValues>;
  summaryCharsLeft: number;
}

export function SummaryField({ control, summaryCharsLeft }: SummaryFieldProps) {
  return (
    <FormField
      control={control}
      name="summary"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Event Summary</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Write a compelling summary..."
              maxLength={140}
              rows={3}
              {...field}
            />
          </FormControl>
          <FormDescription className="flex justify-between">
            <span>
              Engaging summary for event pages and search results.
            </span>
            <span className={summaryCharsLeft < 10 ? 'text-destructive' : 'text-muted-foreground'}>
              {summaryCharsLeft}/140
            </span>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}