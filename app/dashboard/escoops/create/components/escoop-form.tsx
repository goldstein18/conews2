"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';

import { LOCATION_OPTIONS } from '@/types/escoops';
import {
  createEscoopSchema,
  defaultEscoopValues,
  getMarketFromLocations,
  type CreateEscoopFormData
} from '../../lib/validations';
import { useCreateEscoop } from '../../hooks/use-escoop-actions';

interface EscoopFormProps {
  onCancel?: () => void;
  className?: string;
}

export function EscoopForm({ onCancel, className }: EscoopFormProps) {
  const router = useRouter();
  const { createEscoop, loading } = useCreateEscoop();

  const form = useForm<CreateEscoopFormData>({
    resolver: zodResolver(createEscoopSchema),
    defaultValues: defaultEscoopValues,
    mode: 'onBlur'
  });

  const handleSubmit = async (data: CreateEscoopFormData) => {
    try {
      const market = getMarketFromLocations(data.locations);

      const result = await createEscoop({
        name: data.name,
        title: data.title,
        sendDate: data.sendDate.toISOString(),
        locations: data.locations,
        remaining: data.remaining,
        bannersRemaining: data.bannersRemaining,
        market
      });

      if (result) {
        toast.success('Escoop created successfully!');
        router.push('/dashboard/escoops');
      }
    } catch (error) {
      console.error('Error creating escoop:', error);
      toast.error('Failed to create escoop');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const selectedLocations = form.watch('locations');
  const selectedMarket = selectedLocations.length > 0
    ? getMarketFromLocations(selectedLocations)
    : '';

  return (
    <div className={cn("p-6 space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Create New Escoop</h1>
          <p className="text-sm text-muted-foreground">
            Create a new escoop for admin management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Escoop'
            )}
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Escoop Details</CardTitle>
          <CardDescription>
            Fill in the details for your new escoop campaign
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
                                field.onChange([...field.value, location.value]);
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

              {/* Send Date */}
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
                            date < new Date() || date < new Date("1900-01-01")
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
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Escoop'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}