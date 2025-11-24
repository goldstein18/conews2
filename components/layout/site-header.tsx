"use client";

import Link from "next/link";
import { Heart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { canAccessDashboard } from "@/types/user";
import { Logo } from "./logo";
import { SearchBar } from "./search-bar";
import { UserMenu } from "./user-menu";
import { DiscoverMenu } from "./discover-menu";
import { ScheduleMenu, ScheduleButton } from "./schedule-menu";
import { MobileNav } from "./mobile-nav";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const { user, isAuthenticated, isLoggingOut } = useAuthStore();
  const pathname = usePathname();
  const [isAtTop, setIsAtTop] = useState(true);

  // Check if we're on the news page
  const isNewsPage = pathname?.startsWith("/news");

  // Handle scroll behavior for news page - only show header when at top
  useEffect(() => {
    if (!isNewsPage) {
      setIsAtTop(true);
      return;
    }

    const handleScroll = () => {
      // Show header only when scroll position is at the very top (within 10px)
      setIsAtTop(window.scrollY <= 10);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isNewsPage]);

  // We can't check httpOnly cookies from JavaScript, so we trust the auth state from the server
  // isAuthenticated is set by initializeAuth which calls /api/auth/me (server-side validation)

  // Determine if we're in dashboard view
  const isDashboardView = pathname?.startsWith("/dashboard");
  const isDashboardUser = isAuthenticated && user && canAccessDashboard(user.role?.name);
  const isCulturalUser = isAuthenticated && user && !canAccessDashboard(user.role?.name);

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-950/80 transition-transform duration-300 ${
        isNewsPage && !isAtTop ? '-translate-y-full' : ''
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Logo />

          {/* Search Bar - Hidden on dashboard view and mobile */}
          {!isDashboardView && (
            <div className="hidden md:flex flex-1 justify-center mx-8">
              <SearchBar className="max-w-2xl" />
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Logging Out Indicator */}
            {isLoggingOut && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm font-medium">Logging out...</span>
              </div>
            )}

            {/* Dashboard View - Logged In with Dashboard Role */}
            {!isLoggingOut && isDashboardView && isDashboardUser && (
              <>
                {/* Create Dropdown */}
                <ScheduleMenu variant="desktop" />

                {/* Notification Bell */}
                <div className="relative">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {/* Notification Badge - Example */}
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      3
                    </span>
                  </Button>
                </div>

                {/* User Menu */}
                <UserMenu />
              </>
            )}

            {/* Logged In Member (Not Dashboard View) */}
            {!isLoggingOut && !isDashboardView && isDashboardUser && (
              <>
                {/* Schedule Button */}
                <ScheduleButton />

                {/* Likes */}
                <Link href="/dashboard/likes">
                  <Button variant="ghost" className="flex flex-col items-center h-auto py-2 px-3">
                    <Heart className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">Likes</span>
                  </Button>
                </Link>

                {/* Discover Culture */}
                <DiscoverMenu variant="desktop" />

                {/* User Menu */}
                <UserMenu />
              </>
            )}

            {/* Cultural User (Subscriber) */}
            {!isLoggingOut && !isDashboardView && isCulturalUser && (
              <>
                {/* Discover Culture */}
                <DiscoverMenu variant="desktop" />

                {/* Favorites */}
                <Link href="/subscriber/favorites">
                  <Button variant="ghost" className="flex flex-col items-center h-auto py-2 px-3">
                    <Heart className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">Favorites</span>
                  </Button>
                </Link>

                {/* User Menu */}
                <UserMenu />
              </>
            )}

            {/* Not Logged In */}
            {!isAuthenticated && !isLoggingOut && (
              <>
                {/* Discover Culture */}
                <DiscoverMenu variant="desktop" />

                {/* Auth Buttons */}
                <div className="flex items-center space-x-3">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="font-medium">
                      Log In
                    </Button>
                  </Link>

                  <Link href="/auth/register">
                    <Button size="sm" className="bg-brand-blue hover:bg-brand-blue/90 text-white font-medium">
                      Sign Up
                    </Button>
                  </Link>

                  <Link href="/promote">
                    <Button variant="secondary" size="sm" className="font-medium bg-gray-800 hover:bg-gray-900 text-white">
                      Promote with us
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </nav>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
