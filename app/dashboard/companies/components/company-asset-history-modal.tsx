"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCompanyAssetHistory } from "@/app/dashboard/companies/hooks/use-company-assets";

interface CompanyAssetHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

export function CompanyAssetHistoryModal({ 
  isOpen, 
  onClose, 
  companyId 
}: CompanyAssetHistoryModalProps) {
  const { 
    assetHistory, 
    loading, 
    error, 
    formatDate, 
    getFullName 
  } = useCompanyAssetHistory({ companyId });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div>
            <DialogTitle className="text-xl font-semibold">
              Additional Asset History
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              History of all additional assets added to this member
            </p>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          {loading && (
            <div className="space-y-4">
              {/* Loading skeleton */}
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">
                Failed to load asset history
              </p>
              <p className="text-sm text-gray-500">
                {error.message}
              </p>
            </div>
          )}

          {!loading && !error && assetHistory.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                No asset history found
              </h3>
              <p className="text-sm text-gray-500">
                This company doesn&apos;t have any additional asset history yet.
              </p>
            </div>
          )}

          {!loading && !error && assetHistory.length > 0 && (
            <ScrollArea className="h-[50vh]">
              <div className="space-y-4 pr-4">
                {assetHistory.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h4 className="font-medium text-gray-900 text-lg">
                            {entry.action}
                          </h4>
                          <span className="text-gray-500 text-sm">
                            {formatDate(entry.date)}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          Added by: {getFullName(entry.addedBy)}
                        </div>
                        
                        {entry.notes && (
                          <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <span className="font-medium">Notes:</span> {entry.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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