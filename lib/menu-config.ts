import {
  Home,
  Calendar,
  Settings,
  Building2,
  Users,
  ScanEye,
  ShieldCheck,
  Tags,
  MapPin,
  Image,
  Utensils,
  BarChart3,
  NewspaperIcon,
  Mail,
  Palette,
  Monitor,
  Headphones,
  Bell,
  UserCog,
} from 'lucide-react';
import { MenuConfig, MenuItem, MenuGroup } from '@/types/menu';
import { DashboardRole } from '@/types/user';
import { hasAnyRole, canManageCompanies, canManageEmployees, canViewAuditLogs, isSuperAdmin } from '@/lib/roles';
import type { User } from '@/types/user';

// Menu items configuration
const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER', 'DINNING_MEMBER'],
    order: 1,
  },
//   {
//     id: 'users',
//     label: 'Users',
//     icon: Users,
//     roles: ['SUPER_ADMIN', 'ADMIN'],
//     isExpandable: true,
//     order: 2,
//     children: [
//       {
//         id: 'users-list',
//         label: 'All Users',
//         href: '/dashboard/users',
//         roles: ['SUPER_ADMIN', 'ADMIN'],
//         order: 1,
//       },
//       {
//         id: 'users-roles',
//         label: 'Roles & Permissions',
//         href: '/dashboard/users/roles',
//         roles: ['SUPER_ADMIN'],
//         order: 2,
//       },
//       {
//         id: 'users-invites',
//         label: 'Invitations',
//         href: '/dashboard/users/invites',
//         roles: ['SUPER_ADMIN', 'ADMIN'],
//         order: 3,
//       },
//     ],
//   },
  {
    id: 'events',
    label: 'Events',
    href: '/dashboard/events',
    icon: Calendar,
    roles: ['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER', 'DINNING_MEMBER'],
    isExpandable: false,
    order: 3,
  },
  {
    id: 'venues',
    label: 'Venues',
    href: '/dashboard/venues',
    icon: MapPin,
    roles: ['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER', 'DINNING_MEMBER'],
    isExpandable: false,
    order: 4,
  },
  {
    id: 'restaurants',
    label: 'Restaurants',
    href: '/dashboard/restaurants',
    icon: Utensils,
    roles: ['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER', 'DINNING_MEMBER'],
    isExpandable: false,
    order: 4.5,
  },
  {
    id: 'arts-groups',
    label: 'Arts Groups',
    href: '/dashboard/arts-groups',
    icon: Palette,
    roles: ['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER', 'DINNING_MEMBER'],
    isExpandable: false,
    order: 4.7,
  },
//   {
//     id: 'agencies',
//     label: 'Agencies',
//     icon: Building,
//     roles: ['SUPER_ADMIN', 'ADMIN'],
//     isExpandable: true,
//     order: 5,
//     children: [
//       {
//         id: 'agencies-list',
//         label: 'All Agencies',
//         href: '/dashboard/agencies',
//         roles: ['SUPER_ADMIN', 'ADMIN'],
//         order: 1,
//       },
//       {
//         id: 'agencies-contracts',
//         label: 'Contracts',
//         href: '/dashboard/agencies/contracts',
//         roles: ['SUPER_ADMIN', 'ADMIN'],
//         order: 2,
//       },
//     ],
//   },
  {
    id: 'banners',
    label: 'Banners',
    href: '/dashboard/banners',
    icon: Image,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    isExpandable: false,
    order: 5,
  },
  {
    id: 'marquee',
    label: 'Marquee',
    href: '/dashboard/marquee',
    icon: Monitor,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    isExpandable: false,
    order: 5.3,
  },
  {
    id: 'escoop-entries',
    label: 'Escoop Entries',
    href: '/dashboard/escoop-entries',
    icon: Mail,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    isExpandable: false,
    order: 5.5,
  },
  {
    id: 'support',
    label: 'Support Tickets',
    href: '/dashboard/support',
    icon: Headphones,
    roles: ['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER', 'DINNING_MEMBER'],
    isExpandable: false,
    order: 6,
  },
  {
    id: 'companies',
    label: 'Companies',
    href: '/dashboard/companies',
    icon: Building2,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    isExpandable: false,
    order: 11,
  },
  {
    id: 'employees',
    label: 'Employees',
    href: '/dashboard/employees',
    icon: Users,
    roles: ['SUPER_ADMIN'],
    isExpandable: false,
    order: 12,
  },
  {
    id: 'plans',
    label: 'Plans',
    href: '/dashboard/plans',
    icon: Settings,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    isExpandable: false,
    order: 13,
  },
  {
    id: 'news',
    label: 'News',
    href: '/dashboard/news',
    icon: NewspaperIcon,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    isExpandable: false,
    order: 13,
  },
  {
    id: 'audits',
    label: 'Audits',
    href: '/dashboard/audit',
    icon: ScanEye,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    isExpandable: false,
    order: 13,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    roles: ['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER', 'DINNING_MEMBER'],
    isExpandable: true,
    order: 13.3,
    children: [
      {
        id: 'all-notifications',
        label: 'All Notifications',
        href: '/dashboard/notifications',
        roles: ['SUPER_ADMIN', 'ADMIN'],
        permissions: ['notification:broadcast'],
        order: 1,
      },
      {
        id: 'my-notifications',
        label: 'My Notifications',
        href: '/dashboard/notifications/my-notifications',
        roles: ['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER', 'DINNING_MEMBER'],
        permissions: ['notification:read'],
        order: 2,
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    href: '/dashboard/reports',
    icon: BarChart3,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    isExpandable: false,
    order: 13.5,
  },
  {
    id: 'roles-management',
    label: 'Roles & Permissions',
    href: '/dashboard/roles-management',
    icon: ShieldCheck,
    roles: ['SUPER_ADMIN'],
    isExpandable: false,
    order: 14,
  },
  {
    id: 'impersonate',
    label: 'Impersonate User',
    href: '/dashboard/impersonate',
    icon: UserCog,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    isExpandable: false,
    order: 14.5,
  },
  {
    id: 'tags',
    label: 'Tags Management',
    href: '/dashboard/tags',
    icon: Tags,
    roles: ['SUPER_ADMIN'],
    isExpandable: false,
    order: 15,
  },
  {
    id: 'escoops',
    label: 'Escoops',
    href: '/dashboard/escoops',
    icon: Mail,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    isExpandable: false,
    order: 16,
  },
  {
    id: 'dedicated',
    label: 'Dedicated Campaigns',
    href: '/dashboard/dedicated',
    icon: Mail,
    roles: ['SUPER_ADMIN', 'ADMIN'],
    isExpandable: false,
    order: 17,
  },
];

// Group configuration
const menuGroups: MenuGroup[] = [
  {
    id: 'main',
    label: undefined, // No label for main group
    items: menuItems.filter(item =>
      ['dashboard', 'users', 'events', 'venues', 'restaurants', 'arts-groups', 'agencies', 'banners', 'marquee', 'escoop-entries', 'support', 'notifications'].includes(item.id)
    ),
    roles: ['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER', 'DINNING_MEMBER'],
    order: 1,
  },
];

// Admin items configuration - easily configurable
const ADMIN_MENU_ITEMS = ['companies', 'employees', 'news', 'audits', 'reports', 'plans', 'roles-management', 'impersonate', 'tags', 'escoops', 'dedicated'];

// Separate admin items for footer
const adminMenuItems: MenuGroup = {
  id: 'admin',
  label: 'Administration',
  items: menuItems
    .filter(item => ADMIN_MENU_ITEMS.includes(item.id))
    .sort((a, b) => a.order - b.order),
  roles: ['SUPER_ADMIN', 'ADMIN'],
  order: 1,
};

export const menuConfig: MenuConfig = {
  groups: menuGroups,
};

// Helper functions
export const getMenuItemsByRole = (roleName?: string): MenuItem[] => {
  if (!roleName) return [];
  
  const role = roleName as DashboardRole;
  const items: MenuItem[] = [];
  
  menuConfig.groups.forEach(group => {
    if (group.roles.includes(role)) {
      group.items.forEach(item => {
        if (item.roles.includes(role)) {
          // Filter children based on role
          const filteredItem = {
            ...item,
            children: item.children?.filter(child => 
              child.roles.includes(role)
            ).sort((a, b) => a.order - b.order)
          };
          items.push(filteredItem);
        }
      });
    }
  });
  
  return items.sort((a, b) => a.order - b.order);
};

export const getMenuGroupsByRole = (roleName?: string): MenuGroup[] => {
  if (!roleName) return [];
  
  const role = roleName as DashboardRole;
  
  return menuConfig.groups
    .filter(group => group.roles.includes(role))
    .map(group => ({
      ...group,
      items: group.items
        .filter(item => item.roles.includes(role))
        .map(item => ({
          ...item,
          children: item.children?.filter(child => 
            child.roles.includes(role)
          ).sort((a, b) => a.order - b.order)
        }))
        .sort((a, b) => a.order - b.order)
    }))
    .sort((a, b) => a.order - b.order);
};

export const getAdminMenuByRole = (roleName?: string): MenuGroup | null => {
  if (!roleName) return null;
  
  const role = roleName as DashboardRole;
  
  if (!adminMenuItems.roles.includes(role)) {
    return null;
  }
  
  return {
    ...adminMenuItems,
    items: adminMenuItems.items
      .filter(item => item.roles.includes(role))
      .map(item => ({
        ...item,
        children: item.children?.filter(child => 
          child.roles.includes(role)
        ).sort((a, b) => a.order - b.order)
      }))
      .sort((a, b) => a.order - b.order)
  };
};

/**
 * Enhanced menu filtering using the new permission system
 */
export const getMenuItemsByUser = (user: User | null): MenuItem[] => {
  if (!user?.role?.name) return [];
  
  // SUPER_ADMIN sees ALL menu items without any filtering
  if (isSuperAdmin(user)) {
    const allItems: MenuItem[] = [];
    menuConfig.groups.forEach(group => {
      group.items.forEach(item => {
        const fullItem: MenuItem = {
          ...item,
          children: item.children?.sort((a, b) => a.order - b.order)
        };
        allItems.push(fullItem);
      });
    });
    return allItems.sort((a, b) => a.order - b.order);
  }
  
  const items: MenuItem[] = [];
  
  menuConfig.groups.forEach(group => {
    if (hasAnyRole(user, group.roles)) {
      group.items.forEach(item => {
        // Check if user has role access for this item
        if (hasAnyRole(user, item.roles)) {
          // Additional permission-based filtering for specific items
          let shouldInclude = true;
          
          // Companies page requires company management permissions
          if (item.id === 'companies' && !canManageCompanies(user)) {
            shouldInclude = false;
          }
          
          // Employees page requires employee management permissions
          if (item.id === 'employees' && !canManageEmployees(user)) {
            shouldInclude = false;
          }
          
          // Audit page requires audit viewing permissions
          if (item.id === 'audits' && !canViewAuditLogs(user)) {
            shouldInclude = false;
          }
          
          if (shouldInclude) {
            // Filter children based on role and permissions
            const filteredItem = {
              ...item,
              children: item.children?.filter(child => {
                return hasAnyRole(user, child.roles);
              }).sort((a, b) => a.order - b.order)
            };
            items.push(filteredItem);
          }
        }
      });
    }
  });
  
  return items.sort((a, b) => a.order - b.order);
};

export const getMenuGroupsByUser = (user: User | null): MenuGroup[] => {
  if (!user?.role?.name) return [];
  
  // SUPER_ADMIN sees ALL menu groups without any filtering
  if (isSuperAdmin(user)) {
    return menuConfig.groups.map(group => ({
      ...group,
      items: group.items.map(item => ({
        ...item,
        children: item.children?.sort((a, b) => a.order - b.order)
      })).sort((a, b) => a.order - b.order)
    })).sort((a, b) => a.order - b.order);
  }
  
  return menuConfig.groups
    .filter(group => hasAnyRole(user, group.roles))
    .map(group => ({
      ...group,
      items: group.items
        .filter(item => {
          if (!hasAnyRole(user, item.roles)) return false;
          
          // Apply permission-based filtering
          if (item.id === 'companies' && !canManageCompanies(user)) return false;
          if (item.id === 'employees' && !canManageEmployees(user)) return false;
          if (item.id === 'audits' && !canViewAuditLogs(user)) return false;
          
          return true;
        })
        .map(item => ({
          ...item,
          children: item.children?.filter(child => 
            hasAnyRole(user, child.roles)
          ).sort((a, b) => a.order - b.order)
        }))
        .sort((a, b) => a.order - b.order)
    }))
    .filter(group => group.items.length > 0) // Remove empty groups
    .sort((a, b) => a.order - b.order);
};

export const getAdminMenuByUser = (user: User | null): MenuGroup | null => {
  if (!user?.role?.name) return null;
  
  // SUPER_ADMIN sees ALL admin menu items without filtering
  if (isSuperAdmin(user)) {
    return {
      ...adminMenuItems,
      items: adminMenuItems.items.map(item => ({
        ...item,
        children: item.children?.sort((a, b) => a.order - b.order)
      })).sort((a, b) => a.order - b.order)
    };
  }
  
  if (!hasAnyRole(user, adminMenuItems.roles)) {
    return null;
  }
  
  const filteredItems = adminMenuItems.items
    .filter(item => {
      if (!hasAnyRole(user, item.roles)) return false;
      
      // Apply permission-based filtering
      if (item.id === 'companies' && !canManageCompanies(user)) return false;
      if (item.id === 'employees' && !canManageEmployees(user)) return false;
      if (item.id === 'audits' && !canViewAuditLogs(user)) return false;
      
      return true;
    })
    .map(item => ({
      ...item,
      children: item.children?.filter(child => 
        hasAnyRole(user, child.roles)
      ).sort((a, b) => a.order - b.order)
    }))
    .sort((a, b) => a.order - b.order);
  
  if (filteredItems.length === 0) return null;
  
  return {
    ...adminMenuItems,
    items: filteredItems
  };
};