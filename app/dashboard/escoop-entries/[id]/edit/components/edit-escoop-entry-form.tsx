'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useAuthStore } from '@/store/auth-store';
import { useUpdateEscoopEntry } from '../../../hooks';
import {
  updateEscoopEntrySchema,
  LOCATION_OPTIONS,
  type UpdateEscoopEntryFormData
} from '../../../lib/validations';
import type { EscoopEntry } from '@/types/escoop-entries';

interface EditEscoopEntryFormProps {
  escoopEntry: EscoopEntry;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EditEscoopEntryForm({
  escoopEntry,
  onCancel,
  onSuccess
}: EditEscoopEntryFormProps) {
  const { user } = useAuthStore();
  const { updateEscoopEntry, loading } = useUpdateEscoopEntry();
  const [showApprovalReason, setShowApprovalReason] = useState(false);

  // Check if user can edit status (admin/super admin)
  const canEditStatus = user?.role?.name === 'SUPER_ADMIN' || user?.role?.name === 'ADMIN';

  // Form setup
  const form = useForm<UpdateEscoopEntryFormData>({
    resolver: zodResolver(updateEscoopEntrySchema),
    defaultValues: {
      id: escoopEntry.id,
      status: escoopEntry.status,
      locations: escoopEntry.locations || [],
      approvalReason: escoopEntry.approvalReason || '',
    },
  });

  // Watch status changes to show/hide approval reason
  const watchedStatus = form.watch('status');

  useEffect(() => {
    const shouldShowApprovalReason = watchedStatus === 'APPROVED' || watchedStatus === 'DECLINED' || watchedStatus === 'DELETED' || watchedStatus === 'EXPIRED';
    setShowApprovalReason(shouldShowApprovalReason);

    // Clear approval reason if not needed
    if (!shouldShowApprovalReason) {
      form.setValue('approvalReason', '');
    }
  }, [watchedStatus, form]);

  // Handle form submission
  const handleSubmit = async (data: UpdateEscoopEntryFormData) => {
    try {
      await updateEscoopEntry({
        id: data.id,
        status: data.status,
        locations: data.locations,
        ...(data.approvalReason && { approvalReason: data.approvalReason })
      });
      onSuccess();
    } catch (error) {
      // Error is handled by the hook
      console.error('Update error:', error);
    }
  };

  // Handle location selection
  const handleLocationChange = (location: string, checked: boolean) => {
    const currentLocations = form.getValues('locations') || [];
    if (checked) {
      form.setValue('locations', [...currentLocations, location]);
    } else {
      form.setValue('locations', currentLocations.filter(l => l !== location));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Escoop Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Entry Information (Read Only) */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium">Entry Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Escoop</Label>
                  <p className="font-medium">{escoopEntry.escoop.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {escoopEntry.escoop.status} • {escoopEntry.escoop.remaining} remaining
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Event</Label>
                  <p className="font-medium">{escoopEntry.event.title}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <p className="text-sm">
                    {new Date(escoopEntry.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="text-sm">
                    {new Date(escoopEntry.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Selection - Only for Admins */}
            {canEditStatus && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="DECLINED">Declined</SelectItem>
                        <SelectItem value="DELETED">Deleted</SelectItem>
                        <SelectItem value="EXPIRED">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Locations */}
            <div className="space-y-3">
              <Label className="flex items-center space-x-1">
                <span>Target Locations</span>
                <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {LOCATION_OPTIONS.map((location) => (
                  <div key={location.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={location.value}
                      checked={form.watch('locations')?.includes(location.value) || false}
                      onCheckedChange={(checked) =>
                        handleLocationChange(location.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={location.value}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {location.label}
                    </Label>
                  </div>
                ))}
              </div>
              {form.formState.errors.locations && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.locations.message}
                </p>
              )}
            </div>

            {/* Status Reason - Only shown when status requires explanation */}
            {showApprovalReason && (
              <FormField
                control={form.control}
                name="approvalReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status Reason
                      {(watchedStatus === 'APPROVED' || watchedStatus === 'DECLINED' || watchedStatus === 'DELETED' || watchedStatus === 'EXPIRED') && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          watchedStatus === 'APPROVED'
                            ? 'Explain why this entry was approved...'
                            : watchedStatus === 'DECLINED'
                            ? 'Explain why this entry was declined...'
                            : watchedStatus === 'DELETED'
                            ? 'Explain why this entry was deleted...'
                            : watchedStatus === 'EXPIRED'
                            ? 'Explain why this entry was marked as expired...'
                            : 'Explain the reason for this status change...'
                        }
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Entry'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}