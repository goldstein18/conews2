"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { useAuthStore } from "@/store/auth-store";
import { CREATE_PLAN_WITH_STRIPE, GET_PLANS } from "@/lib/graphql/plans";
import { createPlanSchema, defaultAllowances, type CreatePlanFormData } from "../lib/validations";
import { showErrorToast, showSuccessToast } from "@/lib/toast-utils";

export default function CreatePlanPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const [createPlan] = useMutation(CREATE_PLAN_WITH_STRIPE);

  const form = useForm<CreatePlanFormData>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      plan: "",
      planSlug: "",
      price: 1,
      priceLong: "",
      allowances: defaultAllowances,
    },
  });

  useEffect(() => {
    if (user && user.role?.name !== 'SUPER_ADMIN') {
      router.push('/dashboard/plans');
    }
  }, [user, router]);

  const watchPlanName = form.watch("plan");

  useEffect(() => {
    if (watchPlanName) {
      const slug = generateSlug(watchPlanName);
      form.setValue("planSlug", slug);
    }
  }, [watchPlanName, form]);

  if (user?.role?.name !== 'SUPER_ADMIN') {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Access denied. SUPER_ADMIN role required.</p>
        </div>
      </div>
    );
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };


  async function onSubmit(data: CreatePlanFormData) {
    setIsLoading(true);
    
    try {
      const priceInCents = data.price * 100;
      const priceLongValue = priceInCents.toString();
      
      const result = await createPlan({
        variables: {
          createPlanWithStripeInput: {
            plan: data.plan,
            planSlug: data.planSlug,
            price: data.price, // Send in dollars
            priceLong: priceLongValue, // Send in cents as string
            allowances: data.allowances,
          },
        },
        refetchQueries: [
          {
            query: GET_PLANS,
          },
        ],
        awaitRefetchQueries: true,
      });

      if (result.data?.createPlanWithStripe) {
        showSuccessToast("Plan created successfully!");
        router.push('/dashboard/plans');
      }
    } catch (error: unknown) {
      console.error('Create plan error:', error);
      let errorMessage = 'Failed to create plan';
      
      if (error && typeof error === 'object') {
        const err = error as { graphQLErrors?: Array<{ message: string }>; message?: string };
        errorMessage = err.graphQLErrors?.[0]?.message || err.message || errorMessage;
      }
      
      showErrorToast(errorMessage);
    }
    
    setIsLoading(false);
  }

  const allowanceGroups = [
    {
      title: "Events",
      fields: [
        { key: "events", label: "Events", description: "Number of events allowed" },
      ]
    },
    {
      title: "BANNERS",
      fields: [
        { key: "banners", label: "ROS", description: "Run of Site banners" },
        { key: "lbhBanners", label: "Leaderboard", description: "Leaderboard banner ads" },
        { key: "lbvBanners", label: "eBanner", description: "Electronic banner advertisements" },
        { key: "marquee", label: "Marquees", description: "Marquee banner displays" },
      ]
    },
    {
      title: "GENRE BANNERS",
      fields: [
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
      fields: [
        { key: "escoops", label: "Credits", description: "Escoop credits available" },
        { key: "escoopBanners", label: "Inclusions", description: "Escoop banner inclusions" },
        { key: "escoopFeature", label: "Features", description: "Featured escoop placements" },
        { key: "dedicated", label: "Dedicated", description: "Dedicated escoop content" },
      ]
    },
    {
      title: "SOCIAL",
      fields: [
        { key: "fbCovers", label: "Inclusion", description: "Facebook cover inclusions" },
        { key: "fbSocialBoost", label: "Event Boost", description: "Social media event boosting" },
        { key: "fbSocialAd", label: "Ad/Reel", description: "Facebook ads and reels" },
        { key: "fbCarousels", label: "Social Story", description: "Facebook carousel stories" },
      ]
    },
    {
      title: "DIRECTORIES",
      fields: [
        { key: "venues", label: "Venues", description: "Venue directory listings" },
        { key: "restaurants", label: "Restaurants", description: "Restaurant directory listings" },
      ]
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/plans')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Plans</span>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Plan</h1>
        <p className="text-muted-foreground">Create a new membership plan</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Plan Information */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Information</CardTitle>
              <CardDescription>Basic details of the plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Plan Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter plan name"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Plan Price <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <MoneyInput
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="$1,200.00"
                          disabled={isLoading}
                          min={1}
                          max={99999.99}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="planSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="auto-generated-from-name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
              <CardDescription>
                • Assign the number of credits to each benefit.<br />
                • For the Event benefit a value of -1 means unlimited.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {allowanceGroups.map((group) => (
                <div key={group.title} className="space-y-4">
                  <h3 className="text-lg font-semibold">{group.title}</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {group.fields.map((fieldConfig) => {
                      const fieldName = `allowances.${fieldConfig.key}` as `allowances.${keyof typeof defaultAllowances}`;
                      return (
                        <FormField
                          key={fieldConfig.key}
                          control={form.control}
                          name={fieldName}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{fieldConfig.label}</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={field.value || ''}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/plans')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Creating..." : "SAVE"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}