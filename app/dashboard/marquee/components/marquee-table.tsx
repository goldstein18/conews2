'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';
import { useMarqueeActions } from '../hooks';
import { MarqueeStatus } from '@/types/marquee';
import type { Marquee } from '@/types/marquee';

interface MarqueeTableProps {
  marquees: Marquee[];
  loading?: boolean;
  onRefetch?: () => void;
}

export function MarqueeTable({ marquees, loading, onRefetch }: MarqueeTableProps) {
  const router = useRouter();
  const { approveMarquee, declineMarquee } = useMarqueeActions();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const getStatusBadge = (status: MarqueeStatus) => {
    const variants: Record<MarqueeStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      PENDING: { variant: 'secondary', label: 'Pending' },
      APPROVED: { variant: 'default', label: 'Approved' },
      DECLINED: { variant: 'destructive', label: 'Declined' },
      DELETED: { variant: 'outline', label: 'Deleted' },
    };

    const config = variants[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id);
      await approveMarquee(id);
      onRefetch?.();
    } catch (error) {
      console.error('Error approving marquee:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      setActionLoading(id);
      const reason = prompt('Please provide a reason for declining:');
      if (reason) {
        await declineMarquee(id, reason);
        onRefetch?.();
      }
    } catch (error) {
      console.error('Error declining marquee:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && marquees.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Loading marquees...</div>;
  }

  if (marquees.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No marquees found</p>
        <p className="text-sm mt-2">Create your first marquee to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Market</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Media</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {marquees.map((marquee) => (
            <TableRow key={marquee.id}>
              <TableCell className="font-medium">{marquee.name}</TableCell>
              <TableCell>{getStatusBadge(marquee.status)}</TableCell>
              <TableCell className="capitalize">{marquee.market}</TableCell>
              <TableCell>{format(new Date(marquee.startDate), 'MMM d, yyyy')}</TableCell>
              <TableCell>{format(new Date(marquee.endDate), 'MMM d, yyyy')}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {(marquee.desktopImageUrl || marquee.desktopVideoUrl) && (
                    <Badge variant="outline" className="text-xs">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      Desktop
                    </Badge>
                  )}
                  {(marquee.mobileImageUrl || marquee.mobileVideoUrl) && (
                    <Badge variant="outline" className="text-xs">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      Mobile
                    </Badge>
                  )}
                  {!marquee.desktopImageUrl && !marquee.desktopVideoUrl && !marquee.mobileImageUrl && !marquee.mobileVideoUrl && (
                    <span className="text-xs text-muted-foreground">No media</span>
                  )}
                </div>
              </TableCell>
              <TableCell>{marquee.company?.name || 'N/A'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={actionLoading === marquee.id}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/dashboard/marquee/${marquee.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    {marquee.status === MarqueeStatus.PENDING && (
                      <>
                        <DropdownMenuItem onClick={() => handleApprove(marquee.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDecline(marquee.id)}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Decline
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
