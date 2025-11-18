'use client';

import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { ArtsGroup } from '@/types/arts-groups';
import {
  artsGroupBasicSchema,
  ArtsGroupBasicFormData,
  ART_TYPE_OPTIONS,
  MARKET_OPTIONS
} from '../../../lib/validations';

interface ArtsGroupBasicEditFormProps {
  artsGroup: ArtsGroup;
  onSubmit: (data: unknown) => Promise<void>;
  onNext?: () => void;
  loading?: boolean;
  onDataChange?: (data: unknown) => void;
  onFormChange?: () => void;
}

export interface ArtsGroupBasicEditFormRef {
  submitForm: () => void;
}

export const ArtsGroupBasicEditForm = forwardRef<
  ArtsGroupBasicEditFormRef,
  ArtsGroupBasicEditFormProps
>(({
  artsGroup,
  onSubmit,
  onNext,
  loading = false,
  onDataChange,
  onFormChange
}, ref) => {
  const form = useForm<ArtsGroupBasicFormData>({
    resolver: zodResolver(artsGroupBasicSchema),
    defaultValues: {
      name: artsGroup.name || '',
      address: artsGroup.address || '',
      market: artsGroup.market || 'miami',
      artType: artsGroup.artType || '',
      companyId: artsGroup.companyId || '',
      phone: artsGroup.phone || '',
      email: artsGroup.email || '',
      website: artsGroup.website || ''
    }
  });

  // Expose submitForm method via ref
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      form.handleSubmit(handleInternalSubmit)();
    }
  }));

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      onFormChange?.();
    });
    return () => subscription.unsubscribe();
  }, [form, onFormChange]);

  // Update parent with current form data
  useEffect(() => {
    const subscription = form.watch((data) => {
      onDataChange?.(data);
    });
    return () => subscription.unsubscribe();
  }, [form, onDataChange]);

  const handleInternalSubmit = async (data: ArtsGroupBasicFormData) => {
    try {
      // Pass data to wizard, which will handle the actual update
      await onSubmit(data);

      // Optionally move to next step if onNext is provided
      if (onNext) {
        onNext();
      }
    } catch (error) {
      console.error('Error in basic form:', error);
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleInternalSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Arts Group Information</span>
            </CardTitle>
            <CardDescription>Update basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arts Group Name *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="artType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Art Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ART_TYPE_OPTIONS.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="market"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MARKET_OPTIONS.map((market) => (
                          <SelectItem key={market.value} value={market.value}>
                            {market.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Location & Contact</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input type="url" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Navigation button */}
        {onNext && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onNext}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Continue to Step 2 →
            </button>
          </div>
        )}
      </form>
    </Form>
  );
});

ArtsGroupBasicEditForm.displayName = 'ArtsGroupBasicEditForm';
