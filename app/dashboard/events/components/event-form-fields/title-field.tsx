import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Control, FieldValues } from 'react-hook-form';

interface TitleFieldProps {
  control: Control<FieldValues>;
  titleCharsLeft: number;
}

export function TitleField({ control, titleCharsLeft }: TitleFieldProps) {
  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Event Name <span className="text-destructive">*</span>
          </FormLabel>
          <FormControl>
            <Input
              placeholder="Enter event title"
              {...field}
              maxLength={75}
            />
          </FormControl>
          <FormDescription className="flex justify-between">
            <span>
              Choose a title that clearly describes your arts event and gives a feel for the experience.
            </span>
            <span className={titleCharsLeft < 10 ? 'text-destructive' : 'text-muted-foreground'}>
              {titleCharsLeft}/75
            </span>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}