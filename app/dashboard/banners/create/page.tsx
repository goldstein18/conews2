'use client';

import { useSearchParams } from 'next/navigation';
import { BannerCreationWizard } from './components';
import { BannerType } from '@/types/banners';

export default function CreateBannerPage() {
  const searchParams = useSearchParams();
  const bannerType = searchParams.get('type') as BannerType | null;

  return (
    <div className="container mx-auto py-8">
      <BannerCreationWizard bannerType={bannerType} />
    </div>
  );
}