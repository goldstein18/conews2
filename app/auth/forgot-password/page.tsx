"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/lib/toast-utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { resetPasswordRequestSchema, type ResetPasswordRequestFormData } from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordRequestFormData>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ResetPasswordRequestFormData) {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      // Handle rate limit error
      if (response.status === 429) {
        showErrorToast(result.error || 'Too many requests. Please try again later.');
        setIsLoading(false);
        return;
      }

      // Handle other errors
      if (!response.ok) {
        showErrorToast(result.error || 'An error occurred. Please try again.');
        setIsLoading(false);
        return;
      }

      // Show success state
      setIsSuccess(true);
      showSuccessToast('Check your email for password reset instructions');

    } catch (error) {
      console.error('Forgot password error:', error);
      showErrorToast('An unexpected error occurred. Please try again.');
    }

    setIsLoading(false);
  }

  // Success state - show confirmation message
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Check Your Email
            </CardTitle>
            <CardDescription>
              We&apos;ve sent password reset instructions to{" "}
              <span className="font-medium text-foreground">
                {form.getValues('email')}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">What&apos;s next?</strong>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the reset link in the email</li>
                <li>The link will expire in 15 minutes</li>
              </ul>
            </div>

            <div className="text-sm text-center text-muted-foreground">
              Didn&apos;t receive an email?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-medium"
                onClick={() => {
                  setIsSuccess(false);
                  form.reset();
                }}
              >
                Try again
              </Button>
            </div>
          </CardContent>

          <CardFooter>
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Request form
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold">
              Forgot Password?
            </CardTitle>
          </div>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Note:</strong> For your security, we&apos;ll send the reset link only if an account exists with this email.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-sm text-center text-muted-foreground">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
