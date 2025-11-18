"use client";

import { useParams } from "next/navigation";
import { CompanyDetail } from "@/types/members";
import { useCompanyDetail } from "./hooks";
import { 
  CompanyHeader, 
  CompanyOverview, 
  CompanyStats, 
  CompanyMembers 
} from "./components";

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id as string;

  const { company, loading, error } = useCompanyDetail({ companyId });

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading company: {error.message}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <CompanyHeader company={{} as CompanyDetail} loading={true} />
        <CompanyStats company={{} as CompanyDetail} loading={true} />
        <CompanyOverview company={{} as CompanyDetail} loading={true} />
        <CompanyMembers company={{} as CompanyDetail} loading={true} />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex h-96 items-center justify-center p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Company not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <CompanyHeader company={company} />

      {/* Statistics Cards */}
      <CompanyStats company={company} />

      {/* Organization Details & Primary Contact */}
      <CompanyOverview company={company} />

      {/* Organization Members */}
      <CompanyMembers company={company} />
    </div>
  );
}