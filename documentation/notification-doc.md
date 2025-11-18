Queries y Mutations del Módulo de Notificaciones
🔍 QUERIES
1. notifications - Obtener notificaciones paginadas del usuario actual
Request:
query GetMyNotifications {
  notifications(
    first: 20
    after: "notification-cursor-id"  # Opcional para paginación
    includeTotalCount: true
    filter: {
      type: DIRECT              # Opcional: GLOBAL, DIRECT, SYSTEM
      isRead: false             # Opcional: true/false
      dateFrom: "2025-10-01T00:00:00Z"  # Opcional
      dateTo: "2025-10-31T23:59:59Z"    # Opcional
    }
  ) {
    edges {
      node {
        id
        title
        message
        type
        userId
        targetRole
        isRead
        readAt
        metadata
        createdBy
        creator {
          id
          email
          firstName
          lastName
        }
        user {
          id
          email
          firstName
          lastName
        }
        createdAt
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
Response:
{
  "data": {
    "notifications": {
      "edges": [
        {
          "node": {
            "id": "clxxx123456",
            "title": "Payment Successful",
            "message": "Your payment for the Premium plan has been processed successfully",
            "type": "SYSTEM",
            "userId": "user-123",
            "targetRole": null,
            "isRead": false,
            "readAt": null,
            "metadata": {
              "paymentId": "pay_123",
              "amount": 99.99,
              "planSlug": "premium"
            },
            "createdBy": "system",
            "creator": {
              "id": "system-user-id",
              "email": "system@cultureowl.com",
              "firstName": "System",
              "lastName": "Admin"
            },
            "user": {
              "id": "user-123",
              "email": "user@example.com",
              "firstName": "John",
              "lastName": "Doe"
            },
            "createdAt": "2025-10-08T15:30:00Z"
          },
          "cursor": "clxxx123456"
        },
        {
          "node": {
            "id": "clxxx789012",
            "title": "System Maintenance",
            "message": "The platform will be down for maintenance on Oct 15 from 2-4 AM EST",
            "type": "GLOBAL",
            "userId": null,
            "targetRole": null,
            "isRead": true,
            "readAt": "2025-10-08T16:00:00Z",
            "metadata": {
              "priority": "high",
              "category": "maintenance"
            },
            "createdBy": "admin-user-id",
            "creator": {
              "id": "admin-user-id",
              "email": "admin@cultureowl.com",
              "firstName": "Admin",
              "lastName": "User"
            },
            "user": null,
            "createdAt": "2025-10-08T14:00:00Z"
          },
          "cursor": "clxxx789012"
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "clxxx789012"
      },
      "totalCount": 45
    }
  }
}
2. notification - Obtener una notificación específica por ID
Request:
query GetNotification {
  notification(id: "clxxx123456") {
    id
    title
    message
    type
    isRead
    readAt
    metadata
    creator {
      firstName
      lastName
      email
    }
    createdAt
  }
}
Response:
{
  "data": {
    "notification": {
      "id": "clxxx123456",
      "title": "Payment Successful",
      "message": "Your payment for the Premium plan has been processed successfully",
      "type": "SYSTEM",
      "isRead": false,
      "readAt": null,
      "metadata": {
        "paymentId": "pay_123",
        "amount": 99.99,
        "planSlug": "premium"
      },
      "creator": {
        "firstName": "System",
        "lastName": "Admin",
        "email": "system@cultureowl.com"
      },
      "createdAt": "2025-10-08T15:30:00Z"
    }
  }
}
3. unreadNotificationsCount - Contador de notificaciones no leídas
Request:
query GetUnreadCount {
  unreadNotificationsCount
}
Response:
{
  "data": {
    "unreadNotificationsCount": 12
  }
}
4. connectedClientsCount - Número de clientes SSE conectados (Solo Admin)
Request:
query GetConnectedClients {
  connectedClientsCount
}
Response:
{
  "data": {
    "connectedClientsCount": 47
  }
}
Permisos requeridos: notification:read
✏️ MUTATIONS
1. sendGlobalNotification - Enviar notificación global (Solo Admin)
Request:
mutation SendGlobalNotification {
  sendGlobalNotification(input: {
    title: "System Maintenance"
    message: "The platform will be down for maintenance on Oct 15 from 2-4 AM EST"
    type: GLOBAL
    metadata: {
      priority: "high"
      category: "maintenance"
      scheduledDate: "2025-10-15"
    }
  }) {
    id
    title
    message
    type
    userId
    metadata
    createdAt
    creator {
      firstName
      lastName
      email
    }
  }
}
Response:
{
  "data": {
    "sendGlobalNotification": {
      "id": "clxxx345678",
      "title": "System Maintenance",
      "message": "The platform will be down for maintenance on Oct 15 from 2-4 AM EST",
      "type": "GLOBAL",
      "userId": null,
      "metadata": {
        "priority": "high",
        "category": "maintenance",
        "scheduledDate": "2025-10-15"
      },
      "createdAt": "2025-10-08T18:00:00Z",
      "creator": {
        "firstName": "Admin",
        "lastName": "User",
        "email": "admin@cultureowl.com"
      }
    }
  }
}
Permisos requeridos: notification:broadcast
2. sendDirectNotification - Enviar notificación directa a un usuario (Solo Admin)
Request:
mutation SendDirectNotification {
  sendDirectNotification(input: {
    title: "Payment Failed"
    message: "Your payment for the Premium plan could not be processed. Please update your payment method."
    type: DIRECT
    userId: "user-123"
    metadata: {
      paymentId: "pay_failed_456"
      planSlug: "premium"
      failureReason: "insufficient_funds"
    }
  }) {
    id
    title
    message
    type
    userId
    user {
      email
      firstName
      lastName
    }
    metadata
    createdAt
  }
}
Response:
{
  "data": {
    "sendDirectNotification": {
      "id": "clxxx567890",
      "title": "Payment Failed",
      "message": "Your payment for the Premium plan could not be processed. Please update your payment method.",
      "type": "DIRECT",
      "userId": "user-123",
      "user": {
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "metadata": {
        "paymentId": "pay_failed_456",
        "planSlug": "premium",
        "failureReason": "insufficient_funds"
      },
      "createdAt": "2025-10-08T18:15:00Z"
    }
  }
}
Permisos requeridos: notification:broadcast
3. markNotificationAsRead - Marcar notificación(es) como leída(s)
Opción A - Marcar una sola notificación: Request:
mutation MarkOneAsRead {
  markNotificationAsRead(input: {
    id: "clxxx123456"
  }) {
    id
    isRead
    readAt
  }
}
Response:
{
  "data": {
    "markNotificationAsRead": {
      "id": "clxxx123456",
      "isRead": true,
      "readAt": "2025-10-08T18:30:00Z"
    }
  }
}
Opción B - Marcar múltiples notificaciones: Request:
mutation MarkMultipleAsRead {
  markNotificationAsRead(input: {
    ids: ["clxxx123456", "clxxx789012", "clxxx345678"]
  }) {
    count
  }
}
Response:
{
  "data": {
    "markNotificationAsRead": {
      "count": 3
    }
  }
}
4. markAllNotificationsAsRead - Marcar todas las notificaciones como leídas
Request:
mutation MarkAllAsRead {
  markAllNotificationsAsRead
}
Response:
{
  "data": {
    "markAllNotificationsAsRead": 12
  }
}
🔌 REST ENDPOINTS
1. SSE Stream Endpoint - Conectarse al stream de notificaciones en tiempo real
Endpoint: GET /notifications/stream Autenticación:
Opción A: Query parameter: ?token=YOUR_JWT_TOKEN
Opción B: Header: Authorization: Bearer YOUR_JWT_TOKEN
Ejemplo con JavaScript (EventSource):
const token = localStorage.getItem('jwt_token');
const eventSource = new EventSource(
  `http://localhost:3001/notifications/stream?token=${token}`
);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
  
  if (data.type === 'connected') {
    console.log('✅ Connected to notification stream');
  } else {
    // Nueva notificación
    displayNotification(data.title, data.message);
  }
};

eventSource.onerror = (error) => {
  console.error('SSE Error:', error);
  // EventSource reconecta automáticamente
};
Formato de mensajes SSE: Mensaje de conexión:
{
  "type": "connected",
  "message": "Successfully connected to notification stream",
  "timestamp": "2025-10-08T18:00:00Z"
}
Notificación real:
{
  "id": "clxxx123456",
  "title": "Payment Successful",
  "message": "Your payment has been processed",
  "type": "SYSTEM",
  "userId": "user-123",
  "metadata": {
    "paymentId": "pay_123",
    "amount": 99.99
  },
  "createdAt": "2025-10-08T18:30:00Z"
}
Heartbeat (cada 30 segundos):
: heartbeat
2. Health Check Endpoint - Verificar estado del servicio SSE
Endpoint: GET /notifications/health Response:
{
  "status": "ok",
  "service": "notifications-sse",
  "connectedClients": 47,
  "timestamp": "2025-10-08T18:45:00Z"
}
🔧 Uso desde Otros Módulos (TypeScript)
import { Injectable } from '@nestjs/common';
import { NotificationsService } from '@/modules/notifications/notifications.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly notificationsService: NotificationsService
  ) {}

  async handlePaymentSuccess(userId: string, payment: any) {
    // Enviar notificación de sistema
    await this.notificationsService.sendSystemNotification(
      userId,
      'Payment Successful',
      `Your payment of $${payment.amount} has been processed successfully`,
      {
        paymentId: payment.id,
        amount: payment.amount,
        planSlug: payment.planSlug,
        timestamp: new Date().toISOString()
      }
    );
  }

  async handlePaymentFailed(userId: string, payment: any) {
    await this.notificationsService.sendSystemNotification(
      userId,
      'Payment Failed',
      'Your payment could not be processed. Please update your payment method.',
      {
        paymentId: payment.id,
        failureReason: payment.failureReason,
        retryUrl: '/account/payment-methods'
      }
    );
  }

  async notifyMultipleUsers(userIds: string[], title: string, message: string) {
    await this.notificationsService.sendToMultipleUsers(
      userIds,
      title,
      message,
      'system',  // createdBy
      { source: 'payment-module' }
    );
  }
}
📝 Tipos de Notificación
enum NotificationType {
  GLOBAL = "GLOBAL",    // Broadcast a todos los usuarios (admin only)
  DIRECT = "DIRECT",    // Notificación directa a usuario específico
  SYSTEM = "SYSTEM"     // Notificación automática del sistema
}
🔐 Permisos
notification:read - Ver notificaciones (todos los usuarios autenticados)
notification:broadcast - Enviar notificaciones globales/directas (solo admins)
