"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Calendar, Mail, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";

import { useCreateEscoopEntry, useSearchEscoops, useSearchEvents } from "../../hooks";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_MY_COMPANY_PROFILE = gql`
  query GetMyCompanyProfile {
    myCompanyProfile {
      id
      name
    }
  }
`;
import {
  createEscoopEntrySchema,
  defaultEscoopEntryValues,
  LOCATION_OPTIONS,
  type EscoopEntryFormData
} from "../../lib/validations";
import type { EscoopSearchResult, EventSearchResult } from "@/types/escoop-entries";
import { CompanySelectorField } from "./company-selector-field";

interface EscoopEntryFormContentProps {
  onSubmit: () => void;
  onCancel: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;
  onEscoopSelect?: (escoop: EscoopSearchResult) => void;
  onEventSelect?: (event: EventSearchResult) => void;
  onCompanySelect?: (companyName: string) => void;
}

export function EscoopEntryFormContent({
  onSubmit,
  onCancel,
  loading: creating,
  onLoadingStart,
  onEscoopSelect,
  onEventSelect,
  onCompanySelect
}: EscoopEntryFormContentProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [escoopSearch, setEscoopSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  const [escoopOpen, setEscoopOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [selectedEscoop, setSelectedEscoop] = useState<EscoopSearchResult | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventSearchResult | null>(null);

  // Debounced search values
  const [debouncedEscoopSearch] = useDebounce(escoopSearch, 300);
  const [debouncedEventSearch] = useDebounce(eventSearch, 300);

  // Check if user can select company (admin/super admin)
  const canSelectCompany = user?.role?.name === 'SUPER_ADMIN' || user?.role?.name === 'ADMIN';

  // Get user's company if not admin
  const { data: companyData } = useQuery(GET_MY_COMPANY_PROFILE, {
    skip: canSelectCompany // Skip query if user can select company
  });

  const userCompanyId = companyData?.myCompanyProfile?.id;

  // Form setup
  const form = useForm<EscoopEntryFormData>({
    resolver: zodResolver(createEscoopEntrySchema(canSelectCompany)),
    defaultValues: defaultEscoopEntryValues,
  });

  // Watch company selection for event filtering
  const selectedCompanyId = form.watch("companyId");

  // Update companyId when userCompanyId becomes available for regular users
  useEffect(() => {
    if (!canSelectCompany && userCompanyId && !form.getValues('companyId')) {
      form.setValue('companyId', userCompanyId);
    }
  }, [userCompanyId, canSelectCompany, form]);

  // Hooks
  const { createEscoopEntry } = useCreateEscoopEntry();
  const { escoops, loading: escoopsLoading } = useSearchEscoops({
    search: debouncedEscoopSearch,
  });
  const { events, loading: eventsLoading } = useSearchEvents({
    search: debouncedEventSearch,
    companyId: selectedCompanyId || userCompanyId || undefined,
  });

  // Update company name in parent when company changes
  useEffect(() => {
    if (selectedCompanyId && onCompanySelect) {
      // Get company name from companies query if available
      // For now, we'll use a placeholder since we don't have the company name readily available
      onCompanySelect(`Company: ${selectedCompanyId.slice(-8)}`);
    }
  }, [selectedCompanyId, onCompanySelect]);

  // Handle form submission
  const handleSubmit = async (data: EscoopEntryFormData) => {
    if (onLoadingStart) onLoadingStart();

    await createEscoopEntry({
      escoopId: data.escoopId,
      eventId: data.eventId,
      locations: data.locations,
    });

    onSubmit();
  };

  // Handle escoop selection
  const handleEscoopSelect = (escoop: EscoopSearchResult) => {
    setSelectedEscoop(escoop);
    form.setValue("escoopId", escoop.id);
    setEscoopOpen(false);
    setEscoopSearch("");
    if (onEscoopSelect) onEscoopSelect(escoop);
  };

  // Handle event selection
  const handleEventSelect = (event: EventSearchResult) => {
    setSelectedEvent(event);
    form.setValue("eventId", event.id);
    setEventOpen(false);
    setEventSearch("");
    if (onEventSelect) onEventSelect(event);
  };

  // Handle location selection
  const handleLocationChange = (location: string, checked: boolean) => {
    const currentLocations = form.getValues("locations") || [];
    if (checked) {
      form.setValue("locations", [...currentLocations, location]);
    } else {
      form.setValue("locations", currentLocations.filter(l => l !== location));
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Create Escoop Entry</h1>
        <p className="text-muted-foreground">
          Submit your event for inclusion in the next escoop newsletter
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
                    <span className="text-muted-foreground">Select an event</span>
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
                      {events.map((event: EventSearchResult) => (
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

            {/* Create Event Option */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-3">
                If your event isn&apos;t listed, please add it first. If you need it approved immediately{" "}
                <a href="#" className="text-blue-600 underline">Contact Us</a>
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/events/create")}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Event</span>
              </Button>
            </div>
          </div>

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
                    checked={form.watch("locations")?.includes(location.value) || false}
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

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating escoop Entry...
                </>
              ) : (
                "Create escoop Entry"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}