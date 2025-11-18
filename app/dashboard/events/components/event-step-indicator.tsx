import { Button } from '@/components/ui/button';

export function EventStepIndicator() {
  return (
    <div className="flex items-center space-x-4 border-b">
      <Button variant="default" size="sm" className="rounded-full">
        Step 1
      </Button>
      <span className="text-sm font-medium">Step 2</span>
      <span className="text-sm font-medium">Step 3</span>
    </div>
  );
}