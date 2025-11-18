"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  ChevronDown,
  ChevronRight,
  User,
  Settings,
  LogOut,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth-store";
import { useMenuStore } from "@/store/menu-store";
import { cn } from "@/lib/utils";
import { MenuItem, SubMenuItem } from "@/types/menu";

interface DashboardSidebarProps {
  onClose?: () => void;
  className?: string;
}

interface MenuItemComponentProps {
  item: MenuItem;
  pathname: string;
  onClose?: () => void;
}

interface SubMenuItemProps {
  item: SubMenuItem;
  parentId: string;
  pathname: string;
  onClose?: () => void;
}

const SubMenuItemComponent = ({ item, pathname, onClose }: Omit<SubMenuItemProps, 'parentId'>) => {
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ml-6",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <div className="h-2 w-2 rounded-full bg-current opacity-60" />
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded">
          {item.badge}
        </span>
      )}
    </Link>
  );
};

const MenuItemComponent = ({ item, pathname, onClose }: MenuItemComponentProps) => {
  const { isItemExpanded, toggleExpanded, setActiveItem } = useMenuStore();
  const isExpanded = isItemExpanded(item.id);
  const isActive = pathname === item.href;
  const hasActiveChild = item.children?.some(child => pathname === child.href);
  const shouldShowAsActive = isActive || hasActiveChild;

  const handleClick = (e: React.MouseEvent) => {
    if (item.isExpandable && item.children?.length) {
      e.preventDefault();
      toggleExpanded(item.id);
      
      if (hasActiveChild) {
        setActiveItem(null, item.id);
      }
    } else if (item.href) {
      setActiveItem(item.id);
      onClose?.();
    }
  };

  const Icon = item.icon;
  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

  return (
    <div>
      {item.href && !item.isExpandable ? (
        <Link
          href={item.href}
          onClick={onClose}
          className={cn(
            "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            shouldShowAsActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded">
              {item.badge}
            </span>
          )}
        </Link>
      ) : (
        <button
          onClick={handleClick}
          className={cn(
            "flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            shouldShowAsActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span className="text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded">
              {item.badge}
            </span>
          )}
          {item.isExpandable && item.children?.length && (
            <ChevronIcon className="h-4 w-4" />
          )}
        </button>
      )}
      
      {/* Submenu */}
      {item.isExpandable && item.children?.length && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children.map((child) => (
            <SubMenuItemComponent
              key={child.id}
              item={child}
              pathname={pathname}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function DashboardSidebar({ onClose, className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, isLoggingOut, logout } = useAuthStore();
  const { menuGroups, adminMenuGroup, loadMenusForUser, setActiveItem, findParentByChildHref } = useMenuStore();

  useEffect(() => {
    // Use the new permission-based menu loading
    loadMenusForUser(user);
  }, [user, loadMenusForUser]);

  useEffect(() => {
    // Set active menu item based on current pathname
    const parentItem = findParentByChildHref(pathname);
    if (parentItem) {
      setActiveItem(null, parentItem.id);
    } else {
      // Find direct match
      for (const group of menuGroups) {
        for (const item of group.items) {
          if (item.href === pathname) {
            setActiveItem(item.id);
            break;
          }
        }
      }
    }
  }, [pathname, menuGroups, setActiveItem, findParentByChildHref]);

  const handleLogout = () => {
    logout(); // This will handle the redirect internally
  };

  const userInitials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className={cn("flex h-full flex-col bg-card border-r", className)}>
      {/* Logo/Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">E</span>
          </div>
          <span className="text-xl font-semibold">Events</span>
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Main Navigation - Scrollable */}
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.id} className="space-y-1">
            {group.label && (
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.label}
                </h3>
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <MenuItemComponent
                  key={item.id}
                  item={item}
                  pathname={pathname}
                  onClose={onClose}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Administration Footer - Sticky */}
      {adminMenuGroup && (
        <div className="border-t p-4">
          <div className="space-y-1">
            {adminMenuGroup.label && (
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {adminMenuGroup.label}
                </h3>
              </div>
            )}
            <div className="space-y-1">
              {adminMenuGroup.items.map((item) => (
                <MenuItemComponent
                  key={item.id}
                  item={item}
                  pathname={pathname}
                  onClose={onClose}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User section */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user?.avatar || user?.profilePhotoUrl || undefined} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-muted-foreground">{user?.role?.name}</p>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            {/* Settings - only show for users with company access */}
            {user?.role?.name !== 'SUPER_ADMIN' && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Signing Out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}