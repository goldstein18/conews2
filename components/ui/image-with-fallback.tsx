/**
 * ImageWithFallback Component
 * Wrapper around Next.js Image component that handles broken/failed images gracefully
 *
 * Features:
 * - Automatic fallback to default image (owl logo) on error
 * - Centered owl logo with gradient background
 * - Smooth transition when fallback is triggered
 * - Maintains aspect ratio and all Next.js Image props
 */

'use client';

import { useState, useEffect } from 'react';
import Image, { type ImageProps } from 'next/image';
import { DEFAULT_IMAGE } from '@/lib/constants/images';

export interface ImageWithFallbackProps extends Omit<ImageProps, 'onError'> {
  /**
   * Custom fallback image source (defaults to owl logo)
   */
  fallbackSrc?: string;
  /**
   * Additional className for the fallback container
   */
  fallbackClassName?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = DEFAULT_IMAGE,
  fallbackClassName = '',
  className = '',
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Fallback background - only shown when image fails */}
      {hasError && (
        <div
          className={`absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/15 flex items-center justify-center ${fallbackClassName}`}
        >
          {/* Centered owl logo */}
          <div className="relative w-3/5 h-3/5">
            <Image
              src={fallbackSrc}
              alt="CultureOwl Logo"
              fill
              className="object-contain opacity-80"
              sizes="(max-width: 768px) 60vw, 40vw"
              priority={false}
            />
          </div>
        </div>
      )}

      {/* Main image */}
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        onError={handleError}
        className={`${className} ${hasError ? 'opacity-0' : ''}`}
      />
    </div>
  );
}
