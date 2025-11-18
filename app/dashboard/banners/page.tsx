'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, BarChart3, Eye, MousePointerClick, Building2, X, ChevronDown } from 'lucide-react';
import { BannerType, BannerStatus, Banner } from '@/types/banners';
import { useBannerStore } from '@/store/banner-store';
import { useBannersData, useBannerActions } from './hooks';
import { 
  BannerStats, 
  BannerFilters, 
  BannerTable, 
  BannerPageSkeleton 
} from './components';
import { cn } from '@/lib/utils';
import { useRoleAccess } from '@/hooks/use-role-access';
import { GET_ALL_COMPANIES_FOR_DROPDOWN } from '@/lib/graphql/banners';
import { MY_COMPANY_PROFILE } from '@/lib/graphql/settings';
import { MODULE_CONFIGS } from '@/components/ui/image-upload-advanced/types';

// Banner type tabs configuration
const BANNER_TYPE_TABS = [
  { value: 'ALL', label: 'All Banners', icon: null },
  { value: 'ROS', label: 'ROS', icon: null },
  { value: 'PREMIUM', label: 'Premium', icon: null },
  { value: 'BLUE', label: 'Blue', icon: null },
  { value: 'GREEN', label: 'Green', icon: null },
  { value: 'RED', label: 'Red', icon: null },
  { value: 'ESCOOP', label: 'Escoop', icon: null }
] as const;

// Get banner creation options dynamically from MODULE_CONFIGS
const getBannerCreationOptions = () => {
  const bannerTypes = [
    { type: BannerType.ROS, label: 'ROS Banner', description: 'Run of Site' },
    { type: BannerType.PREMIUM, label: 'Premium Banner', description: 'Multiple sizes available' },
    { type: BannerType.BLUE, label: 'Blue Banner', description: 'Blue pages' },
    { type: BannerType.GREEN, label: 'Green Banner', description: 'Green pages' },
    { type: BannerType.RED, label: 'Red Banner', description: 'Red pages' },
    { type: BannerType.ESCOOP, label: 'Escoop Banner', description: 'Escoop network' }
  ];

  return bannerTypes.map((bannerType) => {
    const configKey = `banners-${bannerType.type.toLowerCase()}`;
    const config = MODULE_CONFIGS[configKey];
    
    // Get dimensions from config, fallback to 'Custom' if not found
    const dimensions = config 
      ? `${config.minWidth}×${config.minHeight}px`
      : 'Custom';

    return {
      type: bannerType.type,
      label: bannerType.label,
      description: `${dimensions} - ${bannerType.description}`,
      dimensions
    };
  });
};

function BannersPageContent() {
  const router = useRouter();
  const { isSuperAdmin, isAdmin } = useRoleAccess();
  
  // Determine if user can select any company
  const canSelectCompany = isSuperAdmin || isAdmin;
  
  // Get user's company profile (for regular members)
  const { data: userCompanyData } = useQuery(MY_COMPANY_PROFILE, {
    skip: canSelectCompany, // Skip if user is admin (they can select any company)
    errorPolicy: 'all'
  });
  
  // Companies dropdown data (for admin/super admin)
  const { data: companiesData } = useQuery(GET_ALL_COMPANIES_FOR_DROPDOWN, {
    skip: !canSelectCompany,
    errorPolicy: 'all'
  });
  
  // Zustand store state
  const {
    filters,
    sorting,
    selectedTab,
    setSearch,
    setBannerTypeFilter,
    setStatusFilter,
    setMarketFilter,
    setCompanyFilter,
    setAfter,
    setSorting,
    setSelectedTab,
    clearFilters,
    hasActiveFilters
  } = useBannerStore();

  // Determine effective company ID
  const userCompanyId = userCompanyData?.myCompanyProfile?.id;
  const effectiveCompanyId = canSelectCompany ? filters.companyId : userCompanyId;
  
  // Get selected company info for display
  const selectedCompany = canSelectCompany 
    ? companiesData?.companies?.find((c: { id: string; name: string }) => c.id === filters.companyId)
    : userCompanyData?.myCompanyProfile;
  
  // Show data always - for admins show all companies unless filtered, for members show their company
  const shouldShowData = canSelectCompany ? true : !!userCompanyId;
  
  // Banner actions
  const { 
    approveBanner, 
    declineBanner, 
    pauseBanner, 
    resumeBanner, 
    deleteBanner
  } = useBannerActions();

  // Data fetching (only if we should show data)
  const {
    banners,
    totalCount,
    pageInfo,
    loading,
    error,
    refetch,
    fetchMore
  } = useBannersData({
    search: filters.search,
    bannerType: filters.bannerType,
    status: filters.status,
    market: filters.market,
    companyId: effectiveCompanyId,
    first: 20,
    after: filters.after
  });

  // Handle company selection for admin users
  const handleCompanySelect = (companyId: string | undefined) => {
    setCompanyFilter(companyId);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    const tabValue = value as BannerType | 'ALL';
    setSelectedTab(tabValue);
  };

  // Handle banner actions
  const handleCreateBanner = (bannerType?: BannerType) => {
    const baseUrl = '/dashboard/banners/create';
    if (bannerType) {
      router.push(`${baseUrl}?type=${bannerType}`);
    } else {
      router.push(baseUrl);
    }
  };

  const handleViewBanner = (banner: Banner) => {
    router.push(`/dashboard/banners/${banner.id}`);
  };

  const handleEditBanner = (banner: Banner) => {
    router.push(`/dashboard/banners/${banner.id}/edit`);
  };

  const handleApproveBanner = async (banner: Banner) => {
    const success = await approveBanner({ bannerId: banner.id });
    if (success) {
      refetch();
    }
  };

  const handleDeclineBanner = async (banner: Banner) => {
    // In a real app, you'd show a modal to get the decline reason
    const reason = prompt('Enter decline reason:') || 'No reason provided';
    const success = await declineBanner({ 
      bannerId: banner.id, 
      reason 
    });
    if (success) {
      refetch();
    }
  };

  const handlePauseBanner = async (banner: Banner) => {
    const success = await pauseBanner(banner.id);
    if (success) {
      refetch();
    }
  };

  const handleResumeBanner = async (banner: Banner) => {
    const success = await resumeBanner(banner.id);
    if (success) {
      refetch();
    }
  };

  const handleDeleteBanner = async (banner: Banner) => {
    const success = await deleteBanner(banner.id);
    if (success) {
      refetch();
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      setAfter(pageInfo.endCursor);
    }
  };

  const handlePreviousPage = () => {
    if (pageInfo.hasPreviousPage) {
      setAfter(undefined);
    }
  };

  const handleLoadMore = () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      fetchMore({ after: pageInfo.endCursor });
    }
  };

  // Show loading state initially
  if (loading && banners.length === 0) {
    return <BannerPageSkeleton />;
  }

  // Calculate current tab performance
  const currentTypePerformance = banners
    .filter(b => selectedTab === 'ALL' || b.bannerType === selectedTab)
    .reduce(
      (acc, banner) => ({
        impressions: acc.impressions + (banner.totalImpressions || 0),
        clicks: acc.clicks + (banner.totalClicks || 0)
      }), 
      { impressions: 0, clicks: 0 }
    );

  const currentTypeCTR = currentTypePerformance.impressions > 0 
    ? (currentTypePerformance.clicks / currentTypePerformance.impressions * 100).toFixed(2)
    : '0.00';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Manage Banners</h1>
          <p className="text-sm text-muted-foreground">
            {canSelectCompany 
              ? "View and manage banner ads across all companies"
              : "Manage your banner ads across all platforms"
            }
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Company Selector for Admin/Super Admin */}
          {canSelectCompany && (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={filters.companyId || "all"} 
                onValueChange={(value) => handleCompanySelect(value === "all" ? undefined : value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companiesData?.companies?.map((company: { id: string; name: string }) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Current Company Display for Regular Members */}
          {!canSelectCompany && selectedCompany && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{selectedCompany.name}</span>
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Banner
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {getBannerCreationOptions().map((option) => (
                <DropdownMenuItem 
                  key={option.type}
                  onClick={() => handleCreateBanner(option.type)}
                  className="flex flex-col items-start p-3 cursor-pointer"
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Company filter info for admins */}
      {canSelectCompany && (
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Building2 className="h-4 w-4 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {filters.companyId && selectedCompany 
                  ? `Filtered to: ${selectedCompany.name}`
                  : "Showing all companies"
                }
              </p>
              <p className="text-xs text-muted-foreground">
                {filters.companyId 
                  ? "Stats and banners filtered to selected company"
                  : "Stats and banners from all companies combined"
                }
              </p>
            </div>
            {filters.companyId && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCompanyFilter(undefined)}
                className="gap-1"
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Overall Performance Stats */}
      {shouldShowData && (
        <BannerStats
          companyId={effectiveCompanyId}
          onStatusFilter={(status) => setStatusFilter(status)}
        />
      )}

      {/* Banner Type Tabs */}
      {shouldShowData && (
        <Tabs value={selectedTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-7">
            {BANNER_TYPE_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

        {BANNER_TYPE_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-6">
            {/* Current Tab Performance */}
            {tab.value !== 'ALL' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {tab.label} Banner Performance
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Current performance metrics for {tab.label.toLowerCase()} banners
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-blue-50">
                        <Eye className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Impressions</p>
                        <p className="text-2xl font-bold">{currentTypePerformance.impressions.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-green-50">
                        <MousePointerClick className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                        <p className="text-2xl font-bold">{currentTypePerformance.clicks.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-purple-50">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Average CTR</p>
                        <p className="text-2xl font-bold">{currentTypeCTR}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Banner Status Summary for current type */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { status: 'PENDING', label: 'Pending', count: banners.filter(b => (tab.value === 'ALL' || b.bannerType === tab.value) && b.status === 'PENDING').length, color: 'border-yellow-200 bg-yellow-50' },
                { status: 'RUNNING', label: 'Active', count: banners.filter(b => (tab.value === 'ALL' || b.bannerType === tab.value) && b.status === 'RUNNING').length, color: 'border-green-200 bg-green-50' },
                { status: 'EXPIRED', label: 'Expired', count: banners.filter(b => (tab.value === 'ALL' || b.bannerType === tab.value) && b.status === 'EXPIRED').length, color: 'border-gray-200 bg-gray-50' },
                { status: 'PAUSED', label: 'Paused', count: banners.filter(b => (tab.value === 'ALL' || b.bannerType === tab.value) && b.status === 'PAUSED').length, color: 'border-orange-200 bg-orange-50' }
              ].map((item) => (
                <Card 
                  key={item.status} 
                  className={cn("cursor-pointer transition-all hover:shadow-md", item.color)}
                  onClick={() => setStatusFilter(item.status as BannerStatus)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl font-bold">{item.count}</div>
                      <div className="text-sm font-medium">{item.label}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filters */}
            <BannerFilters
              search={filters.search}
              bannerType={filters.bannerType}
              status={filters.status}
              market={filters.market}
              onSearchChange={setSearch}
              onBannerTypeChange={setBannerTypeFilter}
              onStatusChange={setStatusFilter}
              onMarketChange={setMarketFilter}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters()}
              showAdvanced={true}
            />

            {/* Table */}
            <BannerTable
              banners={banners.filter(b => tab.value === 'ALL' || b.bannerType === tab.value)}
              loading={loading}
              sortField={sorting.field}
              sortDirection={sorting.direction}
              onSort={(field) => setSorting(field)}
              onView={handleViewBanner}
              onEdit={handleEditBanner}
              onDelete={handleDeleteBanner}
              onApprove={handleApproveBanner}
              onDecline={handleDeclineBanner}
              onPause={handlePauseBanner}
              onResume={handleResumeBanner}
              totalCount={totalCount}
              hasNextPage={pageInfo.hasNextPage}
              hasPreviousPage={pageInfo.hasPreviousPage}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              onLoadMore={handleLoadMore}
              showActions={true}
            />
          </TabsContent>
        ))}
        </Tabs>
      )}

      {/* Error handling */}
      {error && shouldShowData && (
        <div className="text-center py-4">
          <p className="text-sm text-destructive mb-2">
            Failed to load banners. Please try again.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}

export default function BannersPage() {
  return <BannersPageContent />;
}