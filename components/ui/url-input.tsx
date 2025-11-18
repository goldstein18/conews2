"use client";

import * as React from "react";
import { Globe, Facebook, Twitter, Instagram, Youtube, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeUrl } from "@/lib/url-utils";

export type SocialPlatform = 'website' | 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'tiktok';

export interface UrlInputProps extends Omit<React.ComponentProps<"input">, 'type' | 'onChange'> {
  /**
   * Default protocol to use when normalizing URLs
   * @default 'https'
   */
  defaultProtocol?: 'http' | 'https';

  /**
   * Social media platform type for icon display
   * @default 'website'
   */
  socialPlatform?: SocialPlatform;

  /**
   * Show protocol prefix indicator (https:// or http://)
   * @default true
   */
  showProtocol?: boolean;

  /**
   * Custom onChange handler that receives the normalized URL
   */
  onValueChange?: (normalizedUrl: string) => void;

  /**
   * Optional onChange for raw input value (before normalization)
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Smart URL Input Component
 *
 * Features:
 * - Auto-normalizes URLs on blur (adds protocol if missing)
 * - Preserves existing protocols (http/https)
 * - Shows platform-specific icons
 * - Visual protocol indicator
 * - Handles malformed URLs intelligently
 *
 * @example
 * ```tsx
 * <UrlInput
 *   defaultProtocol="https"
 *   socialPlatform="facebook"
 *   placeholder="facebook.com/yourpage"
 *   onValueChange={(url) => field.onChange(url)}
 * />
 * ```
 */
const UrlInput = React.forwardRef<HTMLInputElement, UrlInputProps>(
  ({
    className,
    defaultProtocol = 'https',
    socialPlatform = 'website',
    showProtocol = false,
    onValueChange,
    onChange,
    onBlur,
    value: controlledValue,
    defaultValue,
    ...props
  }, ref) => {
    // Internal state for uncontrolled usage
    const [internalValue, setInternalValue] = React.useState<string>(
      (controlledValue as string) || (defaultValue as string) || ''
    );

    // Determine if component is controlled
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    // Get the appropriate icon for the platform
    const PlatformIcon = React.useMemo(() => {
      const iconMap: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
        website: Globe,
        facebook: Facebook,
        twitter: Twitter,
        instagram: Instagram,
        youtube: Youtube,
        tiktok: Music // Using Music icon for TikTok
      };
      return iconMap[socialPlatform];
    }, [socialPlatform]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (!isControlled) {
        setInternalValue(newValue);
      }

      // Call original onChange if provided
      if (onChange) {
        onChange(e);
      }
    };

    // Handle blur - normalize the URL
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const currentValue = e.target.value;

      if (currentValue && currentValue.trim()) {
        // Normalize the URL
        const normalized = normalizeUrl(currentValue, defaultProtocol);

        // Update internal state if uncontrolled
        if (!isControlled) {
          setInternalValue(normalized);
        }

        // Call onValueChange with normalized URL
        if (onValueChange) {
          onValueChange(normalized);
        }

        // Update the input element value directly for controlled components
        if (isControlled && ref && typeof ref !== 'function') {
          if (ref.current) {
            ref.current.value = normalized;
          }
        }
      } else if (!currentValue || !currentValue.trim()) {
        // Empty value - call onValueChange with empty string
        if (onValueChange) {
          onValueChange('');
        }
      }

      // Call original onBlur if provided
      if (onBlur) {
        onBlur(e);
      }
    };

    return (
      <div className="relative">
        {/* Platform Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <PlatformIcon className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Input Field */}
        <input
          type="url"
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          {...props}
        />

        {/* Protocol Indicator (optional) */}
        {showProtocol && value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <span className="text-xs text-muted-foreground font-mono">
              {(value as string).startsWith('http://') ? 'http://' : 'https://'}
            </span>
          </div>
        )}
      </div>
    );
  }
);

UrlInput.displayName = "UrlInput";

export { UrlInput };
