"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

/**
 * Cloudflare Turnstile Widget Component
 *
 * CAPTCHA-alternative bot protection that provides a better UX
 * Docs: https://developers.cloudflare.com/turnstile/
 */

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId: string) => string;
    };
    onloadTurnstileCallback?: () => void;
  }
}

interface TurnstileOptions {
  sitekey: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  'timeout-callback'?: () => void;
}

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  onTimeout?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  id?: string;
  className?: string;
}

export function Turnstile({
  siteKey,
  onVerify,
  onError,
  onExpire,
  onTimeout,
  theme = 'light',
  size = 'normal',
  id = 'turnstile-widget',
  className = '',
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Turnstile script
  useEffect(() => {
    // Check if already loaded
    if (window.turnstile) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="turnstile"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true));
      return;
    }

    // Load the script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Wait a bit for Turnstile to initialize
      setTimeout(() => {
        if (window.turnstile) {
          setIsLoaded(true);
        } else {
          console.error('Turnstile object not available after script load');
          setError('Failed to load bot protection. Please refresh the page.');
          if (onError) onError();
        }
      }, 100);
    };

    script.onerror = (e) => {
      console.error('Failed to load Turnstile script:', e);
      setError('Failed to load bot protection. Please refresh the page.');
      if (onError) onError();
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          console.error('Error removing Turnstile widget:', e);
        }
      }
    };
  }, [onError]);

  // Render widget when script is loaded
  useEffect(() => {
    if (!isLoaded || !containerRef.current || !window.turnstile) {
      if (isLoaded && !window.turnstile) {
        console.error('Turnstile script loaded but window.turnstile is not available');
      }
      return;
    }

    // Prevent multiple renders
    if (widgetIdRef.current) {
      return;
    }

    // Validate siteKey
    if (!siteKey || siteKey.trim() === '') {
      console.error('Turnstile siteKey is empty or invalid');
      setError('Bot protection is not configured correctly.');
      return;
    }

    console.log('Rendering Turnstile widget with siteKey:', siteKey.substring(0, 10) + '...');

    try {
      const widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme,
        size,
        callback: (token: string) => {
          console.log('Turnstile verification successful');
          setError(null);
          onVerify(token);
        },
        'error-callback': () => {
          console.error('Turnstile error-callback triggered');
          setError('Verification failed. Please try again.');
          if (onError) onError();
        },
        'expired-callback': () => {
          console.warn('Turnstile expired-callback triggered');
          setError('Verification expired. Please try again.');
          if (onExpire) onExpire();
        },
        'timeout-callback': () => {
          console.warn('Turnstile timeout-callback triggered');
          setError('Verification timed out. Please try again.');
          if (onTimeout) onTimeout();
        },
      });

      console.log('Turnstile widget rendered successfully, ID:', widgetId);
      widgetIdRef.current = widgetId;
    } catch (err) {
      console.error('Error rendering Turnstile:', err);
      setError('Failed to initialize bot protection.');
      if (onError) onError();
    }
  }, [isLoaded, siteKey, theme, size, onVerify, onError, onExpire, onTimeout]);

  // Expose reset method
  useEffect(() => {
    const reset = () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.reset(widgetIdRef.current);
          setError(null);
        } catch (e) {
          console.error('Error resetting Turnstile:', e);
        }
      }
    };

    // Attach to container for external access if needed
    if (containerRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (containerRef.current as any).reset = reset;
    }
  }, []);

  return (
    <div className={className}>
      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Turnstile container */}
      <div
        id={id}
        ref={containerRef}
        className="flex justify-center"
      />

      {/* Loading state */}
      {!isLoaded && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}
    </div>
  );
}

/**
 * Hook to use Turnstile in forms
 *
 * Usage:
 * const { token, resetTurnstile, TurnstileWidget } = useTurnstile(siteKey);
 */
export function useTurnstile(siteKey: string) {
  const [token, setToken] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetTurnstile = () => {
    setToken(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (containerRef.current && (containerRef.current as any).reset) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (containerRef.current as any).reset();
    }
  };

  const TurnstileWidget = () => (
    <div ref={containerRef}>
      <Turnstile
        siteKey={siteKey}
        onVerify={setToken}
        onError={resetTurnstile}
        onExpire={resetTurnstile}
      />
    </div>
  );

  return {
    token,
    resetTurnstile,
    TurnstileWidget,
  };
}
