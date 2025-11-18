"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/lib/toast-utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/auth-store";
import { canAccessDashboard } from "@/types/user";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        showErrorToast(result.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      // Handle successful login
      const { user } = result;
      
      // Save user data to store (token is now in httpOnly cookie)
      login(user);
      
      showSuccessToast(`Welcome ${user.firstName}!`);
      
      // Determine redirect path
      const redirectPath = user.role && canAccessDashboard(user.role.name) 
        ? "/dashboard" 
        : "/subscriber";
      
      // Force a page reload to ensure middleware picks up the new token
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 500);
      
    } catch (error) {
      console.error('Login error:', error);
      showErrorToast('An unexpected error occurred');
    }
    
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sign In
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <OAuthButtons disabled={isLoading} />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@email.com"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-primary hover:underline"
                        tabIndex={-1}
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="text-sm text-center text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:underline"
                >
                  Sign Up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
