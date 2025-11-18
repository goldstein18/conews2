"use client";

import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateCompanyFormData } from "../lib/validations";
import { MARKET_OPTIONS } from "@/types/members";

export function CompanyDetailsSection() {
  const { control } = useFormContext<CreateCompanyFormData>();

  const formatMarketLabel = (market: string) => {
    return market
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>
          Enter the company details and contact information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Company Name and Email */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Company Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="companyEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="company@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Market and Phone */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="market"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Market <span className="text-destructive">*</span>
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Market" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MARKET_OPTIONS.map((market) => (
                      <SelectItem key={market} value={market}>
                        {formatMarketLabel(market)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="companyPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address */}
        <FormField
          control={control}
          name="companyAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Address <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Street Address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City, State, Zip */}
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={control}
            name="companyCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  City <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="City"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="companyState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  State <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="State"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="companyZipcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Zip Code <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Zip Code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* HubSpot ID (Optional) */}
        <FormField
          control={control}
          name="hubspotId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HubSpot ID (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="HubSpot ID"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      </CardContent>
    </Card>
  );
}