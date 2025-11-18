"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Clock, Trash2, Save, Settings } from "lucide-react";
import { NewsDraft } from '@/store/news-draft-store';
import { formatDistanceToNow } from 'date-fns';

interface NewsDraftsSidebarProps {
  drafts: NewsDraft[];
  currentDraftId: string | null;
  onLoadDraft: (draft: NewsDraft) => void;
  onDeleteDraft: (draftId: string) => void;
  onSaveAsDraft: () => void;
  autoSaveEnabled: boolean;
  onToggleAutoSave: (enabled: boolean) => void;
  isLoading?: boolean;
}

export function NewsDraftsSidebar({
  drafts,
  currentDraftId,
  onLoadDraft,
  onDeleteDraft,
  onSaveAsDraft,
  autoSaveEnabled,
  onToggleAutoSave,
  isLoading = false
}: NewsDraftsSidebarProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteConfirm = (draftId: string) => {
    onDeleteDraft(draftId);
    setDeleteConfirmId(null);
  };

  return (
    <Card className="w-80 h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Drafts
          </CardTitle>
          <Badge variant="outline">{drafts.length}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={onSaveAsDraft}
            disabled={isLoading}
            className="w-full"
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Auto-save</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleAutoSave(!autoSaveEnabled)}
              className={autoSaveEnabled ? "text-green-600" : "text-gray-400"}
            >
              {autoSaveEnabled ? "ON" : "OFF"}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Drafts List */}
        <div className="space-y-3">
          {drafts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No drafts available</p>
            </div>
          ) : (
            drafts.map((draft) => (
              <div
                key={draft.id}
                className={`
                  border rounded-lg p-3 space-y-2 transition-colors cursor-pointer
                  ${currentDraftId === draft.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
                onClick={() => onLoadDraft(draft)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {draft.title || 'Untitled Article'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(draft.lastSaved), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  
                  <Dialog
                    open={deleteConfirmId === draft.id}
                    onOpenChange={(open) => !open && setDeleteConfirmId(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(draft.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Draft</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete the draft &quot;{draft.title || 'Untitled Article'}&quot;?
                          This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteConfirm(draft.id)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Draft Info */}
                <div className="flex items-center gap-2">
                  {draft.isAutoSaved && (
                    <Badge variant="secondary" className="text-xs">
                      Auto-saved
                    </Badge>
                  )}
                  
                  {draft.data.articleType && (
                    <Badge variant="outline" className="text-xs">
                      {draft.data.articleType}
                    </Badge>
                  )}

                  {currentDraftId === draft.id && (
                    <Badge variant="default" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>

                {/* Preview Content */}
                {draft.data.body && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {draft.data.body.substring(0, 80)}...
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Auto-save Status */}
        {autoSaveEnabled && (
          <div className="text-xs text-muted-foreground text-center p-2 bg-green-50 rounded border">
            <Clock className="h-3 w-3 inline mr-1" />
            Auto-save enabled - changes saved every 3 seconds
          </div>
        )}
      </CardContent>
    </Card>
  );
}