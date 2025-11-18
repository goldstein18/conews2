import { LucideIcon } from 'lucide-react';
import { DashboardRole } from './user';

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon: LucideIcon;
  roles: DashboardRole[];
  children?: SubMenuItem[];
  badge?: string | number;
  isExpandable?: boolean;
  order: number;
}

export interface SubMenuItem {
  id: string;
  label: string;
  href: string;
  roles: DashboardRole[];
  permissions?: string[];
  badge?: string | number;
  order: number;
}

export interface MenuGroup {
  id: string;
  label?: string;
  items: MenuItem[];
  roles: DashboardRole[];
  order: number;
}

export interface MenuConfig {
  groups: MenuGroup[];
}

export interface MenuState {
  expandedItems: Set<string>;
  activeItem: string | null;
  activeParent: string | null;
}

export type MenuPermission = {
  canView: boolean;
  canExpand: boolean;
};