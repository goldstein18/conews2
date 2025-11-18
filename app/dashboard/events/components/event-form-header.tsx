import { EventAutoSaveIndicator } from './event-auto-save-indicator';

interface EventFormHeaderProps {
  mode: 'create' | 'draft' | 'edit';
  handleManualSave: () => Promise<void>;
}

export function EventFormHeader({ mode, handleManualSave }: EventFormHeaderProps) {
  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Create Your Event';
      case 'draft': return 'Continue Your Event';
      case 'edit': return 'Edit Event';
      default: return 'Create Your Event';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'create': 
        return 'Share your event with the CultureOwl community in just a few steps';
      case 'draft':
        return 'Complete your event details to publish it';
      case 'edit':
        return 'Update your event information';
      default: 
        return 'Share your event with the CultureOwl community in just a few steps';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">
          {getTitle()}
        </h1>
        <p className="text-muted-foreground">
          {getDescription()}
        </p>
      </div>
      <EventAutoSaveIndicator 
        onManualSave={handleManualSave}
        showManualSave={true}
      />
    </div>
  );
}