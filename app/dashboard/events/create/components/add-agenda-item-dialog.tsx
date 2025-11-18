'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TimePicker } from '@/components/ui/time-picker';
import { Calendar, Clock } from 'lucide-react';
import { agendaItemSchema, type AgendaItemFormData } from '../../lib/validations';

interface AddAgendaItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAgendaItem: (item: AgendaItemFormData) => void;
  existingItem?: AgendaItemFormData;
  mode?: 'add' | 'edit';
}

export function AddAgendaItemDialog({ 
  open, 
  onOpenChange, 
  onAddAgendaItem,
  existingItem,
  mode = 'add'
}: AddAgendaItemDialogProps) {
  const form = useForm<AgendaItemFormData>({
    resolver: zodResolver(agendaItemSchema),
    defaultValues: existingItem || {
      title: '',
      startTime: '',
      duration: 30,
      description: ''
    }
  });

  const handleSubmit = async (data: AgendaItemFormData, event?: React.BaseSyntheticEvent) => {
    try {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      onAddAgendaItem(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding agenda item:', error);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{mode === 'edit' ? 'Edit Agenda Item' : 'Add Agenda Item'}</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Schedule an event or session</p>
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
            {/* Session Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <span>Session Title</span>
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Opening Ceremony, Main Performance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Time and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>Start Time</span>
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <TimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="1"
                        placeholder="e.g., 45 minutes, 1 hour"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Duration Helper Text */}
            <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
              <p>Duration examples:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>30 minutes: Short presentation or break</li>
                <li>60 minutes: Standard session or workshop</li>
                <li>90-120 minutes: Main performances or keynotes</li>
              </ul>
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What will happen during this session? Who will be performing or speaking?"
                      rows={4}
                      maxLength={600}
                      {...field}
                    />
                  </FormControl>
                  <div className="text-xs text-muted-foreground text-right mt-1">
                    {(field.value || '').length}/600 characters
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                + {mode === 'edit' ? 'Update' : 'Add to Schedule'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}