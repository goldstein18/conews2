"use client";

import { AuditEntry } from "@/types/audit";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatActionName,
  getUserDisplayName,
  getEntityDisplayName,
  getActionColor,
  getEntityTypeColor,
} from "../utils/audit-helpers";

interface AuditDetailSheetProps {
  entry: AuditEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AuditDetailSheet({ entry, isOpen, onClose }: AuditDetailSheetProps) {
  if (!entry) return null;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  };

  const formatChangesForDisplay = (changes: Record<string, unknown> | null | undefined) => {
    if (!changes || typeof changes !== 'object') return null;
    
    return Object.entries(changes).map(([field, value]) => {
      // Handle different types of values
      let displayValue: string;
      
      if (value === null || value === undefined) {
        displayValue = 'null';
      } else if (typeof value === 'object') {
        displayValue = JSON.stringify(value, null, 2);
      } else if (typeof value === 'boolean') {
        displayValue = value ? 'true' : 'false';
      } else {
        displayValue = String(value);
      }
      
      return {
        field,
        value: displayValue,
      };
    });
  };

  const formatMetadataForDisplay = (metadata: Record<string, unknown> | null | undefined) => {
    if (!metadata || typeof metadata !== 'object') return null;
    
    return Object.entries(metadata).map(([key, value]) => {
      let displayValue: string;
      
      if (value === null || value === undefined) {
        displayValue = 'null';
      } else if (typeof value === 'object') {
        displayValue = JSON.stringify(value, null, 2);
      } else if (typeof value === 'boolean') {
        displayValue = value ? 'true' : 'false';
      } else {
        displayValue = String(value);
      }
      
      return {
        key,
        value: displayValue,
      };
    });
  };

  const dateTime = formatDateTime(entry.createdAt);
  const changesData = formatChangesForDisplay(entry.changes);
  const metadataData = formatMetadataForDisplay(entry.metadata);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Audit Entry Details</SheetTitle>
          <SheetDescription>
            Detailed information about this audit entry
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User</label>
                  <p className="mt-1 font-medium">{getUserDisplayName(entry)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Action</label>
                  <div className="mt-1">
                    <Badge className={getActionColor(entry.action)}>
                      {formatActionName(entry.action)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Entity Type</label>
                  <div className="mt-1">
                    <Badge variant="outline" className={getEntityTypeColor(entry.entityType)}>
                      {getEntityDisplayName(entry.entityType)}
                    </Badge>
                  </div>
                </div>
                {entry.entityId && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Entity ID</label>
                    <p className="mt-1 font-mono text-sm">{entry.entityId}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Date & Time</label>
                <div className="mt-1">
                  <p className="font-medium">{dateTime.date}</p>
                  <p className="text-sm text-muted-foreground">{dateTime.time}</p>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Changes */}
          {changesData && changesData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Changes Made</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {changesData.map(({ field, value }) => (
                    <div key={field} className="border-l-2 border-muted pl-4">
                      <label className="text-sm font-medium text-muted-foreground">
                        {field}
                      </label>
                      <div className="mt-1">
                        {value.includes('\n') ? (
                          <pre className="text-sm bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                            {value}
                          </pre>
                        ) : (
                          <p className="text-sm font-mono">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          {metadataData && metadataData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metadataData.map(({ key, value }) => (
                    <div key={key} className="border-l-2 border-muted pl-4">
                      <label className="text-sm font-medium text-muted-foreground">
                        {key}
                      </label>
                      <div className="mt-1">
                        {value.includes('\n') ? (
                          <pre className="text-sm bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                            {value}
                          </pre>
                        ) : (
                          <p className="text-sm font-mono">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No additional data message */}
          {(!changesData || changesData.length === 0) && (!metadataData || metadataData.length === 0) && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No additional details available for this audit entry.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}