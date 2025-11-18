import { useQuery } from '@apollo/client';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { gql } from '@apollo/client';
import { Loader2 } from 'lucide-react';
import type { Control, FieldValues } from 'react-hook-form';

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

interface CompanySelectorFieldProps {
  control: Control<FieldValues>;
}

export function CompanySelectorField({ control }: CompanySelectorFieldProps) {
  const { data, loading, error } = useQuery(GET_ALL_COMPANIES_FOR_DROPDOWN, {
    errorPolicy: 'all'
  });

  const companies = data?.companies || [];

  return (
    <FormField
      control={control}
      name="companyId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Client Organization *</FormLabel>
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
                  {company.name} ({company.status})
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