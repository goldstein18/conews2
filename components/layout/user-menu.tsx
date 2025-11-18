"use client";

import { User, type LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { ChevronDown, LayoutDashboard, Heart, Compass, Building, Coffee, Newspaper, Briefcase, Settings, LogOut, UserCircle } from "lucide-react";
import { canAccessDashboard, type User as UserType } from "@/types/user";

interface MenuItemConfig {
  icon: LucideIcon;
  label: string;
  href: string;
}

// Menu items for dashboard users (company members)
const dashboardMenuItems: MenuItemConfig[] = [
  { icon: LayoutDashboard, label: "Member Dashboard", href: "/dashboard" },
  { icon: UserCircle, label: "Profile", href: "/dashboard/profile" },
  { icon: Heart, label: "Hearted Events", href: "/dashboard/hearted-events" },
  { icon: Compass, label: "Explore Events", href: "/events" },
  { icon: Building, label: "Venues & Arts Groups", href: "/venues" },
  { icon: Coffee, label: "Dining Guide", href: "/dining" },
  { icon: Newspaper, label: "Cultural News", href: "/news/cultural" },
  { icon: Briefcase, label: "Industry News", href: "/news/industry" },
];

// Menu items for cultural users (subscribers)
const culturalUserMenuItems: MenuItemConfig[] = [
  { icon: UserCircle, label: "Profile", href: "/subscriber/profile" },
  { icon: Heart, label: "Your Heart Events", href: "/subscriber/favorites" },
  { icon: Compass, label: "Explore Events", href: "/events" },
  { icon: Building, label: "Venues & Arts Groups", href: "/venues" },
  { icon: Coffee, label: "Dining Guide", href: "/dining" },
  { icon: Newspaper, label: "Cultural News", href: "/news/cultural" },
];

function getUserInitials(user: UserType | null): string {
  if (!user) return "U";

  const firstInitial = user.firstName?.charAt(0) || "";
  const lastInitial = user.lastName?.charAt(0) || "";

  return (firstInitial + lastInitial).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U";
}

function getUserDisplayName(user: UserType | null): string {
  if (!user) return "User";

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  if (user.firstName) return user.firstName;

  return user.email || "User";
}

export function UserMenu() {
  const { user, isAuthenticated, isLoggingOut, logout } = useAuthStore();

  if (!isAuthenticated || !user) return null;

  const isDashboardUser = canAccessDashboard(user.role?.name);
  const menuItems = isDashboardUser ? dashboardMenuItems : culturalUserMenuItems;
  const initials = getUserInitials(user);
  const displayName = getUserDisplayName(user);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 h-auto"
        >
          <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{displayName}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {/* User Info Header */}
        <DropdownMenuLabel className="flex items-center space-x-2 py-3">
          <User className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 dark:text-gray-300 font-medium truncate">{user.email}</span>
        </DropdownMenuLabel>

        {/* Role-specific header for dashboard users */}
        {isDashboardUser && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1 bg-gray-50 dark:bg-gray-800">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Logged In Members:
              </span>
            </div>
          </>
        )}

        <DropdownMenuSeparator />

        {/* Menu Items */}
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} className="flex items-center space-x-3 cursor-pointer">
                <Icon className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        {/* Settings */}
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center space-x-3 cursor-pointer">
            <Settings className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Settings</span>
          </Link>
        </DropdownMenuItem>

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center space-x-3 cursor-pointer text-red-600 dark:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              <span className="font-medium">Logging out...</span>
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Log out</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
