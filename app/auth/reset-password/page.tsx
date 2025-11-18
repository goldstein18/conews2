"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, CheckCircle, AlertCircle, Shield } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/lib/toast-utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { ThemeToggle } from "@/components/theme-toggle";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/auth-store";
import { canAccessDashboard } from "@/types/user";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { login } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenStatus, setTokenStatus] = useState<{
    valid: boolean;
    email: string | null;
    message: string | null;
  }>({
    valid: false,
    email: null,
    message: null,
  });

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  // Validate token function
  const validateToken = useCallback(async (tokenToValidate: string) => {
    setIsValidating(true);

    try {
      const response = await fetch("/api/auth/validate-reset-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: tokenToValidate }),
      });

      const result = await response.json();

      setTokenStatus({
        valid: result.valid,
        email: result.email,
        message: result.message,
      });

      // Set token in form
      if (result.valid) {
        form.setValue("token", tokenToValidate);
      }
    } catch (error) {
      console.error("Token validation error:", error);
      setTokenStatus({
        valid: false,
        email: null,
        message: "Failed to validate token",
      });
    }

    setIsValidating(false);
  }, [form]);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenStatus({
        valid: false,
        email: null,
        message: "No reset token provided",
      });
      setIsValidating(false);
      return;
    }

    validateToken(token);
  }, [token, validateToken]);

  async function onSubmit(data: ResetPasswordFormData) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token: data.token,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle validation errors with details
        if (result.details && Array.isArray(result.details)) {
          // Show specific validation errors
          result.details.forEach((detail: { path: string[]; message: string }) => {
            const fieldName = detail.path[0];
            if (fieldName === 'newPassword') {
              form.setError('newPassword', {
                type: 'manual',
                message: detail.message,
              });
            }
          });
          showErrorToast("Please check the password requirements");
        } else {
          showErrorToast(result.error || "Password reset failed");
        }
        setIsLoading(false);
        return;
      }

      // Handle successful password reset
      const { user } = result;

      // Save user data to store (token is now in httpOnly cookie)
      login(user);

      showSuccessToast("Password changed successfully! Logging you in...");

      // Determine redirect path based on role
      const redirectPath = user.role && canAccessDashboard(user.role.name)
        ? "/dashboard"
        : "/subscriber";

      // Force a page reload to ensure middleware picks up the new token
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 500);

    } catch (error) {
      console.error("Reset password error:", error);
      showErrorToast("An unexpected error occurred");
    }

    setIsLoading(false);
  }

  // Loading state - validating token
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Validating reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid token state
  if (!tokenStatus.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Invalid or Expired Link
            </CardTitle>
            <CardDescription>
              {tokenStatus.message || "This password reset link is no longer valid"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Common reasons:</strong>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>The link has expired (links are valid for 15 minutes)</li>
                <li>The link has already been used</li>
                <li>You may have requested a newer reset link</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Link href="/auth/forgot-password" className="w-full">
              <Button className="w-full">
                Request New Reset Link
              </Button>
            </Link>
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

  // Valid token - show reset form
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Create New Password
            </CardTitle>
          </div>
          <CardDescription>
            Reset password for{" "}
            <span className="font-medium text-foreground">
              {tokenStatus.email}
            </span>
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Enter new password"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Must be at least 8 characters with uppercase, lowercase, and number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirm new password"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex gap-2">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    After resetting your password, you&apos;ll be automatically signed in to your account.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Resetting Password..." : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
