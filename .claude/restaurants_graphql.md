GraphQL Queries y Mutations disponibles para el módulo de Restaurants

mutation CreateRestaurant {
    createRestaurant(createRestaurantInput: {
      name: "Pizza Palace"
      description: "Authentic Italian pizza in the heart of Miami"
      address: "123 Main Street"
      city: "Miami"
      state: "FL"
      zipcode: "33101"
      phone: "+1 305-123-4567"
      website: "https://pizzapalace.com"
      email: "info@pizzapalace.com"
      facebook: "pizzapalacemiami"
      twitter: "pizzapalace"
      instagram: "pizzapalacemiami"
      youtube: "pizzapalacechannel"
      restaurantTypeId: "cmem0af6t0001p15ji3zdtcf0"
      menuLink: "https://pizzapalace.com/menu"
      priceRange: MODERATE
      dietaryOptions: ["vegetarian", "gluten_free"]
      amenities: ["parking", "wifi", "outdoor_seating"]
      companyId: "cmdpb0exb0008ojrrbv8rj81w"
      latitude: 25.7617
      longitude: -80.1918
      market: "miami"
    }) {
      id
      name
      slug
      status
      restaurantType {
        displayName
      }
      company {
        name
      }
      owner {
        firstName
        lastName
      }
    }
  }

  respuesta: 

  {
  "data": {
    "createRestaurant": {
      "id": "cmem6l9ye0003vu33fgn7f2ew",
      "name": "Pizza Palace",
      "slug": "pizza-palace",
      "status": "PENDING",
      "restaurantType": {
        "displayName": "Italian"
      },
      "company": {
        "name": "Miami Solo"
      },
      "owner": {
        "firstName": "Sean",
        "lastName": "Sherit"
      }
    }
  }
}


query GetRestaurantsPaginated {
    restaurantsPaginated(
      filter: {
        first: 20
        # search: "italian"
        # status: APPROVED
        # priceRange: UPSCALE
        city: "Miami"
        includeTotalCount: true
      }
    ) {
      edges {
        node {
          id
          name
          slug
          description
          priceRange
          status
          company {
            id
            name
            email
          }
          restaurantType {
            displayName
          }
          imageUrl
          imageBigUrl
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

  respuesta: 
  {
  "data": {
    "restaurantsPaginated": {
      "edges": [
        {
          "node": {
            "id": "cmem6l9ye0003vu33fgn7f2ew",
            "name": "Pizza Palace",
            "slug": "pizza-palace",
            "description": "Authentic Italian pizza in the heart of Miami",
            "priceRange": "MODERATE",
            "status": "PENDING",
            "company": {
              "id": "cmdpb0exb0008ojrrbv8rj81w",
              "name": "Miami Solo",
              "email": "sublime@gmail.com"
            },
            "restaurantType": {
              "displayName": "Italian"
            },
            "imageUrl": null,
            "imageBigUrl": null
          },
          "cursor": "eyJpZCI6ImNtZW02bDl5ZTAwMDN2dTMzZmduN2YyZXciLCJzb3J0VmFsdWUiOiIyMDI1LTA4LTIyVDAxOjU4OjA5LjA2MloifQ=="
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "hasPreviousPage": false,
        "startCursor": "eyJpZCI6ImNtZW02bDl5ZTAwMDN2dTMzZmduN2YyZXciLCJzb3J0VmFsdWUiOiIyMDI1LTA4LTIyVDAxOjU4OjA5LjA2MloifQ==",
        "endCursor": "eyJpZCI6ImNtZW02bDl5ZTAwMDN2dTMzZmduN2YyZXciLCJzb3J0VmFsdWUiOiIyMDI1LTA4LTIyVDAxOjU4OjA5LjA2MloifQ==",
        "totalCount": 1
      }
    }
  }
}

query GetRestaurant {
    restaurant(id: "cmem6l9ye0003vu33fgn7f2ew") {
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
      email
      image
      imageUrl
      imageBig
      imageBigUrl
      facebook
      twitter
      instagram
      youtube
      menuLink
      priceRange
      dietaryOptions
      amenities
      status
      declinedReason
      adminNotes
      latitude
      longitude
      market
      restaurantType {
        id
        name
        displayName
        description
      }
      company {
        id
        name
        email
      }
      owner {
        id
        firstName
        lastName
        email
      }
      operatingHours {
        id
        dayOfWeek
        startTime
        endTime
        isClosed
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
  respuesta: 
  {
  "data": {
    "restaurant": {
      "id": "cmem6l9ye0003vu33fgn7f2ew",
      "name": "Pizza Palace",
      "slug": "pizza-palace",
      "description": "Updated description",
      "address": "123 Main Street",
      "city": "Miami",
      "state": "FL",
      "zipcode": "33101",
      "phone": "+1 305-999-8888",
      "website": "https://pizzapalace.com",
      "email": "info@pizzapalace.com",
      "image": null,
      "imageUrl": null,
      "imageBig": null,
      "imageBigUrl": null,
      "facebook": "https://pizzapalacemiami",
      "twitter": "https://pizzapalace",
      "instagram": "https://pizzapalacemiami",
      "youtube": "https://pizzapalacechannel",
      "menuLink": "https://pizzapalace.com/menu",
      "priceRange": "UPSCALE",
      "dietaryOptions": [
        "vegan",
        "vegetarian",
        "gluten_free"
      ],
      "amenities": [
        "parking",
        "wifi",
        "outdoor_seating",
        "live_music"
      ],
      "status": "APPROVED",
      "declinedReason": null,
      "adminNotes": null,
      "latitude": 25.7617,
      "longitude": -80.1918,
      "market": "miami",
      "restaurantType": {
        "id": "cmem0af6t0001p15ji3zdtcf0",
        "name": "italian",
        "displayName": "Italian",
        "description": "Traditional Italian dishes including pasta, pizza, and Mediterranean cuisine"
      },
      "company": {
        "id": "cmdpb0exb0008ojrrbv8rj81w",
        "name": "Miami Solo",
        "email": "sublime@gmail.com"
      },
      "owner": {
        "id": "cmdwizany00026y05u0pifw3f",
        "firstName": "Sean",
        "lastName": "Sherit",
        "email": "sean@cultureowl.com"
      },
      "operatingHours": [],
      "createdAt": "2025-08-22T01:58:09.062Z",
      "updatedAt": "2025-08-22T03:22:51.780Z"
    }
  }
}


query GetRestaurantTypes {
    restaurantTypes {
      id
      name
      slug
      displayName
      description
      isActive
      createdAt
      updatedAt
    }
  }

  respuesta:
  {
  "data": {
    "restaurantTypes": [
      {
        "id": "cmem0af180000p15jkwjqr87y",
        "name": "american",
        "slug": "american",
        "displayName": "American",
        "description": "Classic American cuisine including burgers, steaks, and comfort food",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:44.732Z",
        "updatedAt": "2025-08-21T23:01:44.732Z"
      },
      {
        "id": "cmem0afcq0003p15j3h79pkn9",
        "name": "chinese",
        "slug": "chinese",
        "displayName": "Chinese",
        "description": "Traditional and modern Chinese cuisine",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:45.147Z",
        "updatedAt": "2025-08-21T23:01:45.147Z"
      },
      {
        "id": "cmem0afpe0007p15jg3rxp28s",
        "name": "french",
        "slug": "french",
        "displayName": "French",
        "description": "Classic French cuisine and fine dining",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:45.602Z",
        "updatedAt": "2025-08-21T23:01:45.602Z"
      },
      {
        "id": "cmem0afmf0006p15jnpat06h3",
        "name": "indian",
        "slug": "indian",
        "displayName": "Indian",
        "description": "Traditional Indian cuisine with curry, tandoor, and vegetarian options",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:45.496Z",
        "updatedAt": "2025-08-21T23:01:45.496Z"
      },
      {
        "id": "cmem0af6t0001p15ji3zdtcf0",
        "name": "italian",
        "slug": "italian",
        "displayName": "Italian",
        "description": "Traditional Italian dishes including pasta, pizza, and Mediterranean cuisine",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:44.933Z",
        "updatedAt": "2025-08-21T23:01:44.933Z"
      },
      {
        "id": "cmem0affn0004p15j9zu15zk8",
        "name": "japanese",
        "slug": "japanese",
        "displayName": "Japanese",
        "description": "Japanese cuisine including sushi, ramen, and traditional dishes",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:45.251Z",
        "updatedAt": "2025-08-21T23:01:45.251Z"
      },
      {
        "id": "cmem0afs70008p15jjzkm0g4j",
        "name": "mediterranean",
        "slug": "mediterranean",
        "displayName": "Mediterranean",
        "description": "Mediterranean cuisine including Greek, Middle Eastern, and coastal dishes",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:45.704Z",
        "updatedAt": "2025-08-21T23:01:45.704Z"
      },
      {
        "id": "cmem0af9i0002p15jplj91uyp",
        "name": "mexican",
        "slug": "mexican",
        "displayName": "Mexican",
        "description": "Authentic Mexican cuisine with tacos, burritos, and traditional dishes",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:45.030Z",
        "updatedAt": "2025-08-21T23:01:45.030Z"
      },
      {
        "id": "cmem0ag0q000bp15j9l3y49dw",
        "name": "other",
        "slug": "other",
        "displayName": "Other",
        "description": "Other cuisine types not listed",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:46.010Z",
        "updatedAt": "2025-08-21T23:01:46.010Z"
      },
      {
        "id": "cmem0afv50009p15jbah9ihn1",
        "name": "seafood",
        "slug": "seafood",
        "displayName": "Seafood",
        "description": "Fresh seafood and fish dishes",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:45.810Z",
        "updatedAt": "2025-08-21T23:01:45.810Z"
      },
      {
        "id": "cmem0afxx000ap15jpfwfjkjo",
        "name": "steakhouse",
        "slug": "steakhouse",
        "displayName": "Steakhouse",
        "description": "Premium steaks and grilled meats",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:45.909Z",
        "updatedAt": "2025-08-21T23:01:45.909Z"
      },
      {
        "id": "cmem0afjl0005p15jwvx3i2uy",
        "name": "thai",
        "slug": "thai",
        "displayName": "Thai",
        "description": "Authentic Thai cuisine with bold flavors and spices",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:45.393Z",
        "updatedAt": "2025-08-21T23:01:45.393Z"
      }
    ]
  }
}

query GetRestaurantDietaryOptions {
    restaurantDietaryOptions {
      id
      name
      slug
      displayName
      description
      category
      isActive
      createdAt
      updatedAt
    }
  }

  respuesta:
  {
  "data": {
    "restaurantDietaryOptions": [
      {
        "id": "cmem0agf4000fp15jcxye9dsx",
        "name": "dairy_free",
        "slug": "dairy-free",
        "displayName": "Dairy Free",
        "description": "Dairy-free options available",
        "category": "dietary",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:46.528Z",
        "updatedAt": "2025-08-21T23:01:46.528Z"
      },
      {
        "id": "cmem0agc9000ep15jfmevrk4l",
        "name": "gluten_free",
        "slug": "gluten-free",
        "displayName": "Gluten Free",
        "description": "Gluten-free menu options available",
        "category": "dietary",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:46.425Z",
        "updatedAt": "2025-08-21T23:01:46.425Z"
      },
      {
        "id": "cmem0aghv000gp15j21eks47g",
        "name": "nut_free",
        "slug": "nut-free",
        "displayName": "Nut Free",
        "description": "Nut-free options for those with allergies",
        "category": "dietary",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:46.627Z",
        "updatedAt": "2025-08-21T23:01:46.627Z"
      },
      {
        "id": "cmem0ag3g000cp15jfb7q36gi",
        "name": "vegan",
        "slug": "vegan",
        "displayName": "Vegan",
        "description": "Plant-based options with no animal products",
        "category": "dietary",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:46.108Z",
        "updatedAt": "2025-08-21T23:01:46.108Z"
      },
      {
        "id": "cmem0ag9f000dp15jg8y81b62",
        "name": "vegetarian",
        "slug": "vegetarian",
        "displayName": "Vegetarian",
        "description": "Vegetarian-friendly options",
        "category": "dietary",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:46.323Z",
        "updatedAt": "2025-08-21T23:01:46.323Z"
      },
      {
        "id": "cmem0agkn000hp15jdnm2yvyb",
        "name": "keto_friendly",
        "slug": "keto-friendly",
        "displayName": "Keto Friendly",
        "description": "Low-carb, high-fat keto diet options",
        "category": "lifestyle",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:46.727Z",
        "updatedAt": "2025-08-21T23:01:46.727Z"
      },
      {
        "id": "cmem0agq3000jp15jvhfgjcxx",
        "name": "low_carb",
        "slug": "low-carb",
        "displayName": "Low Carb",
        "description": "Low carbohydrate menu options",
        "category": "lifestyle",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:46.924Z",
        "updatedAt": "2025-08-21T23:01:46.924Z"
      },
      {
        "id": "cmem0agnd000ip15jum973vwz",
        "name": "paleo",
        "slug": "paleo",
        "displayName": "Paleo",
        "description": "Paleo diet friendly options",
        "category": "lifestyle",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:46.825Z",
        "updatedAt": "2025-08-21T23:01:46.825Z"
      },
      {
        "id": "cmem0agyj000mp15jda6dgzx6",
        "name": "halal",
        "slug": "halal",
        "displayName": "Halal",
        "description": "Halal-certified food preparation",
        "category": "religious",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:47.227Z",
        "updatedAt": "2025-08-21T23:01:47.227Z"
      },
      {
        "id": "cmem0ah18000np15joeopbiqe",
        "name": "kosher",
        "slug": "kosher",
        "displayName": "Kosher",
        "description": "Kosher-certified food preparation",
        "category": "religious",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:47.325Z",
        "updatedAt": "2025-08-21T23:01:47.325Z"
      },
      {
        "id": "cmem0agvs000lp15jadlj9r2o",
        "name": "farm_to_table",
        "slug": "farm-to-table",
        "displayName": "Farm to Table",
        "description": "Locally sourced, farm-fresh ingredients",
        "category": "sourcing",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:47.129Z",
        "updatedAt": "2025-08-21T23:01:47.129Z"
      },
      {
        "id": "cmem0agsw000kp15j2bk14bvx",
        "name": "organic",
        "slug": "organic",
        "displayName": "Organic",
        "description": "Organic ingredients and sourcing",
        "category": "sourcing",
        "isActive": true,
        "createdAt": "2025-08-21T23:01:47.024Z",
        "updatedAt": "2025-08-21T23:01:47.024Z"
      }
    ]
  }
}


query GetRestaurantStats {
    restaurantStats {
      totalRestaurants
      approvedRestaurants
      pendingReviewRestaurants
      rejectedRestaurants
      activeClients
    }
  }

  respuesta:
  {
  "data": {
    "restaurantStats": {
      "totalRestaurants": 1,
      "approvedRestaurants": 0,
      "pendingReviewRestaurants": 1,
      "rejectedRestaurants": 0,
      "activeClients": 1
    }
  }
}

mutation UpdateRestaurant {
    updateRestaurant(updateRestaurantInput: {
      id: "cmem6l9ye0003vu33fgn7f2ew"
      description: "Updated description...."
      phone: "+1 305-999-8888"
      priceRange: UPSCALE
      dietaryOptions: ["vegan", "vegetarian", "gluten_free"]
      amenities: ["parking", "wifi", "outdoor_seating", "live_music"]
    }) {
      id
      name
      description
      phone
      priceRange
      dietaryOptions
      amenities
      status
      updatedAt
    }
  }

  respuesta: 
  {
  "data": {
    "updateRestaurant": {
      "id": "cmem6l9ye0003vu33fgn7f2ew",
      "name": "Pizza Palace",
      "description": "Updated description....",
      "phone": "+1 305-999-8888",
      "priceRange": "UPSCALE",
      "dietaryOptions": [
        "vegan",
        "vegetarian",
        "gluten_free"
      ],
      "amenities": [
        "parking",
        "wifi",
        "outdoor_seating",
        "live_music"
      ],
      "status": "APPROVED",
      "updatedAt": "2025-08-22T03:30:13.331Z"
    }
  }
}

mutation ApproveRestaurant {
    approveRestaurant(id: "cmem6l9ye0003vu33fgn7f2ew") {
      id
      name
      status
      declinedReason
      updatedAt
    }
  }
  respuesta: 
  {
  "data": {
    "approveRestaurant": {
      "id": "cmem6l9ye0003vu33fgn7f2ew",
      "name": "Pizza Palace",
      "status": "APPROVED",
      "declinedReason": null,
      "updatedAt": "2025-08-22T03:22:51.780Z"
    }
  }
}


Generar URL de Subida de Imagen

  mutation GenerateRestaurantImageUploadUrl {
    generateRestaurantImageUploadUrl(generateRestaurantImageUploadUrlInput:
  {
      restaurantId: "restaurant-id"
      fileName: "restaurant-image.jpg"
      contentType: "image/jpeg"
      fileSize: 2048000
      imageType: MAIN
    }) {
      uploadUrl
      key
      expiresIn
      maxFileSize
      allowedTypes
    }
  }


  Actualizar Imágenes del Restaurante

  mutation UpdateRestaurantImages {
    updateRestaurantImages(updateRestaurantImagesInput: {
      restaurantId: "restaurant-id"
      imageKey: "restaurants/hash/main-image.jpg"
      imageBigKey: "restaurants/hash/big-image.jpg"
    }) {
      id
      image
      imageUrl
      imageBig
      imageBigUrl
      updatedAt
    }
  }