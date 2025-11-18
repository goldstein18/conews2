Graphql queries disponibles para el modulo de assets reports

ejemplos: 

Generate client asset report

mutation GenerateClientAssetReport {
    generateClientAssetReport(input: {
      companyId: "cmdnycd8b000848xlui3wmbch"
      startDate: "2025-01-25T00:00:00.000Z"
      endDate: "2025-12-31T23:59:59.999Z"
      includeEvents: true      # Opcional, default: true
      includeBanners: true     # Opcional, default: true
    }) {
      id
      companyId
      startDate
      endDate
      reportUrl      # URL presigned de S3 para descargar PDF
      s3Key
      status         # PENDING, GENERATING, COMPLETED, FAILED
      generatedBy
      fileSize
      createdAt
      updatedAt
      company {
        name
        email
      }
      user {
        firstName
        lastName
      }
    }
  } 

  respuesta: 

  {
  "data": {
    "generateClientAssetReport": {
      "id": "de8a09be-e2e7-432a-af83-59cd5e2f9c14",
      "companyId": "cmdnycd8b000848xlui3wmbch",
      "startDate": "2025-01-25T00:00:00.000Z",
      "endDate": "2025-12-31T23:59:59.999Z",
      "reportUrl": null,
      "s3Key": null,
      "status": "PENDING",
      "generatedBy": "cmdwizany00026y05u0pifw3f",
      "fileSize": null,
      "createdAt": "2025-08-27T01:37:26.634Z",
      "updatedAt": "2025-08-27T01:37:26.634Z",
      "company": {
        "name": "My Company Corp",
        "email": "billing@mycompany.com"
      },
      "user": {
        "firstName": "Sean",
        "lastName": "Sherit"
      }
    }
  }
}

check report status (ya que puede demorar generando el reporte)

query CheckReportStatus {
    getClientAssetReport(reportId: "de8a09be-e2e7-432a-af83-59cd5e2f9c14") {
      id
      status              # PENDING → GENERATING → COMPLETED/FAILED
      reportUrl           # null hasta que status = COMPLETED
      fileSize           # null hasta completar
      createdAt
      updatedAt
    }
  }

  respuesta: 

  {
  "data": {
    "getClientAssetReport": {
      "id": "de8a09be-e2e7-432a-af83-59cd5e2f9c14",
      "status": "COMPLETED",
      "reportUrl": "https://cultureowl-api-upload.s3.us-east-1.amazonaws.com/reports/companies/cmdnycd8b000848xlui3wmbch/2025/08/report-de8a09be-e2e7-432a-af83-59cd5e2f9c14-2025-08-27T01-37-29-884Z.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAX3DRBXH3BNXFYHJQ%2F20250827%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250827T013745Z&X-Amz-Expires=604800&X-Amz-Signature=ee709f4a835ce1610f852af812b12d22b633e39ad1ae85dffbd731809d1ecade&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
      "fileSize": 1660,
      "createdAt": "2025-08-27T01:37:26.634Z",
      "updatedAt": "2025-08-27T01:37:30.387Z"
    }
  }
}


query get report download

query GetReportDownloadUrl {
    getClientAssetReport(reportId: "764e5b5e-0b67-486d-bbe5-aa5be6e53538") {
      id
      status              # COMPLETED
      reportUrl           # 👈 URL presigned para descarga (válida ~1 hora)
      s3Key              # Key del archivo en S3
      fileSize           # Tamaño en bytes
      company {
        name
      }
      user {
        firstName
        lastName
      }
    }
  }

  respuesta :

  {
  "data": {
    "getClientAssetReport": {
      "id": "764e5b5e-0b67-486d-bbe5-aa5be6e53538",
      "status": "COMPLETED",
      "reportUrl": "https://cultureowl-api-upload.s3.us-east-1.amazonaws.com/reports/companies/cmdpb0exb0008ojrrbv8rj81w/2025/08/report-764e5b5e-0b67-486d-bbe5-aa5be6e53538-2025-08-27T01-22-03-425Z.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAX3DRBXH3BNXFYHJQ%2F20250827%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250827T013532Z&X-Amz-Expires=604800&X-Amz-Signature=87037a734900c8e447cd70d8a8bd06854e5cbd73ff22494256fd29b173eebc7c&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
      "s3Key": "reports/companies/cmdpb0exb0008ojrrbv8rj81w/2025/08/report-764e5b5e-0b67-486d-bbe5-aa5be6e53538-2025-08-27T01-22-03-425Z.pdf",
      "fileSize": 3345,
      "company": {
        "name": "Miami Solo"
      },
      "user": {
        "firstName": "Sean",
        "lastName": "Sherit"
      }
    }
  }
}



query preview Client Asset Report

query PreviewClientAssetReport {
    previewClientAssetReport(input: {
      companyId: "cmdpb0exb0008ojrrbv8rj81w"
      startDate: "2024-01-01T00:00:00.000Z"
      endDate: "2025-12-31T23:59:59.999Z"
      includeEvents: true
      includeBanners: true
    }) {
      totalEvents
      totalBanners
      totalBannerImpressions
      totalBannerClicks
      averageCtr
      events {
        # Detalles de eventos
        id
        title
      }
      banners {
        # Detalles de banners
        id
        name
        impressions
        clicks
        ctr
      }
    }
  }

  respuesta: 

  {
  "data": {
    "previewClientAssetReport": {
      "totalEvents": 0,
      "totalBanners": 2,
      "totalBannerImpressions": 0,
      "totalBannerClicks": 0,
      "averageCtr": 0,
      "events": [],
      "banners": [
        {
          "id": "cmelvawvj0001ahc02au0o63r",
          "name": "premium test",
          "impressions": 0,
          "clicks": 0,
          "ctr": 0
        },
        {
          "id": "cmelvfi7b0005ahc0z2fg2snf",
          "name": "banner premium test",
          "impressions": 0,
          "clicks": 0,
          "ctr": 0
        }
      ]
    }
  }
}

query list company reports

query ListCompanyReports {
    listClientAssetReports(
      companyId: "cmdpb0exb0008ojrrbv8rj81w"
      first: 10
    ) {
      id
      status
      reportUrl           # Solo disponible si status = COMPLETED
      startDate
      endDate
      fileSize
      createdAt
      user {
        firstName
        lastName
      }
    }
  }

  respuesta: 

  {
  "data": {
    "listClientAssetReports": [
      {
        "id": "764e5b5e-0b67-486d-bbe5-aa5be6e53538",
        "status": "COMPLETED",
        "reportUrl": "https://cultureowl-api-upload.s3.us-east-1.amazonaws.com/reports/companies/cmdpb0exb0008ojrrbv8rj81w/2025/08/report-764e5b5e-0b67-486d-bbe5-aa5be6e53538-2025-08-27T01-22-03-425Z.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAX3DRBXH3BNXFYHJQ%2F20250827%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250827T013636Z&X-Amz-Expires=604800&X-Amz-Signature=e028897ea9d9f8d67a040e8bfaa018e1564c20f2f5f7f7da04cc77b642473308&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
        "startDate": "2025-01-25T00:00:00.000Z",
        "endDate": "2025-12-31T23:59:59.999Z",
        "fileSize": 3345,
        "createdAt": "2025-08-27T01:21:59.619Z",
        "user": {
          "firstName": "Sean",
          "lastName": "Sherit"
        }
      }
    ]
  }
}

Estados posibles:
  - PENDING → Esperando procesamiento
  - GENERATING → Creando PDF y subiendo a S3
  - COMPLETED → ✅ PDF listo, reportUrl disponible
  - FAILED → ❌ Error en el proceso

  posible flujo o para tomarlo como ejemplo. 

  Flujo de Polling JavaScript

  // 1. Generar reporte
  const generateResponse = await fetch('/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: `mutation GenerateClientAssetReport { ... }`
    })
  });

  const { data } = await generateResponse.json();
  const reportId = data.generateClientAssetReport.id;

  // 2. Polling cada 5 segundos hasta completar
  const pollStatus = async () => {
    const statusResponse = await fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify({
        query: `query CheckReportStatus {
          getClientAssetReport(reportId: "${reportId}") {
            status
            reportUrl
            fileSize
          }
        }`
      })
    });

    const { data } = await statusResponse.json();
    const report = data.getClientAssetReport;

    switch(report.status) {
      case 'COMPLETED':
        console.log('✅ PDF listo:', report.reportUrl);
        window.open(report.reportUrl); // Descargar
        break;

      case 'FAILED':
        console.error('❌ Error generando reporte');
        break;

      case 'PENDING':
      case 'GENERATING':
        console.log('⏳ Procesando...');
        setTimeout(pollStatus, 5000); // Revisar en 5s
        break;
    }
  };

  pollStatus();

  ---
  🎯 Timing Típico

  - PENDING → GENERATING: ~1-2 segundos
  - GENERATING → COMPLETED: ~10-30 segundos (depende del volumen de datos)
  - URL válida: ~1 hora (configurable)
