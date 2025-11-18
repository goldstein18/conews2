"use client";

import Link from "next/link";
import { Plus, Calendar, Image, Megaphone, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ScheduleItem {
  name: string;
  href: string;
  icon: typeof Calendar;
  description: string;
}

const scheduleItems: ScheduleItem[] = [
  {
    name: "Create Event",
    href: "/dashboard/events/create",
    icon: Calendar,
    description: "Schedule a new event",
  },
  {
    name: "Create Banner",
    href: "/dashboard/banners/create",
    icon: Image,
    description: "Create promotional banner",
  },
  {
    name: "Create Scoop",
    href: "/dashboard/news/create",
    icon: Megaphone,
    description: "Write a news article",
  },
];

interface ScheduleMenuProps {
  variant?: "desktop" | "mobile";
}

export function ScheduleMenu({ variant = "desktop" }: ScheduleMenuProps) {
  if (variant === "mobile") {
    // Mobile: Render as simple links
    return (
      <div className="space-y-1">
        <div className="px-4 py-2">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Create & Schedule
          </h3>
        </div>
        {scheduleItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-md mx-2"
            >
              <Icon className="w-5 h-5 text-brand-blue" />
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

  // Desktop: Dropdown menu for dashboard view
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full font-medium transition-colors">
          Create
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {scheduleItems.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem key={item.name} asChild>
              <Link href={item.href} className="flex items-center space-x-3 cursor-pointer py-3">
                <Icon className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                </div>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Alternative: Schedule menu for logged-in members (not dashboard view)
export function ScheduleButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex flex-col items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors group h-auto py-2 px-3">
          <div className="w-8 h-8 flex items-center justify-center mb-1">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium">Schedule</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="w-52">
        {scheduleItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem key={item.name} asChild>
              <Link href={item.href} className="flex items-center space-x-3 cursor-pointer py-3">
                <Icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
