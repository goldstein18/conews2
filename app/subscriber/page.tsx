"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { Calendar, Ticket, User } from "lucide-react";

export default function SubscriberPage() {
  const { user } = useAuthStore();

  return (
    <div className="bg-gradient-to-br from-background to-muted">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Welcome, {user?.firstName}!
              </CardTitle>
              <CardDescription>
                Your subscriber account gives you access to the best events in the city
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">Available Events</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm">
                  Explore all available events in your area
                </p>
                <Button className="mt-4 w-full" variant="outline">
                  View Events
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Ticket className="h-12 w-12 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">My Tickets</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm">
                  Manage your tickets and reservations
                </p>
                <Button className="mt-4 w-full" variant="outline">
                  View Tickets
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <User className="h-12 w-12 mx-auto text-primary mb-2" />
                <CardTitle className="text-lg">My Profile</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm">
                  Update your personal information
                </p>
                <Button className="mt-4 w-full" variant="outline">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade CTA */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Are you an event organizer?</CardTitle>
              <CardDescription>
                Request dashboard access to manage your own events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Request Premium Access</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
