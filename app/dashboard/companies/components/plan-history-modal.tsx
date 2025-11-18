"use client";


import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlanHistory } from "@/app/dashboard/companies/hooks/use-plan-history";
import { PlanHistoryEntryComponent } from "./plan-history-entry";

interface PlanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  companyName?: string;
}

export function PlanHistoryModal({ 
  isOpen, 
  onClose, 
  companyId, 
  companyName 
}: PlanHistoryModalProps) {
  const { 
    planHistory, 
    loading, 
    error, 
    formatDate, 
    formatActionType, 
    getFullName 
  } = usePlanHistory({ companyId });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div>
            <DialogTitle className="text-xl font-semibold">
              Plan History
            </DialogTitle>
            {companyName && (
              <p className="text-sm text-gray-600 mt-1">
                {companyName}
              </p>
            )}
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          {loading && (
            <div className="space-y-4">
              {/* Loading skeleton */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">
                Failed to load plan history
              </p>
              <p className="text-sm text-gray-500">
                {error.message}
              </p>
            </div>
          )}

          {!loading && !error && planHistory.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                No plan history found
              </h3>
              <p className="text-sm text-gray-500">
                This company doesn&apos;t have any plan history yet.
              </p>
            </div>
          )}

          {!loading && !error && planHistory.length > 0 && (
            <ScrollArea className="h-[50vh]">
              <div className="space-y-4 pr-4">
                {planHistory.map((entry) => (
                  <PlanHistoryEntryComponent
                    key={entry.id}
                    entry={entry}
                    formatDate={formatDate}
                    formatActionType={formatActionType}
                    getFullName={getFullName}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}