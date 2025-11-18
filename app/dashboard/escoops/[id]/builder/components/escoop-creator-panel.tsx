'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useEscoopBuilderStore } from '@/store/escoop-builder-store';
import { useEscoopBuilder, useRestaurantSearch, useEventSearch, useEscoopBanners } from '../hooks';
import AnimatedEventsList from './animated-events-list';
import AnimatedBannersList from './animated-banners-list';
import type { SearchRestaurant } from '@/lib/graphql/restaurants';
import type { SearchEvent } from '@/lib/graphql/events';

interface EscoopCreatorPanelProps {
  escoopId: string;
}

export function EscoopCreatorPanel({ escoopId }: EscoopCreatorPanelProps) {
  console.log('EscoopCreatorPanel render with escoopId:', escoopId);

  const {
    settings,
    selectedRestaurants,
    selectedFeaturedEvents,
    updateSelectedTemplate,
    addRestaurant,
    removeRestaurant,
    toggleRestaurantSelection,
    toggleRestaurantPickOfTheMonth,
    addFeaturedEvent,
    removeFeaturedEvent,
    toggleFeaturedEventSelection,
    toggleEventFeatured
  } = useEscoopBuilderStore();

  const {
    entries,
    entriesLoading,
    entriesError
  } = useEscoopBuilder({ escoopId });

  // Restaurant search functionality
  const {
    restaurants: searchResults,
    loading: restaurantsLoading,
    error: restaurantsError,
    searchTerm: restaurantSearchTerm,
    setSearchTerm: setRestaurantSearchTerm,
    loadInitialRestaurants
  } = useRestaurantSearch({
    market: 'miami', // You can make this dynamic based on escoop market
    limit: 10
  });

  // Event search functionality
  const {
    events: eventSearchResults,
    loading: eventsLoading,
    error: eventsError,
    searchTerm: eventSearchTerm,
    setSearchTerm: setEventSearchTerm,
    loadInitialEvents
  } = useEventSearch({
    enabled: true
  });

  // Banners functionality
  const {
    banners,
    loading: bannersLoading,
    error: bannersError
  } = useEscoopBanners({
    escoopId,
    take: 20,
    enabled: true
  });

  console.log('EscoopCreatorPanel hook result:', {
    entriesCount: entries.length,
    entriesLoading,
    hasError: !!entriesError
  });


  const handleAddRestaurant = (restaurant: SearchRestaurant) => {
    const builderRestaurant = {
      id: restaurant.id,
      name: restaurant.name,
      imageUrl: restaurant.imageUrl,
      description: restaurant.description,
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      slug: restaurant.slug,
      location: `${restaurant.city}${restaurant.state ? ', ' + restaurant.state : ''}`,
      isSelected: true,
      isPickOfTheMonth: false
    };
    addRestaurant(builderRestaurant);
  };

  const handleAddEvent = (event: SearchEvent) => {
    const builderEvent = {
      id: event.id,
      title: event.title,
      startDate: event.startDate,
      status: event.status,
      companyId: event.companyId,
      mainImageUrl: event.mainImageUrl,
      isSelected: true,
      isFeatured: false
    };
    addFeaturedEvent(builderEvent);
  };

  return (
    <div className="space-y-5">
        {/* Template Selection - Full Width */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Template Selection</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div>
              <Label htmlFor="template" className="text-sm">Choose Template</Label>
              <Select
                value={settings.selectedTemplate}
                onValueChange={updateSelectedTemplate}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic-newsletter">Classic Newsletter</SelectItem>
                  <SelectItem value="modern-layout" disabled>Modern Layout (Coming Soon)</SelectItem>
                  <SelectItem value="minimal-design" disabled>Minimal Design (Coming Soon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Events & eScoop Banners - 2 Columns */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Newsletter Events</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {entriesLoading ? (
                  <div className="flex items-center space-x-2 py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading events...</span>
                  </div>
                ) : entriesError ? (
                  <div className="text-sm text-red-600 py-2">
                    Error loading events: {entriesError.message}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Label className="text-sm">Events in Newsletter ({entries.length})</Label>
                    <p className="text-xs text-muted-foreground">
                      All events are automatically included in your newsletter preview
                    </p>
                    <AnimatedEventsList
                      events={entries}
                      onEventSelect={(event, index) => {
                        console.log('Event selected:', event.event.title, 'at index:', index);
                      }}
                      showGradients={true}
                      enableArrowNavigation={true}
                      displayScrollbar={true}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">🖼️ eScoop Banners</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {bannersLoading ? (
                  <div className="flex items-center space-x-2 py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading banners...</span>
                  </div>
                ) : bannersError ? (
                  <div className="text-sm text-red-600 py-2">
                    Error loading banners: {bannersError.message}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Label className="text-sm">Available Banners ({banners.length})</Label>
                    <p className="text-xs text-muted-foreground">
                      Banners available for this newsletter
                    </p>
                    <AnimatedBannersList
                      banners={banners}
                      onBannerSelect={(banner, index) => {
                        console.log('Banner selected:', banner.title, 'at index:', index);
                      }}
                      showGradients={true}
                      enableArrowNavigation={true}
                      displayScrollbar={true}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Events Panel - Full Width */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">⭐ Featured Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <Input
              placeholder="Search events..."
              value={eventSearchTerm}
              onChange={(e) => setEventSearchTerm(e.target.value)}
              onFocus={loadInitialEvents}
              className="h-9"
            />

            {/* Event Search Results */}
            {(eventSearchTerm || eventSearchResults.length > 0) && (
              <div className="border rounded-md bg-white shadow-sm max-h-48 overflow-y-auto">
                {eventsLoading ? (
                  <div className="p-3 text-center">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    <span className="text-sm text-muted-foreground">Searching...</span>
                  </div>
                ) : eventsError ? (
                  <div className="p-3 text-sm text-red-600">
                    Error searching events
                  </div>
                ) : eventSearchResults.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground text-center">
                    No events found
                  </div>
                ) : (
                  <div className="divide-y">
                    {eventSearchResults.map((event) => {
                      const isAlreadyAdded = selectedFeaturedEvents.some(e => e.id === event.id);
                      return (
                        <div key={event.id} className="p-3 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{event.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {event.startDate && new Date(event.startDate).toLocaleDateString()}
                                {event.status && ` • ${event.status}`}
                              </p>
                              {event.companyId && (
                                <p className="text-xs text-muted-foreground truncate mt-1">
                                  Company: {event.companyId}
                                </p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant={isAlreadyAdded ? "secondary" : "default"}
                              disabled={isAlreadyAdded}
                              onClick={() => handleAddEvent(event)}
                              className="ml-2"
                            >
                              {isAlreadyAdded ? "Added" : "Add"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Selected Featured Events */}
            <div className="space-y-2">
              <Label className="text-sm">Featured Events ({selectedFeaturedEvents.length})</Label>
              {selectedFeaturedEvents.length === 0 ? (
                <div className="text-xs text-muted-foreground py-4 text-center">
                  Search and add events to feature in your newsletter
                </div>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedFeaturedEvents.map((event) => (
                    <div key={event.id} className="flex items-center space-x-2 p-2 border rounded">
                      <input
                        type="checkbox"
                        checked={event.isSelected}
                        onChange={() => toggleFeaturedEventSelection(event.id)}
                        className="rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.startDate && new Date(event.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant={event.isFeatured ? "default" : "outline"}
                          onClick={() => toggleEventFeatured(event.id)}
                          className="text-xs px-2 py-1"
                        >
                          {event.isFeatured ? "✓ Featured" : "Feature"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFeaturedEvent(event.id)}
                          className="text-xs px-2 py-1 text-red-600 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Editorial Blocks & Restaurant Picks - 2 Columns */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">📝 Editorial Blocks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <Input placeholder="Search editorials..." disabled className="h-9" />
              <Select disabled>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground py-4 text-center">
                Editorial module coming soon...
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">🍽️ Restaurant Picks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <Input
                placeholder="Search restaurants..."
                value={restaurantSearchTerm}
                onChange={(e) => setRestaurantSearchTerm(e.target.value)}
                onFocus={loadInitialRestaurants}
                className="h-9"
              />

              {/* Restaurant Search Results */}
              {(restaurantSearchTerm || searchResults.length > 0) && (
                <div className="border rounded-md bg-white shadow-sm max-h-48 overflow-y-auto">
                  {restaurantsLoading ? (
                    <div className="p-3 text-center">
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      <span className="text-sm text-muted-foreground">Searching...</span>
                    </div>
                  ) : restaurantsError ? (
                    <div className="p-3 text-sm text-red-600">
                      Error searching restaurants
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground text-center">
                      No restaurants found
                    </div>
                  ) : (
                    <div className="divide-y">
                      {searchResults.map((restaurant) => {
                        const isAlreadyAdded = selectedRestaurants.some(r => r.id === restaurant.id);
                        return (
                          <div key={restaurant.id} className="p-3 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{restaurant.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {restaurant.city}{restaurant.state && `, ${restaurant.state}`}
                                </p>
                                {restaurant.description && (
                                  <p className="text-xs text-muted-foreground truncate mt-1">
                                    {restaurant.description}
                                  </p>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant={isAlreadyAdded ? "secondary" : "default"}
                                disabled={isAlreadyAdded}
                                onClick={() => handleAddRestaurant(restaurant)}
                                className="ml-2"
                              >
                                {isAlreadyAdded ? "Added" : "Add"}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Selected Restaurants */}
              <div className="space-y-2">
                <Label className="text-sm">Selected Restaurants ({selectedRestaurants.length})</Label>
                {selectedRestaurants.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-4 text-center">
                    Search and add restaurants to include in your newsletter
                  </div>
                ) : (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedRestaurants.map((restaurant) => (
                      <div key={restaurant.id} className="flex items-center space-x-2 p-2 border rounded">
                        <input
                          type="checkbox"
                          checked={restaurant.isSelected}
                          onChange={() => toggleRestaurantSelection(restaurant.id)}
                          className="rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{restaurant.name}</p>
                          <p className="text-xs text-muted-foreground">{restaurant.location}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant={restaurant.isPickOfTheMonth ? "default" : "outline"}
                            onClick={() => toggleRestaurantPickOfTheMonth(restaurant.id)}
                            className="text-xs px-2 py-1"
                          >
                            {restaurant.isPickOfTheMonth ? "✓ Pick" : "Pick"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeRestaurant(restaurant.id)}
                            className="text-xs px-2 py-1 text-red-600 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

    </div>
  );
}