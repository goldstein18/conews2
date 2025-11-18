import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface EventFormActionsProps {
  onCancel: () => void;
  isValid: boolean;
  draftId?: string;
}

export function EventFormActions({ onCancel, isValid, draftId }: EventFormActionsProps) {
  return (
    <div className="flex justify-between pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      
      <Button
        type="submit"
        disabled={!isValid || !draftId}
        className="min-w-32"
      >
        Continue to Step 2
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}