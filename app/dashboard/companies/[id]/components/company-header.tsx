"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompanyDetail } from "@/types/members";
import { useImpersonationActions } from "@/app/dashboard/impersonate/hooks/use-impersonation-actions";

interface CompanyHeaderProps {
  company: CompanyDetail;
  loading?: boolean;
}

export function CompanyHeader({ company, loading }: CompanyHeaderProps) {
  const router = useRouter();
  const { startImpersonation, loading: impersonating } = useImpersonationActions();
  const [isImpersonating, setIsImpersonating] = useState(false);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-10 w-20 bg-gray-200 rounded"></div>
            <div className="h-10 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'SUSPENDED':
        return 'destructive';
      case 'CANCELLED':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatLocation = () => {
    const parts = [];
    if (company.city) parts.push(company.city);
    if (company.state) parts.push(company.state);
    return parts.join(', ') || 'Location not specified';
  };

  const handleEditClick = () => {
    router.push(`/dashboard/companies/${company.id}/edit`);
  };

  const handleImpersonateClick = async () => {
    if (!company.owner?.id) {
      return;
    }

    setIsImpersonating(true);
    try {
      await startImpersonation(
        company.owner.id,
        `Impersonating company owner: ${company.name}`
      );
    } finally {
      setIsImpersonating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Link 
        href="/dashboard/companies" 
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {company.name}
            </h1>
            <Badge variant={getStatusVariant(company.status)}>
              {company.status}
            </Badge>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <div>{formatLocation()}</div>
            <div>
              {company.plan.plan} • Member since {new Date(company.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleEditClick}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleImpersonateClick}
            disabled={isImpersonating || impersonating || !company.owner?.id}
          >
            {(isImpersonating || impersonating) && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            )}
            {!isImpersonating && !impersonating && <UserCheck className="h-4 w-4 mr-2" />}
            {isImpersonating || impersonating ? 'Impersonating...' : 'Impersonate'}
          </Button>
        </div>
      </div>
    </div>
  );
}