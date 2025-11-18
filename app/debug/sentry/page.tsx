'use client';

import { captureMessage, captureAPIError, captureGraphQLError } from '@/lib/sentry';
import { useState } from 'react';

export default function SentryDebugPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testMessage = () => {
    captureMessage('Test message from frontend', 'info');
    addResult('Mensaje de prueba enviado a Sentry');
  };

  const testError = () => {
    try {
      throw new Error('Error de prueba desde el frontend');
    } catch (error) {
      captureAPIError(error, { 
        component: 'SentryDebugPage',
        action: 'testError' 
      });
      addResult('Error de prueba capturado y enviado a Sentry');
    }
  };

  const testGraphQLError = () => {
    const mockGraphQLError = {
      message: 'GraphQL test error',
      locations: [{ line: 1, column: 1 }],
      path: ['testQuery']
    };
    
    captureGraphQLError(
      mockGraphQLError, 
      'query TestQuery { testField }',
      { testVariable: 'testValue' }
    );
    addResult('Error GraphQL de prueba enviado a Sentry');
  };

  const testActualError = () => {
    // This will trigger the error boundary
    throw new Error('Error real para probar Error Boundary');
  };

  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Página de Debug no disponible en producción</h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sentry Integration Debug</h1>
      
      <div className="grid gap-4 mb-8">
        <button
          onClick={testMessage}
          className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Enviar Mensaje de Prueba
        </button>
        
        <button
          onClick={testError}
          className="p-4 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Capturar Error de API
        </button>
        
        <button
          onClick={testGraphQLError}
          className="p-4 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Capturar Error de GraphQL
        </button>
        
        <button
          onClick={testActualError}
          className="p-4 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Generar Error Real (Error Boundary)
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-3">Resultados de Pruebas:</h2>
        {testResults.length === 0 ? (
          <p className="text-gray-500">No hay resultados aún</p>
        ) : (
          <ul className="space-y-1">
            {testResults.map((result, index) => (
              <li key={index} className="text-sm font-mono">
                {result}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-yellow-800 mb-2">Instrucciones:</h3>
        <ol className="text-sm text-yellow-700 space-y-1">
          <li>1. Configurar SENTRY_DSN en .env.local</li>
          <li>2. Hacer clic en los botones para probar diferentes tipos de errores</li>
          <li>3. Verificar en el dashboard de Sentry que los errores se recibieron</li>
          <li>4. Los errores incluirán contexto del usuario si está autenticado</li>
        </ol>
      </div>
    </div>
  );
}