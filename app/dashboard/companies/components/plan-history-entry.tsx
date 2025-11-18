import { Badge } from "@/components/ui/badge";

interface PlanHistoryEntry {
  id: string;
  eventType: string;
  date: string;
  title: string;
  description: string;
  addedBy: {
    firstName: string;
    lastName: string;
  };
  fromPlan: string | null;
  toPlan: string | null;
  assetType: string | null;
  assetQuantity: number | null;
  assetDuration: string | null;
  fromStatus: string | null;
  toStatus: string | null;
}

interface PlanHistoryEntryProps {
  entry: PlanHistoryEntry;
  formatDate: (dateString: string) => string;
  formatActionType: (eventType: string) => string;
  getFullName: (entry: PlanHistoryEntry) => string;
}

export function PlanHistoryEntryComponent({ 
  entry, 
  formatDate, 
  formatActionType, 
  getFullName 
}: PlanHistoryEntryProps) {
  const getEventTypeColor = (eventType: string) => {
    switch (eventType.toUpperCase()) {
      case 'ASSET_ADDITION':
        return 'bg-green-100 text-green-800';
      case 'ASSET_REMOVAL':
        return 'bg-red-100 text-red-800';
      case 'PLAN_CHANGE':
        return 'bg-blue-100 text-blue-800';
      case 'STATUS_CHANGE':
        return 'bg-yellow-100 text-yellow-800';
      case 'RENEWAL':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLATION':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="secondary" className={getEventTypeColor(entry.eventType)}>
              {formatActionType(entry.eventType)}
            </Badge>
            <span className="text-sm text-gray-500">
              {formatDate(entry.date)}
            </span>
          </div>
          
          <h4 className="font-medium text-gray-900 mb-1">
            {entry.title}
          </h4>
          
          <p className="text-sm text-gray-600 mb-3">
            {entry.description}
          </p>

          {/* Event Details */}
          <div className="bg-blue-50 rounded-md p-3 mb-3">
            <div className="text-sm space-y-1">
              {entry.fromPlan && entry.toPlan && (
                <div className="flex justify-between">
                  <span className="font-medium text-blue-900">Plan Change:</span>
                  <span className="text-blue-700">
                    {entry.fromPlan} → {entry.toPlan}
                  </span>
                </div>
              )}
              {entry.fromStatus && entry.toStatus && (
                <div className="flex justify-between">
                  <span className="font-medium text-blue-900">Status Change:</span>
                  <span className="text-blue-700">
                    {entry.fromStatus} → {entry.toStatus}
                  </span>
                </div>
              )}
              {entry.assetType && entry.assetQuantity && (
                <div className="flex justify-between">
                  <span className="font-medium text-blue-900">Asset:</span>
                  <span className="text-blue-700">
                    {entry.assetQuantity} {entry.assetType}
                    {entry.assetDuration && ` (${entry.assetDuration})`}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-gray-500">
            Action by {getFullName(entry)}
          </div>
        </div>
      </div>
    </div>
  );
}