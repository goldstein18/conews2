"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Building, User } from "lucide-react";
import { CompanyDetail } from "@/types/members";

interface CompanyOverviewProps {
  company: CompanyDetail;
  loading?: boolean;
}

export function CompanyOverview({ company, loading }: CompanyOverviewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-40 bg-gray-200 rounded"></div>
            <div className="h-4 w-56 bg-gray-200 rounded"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatAddress = () => {
    const parts = [];
    if (company.address) parts.push(company.address);
    if (company.city) parts.push(company.city);
    if (company.state) parts.push(company.state);
    if (company.zipcode) parts.push(company.zipcode);
    return parts.join(', ') || 'Not specified';
  };

  const formatPhoneNumber = (phone: string | null) => {
    if (!phone) return 'Not specified';
    // Basic US phone number formatting
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Organization Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Organization Details</span>
          </CardTitle>
          <p className="text-sm text-gray-600">Basic information about the organization</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Mail className="h-4 w-4 mt-0.5 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-900">Email</div>
              <div className="text-sm text-gray-600">
                {company.email || 'Not specified'}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="h-4 w-4 mt-0.5 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-900">Phone</div>
              <div className="text-sm text-gray-600">
                {formatPhoneNumber(company.phone)}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-900">Address</div>
              <div className="text-sm text-gray-600">
                {formatAddress()}
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Primary Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Primary Contact</span>
          </CardTitle>
          <p className="text-sm text-gray-600">Main point of contact</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {company.owner.firstName[0]}{company.owner.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">
                {company.owner.firstName} {company.owner.lastName}
              </div>
              <div className="text-sm text-gray-600 capitalize">
                Owner
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Mail className="h-4 w-4 mt-0.5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-600">
                {company.owner.email}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Phone className="h-4 w-4 mt-0.5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-600">
                {formatPhoneNumber(company.owner.phone)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}