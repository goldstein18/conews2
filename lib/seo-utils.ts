/**
 * SEO Utilities
 * Handles environment detection and SEO configuration
 *
 * Staging (.vercel.app): Blocks indexing
 * Production (custom domain): Allows indexing
 */

/**
 * Detecta si estamos en production (dominio custom) o staging (vercel.app)
 * @returns true si es production, false si es staging
 */
export function isProductionEnvironment(): boolean {
  // En server-side durante build
  if (typeof window === 'undefined') {
    const url = process.env.NEXT_PUBLIC_VERCEL_URL ||
                process.env.VERCEL_URL ||
                'localhost';

    // Production = dominio custom, NO .vercel.app
    return !url.includes('.vercel.app') && !url.includes('localhost');
  }

  // En client-side
  const hostname = window.location.hostname;
  return !hostname.includes('.vercel.app') && hostname !== 'localhost';
}

/**
 * Obtiene la URL base del sitio según el ambiente
 * @returns URL completa del sitio
 */
export function getSiteUrl(): string {
  if (isProductionEnvironment()) {
    return 'https://cultureowl.com';
  }

  // Vercel preview URL
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

/**
 * Obtiene configuración de robots basada en el ambiente
 * Staging: noindex, nofollow
 * Production: index, follow con configuración completa
 */
export function getRobotsConfig() {
  if (isProductionEnvironment()) {
    // PRODUCTION: Permitir indexación
    return {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    };
  }

  // STAGING: Bloquear indexación
  return {
    index: false,
    follow: false,
  };
}
