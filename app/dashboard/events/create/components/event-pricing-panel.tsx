'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { EventMediaFormData } from '../../lib/validations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface EventPricingPanelProps {
  form: UseFormReturn<EventMediaFormData>;
  disabled?: boolean;
}

export function EventPricingPanel({ form, disabled = false }: EventPricingPanelProps) {
  const watchedValues = form.watch();
  const isFreeAdmission = watchedValues.free || false;
  const pricingType = watchedValues.pricingType || 'single';
  
  // Calculate pricing summary
  const getPricingSummary = () => {
    if (isFreeAdmission) {
      return {
        price: 'Free',
        structure: 'Free admission'
      };
    }
    
    if (pricingType === 'single' && watchedValues.singlePrice) {
      return {
        price: `$${watchedValues.singlePrice}`,
        structure: 'Single price'
      };
    }
    
    if (pricingType === 'range' && (watchedValues.minPrice || watchedValues.maxPrice)) {
      const min = watchedValues.minPrice ? `$${watchedValues.minPrice}` : '$0';
      const max = watchedValues.maxPrice ? `$${watchedValues.maxPrice}` : '$0';
      return {
        price: `${min} - ${max}`,
        structure: 'Price range'
      };
    }
    
    return {
      price: 'Not set',
      structure: 'Not selected'
    };
  };

  const pricingSummary = getPricingSummary();

  const handleFreeAdmissionChange = (checked: boolean) => {
    form.setValue('free', checked);
    if (checked) {
      // Clear pricing fields when free is selected
      form.setValue('singlePrice', '');
      form.setValue('minPrice', '');
      form.setValue('maxPrice', '');
      form.setValue('pricingType', 'free');
    } else {
      // Reset to single price when unchecking free
      form.setValue('pricingType', 'single');
    }
  };

  const handlePricingTypeChange = (type: 'single' | 'range') => {
    form.setValue('pricingType', type);
    // Clear opposite pricing fields
    if (type === 'single') {
      form.setValue('minPrice', '');
      form.setValue('maxPrice', '');
    } else {
      form.setValue('singlePrice', '');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Pricing & Ticketing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Free Admission Checkbox */}
        <FormField
          control={form.control}
          name="free"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={handleFreeAdmissionChange}
                  disabled={disabled}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base font-medium">
                  Free Admission
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {/* Pricing Structure - Only show if not free */}
        {!isFreeAdmission && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-3">Pricing Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={pricingType === 'single' ? 'default' : 'outline'}
                  className={`h-auto p-4 justify-center ${
                    pricingType === 'single' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePricingTypeChange('single')}
                  disabled={disabled}
                >
                  Single Price
                </Button>
                <Button
                  type="button"
                  variant={pricingType === 'range' ? 'default' : 'outline'}
                  className={`h-auto p-4 justify-center ${
                    pricingType === 'range'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePricingTypeChange('range')}
                  disabled={disabled}
                >
                  Price Range
                </Button>
              </div>
            </div>

            {/* Single Price Fields */}
            {pricingType === 'single' && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="singlePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Price:</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="25"
                            className="pl-8"
                            disabled={disabled}
                          />
                        </div>
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        Set a fixed price for all tickets to your event.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Price Range Fields */}
            {pricingType === 'range' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Price:</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              $
                            </span>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="25"
                              className="pl-8"
                              disabled={disabled}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Price:</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              $
                            </span>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="50"
                              className="pl-8"
                              disabled={disabled}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Set a price range for different ticket types.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Ticket Link */}
        <FormField
          control={form.control}
          name="ticketUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket Link</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://eventbrite.com/... or https://ticketmaster.com/..."
                  disabled={disabled}
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                Add a link where attendees can purchase tickets for your event.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pricing Summary */}
        <Card className="bg-gray-50">
          <CardContent className="pt-4">
            <h4 className="font-semibold text-base mb-3">Pricing Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Price:</span>
                <span className="text-gray-900">{pricingSummary.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Structure:</span>
                <span className="text-gray-900">{pricingSummary.structure}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}