'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { GripVertical, Image as ImageIcon, ExternalLink, Plus } from 'lucide-react';
import { useEscoopBuilderStore } from '@/store/escoop-builder-store';
import Image from 'next/image';


interface BannerItemProps {
  banner: {
    id: string;
    name: string;
    imageUrl?: string;
    link: string;
    position: number;
    isActive: boolean;
  };
  onToggleActive: (bannerId: string) => void;
}

function BannerItem({ banner, onToggleActive }: BannerItemProps) {
  return (
    <Card className={`mb-3 ${banner.isActive ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* Drag handle */}
          <div className="cursor-move mt-1">
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>

          {/* Banner preview */}
          <div className="flex-shrink-0">
            {banner.imageUrl ? (
              <Image
                src={banner.imageUrl}
                alt={banner.name}
                width={64}
                height={40}
                className="w-16 h-10 object-cover rounded border"
              />
            ) : (
              <div className="w-16 h-10 bg-gray-100 rounded border flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>

          {/* Banner info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium truncate">{banner.name}</h4>
              <Switch
                checked={banner.isActive}
                onCheckedChange={() => onToggleActive(banner.id)}
              />
            </div>

            <div className="space-y-1">
              <Badge variant="outline" className="text-xs">
                Position {banner.position + 1}
              </Badge>
              {banner.link && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  <span className="truncate">{banner.link}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EscoopBannersPanel() {
  const {
    banners,
    bannerOrder,
    setBanners,
    updateBannerOrder,
    toggleBannerActive
  } = useEscoopBuilderStore();

  // Mock data for demonstration
  useEffect(() => {
    // Load mock banners if none exist
    if (banners.length === 0) {
      const mockBanners = [
        {
          id: 'banner-1',
          name: 'Miami Food Co.',
          imageUrl: '/api/placeholder/600/150',
          link: 'https://miamifoodco.com',
          position: 0,
          isActive: true
        },
        {
          id: 'banner-2',
          name: 'Delivery Express',
          imageUrl: '/api/placeholder/600/150',
          link: 'https://deliveryexpress.com',
          position: 1,
          isActive: true
        },
        {
          id: 'banner-3',
          name: 'Restaurant Partner',
          imageUrl: undefined,
          link: 'https://partner.com',
          position: 2,
          isActive: false
        }
      ];
      setBanners(mockBanners);
    }
  }, [banners.length, setBanners]);

  const handleDragStart = (e: React.DragEvent, bannerId: string) => {
    e.dataTransfer.setData('text/plain', bannerId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetBannerId: string) => {
    e.preventDefault();
    const draggedBannerId = e.dataTransfer.getData('text/plain');

    if (draggedBannerId === targetBannerId) return;

    const newOrder = [...bannerOrder];
    const draggedIndex = newOrder.indexOf(draggedBannerId);
    const targetIndex = newOrder.indexOf(targetBannerId);

    // Remove dragged item and insert at target position
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedBannerId);

    updateBannerOrder(newOrder);
  };

  const orderedBanners = bannerOrder
    .map(bannerId => banners.find(b => b.id === bannerId))
    .filter((banner): banner is NonNullable<typeof banner> => Boolean(banner));

  const activeBannersCount = banners.filter(b => b.isActive).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {activeBannersCount} of {banners.length} banners active
        </div>
        <Button size="sm" variant="outline" disabled>
          <Plus className="h-4 w-4 mr-1" />
          Add Banner
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Banner positions info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Banner Positions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">1</div>
                <span>Top banner (after header)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">2</div>
                <span>Middle banner (after events)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium">3</div>
                <span>Bottom banner (before footer)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tips & Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500">🎯</span>
                <span>Drag banners to reorder positions</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-500">⚡</span>
                <span>Toggle switches to enable/disable</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-500">📧</span>
                <span>Only active banners appear in newsletter</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banner list */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Available Banners</Label>
        {orderedBanners.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No banners available</h3>
              <p className="text-sm text-muted-foreground">
                No banners have been created for this eScoop yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {orderedBanners.map((banner, index) => (
              <div
                key={banner.id}
                draggable
                onDragStart={(e) => handleDragStart(e, banner.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, banner.id)}
              >
                <BannerItem
                  banner={{ ...banner, position: index }}
                  onToggleActive={toggleBannerActive}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}