import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Control, FieldValues } from 'react-hook-form';
import { MARKET_OPTIONS } from '../../lib/validations';

interface MarketFieldProps {
  control: Control<FieldValues>;
}

// Market options
const marketOptions = MARKET_OPTIONS.map(option => ({
  value: option.value,
  label: option.label
}));

export function MarketField({ control }: MarketFieldProps) {
  return (
    <FormField
      control={control}
      name="market"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Market <span className="text-destructive">*</span>
          </FormLabel>
          <Select 
            value={field.value || ''} 
            onValueChange={field.onChange}
            key={`market-select-${field.value}`}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {marketOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Select the primary market for your event.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}