'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Calendar, Mail } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { Button } from '@/components/ui/button';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';

import { useAuthStore } from '@/store/auth-store';
import { useUpdateEscoopEntry, useSearchEscoops, useSearchEvents } from '../../../hooks';
import { CompanySelectorField } from '../../../create/components/company-selector-field';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  updateEscoopEntryWithSelectorsSchema,
  LOCATION_OPTIONS,
  type UpdateEscoopEntryWithSelectorsFormData
} from '../../../lib/validations';
import type { EscoopEntry, EscoopSearchResult, EventFullData } from '@/types/escoop-entries';

const GET_MY_COMPANY_PROFILE = gql`
  query GetMyCompanyProfile {
    myCompanyProfile {
      id
      name
    }
  }
`;

interface EditEscoopEntryFormContentProps {
  escoopEntry: EscoopEntry;
  onSubmit: () => void;
  onCancel: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
  onEscoopSelect?: (escoop: EscoopSearchResult) => void;
  onEventSelect?: (event: EventFullData) => void;
  onCompanySelect?: (companyName: string) => void;
}

export function EditEscoopEntryFormContent({
  escoopEntry,
  onSubmit,
  onCancel,
  loading: updating,
  onLoadingStart,
  onEscoopSelect,
  onEventSelect,
  onCompanySelect
}: EditEscoopEntryFormContentProps) {
  const { user } = useAuthStore();
  const { updateEscoopEntry, loading: mutationLoading } = useUpdateEscoopEntry();
  const [escoopSearch, setEscoopSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [escoopOpen, setEscoopOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [selectedEscoop, setSelectedEscoop] = useState<EscoopSearchResult | null>({
    id: escoopEntry.escoop.id,
    name: escoopEntry.escoop.name,
    status: escoopEntry.escoop.status,
    remaining: escoopEntry.escoop.remaining,
    market: '',
  });
  const [selectedEvent, setSelectedEvent] = useState<EventFullData | null>({
    id: escoopEntry.event.id,
    title: escoopEntry.event.title,
    slug: escoopEntry.event.slug,
    companyId: escoopEntry.event.companyId,
    startDate: escoopEntry.event.startDate || '',
    status: escoopEntry.event.status,
    image: escoopEntry.event.image,
    mainImageUrl: escoopEntry.event.mainImageUrl,
  });
  const [showApprovalReason, setShowApprovalReason] = useState(false);

  // Debounced search values
  const [debouncedEscoopSearch] = useDebounce(escoopSearch, 300);
  const [debouncedEventSearch] = useDebounce(eventSearch, 300);

  // Check if user can select company (admin/super admin)
  const canSelectCompany = user?.role?.name === 'SUPER_ADMIN' || user?.role?.name === 'ADMIN';
  const canEditStatus = user?.role?.name === 'SUPER_ADMIN' || user?.role?.name === 'ADMIN';

  // Get user's company if not admin
  const { data: companyData } = useQuery(GET_MY_COMPANY_PROFILE, {
    skip: canSelectCompany
  });

  const userCompanyId = companyData?.myCompanyProfile?.id;

  // Form setup
  const form = useForm<UpdateEscoopEntryWithSelectorsFormData>({
    resolver: zodResolver(updateEscoopEntryWithSelectorsSchema(canSelectCompany)),
    defaultValues: {
      id: escoopEntry.id,
      escoopId: escoopEntry.escoopId,
      eventId: escoopEntry.eventId,
      status: escoopEntry.status,
      locations: escoopEntry.locations || [],
      approvalReason: escoopEntry.approvalReason || '',
      companyId: canSelectCompany ? escoopEntry.event.companyId : (userCompanyId || escoopEntry.event.companyId)
    },
  });

  // Watch form values
  const selectedCompanyId = form.watch('companyId');
  const watchedStatus = form.watch('status');

  // Hooks for search
  const { escoops, loading: escoopsLoading } = useSearchEscoops({
    search: debouncedEscoopSearch,
  });
  const { events, loading: eventsLoading } = useSearchEvents({
    search: debouncedEventSearch,
    companyId: selectedCompanyId,
  });

  // Update company name in parent when company changes
  useEffect(() => {
    if (selectedCompanyId && onCompanySelect) {
      onCompanySelect(`Company: ${selectedCompanyId.slice(-8)}`);
    }
  }, [selectedCompanyId, onCompanySelect]);

  // Watch status changes to show/hide approval reason
  useEffect(() => {
    const shouldShowApprovalReason = watchedStatus === 'APPROVED' || watchedStatus === 'DECLINED' || watchedStatus === 'DELETED' || watchedStatus === 'EXPIRED';
    setShowApprovalReason(shouldShowApprovalReason);

    if (!shouldShowApprovalReason) {
      form.setValue('approvalReason', '');
    }
  }, [watchedStatus, form]);

  // Handle form submission
  const handleSubmit = async (data: UpdateEscoopEntryWithSelectorsFormData) => {
    if (onLoadingStart) onLoadingStart();

    try {
      await updateEscoopEntry({
        id: data.id,
        ...(data.escoopId !== escoopEntry.escoopId && { escoopId: data.escoopId }),
        ...(data.eventId !== escoopEntry.eventId && { eventId: data.eventId }),
        status: data.status,
        locations: data.locations,
        ...(data.approvalReason && { approvalReason: data.approvalReason })
      });
      onSubmit();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  // Handle escoop selection
  const handleEscoopSelect = (escoop: EscoopSearchResult) => {
    setSelectedEscoop(escoop);
    form.setValue('escoopId', escoop.id);
    setEscoopOpen(false);
    setEscoopSearch('');
    if (onEscoopSelect) onEscoopSelect(escoop);
  };

  // Handle event selection
  const handleEventSelect = (event: EventFullData) => {
    setSelectedEvent(event);
    form.setValue('eventId', event.id);
    setEventOpen(false);
    setEventSearch('');
    if (onEventSelect) onEventSelect(event);
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

  const isLoading = updating || mutationLoading;

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Edit Escoop Entry</h1>
        <p className="text-muted-foreground">
          Update your event submission for escoop newsletter
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Company Selector - Only for admins */}
          {canSelectCompany && (
            <CompanySelectorField control={form.control} />
          )}

          {/* Select Escoop */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-1">
              <span>Select Escoop</span>
              <span className="text-red-500">*</span>
            </Label>
            <Popover open={escoopOpen} onOpenChange={setEscoopOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={escoopOpen}
                  className="w-full justify-between"
                >
                  {selectedEscoop ? (
                    <span className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{selectedEscoop.name}</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        {selectedEscoop.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {selectedEscoop.remaining} remaining
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Select an escoop</span>
                  )}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search escoops..."
                    value={escoopSearch}
                    onValueChange={setEscoopSearch}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {escoopsLoading ? (
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ) : (
                        "No escoops found."
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {escoops.map((escoop: EscoopSearchResult) => (
                        <CommandItem
                          key={escoop.id}
                          onSelect={() => handleEscoopSelect(escoop)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{escoop.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {escoop.market} • {escoop.remaining} slots remaining
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            escoop.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                            escoop.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {escoop.status}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {form.formState.errors.escoopId && (
              <p className="text-sm text-red-600">
                {form.formState.errors.escoopId.message}
              </p>
            )}
          </div>

          {/* Select Event */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-1">
              <span>Select Event</span>
              <span className="text-red-500">*</span>
            </Label>
            <Popover open={eventOpen} onOpenChange={setEventOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={eventOpen}
                  className="w-full justify-between"
                  disabled={!selectedCompanyId}
                >
                  {selectedEvent ? (
                    <span className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{selectedEvent.title}</span>
                      {selectedEvent.startDate && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(selectedEvent.startDate).toLocaleDateString()}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      {!selectedCompanyId ? 'Select a company first' : 'Select an event'}
                    </span>
                  )}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search events..."
                    value={eventSearch}
                    onValueChange={setEventSearch}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {eventsLoading ? (
                        <div className="p-4 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ) : (
                        "No events found."
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {events.map((event: EventFullData) => (
                        <CommandItem
                          key={event.id}
                          onSelect={() => handleEventSelect(event)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{event.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {event.status}
                              {event.startDate && ` • ${new Date(event.startDate).toLocaleDateString()}`}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {form.formState.errors.eventId && (
              <p className="text-sm text-red-600">
                {form.formState.errors.eventId.message}
              </p>
            )}
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

          {/* Select Locations */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-1">
              <span>Select Locations</span>
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

          {/* Approval Reason - Only shown when status is APPROVED or REJECTED */}
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
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Updating Entry...
                </>
              ) : (
                'Update Entry'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}