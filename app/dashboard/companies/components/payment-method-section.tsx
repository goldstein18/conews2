"use client";

import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreateCompanyFormData } from "../lib/validations";

export function PaymentMethodSection() {
  const { control } = useFormContext<CreateCompanyFormData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>
          Choose how the company will handle payment for their subscription.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="checkPayment"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Payment Options</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value ? "check" : "stripe"}
                  onValueChange={(value) => field.onChange(value === "check")}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="check" />
                    <div className="space-y-1">
                      <FormLabel className="text-sm font-normal">
                        Check Payment
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Company will pay by check. Manual processing required.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value="stripe" />
                    <div className="space-y-1">
                      <FormLabel className="text-sm font-normal">
                        Send Stripe Invoice
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Send automated Stripe invoice to company email. (Coming soon)
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}