/**
 * Social sharing buttons component
 * Matches Timeout-style social sharing (Facebook, Twitter, Pinterest, Email, WhatsApp)
 */

'use client';

import { Facebook, Twitter, Mail, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ArticleShareButtonsProps {
  title: string;
  url: string;
  className?: string;
}

export function ArticleShareButtons({ title, url, className }: ArticleShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    const shareUrl = shareLinks[platform];
    if (platform === 'email' || platform === 'whatsapp') {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(
        shareUrl,
        '_blank',
        'width=600,height=400,menubar=no,toolbar=no,resizable=yes,scrollbars=yes'
      );
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url
        });
      } catch {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className="text-sm font-medium text-gray-700 mr-2">Share</span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('facebook')}
        className="h-9 px-3 text-gray-700 hover:text-[#1877F2] hover:bg-[#1877F2]/5"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="h-9 px-3 text-gray-700 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/5"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('pinterest')}
        className="h-9 px-3 text-gray-700 hover:text-[#E60023] hover:bg-[#E60023]/5"
        aria-label="Share on Pinterest"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.372 0 12s5.373 12 12 12c5.084 0 9.426-3.163 11.174-7.637-.15-.671-.855-4.46.354-7.553.761-1.951 2.351-3.144 4.044-3.144 1.273 0 1.895.801 1.895 1.763 0 1.272-.807 3.169-1.222 4.928-.348 1.493.747 2.711 2.224 2.711 2.668 0 4.716-2.814 4.716-6.877 0-3.589-2.574-6.098-6.253-6.098-4.265 0-6.759 3.198-6.759 6.506 0 1.28.492 2.652 1.543 3.118.169.082.197.046.197-.114l-.183-2.316c-.021-.088-.056-.109-.129-.179-.38-.35-1.249-1.571-1.249-3.138 0-4.058 2.954-7.783 8.579-7.783 4.505 0 8.003 3.204 8.003 7.483 0 4.48-2.828 8.082-6.752 8.082-1.319 0-2.557-.686-2.981-1.594l-.809 3.076c-.293 1.142-1.082 2.569-1.611 3.438 1.218.375 2.506.578 3.832.578 6.627 0 12-5.372 12-12S18.627 0 12 0z" />
        </svg>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('email')}
        className="h-9 px-3 text-gray-700 hover:text-primary hover:bg-primary/5"
        aria-label="Share via Email"
      >
        <Mail className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('whatsapp')}
        className="h-9 px-3 text-gray-700 hover:text-[#25D366] hover:bg-[#25D366]/5"
        aria-label="Share on WhatsApp"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </Button>

      {typeof window !== 'undefined' && navigator.share && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNativeShare}
          className="h-9 px-3 text-gray-700 hover:text-primary hover:bg-primary/5"
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

