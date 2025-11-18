'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mic, User, Users } from 'lucide-react';
import { performerSchema, type PerformerFormData, PERFORMER_TYPE_OPTIONS } from '../../lib/validations';

interface AddPerformerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPerformer: (performer: PerformerFormData) => void;
  existingPerformer?: PerformerFormData;
  mode?: 'add' | 'edit';
}

export function AddPerformerDialog({ 
  open, 
  onOpenChange, 
  onAddPerformer,
  existingPerformer,
  mode = 'add'
}: AddPerformerDialogProps) {

  const form = useForm<PerformerFormData>({
    resolver: zodResolver(performerSchema),
    defaultValues: existingPerformer || {
      name: '',
      role: '',
      type: 'ARTIST',
      description: ''
    }
  });

  const handleSubmit = async (data: PerformerFormData, event?: React.BaseSyntheticEvent) => {
    try {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      onAddPerformer(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding performer:', error);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ARTIST':
        return <Mic className="h-4 w-4" />;
      case 'SPEAKER':
        return <User className="h-4 w-4" />;
      case 'GUEST':
        return <Users className="h-4 w-4" />;
      default:
        return <Mic className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mic className="h-5 w-5" />
            <span>{mode === 'edit' ? 'Edit Performer' : 'Add New Performer'}</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleSubmit)} 
            className="space-y-6"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
                e.preventDefault();
              }
            }}
          >
            {/* Profile Image Placeholder */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Profile Image (320x320px recommended)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm">Upload a square image (320x320px)</p>
                <p className="text-xs text-gray-400">JPG, PNG, or GIF up to 5MB</p>
              </div>
            </div>

            {/* Name and Role/Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <span>Name</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Performer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <span>Role/Title</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lead Vocalist, Keynote Speaker" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Type Selection */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <div className="flex space-x-2">
                      {PERFORMER_TYPE_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-md border transition-colors ${
                            field.value === option.value
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background hover:bg-muted border-input'
                          }`}
                        >
                          {getTypeIcon(option.value)}
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description or bio..."
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Add Another Button (for future enhancement) */}
            <div className="text-center">
              <Button
                type="button"
                variant="outline"
                className="text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // This will be implemented later for bulk adding
                  console.log('Add another performer');
                }}
              >
                + Add Another Performer
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCancel();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit(handleSubmit)(e);
                }}
              >
                {mode === 'edit' ? 'Update Performer' : 'Add Performer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}