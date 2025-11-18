import { Role } from './user';

export interface EmployeeMarket {
  id: string;
  market: string;
  canCreate: boolean;
  canEdit: boolean;
  canView: boolean;
  isDefault: boolean;
}

export interface EmployeeProfile {
  id: string;
  department?: string;
  position?: string;
  hireDate?: string;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  employee: boolean;
  role?: Role;
  employeeMarkets: EmployeeMarket[];
  employeeProfile?: EmployeeProfile;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string | null;
}

export interface EmployeesPaginated {
  edges: {
    node: Employee;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
    totalCount?: number;
  };
}

export interface EmployeeFilters {
  role?: string;
  market?: string;
  department?: string;
  isActive?: boolean;
}

export interface CreateEmployeeInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  markets: string[];
  defaultMarket: string;
  department?: string;
  position?: string;
}

export interface UpdateEmployeeInput {
  firstName?: string;
  lastName?: string;
  role?: string;
  department?: string;
  position?: string;
  isActive?: boolean;
  markets?: string[];
  defaultMarket?: string;
}

export interface SetEmployeeMarketsInput {
  userId: string;
  markets: {
    market: string;
    canCreate: boolean;
    canEdit: boolean;
    isDefault: boolean;
  }[];
}

// GraphQL Variables types
export interface CreateEmployeeMutationVariables {
  createEmployeeInput: CreateEmployeeInput;
}

export interface UpdateEmployeeMutationVariables {
  id: string;
  updateEmployeeInput: UpdateEmployeeInput;
}

export interface ToggleEmployeeStatusVariables {
  id: string;
  isActive: boolean;
}


export const AVAILABLE_MARKETS = [
  'atlanta',
  'miami',
  'palm-beach',
  'tampa'
] as const;

export const MARKET_LABELS: Record<string, string> = {
  'atlanta': 'Atlanta',
  'miami': 'Miami / Ft. Lauderdale',
  'palm-beach': 'Palm Beach',
  'tampa': 'Tampa / St. Pete'
};

export const EMPLOYEE_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'SALES',
  'EDITORIAL_WRITER'
] as const;

export const ROLE_LABELS: Record<string, string> = {
  'SUPER_ADMIN': 'Super Admin',
  'ADMIN': 'Admin',
  'SALES': 'Sales',
  'EDITORIAL_WRITER': 'Editorial Writer'
};

// GraphQL response types
export interface EmployeesResponse {
  employeesPaginated: EmployeesPaginated;
}

export interface EmployeesVariables {
  first?: number;
  after?: string;
}

export interface EmployeeResponse {
  employee: Employee;
}

export interface EmployeeVariables {
  id: string;
}