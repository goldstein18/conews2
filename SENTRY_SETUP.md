# Configuración de Sentry

## Información General
Este frontend ahora tiene Sentry integrado para monitoreo de errores y performance, sincronizado con tu API backend que ya usa Sentry.

## Configuración Requerida

### 1. Variables de Entorno
Actualiza tu archivo `.env.local` con tus credenciales de Sentry:

```bash
# Sentry Configuration
SENTRY_DSN=https://tu-dsn@sentry.io/proyecto-id
SENTRY_ORG=tu-organizacion-sentry
SENTRY_PROJECT=tu-proyecto-sentry
SENTRY_AUTH_TOKEN=tu-token-de-auth-sentry

# Para el cliente (públicas)
NEXT_PUBLIC_SENTRY_DSN=https://tu-dsn@sentry.io/proyecto-id
```

### 2. Configuración del Proyecto Sentry
1. Ve a tu dashboard de Sentry
2. Crea un nuevo proyecto para el frontend (o usa el existente)
3. Obtén el DSN del proyecto
4. Genera un token de autenticación en Settings > Auth Tokens

### 3. Archivo sentry.properties
Actualiza el archivo `sentry.properties` con tus datos:

```
defaults.url=https://sentry.io/
defaults.org=tu-organizacion-sentry
defaults.project=tu-proyecto-sentry
auth.token=tu-token-de-auth-sentry
```

## Características Implementadas

### ✅ Captura Automática de Errores
- **Error Boundary**: Captura errores de React y los envía a Sentry
- **Global Error Handler**: Maneja errores críticos de Next.js
- **GraphQL Errors**: Errores de GraphQL se capturan automáticamente en `/api/graphql`

### ✅ Contexto de Usuario
- Se establece automáticamente cuando el usuario se autentica
- Se limpia al hacer logout
- Incluye: ID, email, y rol del usuario

### ✅ Breadcrumbs (Migajas de Pan)
- Seguimiento de acciones de GraphQL
- Errores de autenticación JWT
- Navegación y eventos importantes

### ✅ Performance Monitoring
- Monitoreo de rendimiento habilitado
- Sampling configurado para desarrollo y producción
- Session Replay para debugging visual

### ✅ Security & Privacy
- CSP headers actualizados para permitir Sentry
- Tunneling configurado (`/monitoring`) para evitar ad-blockers
- Source maps ocultados en producción

## Archivos Creados/Modificados

### Nuevos Archivos:
- `sentry.client.config.ts` - Configuración del cliente
- `sentry.server.config.ts` - Configuración del servidor  
- `sentry.edge.config.ts` - Configuración de edge runtime
- `sentry.properties` - Configuración de build
- `lib/sentry.ts` - Utilities de Sentry
- `components/error-boundary.tsx` - Error boundary de React
- `app/global-error.tsx` - Error global de Next.js
- `app/debug/sentry/page.tsx` - Página debug (solo desarrollo)

### Archivos Modificados:
- `next.config.ts` - Wrapper de Sentry y CSP headers
- `app/layout.tsx` - Error boundary agregado
- `app/api/graphql/route.ts` - Tracking de errores GraphQL
- `store/auth-store.ts` - Contexto de usuario Sentry
- `package.json` - Dependency @sentry/nextjs agregada

## Testing

### Página de Debug (Solo Desarrollo)
Visita `/debug/sentry` para probar la integración:
- Envío de mensajes de prueba
- Simulación de errores de API
- Errores de GraphQL
- Error boundary testing

### Verificación Manual
1. Genera un error intencionalmente en la app
2. Ve a tu dashboard de Sentry  
3. Verifica que el error aparezca con contexto completo
4. Revisa que el contexto de usuario esté presente (si autenticado)

## Sincronización con Backend
- Ambos frontend y backend reportan al mismo proyecto/organización Sentry
- Los errores de comunicación API ↔ Frontend serán visibles en ambos lados
- El contexto de usuario será consistente entre frontend y backend
- Los transaction traces conectarán requests entre servicios

## Comandos de Build
```bash
# Desarrollo (con debug info)
npm run dev

# Build de producción (con source maps upload)
npm run build

# Lint
npm run lint
```

## Notas de Production

### Configuración CSP
Los headers CSP han sido actualizados para permitir conexiones a Sentry:
```
connect-src 'self' https://*.sentry.io
```

### Source Maps
- Se suben automáticamente en builds de producción
- Se ocultan del cliente final
- Incluyen contexto completo para debugging

### Performance Impact
- Sampling configurado al 10% en producción para Session Replay
- Errores se capturan al 100%
- Performance traces al 100% (ajustar según tráfico)

## Troubleshooting

### Error: "Sentry DSN not configured"
- Verifica que `NEXT_PUBLIC_SENTRY_DSN` esté en `.env.local`
- Reinicia el servidor de desarrollo

### Source Maps no suben
- Verifica `SENTRY_AUTH_TOKEN` en `.env.local`
- Verifica conexión a internet durante build
- Revisa que `sentry.properties` tenga los datos correctos

### Errores no aparecen en Sentry
- Verifica que la configuración DSN sea correcta
- Revisa la consola del browser para errores de Sentry
- Verifica que el proyecto Sentry esté activo

## Siguiente Paso
Una vez configurado, puedes personalizar:
- Sampling rates en los archivos de configuración
- Filtros de errores específicos  
- Tags adicionales para categorización
- Integración con alertas y notificaciones