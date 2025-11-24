"use client";

import Link from "next/link";
import { Globe, Utensils, Building, Music, Newspaper, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DiscoverItem {
  name: string;
  href: string;
  icon: typeof Utensils;
  description: string;
}

const discoverItems: DiscoverItem[] = [
  {
    name: "Art & Dine",
    href: "/art-dine",
    icon: Utensils,
    description: "Discover restaurants and dining experiences",
  },
  {
    name: "Venue Directory",
    href: "/venues",
    icon: Building,
    description: "Explore cultural venues and spaces",
  },
  {
    name: "Arts Groups",
    href: "/arts-groups",
    icon: Music,
    description: "Find local arts organizations",
  },
  {
    name: "Cultural News",
    href: "/news",
    icon: Newspaper,
    description: "Stay updated with arts and culture news",
  },
];

interface DiscoverMenuProps {
  variant?: "desktop" | "mobile";
}

export function DiscoverMenu({ variant = "desktop" }: DiscoverMenuProps) {
  if (variant === "mobile") {
    // Mobile: Render as simple links (will be used in mobile sheet menu)
    return (
      <div className="space-y-1">
        <div className="px-4 py-2">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Discover Culture
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Explore arts and culture</p>
        </div>
        {discoverItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-md mx-2"
            >
              <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Icon className="w-5 h-5 text-brand-blue" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  // Desktop: Dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex flex-col items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors group h-auto py-2 px-3">
          <div className="flex items-center justify-center mb-1">
            <Globe className="w-5 h-5" />
            <ChevronDown className="w-3 h-3 ml-1" />
          </div>
          <span className="text-xs font-medium">Discover Culture</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="w-72">
        <DropdownMenuLabel>
          <div className="py-1">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Discover Culture</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Explore arts and culture</p>
          </div>
        </DropdownMenuLabel>

        <div className="py-2">
          {discoverItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={item.name} asChild>
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950 transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
