Queries for marquee api


Aquí están todos los queries y mutations principales del módulo Marquee con sus respuestas esperadas:
1. Crear Marquee
mutation CreateMarquee {
  createMarquee(createMarqueeInput: {
    name: "Summer Festival 2025"
    link: "https://cultureowl.com/summer-festival"
    startDate: "2025-06-01T00:00:00Z"
    endDate: "2025-08-31T23:59:59Z"
    market: "miami"
    companyId: "clx123abc456"
    
    # Configuración del botón (opcional)
    buttonText: "Get Tickets Now"
    buttonColor: "#FF5733"
    buttonFontWeight: BOLD
    
    # Media (opcional - se puede subir después)
    # desktopImage: "marquee/media/{hash}/desktop_image-{timestamp}.jpg"
    # mobileImage: "marquee/media/{hash}/mobile_image-{timestamp}.jpg"
  }) {
    id
    name
    slug
    link
    startDate
    endDate
    status
    market
    buttonText
    buttonColor
    buttonFontWeight
    desktopImage
    desktopVideo
    mobileImage
    mobileVideo
    desktopImageUrl
    desktopVideoUrl
    mobileImageUrl
    mobileVideoUrl
    bypassCredits
    company {
      id
      name
      email
    }
    owner {
      id
      email
      firstName
      lastName
    }
    createdBy
    createdAt
    updatedAt
  }
}
Respuesta esperada:
{
  "data": {
    "createMarquee": {
      "id": "clx789def123",
      "name": "Summer Festival 2025",
      "slug": "summer-festival-2025",
      "link": "https://cultureowl.com/summer-festival",
      "startDate": "2025-06-01T00:00:00.000Z",
      "endDate": "2025-08-31T23:59:59.000Z",
      "status": "PENDING",
      "market": "miami",
      "buttonText": "Get Tickets Now",
      "buttonColor": "#FF5733",
      "buttonFontWeight": "BOLD",
      "desktopImage": null,
      "desktopVideo": null,
      "mobileImage": null,
      "mobileVideo": null,
      "desktopImageUrl": null,
      "desktopVideoUrl": null,
      "mobileImageUrl": null,
      "mobileVideoUrl": null,
      "bypassCredits": false,
      "company": {
        "id": "clx123abc456",
        "name": "Miami Events Inc",
        "email": "contact@miamievents.com"
      },
      "owner": {
        "id": "clx456user789",
        "email": "john@miamievents.com",
        "firstName": "John",
        "lastName": "Smith"
      },
      "createdBy": "clx456user789",
      "createdAt": "2025-10-07T15:30:00.000Z",
      "updatedAt": "2025-10-07T15:30:00.000Z"
    }
  }
}

2. Generar Pre-signed URL para Desktop Image
mutation GenerateMarqueeDesktopImageUpload {
  generateMarqueeMediaUploadUrl(
    generateMarqueeMediaUploadUrlInput: {
      marqueeId: "clx789def123"
      fileName: "summer-festival-desktop.jpg"
      contentType: "image/jpeg"
      fileSize: 3145728  # 3MB
      mediaType: "desktop_image"
    }
  ) {
    uploadUrl
    key
    expiresIn
    maxFileSize
    recommendedDimensions
    mediaType
  }
}
Respuesta esperada:
{
  "data": {
    "generateMarqueeMediaUploadUrl": {
      "uploadUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/marquee/media/a1b2c3d4e5f6g7h8/desktop_image-1728318600000.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
      "key": "marquee/media/a1b2c3d4e5f6g7h8/desktop_image-1728318600000.jpg",
      "expiresIn": 3600,
      "maxFileSize": 10485760,
      "recommendedDimensions": "1920x600px (full width desktop banner)",
      "mediaType": "desktop_image"
    }
  }
}

3. Generar Pre-signed URL para Mobile Video
mutation GenerateMarqueeMobileVideoUpload {
  generateMarqueeMediaUploadUrl(
    generateMarqueeMediaUploadUrlInput: {
      marqueeId: "clx789def123"
      fileName: "summer-festival-mobile.mp4"
      contentType: "video/mp4"
      fileSize: 15728640  # 15MB
      mediaType: "mobile_video"
    }
  ) {
    uploadUrl
    key
    expiresIn
    maxFileSize
    recommendedDimensions
    mediaType
  }
}
Respuesta esperada:
{
  "data": {
    "generateMarqueeMediaUploadUrl": {
      "uploadUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/marquee/media/x9y8z7w6v5u4t3s2/mobile_video-1728318700000.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
      "key": "marquee/media/x9y8z7w6v5u4t3s2/mobile_video-1728318700000.mp4",
      "expiresIn": 3600,
      "maxFileSize": 52428800,
      "recommendedDimensions": "768x432px or 768x400px (mobile optimized)",
      "mediaType": "mobile_video"
    }
  }
}

4. Actualizar Marquee (después de subir media)
mutation UpdateMarquee {
  updateMarquee(updateMarqueeInput: {
    id: "clx789def123"
    name: "Summer Music Festival 2025"  # Cambiado
    desktopImage: "marquee/media/a1b2c3d4e5f6g7h8/desktop_image-1728318600000.jpg"
    mobileVideo: "marquee/media/x9y8z7w6v5u4t3s2/mobile_video-1728318700000.mp4"
    buttonText: "Buy Tickets"  # Actualizado
    buttonColor: "#00AA00"  # Color nuevo
  }) {
    id
    name
    slug
    link
    buttonText
    buttonColor
    buttonFontWeight
    desktopImage
    desktopImageUrl
    mobileVideo
    mobileVideoUrl
    updatedAt
  }
}
Respuesta esperada:
{
  "data": {
    "updateMarquee": {
      "id": "clx789def123",
      "name": "Summer Music Festival 2025",
      "slug": "summer-music-festival-2025",
      "link": "https://cultureowl.com/summer-festival",
      "buttonText": "Buy Tickets",
      "buttonColor": "#00AA00",
      "buttonFontWeight": "BOLD",
      "desktopImage": "marquee/media/a1b2c3d4e5f6g7h8/desktop_image-1728318600000.jpg",
      "desktopImageUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/marquee/media/a1b2c3d4e5f6g7h8/desktop_image-1728318600000.jpg?X-Amz-Algorithm=...",
      "mobileVideo": "marquee/media/x9y8z7w6v5u4t3s2/mobile_video-1728318700000.mp4",
      "mobileVideoUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/marquee/media/x9y8z7w6v5u4t3s2/mobile_video-1728318700000.mp4?X-Amz-Algorithm=...",
      "updatedAt": "2025-10-07T15:45:00.000Z"
    }
  }
}

5. Obtener Marquee por ID
query GetMarqueeById {
  marquee(id: "clx789def123") {
    id
    name
    slug
    link
    startDate
    endDate
    status
    market
    declinedReason
    
    # Configuración del botón
    buttonText
    buttonColor
    buttonFontWeight
    
    # S3 Keys
    desktopImage
    desktopVideo
    mobileImage
    mobileVideo
    
    # URLs públicas (1-hour expiration)
    desktopImageUrl
    desktopVideoUrl
    mobileImageUrl
    mobileVideoUrl
    
    # Relaciones
    company {
      id
      name
      email
      phone
    }
    owner {
      id
      email
      firstName
      lastName
    }
    
    # Metadata
    bypassCredits
    createdBy
    updatedBy
    deletedBy
    createdAt
    updatedAt
  }
}
Respuesta esperada:
{
  "data": {
    "marquee": {
      "id": "clx789def123",
      "name": "Summer Music Festival 2025",
      "slug": "summer-music-festival-2025",
      "link": "https://cultureowl.com/summer-festival",
      "startDate": "2025-06-01T00:00:00.000Z",
      "endDate": "2025-08-31T23:59:59.000Z",
      "status": "APPROVED",
      "market": "miami",
      "declinedReason": null,
      "buttonText": "Buy Tickets",
      "buttonColor": "#00AA00",
      "buttonFontWeight": "BOLD",
      "desktopImage": "marquee/media/a1b2c3d4e5f6g7h8/desktop_image-1728318600000.jpg",
      "desktopVideo": null,
      "mobileImage": null,
      "mobileVideo": "marquee/media/x9y8z7w6v5u4t3s2/mobile_video-1728318700000.mp4",
      "desktopImageUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/marquee/media/a1b2c3d4e5f6g7h8/desktop_image-1728318600000.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&...",
      "desktopVideoUrl": null,
      "mobileImageUrl": null,
      "mobileVideoUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/marquee/media/x9y8z7w6v5u4t3s2/mobile_video-1728318700000.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&...",
      "company": {
        "id": "clx123abc456",
        "name": "Miami Events Inc",
        "email": "contact@miamievents.com",
        "phone": "+1-305-555-0100"
      },
      "owner": {
        "id": "clx456user789",
        "email": "john@miamievents.com",
        "firstName": "John",
        "lastName": "Smith"
      },
      "bypassCredits": false,
      "createdBy": "clx456user789",
      "updatedBy": "clx456user789",
      "deletedBy": null,
      "createdAt": "2025-10-07T15:30:00.000Z",
      "updatedAt": "2025-10-07T15:45:00.000Z"
    }
  }
}

6. Listado Paginado de Marquees (Cursor-based)
query GetMarqueesPaginated {
  marqueePaginated(
    first: 10
    after: null  # Para la primera página
    includeTotalCount: true
    filter: {
      status: APPROVED
      market: "miami"
      # searchTerm: "festival"  # Opcional
    }
  ) {
    edges {
      node {
        id
        name
        slug
        link
        startDate
        endDate
        status
        market
        buttonText
        buttonColor
        buttonFontWeight
        desktopImageUrl
        desktopVideoUrl
        mobileImageUrl
        mobileVideoUrl
        company {
          id
          name
        }
        owner {
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
Respuesta esperada:
{
  "data": {
    "marqueePaginated": {
      "edges": [
        {
          "node": {
            "id": "clx789def123",
            "name": "Summer Music Festival 2025",
            "slug": "summer-music-festival-2025",
            "link": "https://cultureowl.com/summer-festival",
            "startDate": "2025-06-01T00:00:00.000Z",
            "endDate": "2025-08-31T23:59:59.000Z",
            "status": "APPROVED",
            "market": "miami",
            "buttonText": "Buy Tickets",
            "buttonColor": "#00AA00",
            "buttonFontWeight": "BOLD",
            "desktopImageUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/marquee/media/a1b2c3d4e5f6g7h8/desktop_image-1728318600000.jpg?X-Amz-Algorithm=...",
            "desktopVideoUrl": null,
            "mobileImageUrl": null,
            "mobileVideoUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/marquee/media/x9y8z7w6v5u4t3s2/mobile_video-1728318700000.mp4?X-Amz-Algorithm=...",
            "company": {
              "id": "clx123abc456",
              "name": "Miami Events Inc"
            },
            "owner": {
              "firstName": "John",
              "lastName": "Smith"
            },
            "createdAt": "2025-10-07T15:30:00.000Z"
          },
          "cursor": "clx789def123"
        },
        {
          "node": {
            "id": "clx789def456",
            "name": "Art Basel Miami 2025",
            "slug": "art-basel-miami-2025",
            "link": "https://cultureowl.com/art-basel",
            "startDate": "2025-12-01T00:00:00.000Z",
            "endDate": "2025-12-05T23:59:59.000Z",
            "status": "APPROVED",
            "market": "miami",
            "buttonText": "Learn More",
            "buttonColor": "#000000",
            "buttonFontWeight": "REGULAR",
            "desktopImageUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/marquee/media/b2c3d4e5f6g7h8i9/desktop_image-1728320000000.jpg?X-Amz-Algorithm=...",
            "desktopVideoUrl": null,
            "mobileImageUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/marquee/media/c3d4e5f6g7h8i9j0/mobile_image-1728320100000.jpg?X-Amz-Algorithm=...",
            "mobileVideoUrl": null,
            "company": {
              "id": "clx123abc789",
              "name": "Art Gallery Miami"
            },
            "owner": {
              "firstName": "Maria",
              "lastName": "Garcia"
            },
            "createdAt": "2025-10-07T16:00:00.000Z"
          },
          "cursor": "clx789def456"
        }
        // ... más resultados hasta 10
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "clx789def999"
      },
      "totalCount": 47
    }
  }
}
Para obtener la siguiente página:
query GetMarqueesNextPage {
  marqueePaginated(
    first: 10
    after: "clx789def999"  # Usar el endCursor de la página anterior
    includeTotalCount: false  # Ya tenemos el total
    filter: {
      status: APPROVED
      market: "miami"
    }
  ) {
    edges {
      node {
        # ... mismos campos
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

7. Estadísticas de Marquees
query GetMarqueeStats {
  marqueeStats(market: "miami") {
    total
    pending
    approved
    declined
    deleted
    byMarket
  }
}
Respuesta esperada:
{
  "data": {
    "marqueeStats": {
      "total": 67,
      "pending": 12,
      "approved": 47,
      "declined": 5,
      "deleted": 3,
      "byMarket": 67
    }
  }
}
Stats sin filtro de market (global):
query GetGlobalMarqueeStats {
  marqueeStats {
    total
    pending
    approved
    declined
    deleted
    byMarket  # Será null cuando no hay filtro de market
  }
}
Respuesta esperada:
{
  "data": {
    "marqueeStats": {
      "total": 235,
      "pending": 45,
      "approved": 167,
      "declined": 18,
      "deleted": 5,
      "byMarket": null
    }
  }
}

8. Obtener Mis Marquees (Current User)
query GetMyMarquees {
  myMarquees {
    id
    name
    slug
    status
    market
    startDate
    endDate
    desktopImageUrl
    mobileImageUrl
    desktopVideoUrl
    mobileVideoUrl
    buttonText
    company {
      name
    }
    createdAt
    updatedAt
  }
}
Respuesta esperada:
{
  "data": {
    "myMarquees": [
      {
        "id": "clx789def123",
        "name": "Summer Music Festival 2025",
        "slug": "summer-music-festival-2025",
        "status": "APPROVED",
        "market": "miami",
        "startDate": "2025-06-01T00:00:00.000Z",
        "endDate": "2025-08-31T23:59:59.000Z",
        "desktopImageUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/...",
        "mobileImageUrl": null,
        "desktopVideoUrl": null,
        "mobileVideoUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/...",
        "buttonText": "Buy Tickets",
        "company": {
          "name": "Miami Events Inc"
        },
        "createdAt": "2025-10-07T15:30:00.000Z",
        "updatedAt": "2025-10-07T15:45:00.000Z"
      }
      // ... más marquees del usuario
    ]
  }
}

9. Actualizar Status (Admin only)
mutation ApproveMarquee {
  updateMarqueeStatus(
    id: "clx789def123"
    status: APPROVED
  ) {
    id
    status
    declinedReason
    updatedAt
  }
}
Respuesta esperada:
{
  "data": {
    "updateMarqueeStatus": {
      "id": "clx789def123",
      "status": "APPROVED",
      "declinedReason": null,
      "updatedAt": "2025-10-07T16:30:00.000Z"
    }
  }
}
Rechazar con razón:
mutation DeclineMarquee {
  updateMarqueeStatus(
    id: "clx789def456"
    status: DECLINED
    declinedReason: "Image quality does not meet our standards. Please upload higher resolution images."
  ) {
    id
    status
    declinedReason
  }
}

10. Obtener URL Pública de Media (sin autenticación)
query GetMarqueeMediaUrl {
  getMarqueeMediaUrl(
    mediaKey: "marquee/media/a1b2c3d4e5f6g7h8/desktop_image-1728318600000.jpg"
  )
}
Respuesta esperada:
{
  "data": {
    "getMarqueeMediaUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/marquee/media/a1b2c3d4e5f6g7h8/desktop_image-1728318600000.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...&X-Amz-Expires=3600"
  }
}

Notas Importantes:
1. Media Upload Flow:
    * Crear marquee → Generar pre-signed URL → Upload a S3 → Actualizar marquee con el key
2. Tipos de Media:
    * Desktop: desktop_image O desktop_video (no ambos)
    * Mobile: mobile_image O mobile_video (no ambos)
3. Límites de Tamaño:
    * Imágenes: 10MB max
    * Videos: 50MB max
4. URLs Públicas:
    * Expiran en 1 hora
    * Se generan automáticamente en field resolvers
5. Permisos Requeridos:
    * marquee:create - Crear
    * marquee:read - Leer
    * marquee:update - Actualizar/Aprobar
    * marquee:delete - Eliminar
