"use client";

import { useState } from "react";
import { Plus, History, AlertTriangle, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAssetCounters } from "@/app/dashboard/companies/hooks/use-asset-counters";
import { CompanyAssetHistoryModal } from "./company-asset-history-modal";

interface CompanyAssetCountersSectionProps {
  companyId: string;
  currentPlanBenefits?: {
    events: number;
  };
}

// Asset types configuration (using correct enum values)
const ASSET_TYPES = [
  { key: "EVENTS", name: "Events", icon: "🎉" },
  { key: "BANNERS", name: "Banners", icon: "🏪" }, 
  { key: "ESCOOPS", name: "Escoops", icon: "📰" },
  { key: "VENUES", name: "Venues", icon: "🏢" },
  { key: "RESTAURANTS", name: "Restaurants", icon: "🍽️" }
];

export function CompanyAssetCountersSection({ 
  companyId, 
  currentPlanBenefits 
}: CompanyAssetCountersSectionProps) {
  const [showAssetHistory, setShowAssetHistory] = useState(false);
  const [addQuantities, setAddQuantities] = useState<Record<string, number>>({});

  const { 
    assetCounters, 
    loading, 
    error, 
    isAddingAsset,
    addAsset
  } = useAssetCounters({ companyId });



  // Check if the current plan has unlimited events
  const hasUnlimitedEvents = currentPlanBenefits?.events === -1 || 
                            (currentPlanBenefits?.events && currentPlanBenefits.events >= 999999);

  // Check if an asset should be disabled
  const isAssetDisabled = (assetType: string) => {
    return assetType === "EVENTS" && hasUnlimitedEvents;
  };

  // Handle add quantity change
  const handleAddQuantityChange = (assetType: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setAddQuantities(prev => ({
      ...prev,
      [assetType]: numValue
    }));
  };

  // Handle add asset
  const handleAddAsset = async (assetType: string) => {
    const quantity = addQuantities[assetType];
    if (!quantity || quantity <= 0) return;

    const success = await addAsset({
      type: assetType,
      quantity,
      notes: `Added ${quantity} ${assetType} via Asset Management`
    });

    if (success) {
      setAddQuantities(prev => ({
        ...prev,
        [assetType]: 0
      }));
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-44 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-16 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asset Management</CardTitle>
          <CardDescription className="text-red-600">
            Failed to load asset counters: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Asset Management</CardTitle>
              <CardDescription>
                Track usage, add assets, and monitor availability
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              className="flex items-center space-x-2"
              onClick={() => setShowAssetHistory(true)}
            >
              <History className="h-4 w-4" />
              <span>Asset History</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Show all asset counters that come from API */}
          {assetCounters.map((counter, index) => {
            const assetTypeConfig = ASSET_TYPES.find(t => t.key === counter.assetType) || {
              key: counter.assetType,
              name: counter.assetType,
              icon: "📊"
            };
            const disabled = isAssetDisabled(counter.assetType);
            const addQuantity = addQuantities[counter.assetType] || 0;

            return (
              <div key={counter.assetType}>
                <div className="space-y-4">
                  {/* Asset Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{assetTypeConfig.icon}</span>
                      <div>
                        <h3 className="font-medium text-lg">{assetTypeConfig.name}</h3>
                        {disabled && (
                          <Badge variant="secondary" className="text-xs">
                            Unlimited in Plan
                          </Badge>
                        )}
                        {/* <p className="text-sm text-gray-600">
                          Last used: {formatLastUsed(counter.lastConsumedDate)}
                        </p> */}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {counter.isOutOfStock && (
                        <Badge variant="destructive" className="flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Out of Stock</span>
                        </Badge>
                      )}
                      {counter.isLowStock && !counter.isOutOfStock && (
                        <Badge variant="secondary" className="flex items-center space-x-1 bg-yellow-100 text-yellow-800">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Low Stock</span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar and Stats */}
                  {!disabled ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Usage: {counter.totalConsumed} / {counter.totalAvailable}</span>
                        <span className="font-medium">{counter.usagePercentage}% used</span>
                      </div>
                      <Progress 
                        value={counter.usagePercentage} 
                        className="h-3"
                        // Apply different colors based on usage
                      />
                      
                      {/* Detailed Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="font-semibold text-blue-600">{counter.planAllowed}</div>
                          <div className="text-xs text-gray-600">From Plan</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="font-semibold text-green-600">+{counter.individuallyAdded}</div>
                          <div className="text-xs text-gray-600">Added</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="font-semibold text-orange-600">{counter.totalConsumed}</div>
                          <div className="text-xs text-gray-600">Used</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-gray-600">{counter.totalRemaining}</div>
                          <div className="text-xs text-gray-600">Available</div>
                        </div>
                      </div>
                    </div>
                  ) : disabled ? (
                    <div className="flex items-center justify-center p-8 bg-blue-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">∞</div>
                        <div className="text-sm text-blue-600 font-medium">Unlimited</div>
                        <div className="text-xs text-gray-600">Included in your plan</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                      <div className="text-center text-gray-500">
                        <div className="text-sm">No data available</div>
                      </div>
                    </div>
                  )}

                  {/* Add Asset Section */}
                  {!disabled && (
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <Label htmlFor={`add-${counter.assetType}`} className="text-sm font-medium">
                            Add {assetTypeConfig.name}
                          </Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Input
                              id={`add-${counter.assetType}`}
                              type="number"
                              min="1"
                              max="999"
                              step="1"
                              value={addQuantity || ""}
                              onChange={(e) => handleAddQuantityChange(counter.assetType, e.target.value)}
                              className="w-24"
                              placeholder="0"
                            />
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => handleAddAsset(counter.assetType)}
                              disabled={isAddingAsset || !addQuantity || addQuantity <= 0}
                              className="flex items-center space-x-1"
                            >
                              {isAddingAsset ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Plus className="h-3 w-3" />
                              )}
                              <span>{isAddingAsset ? 'Adding...' : 'Add'}</span>
                            </Button>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">This month</div>
                          <div className="font-medium text-sm flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {counter.consumedThisMonth}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Separator between asset types */}
                {index < assetCounters.length - 1 && (
                  <Separator className="mt-8" />
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Asset History Modal */}
      <CompanyAssetHistoryModal
        isOpen={showAssetHistory}
        onClose={() => setShowAssetHistory(false)}
        companyId={companyId}
      />
    </>
  );
}