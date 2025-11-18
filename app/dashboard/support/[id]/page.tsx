"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { ArrowLeft, Paperclip, Calendar, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProtectedPage, ProtectionPresets } from "@/components/protected-page";
import { GET_TICKET } from "@/lib/graphql/tickets";
import { TicketResponse } from "@/types/ticket";
import {
  TicketStatusBadge,
  TicketPriorityBadge,
  TicketCommentThread,
  TicketReplyForm,
} from "../components";
import {
  formatTicketNumber,
  formatTicketDate,
  getUserFullName,
  formatFileSize,
  getFileIcon,
} from "../utils/ticket-helpers";
import { getCategoryLabel } from "../lib/validations";
import { useAuthStore } from "@/store/auth-store";

export default function TicketDetailPage() {
  return (
    <ProtectedPage {...ProtectionPresets.AuditLogs}>
      <TicketDetailPageContent />
    </ProtectedPage>
  );
}

function TicketDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const ticketId = params?.id as string;

  const { data, loading, error, refetch } = useQuery<TicketResponse>(GET_TICKET, {
    variables: { id: ticketId },
    skip: !ticketId,
  });

  const ticket = data?.ticket;

  // Check if user can add internal notes (admin or staff)
  const canAddInternalNotes = user?.role?.name === 'SUPER_ADMIN' || user?.role?.name === 'ADMIN';

  if (loading) {
    return <TicketDetailSkeleton />;
  }

  if (error || !ticket) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p className="font-medium">Error loading ticket</p>
          <p className="text-sm">{error?.message || 'Ticket not found'}</p>
        </div>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push('/dashboard/support')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tickets
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard/support')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tickets
        </Button>
      </div>

      {/* Ticket Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-sm text-gray-500">
                {formatTicketNumber(ticket.id)}
              </span>
              <TicketStatusBadge status={ticket.status} />
              <TicketPriorityBadge priority={ticket.priority} />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">{ticket.title}</h1>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4" />
            <div>
              <p className="text-xs text-gray-500">Created by</p>
              <p className="font-medium">{getUserFullName(ticket.user)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="h-4 w-4" />
            <div>
              <p className="text-xs text-gray-500">Company</p>
              <p className="font-medium">{ticket.company.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <div>
              <p className="text-xs text-gray-500">Created</p>
              <p className="font-medium">{formatTicketDate(ticket.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4" />
            <div>
              <p className="text-xs text-gray-500">Assigned to</p>
              <p className="font-medium">
                {ticket.assignedTo ? getUserFullName(ticket.assignedTo) : (
                  <span className="text-gray-400 italic">Unassigned</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Details */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-gray-700 whitespace-pre-wrap">
              {ticket.description}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
              <span>Category: <span className="font-medium text-gray-700">{getCategoryLabel(ticket.category)}</span></span>
              <span>•</span>
              <span>Last updated: {formatTicketDate(ticket.updatedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      {ticket.attachments && ticket.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              Attachments ({ticket.attachments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ticket.attachments.map((attachment) => (
                <a
                  key={attachment.id}
                  href={attachment.fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl">{getFileIcon(attachment.contentType)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {attachment.fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.fileSize)}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Thread */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Comments & Replies
        </h2>
        <TicketCommentThread
          comments={ticket.comments || []}
          canViewInternalNotes={canAddInternalNotes}
        />
      </div>

      {/* Reply Form */}
      <TicketReplyForm
        ticketId={ticket.id}
        canAddInternalNotes={canAddInternalNotes}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

function TicketDetailSkeleton() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Skeleton className="h-10 w-32" />
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-8 w-96" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
