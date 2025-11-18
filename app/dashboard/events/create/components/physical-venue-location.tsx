'use client';

import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { VenueCombobox } from './venue-combobox';
import { EventDetailsFormData } from '../../lib/validations';
import { useZipcodeMarket } from '@/hooks/use-zipcode-market';

interface PhysicalVenueLocationProps {
  form: UseFormReturn<EventDetailsFormData>;
}

export function PhysicalVenueLocation({ form }: PhysicalVenueLocationProps) {
  // Initialize showManualEntry based on existing data
  const [showManualEntry, setShowManualEntry] = useState(() => {
    // Determine if we should show manual entry based on saved data
    const venueName = form.getValues('venueName');
    const venueId = form.getValues('venueId');
    const address = form.getValues('address');

    // Logic: Show manual entry ONLY if there's manual data (venueName or address) and NO venueId
    // We ignore zipcode because both modes use it (venue for market, manual for location)
    const hasManualData = !!venueName || !!address;
    const hasVenueId = !!venueId;

    // Show manual form if: NO venueId AND HAS manual data
    // Show venue selector if: HAS venueId OR NO manual data
    return !hasVenueId && hasManualData;
  });

  // Watch the venueId to determine if manual entry should be shown
  const selectedVenueId = form.watch('venueId');

  // Initialize zipcode market hook for market auto-detection
  const { isLoading: isLoadingMarket, error: marketError, validateZipCode } = useZipcodeMarket({
    form,
    zipcodeField: 'zipcode',
    marketField: 'market',
    cityField: 'city',
    stateField: 'state'
  });

  // REMOVED: This useEffect was interfering with manual toggles
  // The initial state is set correctly in useState(() => {...})
  // We don't need to watch and auto-switch, let the user control the mode

  // Simple cleanup: ensure venueId is cleared when in manual mode
  useEffect(() => {
    if (showManualEntry) {
      const currentVenueId = form.getValues('venueId');
      // Only clear if there's actually a venueId to clear
      if (currentVenueId) {
        console.log('[CLEANUP] Clearing venueId in manual mode');
        // Use setTimeout to avoid race conditions with the toggle handler
        setTimeout(() => {
          form.setValue('venueId', '', { shouldValidate: true, shouldDirty: true });
        }, 0);
      }
    }
  }, [showManualEntry, form]);

  const handleVenueSelect = (venueId: string, venue?: { id: string; name: string; address?: string; city?: string; state?: string; zipcode?: string }) => {
    setShowManualEntry(false);

    // Set the selected venue ID
    form.setValue('venueId', venueId, { shouldValidate: true, shouldDirty: true });

    // CRITICAL: Clear ALL manual entry fields when selecting a venue
    // When using venue selection, we ONLY send venueId + zipcode + market to backend
    // NO visual fields (venueName, address, city, state) should be populated
    form.setValue('venueName', '', { shouldValidate: true, shouldDirty: true });
    form.setValue('address', '', { shouldValidate: true, shouldDirty: true });
    form.setValue('city', '', { shouldValidate: true, shouldDirty: true });
    form.setValue('state', '', { shouldValidate: true, shouldDirty: true });

    // Clear zipcode and market first, then set from venue if available
    form.setValue('zipcode', '', { shouldValidate: true, shouldDirty: true });
    form.setValue('market', '', { shouldValidate: true, shouldDirty: true });

    // If venue data is provided with zipcode, set it (hidden) and trigger market detection
    // Zipcode is ONLY used for market calculation, not displayed in form
    if (venue?.zipcode) {
      form.setValue('zipcode', venue.zipcode, { shouldValidate: true, shouldDirty: true });
      validateZipCode(venue.zipcode);
    }
  };

  const handleManualEntrySelect = () => {
    setShowManualEntry(true);

    // CRITICAL: Clear venue ID when switching to manual entry
    // This ensures the backend knows we're using manual venue data, not a venue selection
    form.setValue('venueId', '', { shouldValidate: true, shouldDirty: true });

    // Clear existing manual fields to start fresh
    form.setValue('venueName', '', { shouldValidate: true, shouldDirty: true });
    form.setValue('address', '', { shouldValidate: true, shouldDirty: true });
    form.setValue('city', '', { shouldValidate: true, shouldDirty: true });
    form.setValue('state', '', { shouldValidate: true, shouldDirty: true });
    form.setValue('zipcode', '', { shouldValidate: true, shouldDirty: true });
    form.setValue('market', '', { shouldValidate: true, shouldDirty: true });
  };

  const handleManualEntryToggle = () => {
    const newManualEntryState = !showManualEntry;

    if (newManualEntryState) {
      // Switching to manual entry - CLEAR venue selection completely
      console.log('[MANUAL TOGGLE] Switching to MANUAL mode');

      // Update state FIRST to show manual form
      setShowManualEntry(true);

      // CRITICAL: Clear venueId first, then ALL other fields
      // This prevents the auto-save from detecting venue mode
      form.setValue('venueId', '', { shouldValidate: false, shouldDirty: false });
      form.setValue('venueName', '', { shouldValidate: false, shouldDirty: false });
      form.setValue('address', '', { shouldValidate: false, shouldDirty: false });
      form.setValue('city', '', { shouldValidate: false, shouldDirty: false });
      form.setValue('state', '', { shouldValidate: false, shouldDirty: false });
      form.setValue('zipcode', '', { shouldValidate: false, shouldDirty: false });
      form.setValue('market', '', { shouldValidate: false, shouldDirty: false });

      // Force a form reset to ensure all values are truly cleared
      setTimeout(() => {
        const currentValues = form.getValues();
        form.reset({
          ...currentValues,
          venueId: '',
          venueName: '',
          address: '',
          city: '',
          state: '',
          zipcode: '',
          market: ''
        });
      }, 0);
    } else {
      // Switching back to venue selection - CLEAR all manual entry fields
      console.log('[MANUAL TOGGLE] Switching to VENUE mode');

      setShowManualEntry(false);

      form.setValue('venueName', '', { shouldValidate: false, shouldDirty: false });
      form.setValue('address', '', { shouldValidate: false, shouldDirty: false });
      form.setValue('city', '', { shouldValidate: false, shouldDirty: false });
      form.setValue('state', '', { shouldValidate: false, shouldDirty: false });
      form.setValue('zipcode', '', { shouldValidate: false, shouldDirty: false });
      form.setValue('market', '', { shouldValidate: false, shouldDirty: false });
    }
  };


  return (
    <div className="space-y-6">
      {!showManualEntry ? (
        <>
          {/* Venue Selection */}
          <FormField
            control={form.control}
            name="venueId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-1">
                  <span>Select Venue</span>
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <VenueCombobox
                    value={field.value || ''}
                    onSelect={handleVenueSelect}
                    onManualEntry={handleManualEntrySelect}
                    placeholder="Search for a venue..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Manual Entry Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleManualEntryToggle}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            Enter venue manually
          </Button>

          {/* Info about venue selection */}
          {selectedVenueId && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-800">Venue Selected</div>
                      <div className="text-sm text-green-600">
                        Venue details will be populated automatically for your event.
                      </div>
                    </div>
                  </div>
                  {form.watch('market') && (
                    <div className="flex items-center space-x-2 pt-2 border-t border-green-200">
                      <span className="text-sm text-green-700">Market:</span>
                      <Badge variant="secondary" className="text-sm">
                        {form.watch('market').toUpperCase()}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <>
          {/* Manual Entry Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Manual Venue Entry</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleManualEntryToggle}
              >
                Back to venue selection
              </Button>
            </div>

            {/* Venue Name */}
            <FormField
              control={form.control}
              name="venueName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue Name</FormLabel>
                  <FormControl>
                    <Input
                      key={`venueName-manual-${showManualEntry}`}
                      placeholder="Enter venue name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      key={`address-manual-${showManualEntry}`}
                      placeholder="Enter street address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City, State, Zip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        key={`city-manual-${showManualEntry}`}
                        placeholder="City"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input
                        key={`state-manual-${showManualEntry}`}
                        placeholder="State"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          key={`zipcode-manual-${showManualEntry}`}
                          placeholder="Zip"
                          {...field}
                          onBlur={(e) => {
                            field.onBlur();
                            if (e.target.value) {
                              validateZipCode(e.target.value);
                            }
                          }}
                        />
                      </FormControl>
                      {isLoadingMarket && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    {marketError && (
                      <p className="text-sm font-medium text-destructive mt-1.5">
                        {marketError}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Auto-detected Market Display */}
            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market (Auto-detected)</FormLabel>
                  <div className="flex items-center gap-2 h-10">
                    {field.value ? (
                      <Badge variant="secondary" className="text-sm font-normal">
                        {field.value.toUpperCase()}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Enter ZIP code to auto-detect market
                      </span>
                    )}
                  </div>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Manual Entry Preview */}
          {(form.watch('venueName') || form.watch('address')) && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    {form.watch('venueName') && (
                      <div className="font-medium text-blue-800">{form.watch('venueName')}</div>
                    )}
                    {form.watch('address') && (
                      <div className="text-sm text-blue-600">
                        {form.watch('address')}
                        {form.watch('city') && `, ${form.watch('city')}`}
                        {form.watch('state') && `, ${form.watch('state')}`}
                        {form.watch('zipcode') && ` ${form.watch('zipcode')}`}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

    </div>
  );
}