"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { LOCATION_OPTIONS } from '@/types/escoops';
import {
  updateEscoopSchema,
  getMarketFromLocations,
  type UpdateEscoopFormData
} from '../../../lib/validations';
import { useEscoop, useUpdateEscoop } from '../../../hooks';
import { EscoopFormSkeleton } from '../../../components/escoop-skeleton';

interface EscoopEditFormProps {
  escoopId: string;
  onCancel?: () => void;
  className?: string;
}

// Status options for editing
const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'SENT', label: 'Sent' }
];

export function EscoopEditForm({ escoopId, onCancel, className }: EscoopEditFormProps) {
  const router = useRouter();
  const { escoop, loading: loadingEscoop, error } = useEscoop({ id: escoopId });
  const { updateEscoop, loading: updating } = useUpdateEscoop();

  const form = useForm<UpdateEscoopFormData>({
    resolver: zodResolver(updateEscoopSchema),
    mode: 'onBlur'
  });

  // Populate form when escoop data is loaded
  useEffect(() => {
    if (escoop) {
      form.reset({
        id: escoop.id,
        name: escoop.name,
        title: escoop.title,
        sendDate: new Date(escoop.sendDate),
        locations: escoop.locations,
        remaining: escoop.remaining,
        bannersRemaining: escoop.bannersRemaining,
        status: escoop.status
      });
    }
  }, [escoop, form]);

  const handleSubmit = async (data: UpdateEscoopFormData) => {
    try {
      const market = getMarketFromLocations(data.locations || []);

      const updateData: {
        id: string;
        name?: string;
        title?: string;
        sendDate?: string;
        locations?: string[];
        market?: string;
        remaining?: number;
        bannersRemaining?: number;
        status?: string;
      } = {
        id: data.id,
      };

      // Only include fields that have changed
      if (data.name !== escoop?.name) updateData.name = data.name;
      if (data.title !== escoop?.title) updateData.title = data.title;
      if (data.sendDate) updateData.sendDate = data.sendDate.toISOString();
      if (data.locations) {
        updateData.locations = data.locations;
        updateData.market = market;
      }
      if (data.remaining !== escoop?.remaining) updateData.remaining = data.remaining;
      if (data.bannersRemaining !== escoop?.bannersRemaining) updateData.bannersRemaining = data.bannersRemaining;
      if (data.status !== escoop?.status) updateData.status = data.status;

      const result = await updateEscoop(updateData);

      if (result) {
        toast.success('Escoop updated successfully!');
        router.push('/dashboard/escoops');
      }
    } catch (error) {
      console.error('Error updating escoop:', error);
      toast.error('Failed to update escoop');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const handleBackToList = () => {
    router.push('/dashboard/escoops');
  };

  // Loading state
  if (loadingEscoop) {
    return <EscoopFormSkeleton />;
  }

  // Error state
  if (error || !escoop) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Escoop Not Found</h1>
            <p className="text-sm text-muted-foreground">
              The escoop you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to edit it.
            </p>
          </div>
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  const selectedLocations = form.watch('locations');
  const selectedMarket = selectedLocations && selectedLocations.length > 0
    ? getMarketFromLocations(selectedLocations)
    : '';

  return (
    <div className={cn("p-6 space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToList}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Edit Escoop</h1>
              <p className="text-sm text-muted-foreground">
                Update escoop details and settings
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={updating}>
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={updating}
          >
            {updating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Escoop'
            )}
          </Button>
        </div>
      </div>

      {/* Escoop Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Escoop Information
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                ID: {escoop.id.slice(0, 8)}...
              </Badge>
              <Badge
                variant={escoop.status === 'SENT' ? 'default' : 'secondary'}
                className={
                  escoop.status === 'SENT'
                    ? 'bg-green-100 text-green-800'
                    : escoop.status === 'SCHEDULED'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }
              >
                {escoop.status}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription>
            Created by {escoop.owner.firstName} {escoop.owner.lastName} on{' '}
            {format(parseISO(escoop.createdAt), 'MMM dd, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Escoop Name and Title */}
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escoop Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Weekly Newsletter"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This usually contains the send date or campaign identifier
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Guide to Upcoming Culture"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The title that will be displayed in the escoop
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status and Send Date */}
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Change the escoop status
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sendDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Send Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        The date when this escoop should be sent
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Locations */}
              <FormField
                control={form.control}
                name="locations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locations *</FormLabel>
                    <FormDescription className="mb-3">
                      Select the locations where this escoop will be distributed
                    </FormDescription>
                    <div className="grid gap-3 md:grid-cols-3">
                      {LOCATION_OPTIONS.map((location) => (
                        <div key={location.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={location.value}
                            checked={field.value?.includes(location.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...(field.value || []), location.value]);
                              } else {
                                field.onChange(
                                  field.value?.filter((value: string) => value !== location.value)
                                );
                              }
                            }}
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
                    {selectedMarket && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Market: <span className="font-medium capitalize">{selectedMarket}</span>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remaining counts */}
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="remaining"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remaining Entries</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="1000"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of entries remaining for this escoop
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bannersRemaining"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Remaining</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Number of banner slots remaining
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Form Actions - Hidden since we have header actions */}
              <div className="hidden">
                <Button type="submit" disabled={updating}>
                  {updating ? 'Updating...' : 'Update Escoop'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}