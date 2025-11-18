'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Check, ChevronsUpDown, MapPin, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
import { SEARCH_VENUES, GET_VENUE } from '@/lib/graphql/venues';

interface Venue {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  status: string;
  priority?: string;
  hostsPrivateEvents?: boolean;
  company?: {
    id: string;
    name: string;
  };
}

interface VenueComboboxProps {
  value?: string;
  onSelect: (venueId: string, venue?: Venue) => void;
  onManualEntry: () => void;
  placeholder?: string;
  className?: string;
}

export function VenueCombobox({
  value,
  onSelect,
  onManualEntry,
  placeholder = "Search venues...",
  className
}: VenueComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const { data, loading, error } = useQuery(SEARCH_VENUES, {
    variables: {
      filter: {
        ...(debouncedSearch && { search: debouncedSearch }),
        status: 'APPROVED',
        limit: 20,
        page: 1
      }
    },
    skip: !open && !debouncedSearch, // Only fetch when open or searching
    fetchPolicy: 'cache-and-network'
  });

  // Fetch selected venue details if we have a value
  const { data: selectedVenueData } = useQuery(GET_VENUE, {
    variables: { identifier: value },
    skip: !value,
    fetchPolicy: 'no-cache' // Redis cache on API handles this
  });

  const venues = data?.venues?.venues || [];
  const selectedVenue = selectedVenueData?.venue || venues.find((venue: Venue) => venue.id === value);

  const handleSelect = (venueId: string, venue?: Venue) => {
    if (venueId === 'manual') {
      onManualEntry();
    } else {
      onSelect(venueId, venue);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-auto min-h-[44px] py-3", className)}
        >
          <div className="flex items-center space-x-2 flex-1 text-left">
            {selectedVenue ? (
              <>
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-medium">{selectedVenue.name}</span>
                  {selectedVenue.address && selectedVenue.city && (
                    <span className="text-xs text-muted-foreground">
                      {selectedVenue.address}, {selectedVenue.city}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{placeholder}</span>
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search venues..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="border-none focus:ring-0"
          />
          <CommandList>
            <CommandEmpty>
              {loading ? (
                <div className="py-6 text-center text-sm">
                  <div className="animate-pulse">Searching venues...</div>
                </div>
              ) : error ? (
                <div className="py-6 text-center text-sm text-red-600">
                  Error loading venues: {error.message}
                </div>
              ) : (
                <div className="py-6 text-center text-sm">
                  {searchValue ? "No venues found." : "Start typing to search venues..."}
                </div>
              )}
            </CommandEmpty>
            {venues.length > 0 && (
              <CommandGroup>
                {venues.map((venue: Venue) => (
                  <CommandItem
                    key={venue.id}
                    value={venue.id}
                    onSelect={() => handleSelect(venue.id, venue)}
                    className="flex items-start space-x-2 py-3"
                  >
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4",
                        value === venue.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col items-start flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{venue.name}</span>
                        {venue.priority === 'HIGH' && (
                          <span className="px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                            Premium
                          </span>
                        )}
                      </div>
                      {venue.address && venue.city && (
                        <span className="text-xs text-muted-foreground">
                          {venue.address}, {venue.city}
                          {venue.state && `, ${venue.state}`}
                        </span>
                      )}
                      {venue.company && (
                        <span className="text-xs text-blue-600">
                          by {venue.company.name}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            <CommandGroup>
              <CommandItem
                value="manual"
                onSelect={() => handleSelect('manual')}
                className="border-t border-gray-200"
              >
                <Check className="mr-2 h-4 w-4 opacity-0" />
                <div className="flex items-center space-x-2 text-blue-600">
                  <span>Enter venue manually</span>
                </div>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}