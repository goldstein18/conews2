import { useQuery } from '@apollo/client';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { gql } from '@apollo/client';
import { Loader2, Building2 } from 'lucide-react';
import type { Control, FieldValues, Path } from 'react-hook-form';

const GET_ALL_COMPANIES_FOR_DROPDOWN = gql`
  query GetAllCompanies {
    companies {
      id
      name
      status
    }
  }
`;

interface Company {
  id: string;
  name: string;
  status: string;
}

interface FormWithCompanyId extends FieldValues {
  companyId?: string;
}

interface CompanySelectorFieldProps<T extends FormWithCompanyId = FormWithCompanyId> {
  control: Control<T>;
}

export function CompanySelectorField<T extends FormWithCompanyId = FormWithCompanyId>({ control }: CompanySelectorFieldProps<T>) {
  const { data, loading, error } = useQuery(GET_ALL_COMPANIES_FOR_DROPDOWN, {
    errorPolicy: 'all'
  });

  const companies = data?.companies || [];

  return (
    <FormField
      control={control}
      name={"companyId" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Client Organization *</span>
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || ''}
            key={`company-select-${field.value}`}
          >
            <FormControl>
              <SelectTrigger>
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading companies...
                  </div>
                ) : (
                  <SelectValue placeholder="Select a client organization" />
                )}
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {companies.map((company: Company) => (
                <SelectItem key={company.id} value={company.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{company.name}</span>
                    <span className={`ml-2 text-xs px-2 py-1 rounded ${
                      company.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      company.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {company.status}
                    </span>
                  </div>
                </SelectItem>
              ))}
              {companies.length === 0 && !loading && (
                <SelectItem disabled value="no-companies">
                  No companies found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {error && (
            <p className="text-sm text-red-600">
              Error loading companies: {error.message}
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}