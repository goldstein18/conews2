"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notification-bell";
import { NotificationSSEManager } from "@/components/notification-sse-manager";
import { ImpersonationBanner } from "@/components/impersonation-banner";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useMenuStore } from "@/store/menu-store";
import { canAccessDashboard } from "@/types/user";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isInitializing, isLoggingOut, initializeAuth } = useAuthStore();
  const { findMenuItemByHref, findParentByChildHref } = useMenuStore();

  // Initialize auth on mount - if we reached here, middleware validated the token
  useEffect(() => {
    if (!user && !isInitializing && !isLoggingOut) {
      console.log('Dashboard: No user data, initializing auth...');
      initializeAuth();
    }
  }, [user, isInitializing, isLoggingOut, initializeAuth]);

  // Only check role-based access, don't redirect to login (middleware handles that)
  useEffect(() => {
    if (!isInitializing && !isLoggingOut && user && user.role && !canAccessDashboard(user.role.name)) {
      console.log('Dashboard: User cannot access dashboard, redirecting to subscriber');
      router.push("/subscriber");
    }
  }, [user, isInitializing, isLoggingOut, router]);

  // Show logout spinner if logging out
  if (isLoggingOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold">Logging out...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting users without proper access
  if (!user || !user.role || !canAccessDashboard(user.role.name)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Get current page title from menu configuration
  const getCurrentPageTitle = () => {
    const currentItem = findMenuItemByHref(pathname);
    const parent = findParentByChildHref(pathname);
    
    if (currentItem) {
      return currentItem.label;
    }
    
    if (parent) {
      const child = parent.children?.find(child => child.href === pathname);
      return child?.label || "Dashboard";
    }
    
    return "Dashboard";
  };

  return (
    <div className="flex min-h-screen">
      {/* SSE Connection Manager */}
      <NotificationSSEManager />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col">
        <DashboardSidebar />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
          </VisuallyHidden>
          <DashboardSidebar onClose={() => setIsSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Impersonation Banner */}
        <ImpersonationBanner />

        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">
              {getCurrentPageTitle()}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-muted/30 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
