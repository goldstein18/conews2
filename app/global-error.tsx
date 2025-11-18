'use client';

import * as Sentry from "@sentry/nextjs";
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Capture the error in Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Error del Sistema
            </h2>
            <p className="text-gray-600 mb-6">
              Ha ocurrido un error crítico. Nuestro equipo técnico ha sido notificado automáticamente.
            </p>
            <div className="space-y-3">
              <button
                onClick={reset}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-3"
              >
                Reintentar
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Ir al Inicio
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left max-w-md mx-auto">
                <summary className="cursor-pointer font-semibold">
                  Detalles del Error (Solo desarrollo)
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                  {error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}