"use client";

import { useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CompanyDetail } from "@/types/members";
import { PlanHistoryModal } from "./plan-history-modal";

interface CompanyEditHeaderProps {
  company: CompanyDetail;
  onBack: () => void;
  onToggleStatus?: (active: boolean) => void;
}

export function CompanyEditHeader({
  company,
  onBack,
  onToggleStatus
}: CompanyEditHeaderProps) {
  const [isActive, setIsActive] = useState(company.status === 'ACTIVE');
  const [showPlanHistory, setShowPlanHistory] = useState(false);

  const handleStatusToggle = (checked: boolean) => {
    setIsActive(checked);
    onToggleStatus?.(checked);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'SUSPENDED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-6 py-4">
        {/* Back button row */}
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Company</span>
          </Button>
        </div>

        {/* Main header content */}
        <div className="flex items-center justify-between">
          {/* Left side - Company info */}
          <div className="flex items-center space-x-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold">Edit {company.name}</h1>
                <Badge variant={getStatusBadgeColor(company.status)}>
                  {company.status}
                </Badge>
                <Switch
                  checked={isActive}
                  onCheckedChange={handleStatusToggle}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
              
              <div className="mt-1">
                <p className="text-lg text-gray-600">{company.plan?.plan || 'No Plan'}</p>
              </div>
              
              <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
                <span>
                  Expires: {formatDate(company.benefits?.[0]?.endDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="flex items-center space-x-2"
            >
              <span className="w-4 h-4 rounded-full bg-orange-500"></span>
              <span>Impersonate</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center space-x-2"
              onClick={() => setShowPlanHistory(true)}
            >
              <Eye className="h-4 w-4" />
              <span>View Plan History</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Plan History Modal */}
      <PlanHistoryModal
        isOpen={showPlanHistory}
        onClose={() => setShowPlanHistory(false)}
        companyId={company.id}
        companyName={company.name}
      />
    </div>
  );
}