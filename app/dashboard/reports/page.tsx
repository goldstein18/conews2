"use client";

// Reports & Analytics main page
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart3, Shield } from "lucide-react";
import { ProtectedPage } from "@/components/protected-page";
import { useReportsStore } from "@/store/reports-store";

// Components
import { ClientReportsTab, OverallAnalyticsTab } from "./components";

export default function ReportsPage() {
  return (
    <ProtectedPage 
      requiredRoles={['SUPER_ADMIN', 'ADMIN']}
      unauthorizedComponent={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Access Restricted
            </h2>
            <p className="text-sm text-gray-600">
              This section is only available to Super Admins and Admins.
            </p>
          </div>
        </div>
      }
    >
      <ReportsPageContent />
    </ProtectedPage>
  );
}

function ReportsPageContent() {
  const { activeTab, setActiveTab } = useReportsStore();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">
            Generate comprehensive reports and analyze asset performance across your platform.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Shield className="h-4 w-4" />
          <span>Admin Access Only</span>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'client-reports' | 'overall-analytics')}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="client-reports" 
            className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <FileText className="h-4 w-4" />
            <span>Client Reports</span>
          </TabsTrigger>
          <TabsTrigger 
            value="overall-analytics" 
            className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Overall Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Client Reports Tab Content */}
        <TabsContent value="client-reports" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Client Asset Reports</h2>
            <p className="text-sm text-gray-600 mt-1">
              Generate detailed asset performance reports for specific organizations
            </p>
          </div>
          <ClientReportsTab />
        </TabsContent>

        {/* Overall Analytics Tab Content */}
        <TabsContent value="overall-analytics" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Overall Analytics</h2>
            <p className="text-sm text-gray-600 mt-1">
              View asset performance across all placements and clients
            </p>
          </div>
          <OverallAnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}