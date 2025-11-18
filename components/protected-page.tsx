'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoleAccess } from '@/hooks/use-role-access';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedPageProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  minimumRole?: string;
  fallbackPath?: string;
  showAccessDenied?: boolean;
  loadingComponent?: React.ReactNode;
  unauthorizedComponent?: React.ReactNode;
}

/**
 * Loading component for protected pages
 */
function DefaultLoadingComponent() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Verificando permisos...</p>
      </div>
    </div>
  );
}

/**
 * Default unauthorized component
 */
function DefaultUnauthorizedComponent({ 
  reason, 
  onGoBack 
}: { 
  reason: string | null; 
  onGoBack: () => void; 
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-red-900">
                Acceso Denegado
              </h3>
              <p className="text-sm text-muted-foreground">
                {reason || 'No tienes permisos para acceder a esta página.'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>
                Si crees que esto es un error, contacta al administrador del sistema.
              </span>
            </div>
            
            <Button 
              onClick={onGoBack}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Protected Page component that wraps content with role-based access control
 * 
 * @param props Configuration and content for the protected page
 */
export function ProtectedPage({
  children,
  requiredRoles,
  requiredPermissions,
  minimumRole,
  fallbackPath = '/dashboard',
  showAccessDenied = true,
  loadingComponent,
  unauthorizedComponent,
}: ProtectedPageProps) {
  const router = useRouter();
  
  const {
    hasAccess,
    isLoading,
    isAuthenticated,
    showUnauthorized,
    accessDeniedReason,
  } = useRoleAccess({
    requiredRoles,
    requiredPermissions,
    minimumRole,
    redirectPath: fallbackPath,
  });

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Redirect unauthorized users if not showing access denied message
  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasAccess && !showAccessDenied) {
      router.push(fallbackPath);
    }
  }, [isLoading, isAuthenticated, hasAccess, showAccessDenied, fallbackPath, router]);

  const handleGoBack = () => {
    router.push(fallbackPath);
  };

  // Show loading state
  if (isLoading) {
    return loadingComponent || <DefaultLoadingComponent />;
  }

  // Don't render anything for unauthenticated users (they're being redirected)
  if (!isAuthenticated) {
    return null;
  }

  // Show unauthorized message for authenticated but unauthorized users
  if (showUnauthorized && showAccessDenied) {
    return unauthorizedComponent || (
      <DefaultUnauthorizedComponent 
        reason={accessDeniedReason}
        onGoBack={handleGoBack}
      />
    );
  }

  // Show content only if user has access
  if (hasAccess) {
    return <>{children}</>;
  }

  // Default fallback - don't render anything
  return null;
}

/**
 * Higher-order component version of ProtectedPage
 * 
 * @param Component The component to protect
 * @param options Protection options
 * @returns Protected component
 */
export function withRoleProtection<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedPageProps, 'children'>
) {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const ProtectedComponent = (props: P) => {
    return (
      <ProtectedPage {...options}>
        <Component {...props} />
      </ProtectedPage>
    );
  };
  
  ProtectedComponent.displayName = `withRoleProtection(${displayName})`;
  
  return ProtectedComponent;
}

/**
 * Preset configurations for common protection scenarios
 * Now using permission-based access instead of just roles
 * Note: SUPER_ADMIN automatically bypasses all validations via the permission system
 */
export const ProtectionPresets = {
  SuperAdminOnly: { 
    requiredRoles: ['SUPER_ADMIN'] as string[]
    // Temporarily removed requiredPermissions until DB is configured
    // requiredPermissions: ['system:admin'] as string[]
  },
  AdminAndAbove: { 
    requiredRoles: ['SUPER_ADMIN', 'ADMIN'] as string[],
    requiredPermissions: ['user:manage', 'company:manage'] as string[]
    // SUPER_ADMIN bypasses permission validation automatically
  },
  CompanyManagement: {
    requiredRoles: ['SUPER_ADMIN', 'ADMIN'] as string[],
    requiredPermissions: ['company:read', 'company:manage'] as string[]
    // SUPER_ADMIN bypasses permission validation automatically
    // Access granted if user has required role OR required permissions
  },
  EmployeeManagement: {
    requiredRoles: ['SUPER_ADMIN', 'ADMIN'] as string[],
    requiredPermissions: ['user:read', 'user:manage'] as string[]
    // SUPER_ADMIN bypasses permission validation automatically
    // Access granted if user has required role OR required permissions
  },
  AuditLogs: { 
    requiredRoles: ['SUPER_ADMIN'] as string[],
    requiredPermissions: ['audit:read'] as string[]
    // SUPER_ADMIN bypasses permission validation automatically
  },
  CalendarAccess: { 
    requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'CALENDAR_MEMBER'] as string[],
    requiredPermissions: ['event:read', 'event:manage'] as string[]
  },
  DiningAccess: { 
    requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'DINNING_MEMBER'] as string[],
    requiredPermissions: ['restaurant:read', 'restaurant:manage'] as string[]
  },
  SalesAccess: { 
    requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'SALES'] as string[],
    requiredPermissions: ['sale:read', 'sale:manage'] as string[]
  },
  AgencyAccess: { 
    requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'AGENCY'] as string[],
    requiredPermissions: ['agency:read', 'agency:manage'] as string[]
  },
  EditorialAccess: { 
    requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITORIAL_WRITER'] as string[],
    requiredPermissions: ['article:read', 'article:manage'] as string[]
  },
};

/**
 * Quick protection components for common scenarios
 */
export const SuperAdminPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedPage {...ProtectionPresets.SuperAdminOnly}>
    {children}
  </ProtectedPage>
);

export const AdminPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedPage {...ProtectionPresets.AdminAndAbove}>
    {children}
  </ProtectedPage>
);

export const CompanyManagementPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedPage {...ProtectionPresets.CompanyManagement}>
    {children}
  </ProtectedPage>
);

export const EmployeeManagementPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedPage {...ProtectionPresets.EmployeeManagement}>
    {children}
  </ProtectedPage>
);

export const AuditPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedPage {...ProtectionPresets.AuditLogs}>
    {children}
  </ProtectedPage>
);