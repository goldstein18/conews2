"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, CreditCard } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

import { OrganizationProfile, TeamManagement, OrganizationProfileSkeleton, TeamManagementSkeleton, PlanBillingSkeleton } from "./components";
import { useCompanyProfile, useCompanyTeam } from "./hooks";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("organization");
  const { user } = useAuthStore();
  const router = useRouter();

  // Centralized data loading - load once on page mount
  const { profile, loading: profileLoading } = useCompanyProfile();
  const { teamMembers, loading: teamLoading } = useCompanyTeam();
  
  // Extract social networks from profile data instead of separate query
  const socialNetworks = profile?.network?.socialNetworks || {};

  // Redirect SUPER_ADMIN users away from settings
  useEffect(() => {
    if (user?.role?.name === 'SUPER_ADMIN') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Don't render anything for SUPER_ADMIN
  if (user?.role?.name === 'SUPER_ADMIN') {
    return null;
  }

  // Individual loading states for each tab
  const isLoadingProfile = profileLoading;
  const isLoadingTeam = teamLoading;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your organization profile, subscription, and platform settings.
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="organization" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Organization</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Team Management</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Plan & Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* Organization Tab */}
        <TabsContent value="organization" className="space-y-6">
          {isLoadingProfile ? (
            <OrganizationProfileSkeleton />
          ) : (
            <OrganizationProfile 
              profile={profile}
              socialNetworks={socialNetworks}
            />
          )}
        </TabsContent>

        {/* Team Management Tab */}
        <TabsContent value="team" className="space-y-6">
          {isLoadingTeam ? (
            <TeamManagementSkeleton />
          ) : (
            <TeamManagement 
              teamMembers={teamMembers}
            />
          )}
        </TabsContent>

        {/* Plan & Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <PlanBillingSkeleton />
        </TabsContent>
      </Tabs>
    </div>
  );
}