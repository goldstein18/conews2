'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to events listing page - drafts are now created from there
    router.replace('/dashboard/events');
  }, [router]);

  // This page is deprecated - drafts are now created directly from the listing
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-gray-600">Redirecting to events...</p>
    </div>
  );
}