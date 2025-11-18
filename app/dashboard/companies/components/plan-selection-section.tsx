"use client";

import { useFormContext } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateCompanyFormData } from "../lib/validations";
import { Plan } from "@/types/members";

interface PlanSelectionSectionProps {
  plans: Plan[];
  isLoading?: boolean;
}

export function PlanSelectionSection({ plans, isLoading }: PlanSelectionSectionProps) {
  const { control, watch } = useFormContext<CreateCompanyFormData>();
  
  const selectedPlanSlug = watch("planSlug");
  const selectedPlan = plans.find(plan => plan.planSlug === selectedPlanSlug);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatAllowanceValue = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    return numValue === -1 ? 'Unlimited' : numValue.toString();
  };

  const allowanceGroups = [
    {
      title: "EVENTS",
      items: [
        { key: "events", label: "Events", description: "Number of events allowed" },
      ]
    },
    {
      title: "BANNERS", 
      items: [
        { key: "banners", label: "ROS", description: "Run of Site banners" },
        { key: "lbhBanners", label: "Leaderboard", description: "Leaderboard banner ads" },
        { key: "lbvBanners", label: "eBanner", description: "Electronic banner advertisements" },
        { key: "marquee", label: "Marquees", description: "Marquee banner displays" },
      ]
    },
    {
      title: "GENRE BANNERS",
      items: [
        { key: "genreBlue", label: "Blue 3mo", description: "Blue genre 3-month banners" },
        { key: "genreBlue6", label: "Blue 6mo", description: "Blue genre 6-month banners" },
        { key: "genreBlue12", label: "Blue 12mo", description: "Blue genre 12-month banners" },
        { key: "genreGreen", label: "Green 3mo", description: "Green genre 3-month banners" },
        { key: "genreGreen6", label: "Green 6mo", description: "Green genre 6-month banners" },
        { key: "genreGreen12", label: "Green 12mo", description: "Green genre 12-month banners" },
        { key: "genreRed", label: "Red 3mo", description: "Red genre 3-month banners" },
      ]
    },
    {
      title: "ESCOOPS",
      items: [
        { key: "escoops", label: "Credits", description: "Escoop credits available" },
        { key: "escoopBanners", label: "Inclusions", description: "Escoop banner inclusions" },
        { key: "escoopFeature", label: "Features", description: "Featured escoop placements" },
        { key: "dedicated", label: "Dedicated", description: "Dedicated escoop content" },
      ]
    },
    {
      title: "SOCIAL",
      items: [
        { key: "fbCovers", label: "Inclusion", description: "Facebook cover inclusions" },
        { key: "fbSocialBoost", label: "Event Boost", description: "Social media event boosting" },
        { key: "fbSocialAd", label: "Ad/Reel", description: "Facebook ads and reels" },
        { key: "fbCarousels", label: "Social Story", description: "Facebook carousel stories" },
      ]
    },
    {
      title: "DIRECTORIES",
      items: [
        { key: "venues", label: "Venues", description: "Venue directory listings" },
        { key: "restaurants", label: "Restaurants", description: "Restaurant directory listings" },
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Plan Selection</CardTitle>
        <CardDescription>
          Select a membership plan for the company.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plan Selection Dropdown */}
        <FormField
          control={control}
          name="planSlug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Select Membership Plan <span className="text-destructive">*</span>
              </FormLabel>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.planSlug}>
                      <div className="flex items-center justify-between w-full">
                        <span>{plan.plan}</span>
                        <span className="ml-4 text-muted-foreground">
                          {formatPrice(plan.price)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Plan Benefits Preview */}
        {selectedPlan && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Assets Included with Plan</h3>
            <div className="grid gap-4">
              {allowanceGroups.map((group) => {
                // Filter items to only show those with values > 0 or -1 (unlimited)
                const availableItems = group.items.filter((item) => {
                  const allowanceValue = selectedPlan.allowances[item.key as keyof typeof selectedPlan.allowances];
                  const numValue = typeof allowanceValue === 'string' ? parseInt(allowanceValue) : allowanceValue;
                  return numValue > 0 || numValue === -1;
                });

                // Only show the group if it has available items
                if (availableItems.length === 0) return null;

                return (
                  <div key={group.title}>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                      {group.title}
                    </h4>
                    <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {availableItems.map((item) => {
                        const allowanceValue = selectedPlan.allowances[item.key as keyof typeof selectedPlan.allowances];
                        const displayValue = formatAllowanceValue(allowanceValue);
                        
                        return (
                          <div key={item.key} className="flex flex-col items-center justify-center p-3 border rounded-lg bg-gray-50">
                            <div className="text-center">
                              <p className="text-xs font-medium text-gray-700 mb-1">{item.label}</p>
                              <Badge 
                                variant={allowanceValue === -1 ? "default" : "secondary"}
                                className="text-xs px-2 py-1"
                              >
                                {displayValue}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }).filter(Boolean)}
            </div>

            {/* Plan Price Summary */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{selectedPlan.plan}</h4>
                  <p className="text-sm text-muted-foreground">Monthly subscription</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{formatPrice(selectedPlan.price)}</p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}