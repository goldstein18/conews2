"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, CalendarCheck, Clock } from "lucide-react";
import { CompanyDetail } from "@/types/members";

interface CompanyStatsProps {
  company: CompanyDetail;
  loading?: boolean;
}

export function CompanyStats({ company, loading }: CompanyStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getExpirationInfo = () => {
    if (!company.benefits || company.benefits.length === 0) {
      return { date: 'N/A', isExpiringSoon: false };
    }

    // Get the latest end date
    const latestBenefit = company.benefits.reduce((latest, current) => {
      return new Date(current.endDate) > new Date(latest.endDate) ? current : latest;
    });

    const endDate = new Date(latestBenefit.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const formattedDate = endDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    return {
      date: formattedDate,
      isExpiringSoon: diffDays <= 30 && diffDays > 0
    };
  };

  const expirationInfo = getExpirationInfo();

  const stats = [
    {
      title: "Total Members",
      value: company.users?.length || company.userCount,
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100"
    },
    {
      title: "Total Events", 
      value: 0, // Will be available when backend supports it
      icon: Calendar,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100"
    },
    {
      title: "Upcoming Events",
      value: 0, // Will be available when backend supports it
      icon: CalendarCheck,
      iconColor: "text-green-600", 
      iconBg: "bg-green-100"
    },
    {
      title: "Expiration",
      value: expirationInfo.date,
      icon: Clock,
      iconColor: expirationInfo.isExpiringSoon ? "text-orange-600" : "text-gray-600",
      iconBg: expirationInfo.isExpiringSoon ? "bg-orange-100" : "bg-gray-100",
      isDate: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${
                  stat.title === "Expiration" && expirationInfo.isExpiringSoon 
                    ? "text-orange-600" 
                    : "text-gray-900"
                }`}>
                  {stat.isDate ? stat.value : stat.value.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}