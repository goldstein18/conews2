import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem, MenuGroup, MenuState } from '@/types/menu';
import { 
  getMenuItemsByRole, 
  getMenuGroupsByRole, 
  getAdminMenuByRole,
  getMenuItemsByUser,
  getMenuGroupsByUser,
  getAdminMenuByUser
} from '@/lib/menu-config';
import { DashboardRole, User } from '@/types/user';

interface MenuStore extends MenuState {
  // State
  menuItems: MenuItem[];
  menuGroups: MenuGroup[];
  adminMenuGroup: MenuGroup | null;
  isLoading: boolean;
  
  // Actions
  loadMenusForRole: (roleName?: string) => void;
  loadMenusForUser: (user: User | null) => void;
  toggleExpanded: (itemId: string) => void;
  setActiveItem: (itemId: string | null, parentId?: string | null) => void;
  isItemExpanded: (itemId: string) => boolean;
  collapseAll: () => void;
  expandAll: () => void;
  
  // Getters
  getExpandedItems: () => string[];
  getVisibleMenuItems: () => MenuItem[];
  findMenuItemByHref: (href: string) => MenuItem | null;
  findParentByChildHref: (href: string) => MenuItem | null;
}

export const useMenuStore = create<MenuStore>()(
  persist(
    (set, get) => ({
      // Initial state
      expandedItems: new Set<string>(),
      activeItem: null,
      activeParent: null,
      menuItems: [],
      menuGroups: [],
      adminMenuGroup: null,
      isLoading: false,

      // Actions
      loadMenusForRole: (roleName?: string) => {
        set({ isLoading: true });
        
        try {
          const menuItems = getMenuItemsByRole(roleName);
          const menuGroups = getMenuGroupsByRole(roleName);
          const adminMenuGroup = getAdminMenuByRole(roleName);
          
          set({
            menuItems,
            menuGroups,
            adminMenuGroup,
            isLoading: false,
          });
          
          // Auto-expand items that have active children
          const currentPath = window.location.pathname;
          const parentItem = get().findParentByChildHref(currentPath);
          
          if (parentItem) {
            get().toggleExpanded(parentItem.id);
            get().setActiveItem(null, parentItem.id);
          }
        } catch (error) {
          console.error('Error loading menus:', error);
          set({ isLoading: false });
        }
      },

      loadMenusForUser: (user: User | null) => {
        set({ isLoading: true });
        
        try {
          const menuItems = getMenuItemsByUser(user);
          const menuGroups = getMenuGroupsByUser(user);
          const adminMenuGroup = getAdminMenuByUser(user);
          
          set({
            menuItems,
            menuGroups,
            adminMenuGroup,
            isLoading: false,
          });
          
          // Auto-expand items that have active children
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const parentItem = get().findParentByChildHref(currentPath);
            
            if (parentItem && !get().isItemExpanded(parentItem.id)) {
              get().toggleExpanded(parentItem.id);
              get().setActiveItem(null, parentItem.id);
            }
          }
        } catch (error) {
          console.error('Error loading menus for user:', error);
          set({ isLoading: false });
        }
      },

      toggleExpanded: (itemId: string) => {
        set((state) => {
          const newExpandedItems = new Set(state.expandedItems);
          
          if (newExpandedItems.has(itemId)) {
            newExpandedItems.delete(itemId);
          } else {
            newExpandedItems.add(itemId);
          }
          
          return { expandedItems: newExpandedItems };
        });
      },

      setActiveItem: (itemId: string | null, parentId?: string | null) => {
        set({
          activeItem: itemId,
          activeParent: parentId || null,
        });
      },

      isItemExpanded: (itemId: string) => {
        return get().expandedItems.has(itemId);
      },

      collapseAll: () => {
        set({ expandedItems: new Set() });
      },

      expandAll: () => {
        const { menuItems } = get();
        const expandableItems = menuItems
          .filter(item => item.isExpandable && item.children?.length)
          .map(item => item.id);
        
        set({ expandedItems: new Set(expandableItems) });
      },

      // Getters
      getExpandedItems: () => {
        return Array.from(get().expandedItems);
      },

      getVisibleMenuItems: () => {
        return get().menuItems;
      },

      findMenuItemByHref: (href: string) => {
        const { menuItems } = get();
        
        // Check main items first
        for (const item of menuItems) {
          if (item.href === href) {
            return item;
          }
          
          // Check children
          if (item.children) {
            for (const child of item.children) {
              if (child.href === href) {
                return {
                  ...item,
                  id: child.id,
                  label: child.label,
                  href: child.href,
                };
              }
            }
          }
        }
        
        return null;
      },

      findParentByChildHref: (href: string) => {
        const { menuItems } = get();
        
        for (const item of menuItems) {
          if (item.children) {
            for (const child of item.children) {
              if (child.href === href) {
                return item;
              }
            }
          }
        }
        
        return null;
      },
    }),
    {
      name: 'menu-storage',
      partialize: (state) => ({
        expandedItems: Array.from(state.expandedItems), // Convert Set to Array for persistence
        activeItem: state.activeItem,
        activeParent: state.activeParent,
      }),
      onRehydrateStorage: () => (state) => {
        // Convert persisted array back to Set
        if (state && Array.isArray(state.expandedItems)) {
          state.expandedItems = new Set(state.expandedItems);
        }
      },
    }
  )
);