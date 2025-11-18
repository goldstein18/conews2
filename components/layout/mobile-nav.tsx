"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Heart, LogIn, UserPlus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth-store";
import { canAccessDashboard } from "@/types/user";
import { DiscoverMenu } from "./discover-menu";
import { ScheduleMenu } from "./schedule-menu";
import { Logo } from "./logo";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const isDashboardUser = isAuthenticated && user && canAccessDashboard(user.role?.name);
  const isCulturalUser = isAuthenticated && user && !canAccessDashboard(user.role?.name);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-6 h-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>
            <Logo showText={true} />
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* User Info - Authenticated */}
          {isAuthenticated && user && (
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white font-semibold">
                  {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {user.firstName || user.email}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                </div>
              </div>
            </div>
          )}

          {/* Discover Culture Section */}
          <div>
            <DiscoverMenu variant="mobile" />
          </div>

          <Separator />

          {/* Dashboard Users - Schedule/Create */}
          {isDashboardUser && (
            <>
              <div>
                <ScheduleMenu variant="mobile" />
              </div>
              <Separator />
            </>
          )}

          {/* Logged In Member Links */}
          {isDashboardUser && (
            <div className="space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-md"
              >
                <Heart className="w-5 h-5 text-brand-blue" />
                <span className="text-sm font-medium">Hearted Events</span>
              </Link>
            </div>
          )}

          {/* Cultural User Links */}
          {isCulturalUser && (
            <div className="space-y-1">
              <Link
                href="/subscriber/favorites"
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-md"
              >
                <Heart className="w-5 h-5 text-brand-blue" />
                <span className="text-sm font-medium">Favorites</span>
              </Link>
            </div>
          )}

          {/* Not Logged In - Auth Buttons */}
          {!isAuthenticated && (
            <>
              <Separator />
              <div className="space-y-3 px-4">
                <Link href="/auth/login" onClick={() => setOpen(false)} className="block w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <LogIn className="w-4 h-4 mr-2" />
                    Log In
                  </Button>
                </Link>

                <Link href="/auth/register" onClick={() => setOpen(false)} className="block w-full">
                  <Button className="w-full bg-brand-blue hover:bg-brand-blue/90 justify-start">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>

                <Link href="/promote" onClick={() => setOpen(false)} className="block w-full">
                  <Button variant="secondary" className="w-full justify-start">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Promote with us
                  </Button>
                </Link>
              </div>
            </>
          )}

          {/* Authenticated - Logout */}
          {isAuthenticated && (
            <>
              <Separator />
              <div className="px-4">
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
