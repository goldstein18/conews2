"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { subscriberBasicSchema, type SubscriberBasicFormData } from "@/lib/validations/auth";
import { Turnstile } from "@/components/ui/turnstile";
import { CheckCircle2, XCircle } from "lucide-react";

interface RegistrationBasicFormProps {
  onSubmit: (data: SubscriberBasicFormData) => void;
  loading?: boolean;
}

export function RegistrationBasicForm({ onSubmit, loading }: RegistrationBasicFormProps) {
  const [emailCheckStatus, setEmailCheckStatus] = useState<{
    checking: boolean;
    exists: boolean | null;
    message: string;
  }>({
    checking: false,
    exists: null,
    message: "",
  });

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const form = useForm<SubscriberBasicFormData>({
    resolver: zodResolver(subscriberBasicSchema),
    defaultValues: {
      email: "",
      confirmEmail: "",
      firstName: "",
      lastName: "",
      password: "",
      turnstileToken: "",
    },
  });

  // Check if email exists
  const checkEmailExists = async (email: string) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailCheckStatus({
        checking: false,
        exists: null,
        message: "",
      });
      return;
    }

    setEmailCheckStatus({
      checking: true,
      exists: null,
      message: "Checking email availability...",
    });

    try {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.exists) {
        setEmailCheckStatus({
          checking: false,
          exists: true,
          message: "This email is already registered",
        });
        form.setError("email", {
          type: "manual",
          message: "This email is already registered",
        });
      } else {
        setEmailCheckStatus({
          checking: false,
          exists: false,
          message: "Email is available",
        });
        form.clearErrors("email");
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setEmailCheckStatus({
        checking: false,
        exists: null,
        message: "",
      });
    }
  };

  const handleSubmit = (data: SubscriberBasicFormData) => {
    // Final validation before submit
    if (emailCheckStatus.exists === true) {
      form.setError("email", {
        type: "manual",
        message: "This email is already registered",
      });
      return;
    }

    // Validate Turnstile token
    if (!turnstileToken) {
      form.setError("turnstileToken", {
        type: "manual",
        message: "Please complete the bot verification",
      });
      return;
    }

    // Include Turnstile token in submission
    onSubmit({
      ...data,
      turnstileToken,
    });
  };

  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token);
    form.setValue("turnstileToken", token);
    form.clearErrors("turnstileToken");
  };

  const handleTurnstileError = () => {
    setTurnstileToken(null);
    form.setValue("turnstileToken", "");
    form.setError("turnstileToken", {
      type: "manual",
      message: "Bot verification failed. Please try again.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5" autoComplete="off">
        {/* OAuth Buttons */}
        <OAuthButtons disabled={loading || emailCheckStatus.checking} />

        {/* Email Address */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <FloatingLabelInput
                    type="email"
                    label="Email Address *"
                    disabled={loading || emailCheckStatus.checking}
                    autoComplete="off"
                    {...field}
                    onBlur={(e) => {
                      field.onBlur();
                      checkEmailExists(e.target.value);
                    }}
                    className={
                      emailCheckStatus.exists === false
                        ? "border-green-500 focus:border-green-500"
                        : emailCheckStatus.exists === true
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }
                  />
                  {/* Status indicator */}
                  {emailCheckStatus.checking && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                    </div>
                  )}
                  {emailCheckStatus.exists === false && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                  {emailCheckStatus.exists === true && (
                    <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                  )}
                </div>
              </FormControl>
              {/* Show validation message */}
              {emailCheckStatus.message && !form.formState.errors.email && (
                <p
                  className={`text-sm mt-1 ${
                    emailCheckStatus.exists === false
                      ? "text-green-600"
                      : emailCheckStatus.exists === true
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {emailCheckStatus.message}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Email Address */}
        <FormField
          control={form.control}
          name="confirmEmail"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  type="email"
                  label="Confirm Email Address *"
                  disabled={loading}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* First Name and Last Name in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    type="text"
                    label="First Name *"
                    disabled={loading}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    type="text"
                    label="Last Name"
                    disabled={loading}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FloatingLabelInput
                  type="password"
                  label="Password *"
                  disabled={loading}
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">
                Your password must be at least 8 characters
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-2 pt-2">
          <Checkbox id="terms" required disabled={loading} className="mt-0.5" />
          <label
            htmlFor="terms"
            className="text-10px leading-relaxed text-gray-600 cursor-pointer"
          >
            I accept the CultureOwl{" "}
            <Link
              href="/terms-of-service"
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              Terms of Service
            </Link>
            , Prohibited Activities, agree to the use of cookies as outlined in the{" "}
            <Link
              href="/cookie-policy"
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              Cookie Policy
            </Link>
            , and have read the{" "}
            <Link
              href="/privacy-policy"
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        {/* Cloudflare Turnstile Bot Protection */}
        <FormField
          control={form.control}
          name="turnstileToken"
          render={() => {
            const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

            if (!siteKey) {
              console.error('Turnstile site key is not configured');
              return (
                <FormItem>
                  <div className="text-sm text-red-600">
                    Bot protection is not configured. Please contact support.
                  </div>
                </FormItem>
              );
            }

            return (
              <FormItem>
                <FormControl>
                  <Turnstile
                    siteKey={siteKey}
                    onVerify={handleTurnstileVerify}
                    onError={handleTurnstileError}
                    onExpire={() => {
                      setTurnstileToken(null);
                      form.setValue("turnstileToken", "");
                    }}
                    theme="light"
                    className="mt-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base mt-6"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Processing...
            </>
          ) : (
            "NEXT"
          )}
        </Button>

        {/* Already signed up */}
        <div className="text-center text-sm pt-2">
          Already signed up?{" "}
          <Link
            href="/auth/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
