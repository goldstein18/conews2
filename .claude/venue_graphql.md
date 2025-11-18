⏺ 📋 Queries y Mutations del Módulo de Venues Expandido

  Aquí tienes todos los queries y mutations disponibles con las
  nuevas funcionalidades:

  🏢 Company Dropdown

  # Obtener companies para dropdown
  query GetMyCompaniesForDropdown {
    getMyCompaniesForDropdown {
      id
      name
      email
    }
  }

  🏟️ Venue Management

  Crear Venue (con nuevos campos):
  mutation CreateVenue {
    createVenue(createVenueInput: {
      # Campos básicos existentes
      name: "Teatro Nacional"
      description: "Un hermoso teatro en el centro de la ciudad"
      address: "123 Main Street"
      city: "Miami"
      state: "FL"
      zipcode: "33101"
      phone: "+1-305-555-0123"
      website: "https://teatronacional.com"
      venueType: THEATER

      # NUEVOS CAMPOS OBLIGATORIOS
      companyId: "company-id-123"

      # NUEVOS CAMPOS OPCIONALES
      priority: HIGH
      hostsPrivateEvents: true
      parkingInformation: "Estacionamiento gratuito disponible en
  la parte trasera del edificio. 50 espacios disponibles."
      accessibilityFeatures: "Acceso para sillas de ruedas, baños
  accesibles, asientos reservados para personas con discapacidad."
      adminNotes: "Venue premium con excelente acústica. Requiere
  setup especial para eventos corporativos."

      # Campos de imagen opcionales
      image: "venues/images/teatro-nacional-main.jpg"
      imageBig: "venues/images/teatro-nacional-big.jpg"
    }) {
      id
      name
      slug
      companyId
      company {
        id
        name
      }
      priority
      hostsPrivateEvents
      parkingInformation
      accessibilityFeatures
      adminNotes
      status
      createdAt
      createdBy
    }
  }

  Actualizar Venue:
  mutation UpdateVenue {
    updateVenue(updateVenueInput: {
      id: "venue-id-123"
      priority: MEDIUM
      hostsPrivateEvents: false
      parkingInformation: "Estacionamiento de pago. $10 por
  evento."
      accessibilityFeatures: "Rampa de acceso, ascensor
  disponible."
      adminNotes: "Actualizado - nueva política de
  estacionamiento."
    }) {
      id
      name
      priority
      hostsPrivateEvents
      parkingInformation
      accessibilityFeatures
      adminNotes
      updatedAt
      updatedBy
    }
  }

  ⏰ Operating Hours Management

  Crear Horarios de Operación:
  mutation CreateVenueOperatingHours {
    createVenueOperatingHours(createVenueOperatingHoursInput: {
      venueId: "venue-id-123"
      dayOfWeek: MONDAY
      startTime: "09:00"
      endTime: "17:00"
      isClosed: false
    }) {
      id
      venueId
      dayOfWeek
      startTime
      endTime
      isClosed
      createdAt
      createdBy
    }
  }

  Actualizar Horarios:
  mutation UpdateVenueOperatingHours {
    updateVenueOperatingHours(updateVenueOperatingHoursInput: {
      id: "hours-id-123"
      startTime: "10:00"
      endTime: "22:00"
      isClosed: false
    }) {
      id
      dayOfWeek
      startTime
      endTime
      isClosed
      updatedAt
      updatedBy
    }
  }

  Marcar día como cerrado:
  mutation CloseVenueDay {
    updateVenueOperatingHours(updateVenueOperatingHoursInput: {
      id: "hours-id-123"
      isClosed: true
    }) {
      id
      dayOfWeek
      isClosed
    }
  }

  Eliminar Horarios:
  mutation DeleteVenueOperatingHours {
    deleteVenueOperatingHours(id: "hours-id-123")
  }

  Obtener Horarios de un Venue:
  query GetVenueOperatingHours {
    getVenueOperatingHours(venueId: "venue-id-123") {
      id
      dayOfWeek
      startTime
      endTime
      isClosed
      createdAt
    }
  }

  ❓ FAQ Management

  Crear FAQ:
  mutation CreateVenueFAQ {
    createVenueFAQ(createVenueFAQInput: {
      venueId: "venue-id-123"
      question: "¿Hay estacionamiento disponible?"
      answer: "Sí, tenemos estacionamiento gratuito en la parte
  trasera del edificio con 50 espacios disponibles."
      order: 1
      isActive: true
    }) {
      id
      venueId
      question
      answer
      order
      isActive
      createdAt
      createdBy
    }
  }

  Actualizar FAQ:
  mutation UpdateVenueFAQ {
    updateVenueFAQ(updateVenueFAQInput: {
      id: "faq-id-123"
      question: "¿Cuál es la política de estacionamiento?"
      answer: "Ofrecemos estacionamiento gratuito para todos los
  eventos. El estacionamiento está ubicado en la parte trasera del
   edificio y cuenta con 50 espacios."
      order: 1
    }) {
      id
      question
      answer
      order
      updatedAt
      updatedBy
    }
  }

  Eliminar FAQ:
  mutation DeleteVenueFAQ {
    deleteVenueFAQ(id: "faq-id-123")
  }

  Obtener FAQs de un Venue:
  query GetVenueFAQs {
    getVenueFAQs(venueId: "venue-id-123", activeOnly: true) {
      id
      question
      answer
      order
      isActive
      createdAt
    }
  }

  Obtener todas las FAQs (incluyendo inactivas):
  query GetAllVenueFAQs {
    getVenueFAQs(venueId: "venue-id-123", activeOnly: false) {
      id
      question
      answer
      order
      isActive
      createdAt
    }
  }

  🔍 Venue Queries (Actualizados)

  Obtener Venue completo con nuevos datos:
  query GetVenueComplete {
    venue(identifier: "venue-id-123") {
      id
      name
      slug
      description
      address
      city
      state
      zipcode
      phone
      website

      # Nuevos campos
      companyId
      company {
        id
        name
        email
      }
      priority
      hostsPrivateEvents
      parkingInformation
      accessibilityFeatures
      adminNotes

      # Relaciones nuevas
      operatingHours {
        id
        dayOfWeek
        startTime
        endTime
        isClosed
      }
      faqs {
        id
        question
        answer
        order
        isActive
      }

      # Campos existentes
      status
      venueType
      image
      imageUrl
      imageBig
      imageBigUrl
      owner {
        id
        firstName
        lastName
        email
      }
      createdAt
      updatedAt
      createdBy
      updatedBy
    }
  }

  Buscar Venues con filtros:
  query SearchVenues {
    venues(filter: {
      search: "teatro"
      city: "Miami"
      status: APPROVED
      limit: 10
      page: 1
    }) {
      venues {
        id
        name
        priority
        hostsPrivateEvents
        company {
          id
          name
        }
      }
      total
      totalPages
      hasNextPage
    }
  }

  Venues con cursor pagination:
  query VenuesPaginated {
    venuesPaginated(filter: {
      first: 10
      includeTotalCount: true
      sort: { field: "createdAt", direction: "desc" }
    }) {
      edges {
        node {
          id
          name
          priority
          hostsPrivateEvents
          company {
            name
          }
          operatingHours {
            dayOfWeek
            startTime
            endTime
            isClosed
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        totalCount
      }
    }
  }

  📊 Queries de Ejemplo Completos

  Setup completo de un Venue nuevo:
  # 1. Crear el venue
  mutation SetupNewVenue {
    createVenue(createVenueInput: {
      name: "Centro Cultural Artístico"
      description: "Espacio versátil para eventos culturales y
  artísticos"
      address: "456 Art Street"
      city: "Miami"
      state: "FL"
      zipcode: "33102"
      phone: "+1-305-555-0456"
      website: "https://centroartistico.com"
      venueType: ART_CENTER
      companyId: "company-id-456"
      priority: HIGH
      hostsPrivateEvents: true
      parkingInformation: "Estacionamiento valet disponible. $15
  por evento."
      accessibilityFeatures: "Completamente accesible, ascensor,
  baños adaptados, espacios reservados."
      adminNotes: "Venue premium, requiere coordinación especial
  para eventos grandes."
    }) {
      id
      name
      slug
    }
  }

  # 2. Configurar horarios (ejecutar para cada día)
  mutation SetupOperatingHours {
    createVenueOperatingHours(createVenueOperatingHoursInput: {
      venueId: "nuevo-venue-id"
      dayOfWeek: MONDAY
      startTime: "10:00"
      endTime: "20:00"
      isClosed: false
    }) {
      id
      dayOfWeek
    }
  }

  # 3. Agregar FAQs
  mutation AddFAQs {
    createVenueFAQ(createVenueFAQInput: {
      venueId: "nuevo-venue-id"
      question: "¿Qué servicios de catering ofrecen?"
      answer: "Trabajamos con varios proveedores de catering
  certificados. Podemos proporcionar una lista completa al momento
   de la reserva."
      order: 1
    }) {
      id
      question
    }
  }

  🎯 Enum Values Disponibles:

  VenuePriority:
  - LOW
  - MEDIUM
  - HIGH

  DayOfWeek:
  - MONDAY
  - TUESDAY
  - WEDNESDAY
  - THURSDAY
  - FRIDAY
  - SATURDAY
  - SUNDAY