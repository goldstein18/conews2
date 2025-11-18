import { Employee } from '@/types/employees';
import { MARKET_LABELS, ROLE_LABELS } from '@/types/employees';

export function formatEmployeeName(employee: Employee): string {
  return `${employee.firstName} ${employee.lastName}`.trim();
}

export function formatEmployeeMarkets(markets: Employee['employeeMarkets']): string {
  if (!markets || markets.length === 0) return '-';
  
  return markets
    .map(m => MARKET_LABELS[m.market] || m.market)
    .join(', ');
}

export function formatEmployeeRole(role?: Employee['role']): string {
  if (!role) return 'No Role';
  return ROLE_LABELS[role.name] || role.name;
}

export function getDefaultMarket(markets: Employee['employeeMarkets']): string | undefined {
  const defaultMarket = markets?.find(m => m.isDefault);
  return defaultMarket?.market;
}

export function canEmployeeManageMarket(
  markets: Employee['employeeMarkets'], 
  market: string, 
  action: 'create' | 'edit' | 'view' = 'view'
): boolean {
  const employeeMarket = markets?.find(m => m.market === market);
  if (!employeeMarket) return false;
  
  switch (action) {
    case 'create':
      return employeeMarket.canCreate;
    case 'edit':
      return employeeMarket.canEdit;
    case 'view':
      return employeeMarket.canView;
    default:
      return false;
  }
}

export function getEmployeeStatusBadgeVariant(isActive: boolean): "default" | "secondary" {
  return isActive ? "default" : "secondary";
}

export function getEmployeeStatusLabel(isActive: boolean): string {
  return isActive ? "Active" : "Inactive";
}