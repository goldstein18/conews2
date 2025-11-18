'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  MoreHorizontal, 
  ChevronUp, 
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { Banner, BannerSortField, BannerSortDirection, BannerType, BannerStatus } from '@/types/banners';
import { BannerTableSkeleton } from './banner-skeleton';
import { cn } from '@/lib/utils';

interface BannerTableProps {
  banners: Banner[];
  loading?: boolean;
  sortField?: BannerSortField;
  sortDirection?: BannerSortDirection;
  onSort: (field: BannerSortField) => void;
  onView?: (banner: Banner) => void;
  onEdit?: (banner: Banner) => void;
  onDelete?: (banner: Banner) => void;
  onApprove?: (banner: Banner) => void;
  onDecline?: (banner: Banner) => void;
  onPause?: (banner: Banner) => void;
  onResume?: (banner: Banner) => void;
  totalCount?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
  onLoadMore?: () => void;
  showActions?: boolean;
  className?: string;
}

interface TableHeaderConfig {
  key: BannerSortField;
  label: string;
  sortable: boolean;
  className?: string;
}

const tableHeaders: TableHeaderConfig[] = [
  { key: BannerSortField.NAME, label: 'Banner Name', sortable: true, className: 'min-w-[200px]' },
  { key: BannerSortField.BANNER_TYPE, label: 'Type', sortable: true, className: 'w-[100px]' },
  { key: BannerSortField.STATUS, label: 'Status', sortable: true, className: 'w-[120px]' },
  { key: BannerSortField.START_DATE, label: 'Start Date', sortable: true, className: 'w-[120px]' },
  { key: BannerSortField.END_DATE, label: 'End Date', sortable: true, className: 'w-[120px]' },
  { key: BannerSortField.TOTAL_IMPRESSIONS, label: 'Impressions', sortable: true, className: 'w-[120px]' },
  { key: BannerSortField.TOTAL_CLICKS, label: 'Clicks', sortable: true, className: 'w-[100px]' },
  { key: BannerSortField.CTR, label: 'CTR', sortable: false, className: 'w-[100px]' },
];

function BannerStatusBadge({ status }: { status: BannerStatus }) {
  const variants = {
    [BannerStatus.PENDING]: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    [BannerStatus.APPROVED]: { variant: 'secondary' as const, className: 'bg-green-100 text-green-800 border-green-200' },
    [BannerStatus.RUNNING]: { variant: 'default' as const, className: 'bg-blue-100 text-blue-800 border-blue-200' },
    [BannerStatus.EXPIRED]: { variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800 border-gray-200' },
    [BannerStatus.DECLINED]: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800 border-red-200' },
    [BannerStatus.PAUSED]: { variant: 'secondary' as const, className: 'bg-orange-100 text-orange-800 border-orange-200' },
  };

  const config = variants[status];
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {status.toLowerCase()}
    </Badge>
  );
}

function BannerTypeBadge({ bannerType }: { bannerType: BannerType }) {
  const variants = {
    [BannerType.ROS]: 'bg-purple-100 text-purple-800 border-purple-200',
    [BannerType.PREMIUM]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    [BannerType.BLUE]: 'bg-blue-100 text-blue-800 border-blue-200',
    [BannerType.GREEN]: 'bg-green-100 text-green-800 border-green-200',
    [BannerType.RED]: 'bg-red-100 text-red-800 border-red-200',
    [BannerType.ESCOOP]: 'bg-orange-100 text-orange-800 border-orange-200',
  };
  
  return (
    <Badge variant="outline" className={variants[bannerType]}>
      {bannerType}
    </Badge>
  );
}

function BannerActionsDropdown({ 
  banner, 
  onView, 
  onEdit, 
  onDelete, 
  onApprove, 
  onDecline, 
  onPause, 
  onResume 
}: { 
  banner: Banner;
  onView?: (banner: Banner) => void;
  onEdit?: (banner: Banner) => void;
  onDelete?: (banner: Banner) => void;
  onApprove?: (banner: Banner) => void;
  onDecline?: (banner: Banner) => void;
  onPause?: (banner: Banner) => void;
  onResume?: (banner: Banner) => void;
}) {
  const canApprove = banner.status === BannerStatus.PENDING;
  const canDecline = banner.status === BannerStatus.PENDING;
  const canPause = banner.status === BannerStatus.RUNNING;
  const canResume = banner.status === BannerStatus.PAUSED;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {onView && (
          <DropdownMenuItem onClick={() => onView(banner)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
        )}
        
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(banner)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Banner
          </DropdownMenuItem>
        )}

        {banner.imageUrl && (
          <DropdownMenuItem 
            onClick={() => window.open(banner.imageUrl, '_blank')}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            View Image
          </DropdownMenuItem>
        )}

        {banner.link && (
          <DropdownMenuItem 
            onClick={() => window.open(banner.link, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Link
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {canApprove && onApprove && (
          <DropdownMenuItem 
            onClick={() => onApprove(banner)}
            className="text-green-600"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </DropdownMenuItem>
        )}

        {canDecline && onDecline && (
          <DropdownMenuItem 
            onClick={() => onDecline(banner)}
            className="text-red-600"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Decline
          </DropdownMenuItem>
        )}

        {canPause && onPause && (
          <DropdownMenuItem 
            onClick={() => onPause(banner)}
            className="text-orange-600"
          >
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </DropdownMenuItem>
        )}

        {canResume && onResume && (
          <DropdownMenuItem 
            onClick={() => onResume(banner)}
            className="text-blue-600"
          >
            <Play className="h-4 w-4 mr-2" />
            Resume
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {onDelete && (
          <DropdownMenuItem 
            onClick={() => onDelete(banner)}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function BannerTable({
  banners,
  loading = false,
  sortField,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onDecline,
  onPause,
  onResume,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
  onLoadMore,
  showActions = true,
  className
}: BannerTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  const handleDeleteClick = (banner: Banner) => {
    setBannerToDelete(banner);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (bannerToDelete && onDelete) {
      onDelete(bannerToDelete);
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    }
  };

  const handleSort = (field: BannerSortField) => {
    onSort(field);
  };

  const getSortIcon = (field: BannerSortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined || isNaN(num)) {
      return '0';
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const calculateCTR = (clicks: number | null | undefined, impressions: number | null | undefined): string => {
    const safeClicks = clicks || 0;
    const safeImpressions = impressions || 0;
    
    if (safeImpressions === 0) return '0.00%';
    return ((safeClicks / safeImpressions) * 100).toFixed(2) + '%';
  };

  if (loading) {
    return <BannerTableSkeleton className={className} />;
  }

  if (banners.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No banners found</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            No banners match your current filters. Try adjusting your search criteria or clear the filters to see all banners.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableHeaders.map((header) => (
                    <TableHead 
                      key={header.key}
                      className={cn(
                        header.className,
                        header.sortable && "cursor-pointer hover:bg-muted/50 select-none"
                      )}
                      onClick={header.sortable ? () => handleSort(header.key) : undefined}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{header.label}</span>
                        {header.sortable && getSortIcon(header.key)}
                      </div>
                    </TableHead>
                  ))}
                  {showActions && (
                    <TableHead className="w-[50px]">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id} className="hover:bg-muted/50">
                    {/* Banner Name */}
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <p className="font-semibold">{banner.name}</p>
                        {banner.company && (
                          <p className="text-sm text-muted-foreground">{banner.company.name}</p>
                        )}
                      </div>
                    </TableCell>
                    
                    {/* Type */}
                    <TableCell>
                      <BannerTypeBadge bannerType={banner.bannerType} />
                    </TableCell>
                    
                    {/* Status */}
                    <TableCell>
                      <BannerStatusBadge status={banner.status} />
                    </TableCell>
                    
                    {/* Start Date */}
                    <TableCell className="text-sm">
                      {formatDate(banner.startDate)}
                    </TableCell>
                    
                    {/* End Date */}
                    <TableCell className="text-sm">
                      {formatDate(banner.endDate)}
                    </TableCell>
                    
                    {/* Impressions */}
                    <TableCell className="text-right">
                      {formatNumber(banner.totalImpressions)}
                    </TableCell>
                    
                    {/* Clicks */}
                    <TableCell className="text-right">
                      {formatNumber(banner.totalClicks)}
                    </TableCell>
                    
                    {/* CTR */}
                    <TableCell className="text-right">
                      {calculateCTR(banner.totalClicks, banner.totalImpressions)}
                    </TableCell>
                    
                    {/* Actions */}
                    {showActions && (
                      <TableCell>
                        <BannerActionsDropdown
                          banner={banner}
                          onView={onView}
                          onEdit={onEdit}
                          onDelete={handleDeleteClick}
                          onApprove={onApprove}
                          onDecline={onDecline}
                          onPause={onPause}
                          onResume={onResume}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {(hasNextPage || hasPreviousPage || (totalCount !== undefined && totalCount !== null)) && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {totalCount !== undefined && totalCount !== null && (
              <span>Showing {banners.length} of {totalCount} banners</span>
            )}
          </div>
          
          <div className="flex space-x-2">
            {hasPreviousPage && onPreviousPage && (
              <Button variant="outline" onClick={onPreviousPage}>
                Previous
              </Button>
            )}
            
            {hasNextPage && onNextPage && (
              <Button variant="outline" onClick={onNextPage}>
                Next
              </Button>
            )}
            
            {hasNextPage && onLoadMore && (
              <Button variant="outline" onClick={onLoadMore}>
                Load More
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{bannerToDelete?.name}&quot;? This action cannot be undone and will permanently remove the banner from all platforms.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Banner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}