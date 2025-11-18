"use client";

import { useState } from "react";
import { Save, History } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCompanyAssets } from "@/app/dashboard/companies/hooks/use-company-assets";
import { CompanyAssetHistoryModal } from "./company-asset-history-modal";

interface CompanyAdditionalAssetsSectionProps {
  companyId: string;
  currentPlanBenefits?: {
    events: number;
    // Add other benefits if needed
  };
}

// Asset configuration based on the API structure (using the enum values from your API)
const ASSET_CATEGORIES = [
  {
    title: "EVENTS",
    assets: [
      { key: "EVENTS", name: "Events", duration: null }
    ]
  },
  {
    title: "BANNERS", 
    assets: [
      { key: "BANNERS", name: "Blue (3mo)", duration: "3mo" },
      { key: "BANNERS", name: "Blue (6mo)", duration: "6mo" },
      { key: "BANNERS", name: "Blue (12mo)", duration: "12mo" },
      { key: "BANNERS", name: "Green (3mo)", duration: "3mo" },
      { key: "BANNERS", name: "Green (6mo)", duration: "6mo" },
      { key: "BANNERS", name: "Green (12mo)", duration: "12mo" },
      { key: "BANNERS", name: "Red (3mo)", duration: "3mo" },
      { key: "BANNERS", name: "ROS", duration: null },
      { key: "BANNERS", name: "Leaderboard Banner", duration: null },
      { key: "BANNERS", name: "Marquees", duration: null }
    ]
  },
  {
    title: "ESCOOPS",
    assets: [
      { key: "ESCOOPS", name: "Inclusions", duration: null },
      { key: "ESCOOPS", name: "Features", duration: null },
      { key: "ESCOOPS", name: "Dedicated", duration: null }
    ]
  },
  {
    title: "DIRECTORIES",
    assets: [
      { key: "VENUES", name: "Venues", duration: null },
      { key: "RESTAURANTS", name: "Restaurants", duration: null }
    ]
  }
];

export function CompanyAdditionalAssetsSection({ companyId, currentPlanBenefits }: CompanyAdditionalAssetsSectionProps) {
  const [assetQuantities, setAssetQuantities] = useState<Record<string, number>>({});
  const [showAssetHistory, setShowAssetHistory] = useState(false);
  
  const { assets, loading, isAdding, addAsset } = useCompanyAssets({ companyId });

  // Check if the current plan has unlimited events
  const hasUnlimitedEvents = currentPlanBenefits?.events === -1 || 
                            (currentPlanBenefits?.events && currentPlanBenefits.events >= 999999);

  // Check if an asset should be disabled based on current plan
  const isAssetDisabled = (assetKey: string) => {
    if (assetKey === "EVENTS" && hasUnlimitedEvents) {
      return true;
    }
    // Add more conditions here for other asset types if needed
    return false;
  };



  // Create unique key for asset with duration
  const createAssetKey = (assetKey: string, duration: string | null, name: string) => {
    return duration ? `${assetKey}_${duration}_${name.replace(/\s+/g, '_').toUpperCase()}` : `${assetKey}_${name.replace(/\s+/g, '_').toUpperCase()}`;
  };

  // Get current quantity for an asset
  const getCurrentQuantity = (assetKey: string, duration: string | null, name: string) => {
    const fullKey = createAssetKey(assetKey, duration, name);
    const existingAsset = assets.find(asset => 
      asset.type === assetKey && 
      asset.duration === duration
    );
    return assetQuantities[fullKey] ?? existingAsset?.quantity ?? 0;
  };

  // Handle quantity change
  const handleQuantityChange = (assetKey: string, duration: string | null, name: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const fullKey = createAssetKey(assetKey, duration, name);
    setAssetQuantities(prev => ({
      ...prev,
      [fullKey]: numValue
    }));
  };

  // Check if there are changes to save
  const hasChanges = () => {
    return Object.keys(assetQuantities).length > 0 && Object.values(assetQuantities).some(qty => qty > 0);
  };

  // Save changes
  const handleSave = async () => {
    const changes = Object.entries(assetQuantities).filter(([, quantity]) => quantity > 0);

    if (changes.length === 0) {
      return;
    }

    // Process each change
    for (const [fullKey, quantity] of changes) {
      // Parse the full key to extract type, duration, and name
      const parts = fullKey.split('_');
      const assetType = parts[0]; // EVENTS, BANNERS, etc.
      
      let duration: string | undefined;
      let assetName = "";
      
      if (parts.length > 1) {
        // Check if second part is duration
        if (['3mo', '6mo', '12mo'].includes(parts[1])) {
          duration = parts[1];
          assetName = parts.slice(2).join(' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        } else {
          assetName = parts.slice(1).join(' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        }
      }

      await addAsset({
        type: assetType,
        quantity,
        duration,
        notes: `Added ${assetName} via Additional Assets section`
      });
    }

    // Clear changes after saving
    setAssetQuantities({});
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
            <div key={i}>
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Additional Assets</CardTitle>
              <CardDescription>
                Assign additional assets to this member
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              className="flex items-center space-x-2"
              onClick={() => setShowAssetHistory(true)}
            >
              <History className="h-4 w-4" />
              <span>Additional Asset History</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {ASSET_CATEGORIES.map((category, categoryIndex) => (
            <div key={category.title}>
              <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">
                {category.title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.assets.map((asset) => {
                  const uniqueId = createAssetKey(asset.key, asset.duration, asset.name);
                  const disabled = isAssetDisabled(asset.key);
                  return (
                    <div key={uniqueId} className="space-y-2">
                      <Label htmlFor={uniqueId} className="text-sm font-medium">
                        {asset.name}
                        {disabled && (
                          <span className="text-xs text-gray-500 ml-2 font-normal">
                            (Unlimited in plan)
                          </span>
                        )}
                      </Label>
                      <Input
                        id={uniqueId}
                        type="number"
                        min="0"
                        step="1"
                        value={disabled ? "∞" : getCurrentQuantity(asset.key, asset.duration, asset.name)}
                        onChange={(e) => handleQuantityChange(asset.key, asset.duration, asset.name, e.target.value)}
                        className={`w-full ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        placeholder={disabled ? "Unlimited" : "0"}
                        disabled={disabled}
                        readOnly={disabled}
                      />
                    </div>
                  );
                })}
              </div>
              
              {categoryIndex < ASSET_CATEGORIES.length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          ))}

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isAdding || !hasChanges()}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4" />
              <span>{isAdding ? 'Saving...' : 'Save'}</span>
            </Button>
          </div>
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