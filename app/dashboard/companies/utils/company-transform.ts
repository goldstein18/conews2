import { CreateCompanyFormData } from "../lib/validations";
import { CompanyDetail, MarketOption } from "@/types/members";

/**
 * Transforms company API response data into form data format for editing
 */
export function transformCompanyToFormData(company: CompanyDetail): CreateCompanyFormData {
  return {
    // User information - use owner as the primary user
    users: [
      {
        name: `${company.owner?.firstName || ''} ${company.owner?.lastName || ''}`.trim() || '',
        email: company.owner?.email || '',
        role: 'owner' as const,
        isOwner: true,
      }
    ],
    
    // Company details
    companyName: company.name || '',
    companyEmail: company.email || '',
    companyPhone: company.phone || '',
    companyAddress: company.address || '',
    companyCity: company.city || '',
    companyState: company.state || '',
    companyZipcode: company.zipcode || '',
    companyNotes: '',
    
    // Additional fields
    hubspotId: undefined, // Not available in company detail response
    market: (company.owner?.market || 'miami') as MarketOption,
    planSlug: company.plan?.planSlug || '',
    checkPayment: company.benefits?.[0]?.checkPayment ?? true,
  };
}

/**
 * Helper to get initial form values - either default or transformed company data
 */
export function getInitialFormValues(companyData?: CompanyDetail): CreateCompanyFormData {
  if (companyData) {
    return transformCompanyToFormData(companyData);
  }
  
  // Return default values for create mode
  return {
    users: [
      {
        name: '',
        email: '',
        role: 'owner' as const,
        isOwner: true,
      }
    ],
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyZipcode: '',
    hubspotId: undefined,
    companyNotes: '',
    market: 'miami' as const,
    planSlug: '',
    checkPayment: true,
  };
}