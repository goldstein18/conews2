'use client';

import { Building2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Control, FieldValues } from 'react-hook-form';
import {
  TitleField,
  SummaryField,
  DescriptionField
} from './event-form-fields';
import { CompanySelectorField } from './company-selector-field';
import { useQuery } from '@apollo/client';
import { MY_COMPANY_PROFILE } from '@/lib/graphql/settings';
import { useAuthStore } from '@/store/auth-store';
import { isSuperAdmin, isAdmin } from '@/lib/roles';

interface EventBasicInfoCardProps {
  control: Control<FieldValues>;
  titleCharsLeft: number;
  summaryCharsLeft: number;
  canSelectCompany?: boolean;
}

export function EventBasicInfoCard({
  control,
  titleCharsLeft,
  summaryCharsLeft
}: EventBasicInfoCardProps) {
  const { user } = useAuthStore();
  const canSelectCompanyFlag = user && (isSuperAdmin(user) || isAdmin(user));

  // Get user's company profile (for members)
  const { data: companyData } = useQuery(MY_COMPANY_PROFILE, {
    skip: !!canSelectCompanyFlag,
    errorPolicy: 'all'
  });

  const userCompany = companyData?.myCompanyProfile;

  return (
    <>
      {/* Client Organization Panel - First Panel */}
      {canSelectCompanyFlag ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Client Organization</span>
            </CardTitle>
            <CardDescription>
              Select which client organization this event belongs to
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompanySelectorField control={control} />
          </CardContent>
        </Card>
      ) : userCompany ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Your Organization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Organization:</span> {userCompany.name}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                This event will be created for your organization
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Basic Information Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Start with the essential details about your event.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TitleField control={control} titleCharsLeft={titleCharsLeft} />
          <SummaryField control={control} summaryCharsLeft={summaryCharsLeft} />
          <DescriptionField control={control} />
        </CardContent>
      </Card>
    </>
  );
}