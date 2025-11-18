"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showErrorToast, showSuccessToast } from "@/lib/toast-utils";
import { useAuthStore } from "@/store/auth-store";
import { RegistrationBasicForm } from "./registration-basic-form";
import { RegistrationLocationForm } from "./registration-location-form";
import type { SubscriberBasicFormData, SubscriberLocationFormData } from "@/lib/validations/auth";

export function RegistrationWizard() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [basicFormData, setBasicFormData] = useState<SubscriberBasicFormData | null>(null);

  // Handle Step 1 completion
  const handleStep1Complete = (data: SubscriberBasicFormData) => {
    console.log("✅ Step 1 data collected:", {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    // Store basic form data and move to step 2
    setBasicFormData(data);
    setCurrentStep(2);
  };

  // Handle Step 2 completion - Final registration
  const handleStep2Complete = async (locationData: SubscriberLocationFormData) => {
    if (!basicFormData) {
      showErrorToast("Please complete Step 1 first");
      setCurrentStep(1);
      return;
    }

    setIsLoading(true);

    try {
      console.log("📤 Submitting registration:", {
        email: basicFormData.email,
        firstName: basicFormData.firstName,
        lastName: basicFormData.lastName,
        city: locationData.city,
        state: locationData.state,
        hasTurnstileToken: !!basicFormData.turnstileToken,
      });

      // Call BFF registration endpoint
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify({
          email: basicFormData.email,
          password: basicFormData.password,
          firstName: basicFormData.firstName,
          lastName: basicFormData.lastName || "",
          city: locationData.city,
          state: locationData.state,
          tagIds: [], // No tags for now as requested
          turnstileToken: basicFormData.turnstileToken, // Include Turnstile token
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409) {
          showErrorToast("An account with this email already exists");
        } else {
          showErrorToast(result.error || "Registration failed");
        }
        setIsLoading(false);
        return;
      }

      // Handle successful registration
      const { user, shouldRedirectToLogin } = result;

      if (shouldRedirectToLogin) {
        // Registration succeeded but auto-login failed
        showSuccessToast("Registration successful! Please login to continue.");
        setTimeout(() => {
          router.push("/auth/login");
        }, 1000);
        return;
      }

      // Save user data to store (token is now in httpOnly cookie)
      login(user);

      showSuccessToast(
        `Welcome to CultureOwl, ${user.firstName}! 🎉`
      );

      // Redirect to home page after successful registration
      // Home will show authenticated content with session active
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      showErrorToast("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // Handle back to step 1
  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  // Step 2 needs a completely different layout
  if (currentStep === 2) {
    return (
      <RegistrationLocationForm
        onSubmit={handleStep2Complete}
        onBack={handleBackToStep1}
        loading={isLoading}
      />
    );
  }

  // Step 1 - normal form
  return (
    <div className="w-full">
      <RegistrationBasicForm
        onSubmit={handleStep1Complete}
        loading={isLoading}
      />
    </div>
  );
}
