GraphQL Queries y Mutations disponibles para el módulo de Banners

  Queries (Consultas)

  # 1. Obtener banner por ID
  query GetBanner {
    banner(id: "banner-id") {
      id, name, bannerType, startDate, endDate
      status, isActive, isRunning, market
      image, imageUrl, link, declinedReason
      totalClicks, totalImpressions, totalOpens
      companyId, userId, bypassCredits
      createdAt, updatedAt
    }
  }

  # 2. Listar banners con filtros
  query GetBanners {
    banners(
      filter: {
        bannerType: ROS
        status: APPROVED
        isActive: true
        market: "miami"
        companyId: "company-id"
      }
      skip: 0
      take: 10
    ) {
      id, name, bannerType, status, imageUrl
      startDate, endDate, isRunning
    }
  }

  # 3. Banners paginados (cursor-based)
  query GetBannersPaginated {
    bannersPaginated(
      first: 20
      after: "cursor-id"
      filter: { status: RUNNING, bannerType: PREMIUM }
      includeTotalCount: true
    ) {
      edges {
        node {
          id, name, bannerType, status, imageUrl
          totalClicks, totalImpressions
        }
        cursor
      }
      pageInfo {
        hasNextPage, hasPreviousPage
        startCursor, endCursor
      }
      totalCount
    }
  }

  # 4. Estadísticas de banner
  query GetBannerStatistics {
    bannerStatistics(
      bannerId: "banner-id"
      startDate: "2024-01-01"
      endDate: "2024-12-31"
    ) {
      id, clicks, impressions, opens, date
      userAgent, ipAddress, referer
    }
  }

  # 5. Empresas accesibles para banners
  query GetAccessibleCompanies {
    accessibleCompanies {
      id, name, canCreateBanners
    }
  }

  # 6. Permisos de creación de banners
  query GetBannerCreationPermissions {
    bannerCreationPermissions {
      canCreate, maxBanners, companiesAllowed
    }
  }

  # 7. Resumen de créditos para banners
  query GetBannerCreditsBreakdown {
    bannerCreditsBreakdown {
      lbhBanners, lbvBanners, banners, escoopBanners
      hasCredits, source, companyName
    }
  }

  # 8. Requisitos de créditos por tipo
  query GetBannerCreditRequirements {
    bannerCreditRequirements {
      ROS, PREMIUM, BLUE, GREEN, RED, ESCOOP
    }
  }

  # 9. Resumen de estados de banners
  query GetBannerStatusSummary {
    bannerStatusSummary(companyId: "company-id") {
      pending, approved, running, expired, declined, paused
      total, activeCount
    }
  }

  # 10. Top banners por rendimiento
  query GetTopPerformingBanners {
    topPerformingBanners(
      companyId: "company-id"
      limit: 10
      metric: "clicks"  # "clicks" | "impressions" | "ctr"
      startDate: "2024-01-01"
      endDate: "2024-12-31"
    ) {
      id, name, bannerType
      totalClicks, totalImpressions, ctr
    }
  }

  Mutations (Modificaciones)

  # 1. Crear banner
  mutation CreateBanner {
    createBanner(createBannerInput: {
      name: "Banner Premium Miami"
      bannerType: PREMIUM
      startDate: "2024-01-01T00:00:00Z"
      endDate: "2024-12-31T23:59:59Z"
      link: "https://example.com"
      market: "miami"
      companyId: "company-id"
      zoneId: "zone-1"
    }) {
      id, name, status, bypassCredits
      createdAt
    }
  }

  # 2. Actualizar banner
  mutation UpdateBanner {
    updateBanner(updateBannerInput: {
      bannerId: "banner-id"
      name: "Nuevo nombre"
      link: "https://newlink.com"
      startDate: "2024-02-01T00:00:00Z"
    }) {
      id, name, link, updatedAt
    }
  }

  # 3. Eliminar banner
  mutation DeleteBanner {
    deleteBanner(bannerId: "banner-id")
  }

  # 4. Generar URL de subida de imagen
  mutation GenerateBannerUploadUrl {
    generateBannerUploadUrl(generateBannerUploadUrlInput: {
      bannerId: "banner-id"
      fileName: "banner.jpg"
      contentType: "image/jpeg"
      fileSize: 2048000
    }) {
      uploadUrl, key, expiresIn
      maxFileSize, recommendedDimensions
    }
  }

  # 5. Actualizar imagen del banner
  mutation UpdateBannerImage {
    updateBannerImage(updateBannerImageInput: {
      bannerId: "banner-id"
      imageKey: "banners/company-id/banner-id/banner-timestamp.jpg"
    }) {
      id, image, imageUrl, updatedAt
    }
  }

  # 6. Aprobar banner (admin)
  mutation ApproveBanner {
    approveBanner(approveBannerInput: {
      bannerId: "banner-id"
    }) {
      id, status, isRunning, updatedAt
    }
  }

  # 7. Rechazar banner (admin)
  mutation DeclineBanner {
    declineBanner(declineBannerInput: {
      bannerId: "banner-id"
      reason: "No cumple con las políticas"
    }) {
      id, status, declinedReason, updatedAt
    }
  }

  # 8. Pausar banner
  mutation PauseBanner {
    pauseBanner(bannerId: "banner-id") {
      id, status, isRunning, updatedAt
    }
  }

  # 9. Reanudar banner
  mutation ResumeBanner {
    resumeBanner(bannerId: "banner-id") {
      id, status, isRunning, updatedAt
    }
  }

  # 10. Registrar clic en banner
  mutation TrackBannerClick {
    trackBannerClick(trackBannerClickInput: {
      bannerId: "banner-id"
      clickType: "LINK_CLICK"
    }) {
      success, message
    }
  }

  # 11. Registrar impresión de banner
  mutation TrackBannerImpression {
    trackBannerImpression(bannerId: "banner-id") {
      success, message
    }
  }

  Tipos de Banner disponibles

  - ROS: Run of Site - banners verticales (consume lbhBanners)
  - PREMIUM: Banners horizontales premium (consume lbvBanners)
  - BLUE: Banners cuadrados azules (consume banners)
  - GREEN: Banners verdes para páginas específicas (consume banners)
  - RED: Banners rojos tipo hero (consume banners)
  - ESCOOP: Banners relacionados al módulo escoop (consume escoopBanners)

  Estados de Banner

  - PENDING: Esperando aprobación
  - APPROVED: Aprobado y puede ejecutarse
  - RUNNING: Actualmente activo y ejecutándose
  - EXPIRED: Pasó la fecha de fin
  - DECLINED: Rechazado/declinado
  - PAUSED: Pausado temporalmente

  Características Implementadas

  ✅ Sistema de créditos - Admin/SuperAdmin bypassen créditos automáticamente✅ Gestión de 
  imágenes S3 - URLs pre-firmadas seguras✅ Seguimiento de estadísticas - Clics,
  impresiones, opens✅ Sistema de aprobación - Workflow de admin para aprobar/rechazar✅
  Integración de auditoría - Logging completo de todas las operaciones✅ Paginación 
  cursor-based - Para grandes volúmenes de datos✅ Filtrado avanzado - Por tipo, estado,
  mercado, compañía✅ Gestión de estados - Pausar/reanudar automáticamente por fechas

  El módulo está completamente implementado y listo para uso en producción!