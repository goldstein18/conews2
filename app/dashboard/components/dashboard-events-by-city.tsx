"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { EventsByCity } from "@/types/dashboard";

interface DashboardEventsByCityProps {
  eventsByCity: EventsByCity;
}

const cityLabels: Record<string, string> = {
  miami: "Miami",
  orlando: "Orlando",
  tampa: "Tampa",
  fortlauderdale: "Fort Lauderdale",
  jacksonville: "Jacksonville",
};

export function DashboardEventsByCity({ eventsByCity }: DashboardEventsByCityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Running Events</span>
        </CardTitle>
        <CardDescription>Currently active events by city</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {eventsByCity.citiesStats.map((cityStats) => {
            const cityLabel = cityLabels[cityStats.city.toLowerCase()] || cityStats.city.toUpperCase();

            return (
              <div key={cityStats.city} className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-500 mx-auto flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{cityLabel}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {cityStats.runningEvents.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {cityStats.runningEvents === 1 ? 'attendee' : 'attendees'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {eventsByCity.totalRunningEvents.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Total Running</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {eventsByCity.totalFeaturedEvents.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">Featured Events</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {eventsByCity.citiesStats.reduce((sum, city) => sum + city.pendingEvents, 0)}
            </p>
            <p className="text-xs text-gray-600">Pending Approval</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {eventsByCity.citiesStats.reduce((sum, city) => sum + city.totalApprovedEvents, 0)}
            </p>
            <p className="text-xs text-gray-600">Total Approved</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
