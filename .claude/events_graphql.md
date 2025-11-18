queries para usar de graphql 

query GetEvents {
    events(
      filter: {
        status: DRAFT
      }
      page: 1
      limit: 20
    ) {
      events {
        id
        title
        description
        slug
        status
        isDraft
        summary
        venueName
        address
        city
        state
        zipcode
        phone
        website
        ticketUrl
        facebook
        twitter
        instagram
        youtube
        tiktok
        free
        virtual
        virtualEventLink
        venueId
        market
        pricing
        eventDetails
        faqs
        times
        mainImage
        bigImage
        featuredImage
        videoUrl
        videoType
        createdAt
        updatedAt
        lastAutoSaveAt
        owner {
          id
          firstName
          lastName
          email
        }
        venue {
          id
          name
          address
          city
          state
        }
        eventTags {
          id
          assignmentType
          tag {
            id
            name
            type
            color
          }
        }
        eventDates {
          id
          date
          startTime
          endTime
          timezone
          doorTime
          ageRestriction
          maxCapacity
          soldOut
          cancelled
        }
        eventOccurrences {
          id
          rrule
          timezone
          startTime
          endTime
          durationMinutes
          exceptionDates
          customOccurrences
        }
        _count {
          eventLikes
        }
      }
      pagination {
        currentPage
        totalPages
        totalItems
        hasNextPage
        hasPrevPage
      }
    }
  }

  respuesta: 
  {
  "data": {
    "events": {
      "events": [
        {
          "id": "cmeuaxqsa00015jett0dh6xsg",
          "title": "Título actualizado 2",
          "description": "desc for event 2",
          "slug": "ttulo-actualizado-2-1",
          "status": "DRAFT",
          "isDraft": true,
          "summary": "Resume short for event",
          "venueName": null,
          "address": null,
          "city": null,
          "state": null,
          "zipcode": null,
          "phone": null,
          "website": "https://evento.com",
          "ticketUrl": null,
          "facebook": "https://facebook.com/evento",
          "twitter": null,
          "instagram": "https://instagram.com/evento",
          "youtube": null,
          "tiktok": null,
          "free": false,
          "virtual": false,
          "virtualEventLink": "https://zoom.us/meeting",
          "venueId": "cmef6lb8e0001oerqnf5m5ccq",
          "market": "miami",
          "pricing": {
            "general": 30
          },
          "eventDetails": null,
          "faqs": null,
          "times": {
            "endTime": "22:00",
            "startTime": "19:00"
          },
          "mainImage": null,
          "bigImage": null,
          "featuredImage": null,
          "videoUrl": null,
          "videoType": null,
          "createdAt": "1756318918618",
          "updatedAt": "1756318918618",
          "lastAutoSaveAt": null,
          "owner": {
            "id": "cmdwizany00026y05u0pifw3f",
            "firstName": "Sean",
            "lastName": "Sherit",
            "email": "sean@cultureowl.com"
          },
          "venue": {
            "id": "cmef6lb8e0001oerqnf5m5ccq",
            "name": "venue miami",
            "address": "bello antioquia",
            "city": "pompano",
            "state": "florida"
          },
          "eventTags": [
            {
              "id": "cmeuaxt7700035jetcd3ah56d",
              "assignmentType": "MAIN_GENRE",
              "tag": {
                "id": "cmdgub50o003dczyg3x6twzlu",
                "name": "MUSIC",
                "type": "MAIN_GENRE",
                "color": "#3B82F6"
              }
            },
            {
              "id": "cmeuaxtp500055jethsdo7k0n",
              "assignmentType": "SUBGENRE",
              "tag": {
                "id": "cmdgubbg5003tczyg1m3rudbo",
                "name": "Festival",
                "type": "SUBGENRE",
                "color": "#93C5FD"
              }
            },
            {
              "id": "cmeuaxu1k00075jetq6utikw1",
              "assignmentType": "SUPPORTING",
              "tag": {
                "id": "cmdguc2bs005qczygunjxur4l",
                "name": "Jazz",
                "type": "SUPPORTING",
                "color": "#3B82F6"
              }
            },
            {
              "id": "cmeuaxuff00095jet8bnxhrlr",
              "assignmentType": "SUPPORTING",
              "tag": {
                "id": "cmdguc3tw005uczyg214z6la9",
                "name": "Pop",
                "type": "SUPPORTING",
                "color": "#3B82F6"
              }
            },
            {
              "id": "cmeuaxuri000b5jetfv5btpl7",
              "assignmentType": "AUDIENCE",
              "tag": {
                "id": "cmdgudqsx009qczygqf5eriz2",
                "name": "Outdoor",
                "type": "AUDIENCE",
                "color": "#8B5CF6"
              }
            }
          ],
          "eventDates": [],
          "eventOccurrences": [
            {
              "id": "cmeuaxv44000d5jeti5iclnsx",
              "rrule": "FREQ=WEEKLY;DTSTART=20251010T000000Z;UNTIL=20260426T000000Z",
              "timezone": "America/New_York",
              "startTime": "19:00",
              "endTime": "22:00",
              "durationMinutes": null,
              "exceptionDates": null,
              "customOccurrences": null
            }
          ],
          "_count": {
            "eventLikes": 0
          }
        },
        {
          "id": "cmeu8nnwv000hiq3h6lqcvg5n",
          "title": "Título actualizado 2",
          "description": "Descripción parcial",
          "slug": "ttulo-actualizado-2",
          "status": "DRAFT",
          "isDraft": true,
          "summary": null,
          "venueName": null,
          "address": null,
          "city": null,
          "state": null,
          "zipcode": null,
          "phone": null,
          "website": null,
          "ticketUrl": null,
          "facebook": null,
          "twitter": null,
          "instagram": null,
          "youtube": null,
          "tiktok": null,
          "free": false,
          "virtual": false,
          "virtualEventLink": null,
          "venueId": null,
          "market": null,
          "pricing": null,
          "eventDetails": null,
          "faqs": null,
          "times": null,
          "mainImage": null,
          "bigImage": null,
          "featuredImage": null,
          "videoUrl": null,
          "videoType": null,
          "createdAt": "1756315089103",
          "updatedAt": "1756318245404",
          "lastAutoSaveAt": "1756318245402",
          "owner": {
            "id": "cmdwizany00026y05u0pifw3f",
            "firstName": "Sean",
            "lastName": "Sherit",
            "email": "sean@cultureowl.com"
          },
          "venue": null,
          "eventTags": [],
          "eventDates": [],
          "eventOccurrences": [],
          "_count": {
            "eventLikes": 0
          }
        },
        {
          "id": "cmeu8bdic0001iq3h7t0nfuco",
          "title": "Mi Evento",
          "description": "Descripción del evento",
          "slug": "mi-evento-1",
          "status": "DRAFT",
          "isDraft": true,
          "summary": "Resumen corto",
          "venueName": null,
          "address": null,
          "city": null,
          "state": null,
          "zipcode": null,
          "phone": null,
          "website": "https://evento.com",
          "ticketUrl": null,
          "facebook": "https://facebook.com/evento",
          "twitter": null,
          "instagram": "https://instagram.com/evento",
          "youtube": null,
          "tiktok": null,
          "free": false,
          "virtual": false,
          "virtualEventLink": "https://zoom.us/meeting",
          "venueId": "cmef6lb8e0001oerqnf5m5ccq",
          "market": "miami",
          "pricing": {
            "vip": 50,
            "general": 25
          },
          "eventDetails": null,
          "faqs": null,
          "times": null,
          "mainImage": null,
          "bigImage": null,
          "featuredImage": null,
          "videoUrl": null,
          "videoType": null,
          "createdAt": "1756314515748",
          "updatedAt": "1756314515748",
          "lastAutoSaveAt": null,
          "owner": {
            "id": "cmdwizany00026y05u0pifw3f",
            "firstName": "Sean",
            "lastName": "Sherit",
            "email": "sean@cultureowl.com"
          },
          "venue": {
            "id": "cmef6lb8e0001oerqnf5m5ccq",
            "name": "venue miami",
            "address": "bello antioquia",
            "city": "pompano",
            "state": "florida"
          },
          "eventTags": [
            {
              "id": "cmeu8bg960003iq3h4wrl3td1",
              "assignmentType": "MAIN_GENRE",
              "tag": {
                "id": "cmdgub50o003dczyg3x6twzlu",
                "name": "MUSIC",
                "type": "MAIN_GENRE",
                "color": "#3B82F6"
              }
            },
            {
              "id": "cmeu8bgts0005iq3h8fb2slwy",
              "assignmentType": "SUBGENRE",
              "tag": {
                "id": "cmdgubbg5003tczyg1m3rudbo",
                "name": "Festival",
                "type": "SUBGENRE",
                "color": "#93C5FD"
              }
            },
            {
              "id": "cmeu8bh8v0007iq3h7p7mszsj",
              "assignmentType": "SUPPORTING",
              "tag": {
                "id": "cmdguc2bs005qczygunjxur4l",
                "name": "Jazz",
                "type": "SUPPORTING",
                "color": "#3B82F6"
              }
            },
            {
              "id": "cmeu8bhnh0009iq3hc2aky28d",
              "assignmentType": "SUPPORTING",
              "tag": {
                "id": "cmdguc3tw005uczyg214z6la9",
                "name": "Pop",
                "type": "SUPPORTING",
                "color": "#3B82F6"
              }
            },
            {
              "id": "cmeu8bi20000biq3huu50mnzt",
              "assignmentType": "AUDIENCE",
              "tag": {
                "id": "cmdgudqsx009qczygqf5eriz2",
                "name": "Outdoor",
                "type": "AUDIENCE",
                "color": "#8B5CF6"
              }
            }
          ],
          "eventDates": [
            {
              "id": "cmeu8bihh000diq3h2z0sa83r",
              "date": "1761091200000",
              "startTime": "1761094800000",
              "endTime": "1761105600000",
              "timezone": null,
              "doorTime": null,
              "ageRestriction": null,
              "maxCapacity": null,
              "soldOut": false,
              "cancelled": false
            }
          ],
          "eventOccurrences": [],
          "_count": {
            "eventLikes": 0
          }
        },
        {
          "id": "cmeu87ns40001zvutjyfbo7k7",
          "title": "Mi Evento",
          "description": "Descripción del evento",
          "slug": "mi-evento",
          "status": "DRAFT",
          "isDraft": true,
          "summary": "Resumen corto",
          "venueName": null,
          "address": null,
          "city": null,
          "state": null,
          "zipcode": null,
          "phone": null,
          "website": "https://evento.com",
          "ticketUrl": null,
          "facebook": "https://facebook.com/evento",
          "twitter": null,
          "instagram": "https://instagram.com/evento",
          "youtube": null,
          "tiktok": null,
          "free": false,
          "virtual": false,
          "virtualEventLink": "https://zoom.us/meeting",
          "venueId": "cmef6lb8e0001oerqnf5m5ccq",
          "market": "miami",
          "pricing": {
            "vip": 50,
            "general": 25
          },
          "eventDetails": null,
          "faqs": null,
          "times": null,
          "mainImage": null,
          "bigImage": null,
          "featuredImage": null,
          "videoUrl": null,
          "videoType": null,
          "createdAt": "1756314342435",
          "updatedAt": "1756314342435",
          "lastAutoSaveAt": null,
          "owner": {
            "id": "cmdwizany00026y05u0pifw3f",
            "firstName": "Sean",
            "lastName": "Sherit",
            "email": "sean@cultureowl.com"
          },
          "venue": {
            "id": "cmef6lb8e0001oerqnf5m5ccq",
            "name": "venue miami",
            "address": "bello antioquia",
            "city": "pompano",
            "state": "florida"
          },
          "eventTags": [
            {
              "id": "cmeu87qm80003zvut9a43hbhd",
              "assignmentType": "MAIN_GENRE",
              "tag": {
                "id": "cmdgub50o003dczyg3x6twzlu",
                "name": "MUSIC",
                "type": "MAIN_GENRE",
                "color": "#3B82F6"
              }
            },
            {
              "id": "cmeu87r3y0005zvutswdf5mgl",
              "assignmentType": "SUBGENRE",
              "tag": {
                "id": "cmdgubbg5003tczyg1m3rudbo",
                "name": "Festival",
                "type": "SUBGENRE",
                "color": "#93C5FD"
              }
            },
            {
              "id": "cmeu87rgc0007zvutwxrwvkrj",
              "assignmentType": "SUPPORTING",
              "tag": {
                "id": "cmdguc2bs005qczygunjxur4l",
                "name": "Jazz",
                "type": "SUPPORTING",
                "color": "#3B82F6"
              }
            },
            {
              "id": "cmeu87rt70009zvut8t3qsha3",
              "assignmentType": "SUPPORTING",
              "tag": {
                "id": "cmdguc3tw005uczyg214z6la9",
                "name": "Pop",
                "type": "SUPPORTING",
                "color": "#3B82F6"
              }
            },
            {
              "id": "cmeu87s7o000bzvut1hou5uke",
              "assignmentType": "AUDIENCE",
              "tag": {
                "id": "cmdgudqsx009qczygqf5eriz2",
                "name": "Outdoor",
                "type": "AUDIENCE",
                "color": "#8B5CF6"
              }
            }
          ],
          "eventDates": [],
          "eventOccurrences": [],
          "_count": {
            "eventLikes": 0
          }
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 1,
        "totalItems": 4,
        "hasNextPage": false,
        "hasPrevPage": false
      }
    }
  },
  "errors": [
    {
      "message": "JSONObject cannot represent non-object value: ",
      "locations": [
        {
          "line": 89,
          "column": 11
        }
      ],
      "path": [
        "events",
        "events",
        "0",
        "eventOccurrences",
        "0",
        "exceptionDates"
      ]
    }
  ]
}

mutation CreateEvent {
    createEvent(createEventInput: {
      title: "Título actualizado 2"
      description: "desc for event 2"
      companyId: "cmdsd0glh000e10s63bl6g628"
      summary: "Resume short for event"

      # Ubicación - opción 1: venue existente
      venueId: "cmef6lb8e0001oerqnf5m5ccq"

      # Ubicación - opción 2: venue inline
      #venueName: "Nombre del lugar"
      #address: "123 Main St"
      #city: "Miami"
      #state: "FL"
      #zipcode: "33101"

      # Detalles del evento
      free: false
      virtual: false
      virtualEventLink: "https://zoom.us/meeting"
      pricing: { general: 30 }

      # Redes sociales
      website: "https://evento.com"
      facebook: "https://facebook.com/evento"
      instagram: "https://instagram.com/evento"

      # Tags (REQUERIDO)
      tags: {
        mainGenre: ["cmdgub50o003dczyg3x6twzlu"]
        subgenre: ["cmdgubbg5003tczyg1m3rudbo"]
        supporting: ["cmdguc2bs005qczygunjxur4l", "cmdguc3tw005uczyg214z6la9"]
        audience: ["cmdgudqsx009qczygqf5eriz2"]
      }

      # Fechas - opción 1: evento único
      #eventDates: [
      #  {
      #    date: "2025-09-16"
      #    startTime: "20:00"
      #    endTime: "23:00"
      #  }
      #]

      # Fechas - opción 2: evento recurrente
      recurringPattern: "weekly"
      recurringStart: "2025-10-10"
      recurringEnd: "2026-04-26"
      times: {
        startTime: "19:00"
        endTime: "22:00"
      }

      market: "miami"
    }) {
      id
      title
      slug
      status
    }
  }

  respuesta: 
  {
  "data": {
    "createEvent": {
      "id": "cmeuaxqsa00015jett0dh6xsg",
      "title": "Título actualizado 2",
      "slug": "ttulo-actualizado-2-1",
      "status": "DRAFT"
    }
  }
}

mutation InitializeDraft {
    initializeDraft {
      id
      title
      slug
      status
    }
  }

respuesta: 

{
  "data": {
    "initializeDraft": {
      "id": "cmeu8nnwv000hiq3h6lqcvg5n",
      "title": "Draft Event - 8/27/2025",
      "slug": "draft-event---8272025-draft-1756315089102",
      "status": "DRAFT"
    }
  }
}

mutation AutoSaveEvent {
    autoSaveEvent(
      eventId: "cmeu8nnwv000hiq3h6lqcvg5n"
      data: {
        title: "Título actualizado 2"
        description: "Descripción parcial"
      }
    ) {
      id
      lastAutoSaveAt
      isDraft
    }
  }

respuesta: 

{
  "data": {
    "autoSaveEvent": {
      "id": "cmeu8nnwv000hiq3h6lqcvg5n",
      "lastAutoSaveAt": "1756318245402",
      "isDraft": true
    }
  }
}

Generar URL de subida de imagen

  mutation GenerateEventImageUploadUrl {
    generateEventImageUploadUrl(generateEventImageUploadUrlInput: {
      eventId: "event-id"
      fileName: "imagen.jpg"
      contentType: "image/jpeg"
      fileSize: 2048000
      imageType: "main" # "main", "big", "featured"
    }) {
      uploadUrl
      key
      expiresIn
      maxFileSize
      recommendedDimensions
    }
  }

  Después de subir a S3, actualizar el evento:

  mutation UpdateEventImages {
    updateEvent(updateEventInput: {
      id: "event-id"
      image: "events/images/{hash}/main-{timestamp}.jpg"
      imageBig: "events/images/{hash}/big-{timestamp}.jpg"
      featuredImage: "events/images/{hash}/featured-{timestamp}.jpg"
    }) {
      id
      image
      imageBig
      featuredImage
    }
  }

  mutation SubmitDraft {
    submitDraft(eventId: "draft-event-id") {
      id
      status # PENDING
      isDraft # false
    }
  }

CASOS DE USO TÍPICOS

  Flujo para evento único:

  1. initializeDraft() - al abrir formulario
  2. autoSaveEvent() - cada 30 segundos
  3. generateEventImageUploadUrl() - para subir imágenes
  4. submitDraft() - al enviar formulario

  Flujo para evento recurrente:

  1. Mismo flujo, pero usar recurringPattern en vez de eventDates
  2. El sistema calculará automáticamente las fechas

  Consulta de eventos con fechas:

  - Para eventos únicos: usa eventDates
  - Para eventos recurrentes: usa getEventOccurrences() (método interno)

