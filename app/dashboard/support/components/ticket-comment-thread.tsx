import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Lock, Paperclip, Download } from 'lucide-react';
import { TicketComment } from '@/types/ticket';
import {
  getUserFullName,
  getUserInitials,
  formatTicketDate,
  formatFileSize,
  getFileIcon,
} from '../utils/ticket-helpers';

interface TicketCommentThreadProps {
  comments: TicketComment[];
  canViewInternalNotes?: boolean;
}

export function TicketCommentThread({
  comments,
  canViewInternalNotes = false,
}: TicketCommentThreadProps) {
  // Filter out internal notes if user doesn't have permission
  const visibleComments = canViewInternalNotes
    ? comments
    : comments.filter(comment => !comment.isInternal);

  if (visibleComments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <p>No comments yet</p>
          <p className="text-sm">Be the first to reply to this ticket</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {visibleComments.map((comment) => (
        <Card
          key={comment.id}
          className={`${
            comment.isInternal
              ? 'border-yellow-300 bg-yellow-50'
              : 'border-gray-200'
          }`}
        >
          <CardContent className="pt-6">
            {/* Comment Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getUserInitials(comment.user)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">
                      {getUserFullName(comment.user)}
                    </p>
                    {comment.isInternal && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 border-yellow-300"
                      >
                        <Lock className="h-3 w-3 mr-1" />
                        Internal Note
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatTicketDate(comment.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Comment Content */}
            <div className="ml-13 space-y-3">
              <div className="text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </div>

              {/* Attachments */}
              {comment.attachments && comment.attachments.length > 0 && (
                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Paperclip className="h-4 w-4" />
                    <span className="font-medium">
                      {comment.attachments.length}{' '}
                      {comment.attachments.length === 1 ? 'Attachment' : 'Attachments'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {comment.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {getFileIcon(attachment.contentType)}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {attachment.fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(attachment.fileSize)}
                            </p>
                          </div>
                        </div>
                        <Download className="h-4 w-4 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
