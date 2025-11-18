"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subscriberLocationSchema, type SubscriberLocationFormData, US_STATES } from "@/lib/validations/auth";

interface RegistrationLocationFormProps {
  onSubmit: (data: SubscriberLocationFormData) => void;
  onBack: () => void;
  loading?: boolean;
}

export function RegistrationLocationForm({
  onSubmit,
  onBack,
  loading,
}: RegistrationLocationFormProps) {
  const form = useForm({
    resolver: zodResolver(subscriberLocationSchema),
    defaultValues: {
      city: "",
      state: "",
      sendNotifications: true,
    },
  });

  const handleSubmit = (data: SubscriberLocationFormData) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="min-h-screen flex">
        {/* Left Side - Text Content */}
        <div className="hidden lg:flex lg:w-1/3 bg-gray-50 p-12 flex-col justify-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-anton leading-tight">TELL US</h1>
            <h1 className="text-5xl font-anton leading-tight">YOUR LOCATION</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Find unique experiences near you,
              <br />
              crafted by top cultural producers!
            </p>

            {/* Progress on sidebar for desktop */}
            <div className="mt-8">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox checked className="pointer-events-none" />
                <span className="text-sm text-gray-600">Yes, please!</span>
              </div>
              <p className="text-sm text-gray-500 mt-6 mb-2">Step 2 of 2</p>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-full transition-all duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 md:p-12 lg:p-16 flex items-center justify-center">
            <div className="w-full max-w-xl">
              {/* Mobile header */}
              <div className="lg:hidden mb-8">
                <h2 className="text-4xl font-anton mb-2 leading-tight">TELL US</h2>
                <h3 className="text-4xl font-anton mb-4 leading-tight">YOUR LOCATION</h3>
                <p className="text-gray-600 text-base">
                  Find unique experiences near you,
                  <br />
                  crafted by top cultural producers!
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  {/* Location Input with Icon */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <FloatingLabelInput
                              type="text"
                              label="Enter your City"
                              disabled={loading}
                              autoComplete="off"
                              className="pr-12 h-14 text-base"
                              {...field}
                            />
                            <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* State Selector */}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={loading}
                        >
                          <FormControl>
                            <SelectTrigger className="h-14 text-base">
                              <SelectValue placeholder="Select your state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {US_STATES.map((state) => (
                              <SelectItem key={state.value} value={state.value}>
                                {state.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  {/* Progress Indicator - Mobile only */}
                  <div className="lg:hidden pt-4">
                    <p className="text-sm text-gray-500 mb-2">Step 2 of 2</p>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-full transition-all duration-300" />
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* Fixed Bottom Buttons */}
          <div className="border-t bg-white p-6 md:p-8 lg:p-12">
            <div className="w-full max-w-xl mx-auto flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={loading}
                className="h-12 px-8 text-base border-2"
              >
                Back
              </Button>
              <Button
                type="submit"
                onClick={form.handleSubmit(handleSubmit)}
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating Account...
                  </>
                ) : (
                  "FINISH"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
