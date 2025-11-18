Ticket Support Module - GraphQL Operations & Service Flows
📋 Available GraphQL Operations
Mutations (Write Operations)
1. createTicket - Create Support Ticket
mutation CreateTicket {
  createTicket(createTicketInput: {
    title: "Unable to upload event images"
    description: "Getting an error when trying to upload images to our event. Error code: S3_UPLOAD_FAILED"
    priority: HIGH
    category: TECHNICAL
    companyId: "company-id"
  }) {
    id
    title
    description
    status        # OPEN
    priority      # HIGH
    category      # TECHNICAL
    company { id, name, email }
    user { id, firstName, lastName, email }
    createdAt
    updatedAt
  }
}
Response Example:
{
  "data": {
    "createTicket": {
      "id": "clx1234567890",
      "title": "Unable to upload event images",
      "description": "Getting an error when trying to upload images to our event. Error code: S3_UPLOAD_FAILED",
      "status": "OPEN",
      "priority": "HIGH",
      "category": "TECHNICAL",
      "company": {
        "id": "company-id",
        "name": "Acme Corp",
        "email": "billing@acme.com"
      },
      "user": {
        "id": "user-id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@acme.com"
      },
      "createdAt": "2025-10-07T10:30:00Z",
      "updatedAt": "2025-10-07T10:30:00Z"
    }
  }
}

2. updateTicket - Update Ticket Details
mutation UpdateTicket {
  updateTicket(updateTicketInput: {
    id: "ticket-id"
    title: "Updated title"
    description: "Updated description with more details"
    priority: URGENT
    category: BUG_REPORT
  }) {
    id
    title
    description
    priority
    category
    updatedAt
  }
}
Response Example:
{
  "data": {
    "updateTicket": {
      "id": "clx1234567890",
      "title": "Updated title",
      "description": "Updated description with more details",
      "priority": "URGENT",
      "category": "BUG_REPORT",
      "updatedAt": "2025-10-07T11:15:00Z"
    }
  }
}

3. updateTicketStatus - Change Ticket Status
mutation UpdateTicketStatus {
  updateTicketStatus(updateTicketStatusInput: {
    ticketId: "ticket-id"
    status: IN_PROGRESS
  }) {
    id
    status
    assignedTo { firstName, lastName }
    updatedAt
  }
}
Response Example:
{
  "data": {
    "updateTicketStatus": {
      "id": "clx1234567890",
      "status": "IN_PROGRESS",
      "assignedTo": {
        "firstName": "Sarah",
        "lastName": "Support"
      },
      "updatedAt": "2025-10-07T11:20:00Z"
    }
  }
}

4. assignTicket - Assign Ticket to Support Staff
mutation AssignTicket {
  assignTicket(assignTicketInput: {
    ticketId: "ticket-id"
    assignedToId: "support-staff-id"
  }) {
    id
    assignedTo { 
      id
      firstName
      lastName
      email
      role { name }
    }
    status  # Automatically changes to IN_PROGRESS
    updatedAt
  }
}
Response Example:
{
  "data": {
    "assignTicket": {
      "id": "clx1234567890",
      "assignedTo": {
        "id": "support-staff-id",
        "firstName": "Sarah",
        "lastName": "Support",
        "email": "sarah@support.com",
        "role": {
          "name": "ADMIN"
        }
      },
      "status": "IN_PROGRESS",
      "updatedAt": "2025-10-07T11:25:00Z"
    }
  }
}

5. addTicketComment - Add Comment/Reply
mutation AddTicketComment {
  addTicketComment(addCommentInput: {
    ticketId: "ticket-id"
    content: "I've checked the S3 bucket permissions and they look correct. Can you try again?"
    isInternal: false  # Public reply
  }) {
    id
    content
    isInternal
    ticketId
    user { 
      id
      firstName
      lastName
      email
    }
    createdAt
    updatedAt
  }
}
Response Example:
{
  "data": {
    "addTicketComment": {
      "id": "comment-id-123",
      "content": "I've checked the S3 bucket permissions and they look correct. Can you try again?",
      "isInternal": false,
      "ticketId": "clx1234567890",
      "user": {
        "id": "support-staff-id",
        "firstName": "Sarah",
        "lastName": "Support",
        "email": "sarah@support.com"
      },
      "createdAt": "2025-10-07T11:30:00Z",
      "updatedAt": "2025-10-07T11:30:00Z"
    }
  }
}

6. addInternalNote - Add Internal Staff Note
mutation AddInternalNote {
  addTicketComment(addCommentInput: {
    ticketId: "ticket-id"
    content: "Customer has exceeded storage quota. Need to upgrade plan."
    isInternal: true  # Internal note (staff only)
  }) {
    id
    content
    isInternal
    createdAt
  }
}
Response Example:
{
  "data": {
    "addTicketComment": {
      "id": "comment-id-124",
      "content": "Customer has exceeded storage quota. Need to upgrade plan.",
      "isInternal": true,
      "createdAt": "2025-10-07T11:35:00Z"
    }
  }
}

7. generateTicketAttachmentUploadUrl - Generate S3 Upload URL
mutation GenerateTicketAttachmentUrl {
  generateTicketAttachmentUploadUrl(
    generateAttachmentUploadUrlInput: {
      ticketId: "ticket-id"
      fileName: "error-screenshot.png"
      contentType: "image/png"
      fileSize: 2048000  # 2MB
    }
  ) {
    uploadUrl
    key
    expiresIn
    maxFileSize
  }
}
Response Example:
{
  "data": {
    "generateTicketAttachmentUploadUrl": {
      "uploadUrl": "https://s3.amazonaws.com/bucket/tickets/attachments/abc123/error-screenshot.png?X-Amz-Signature=...",
      "key": "tickets/attachments/abc123/error-screenshot.png",
      "expiresIn": 3600,
      "maxFileSize": 104857600
    }
  }
}

8. deleteTicket - Delete Ticket (Soft Delete)
mutation DeleteTicket {
  deleteTicket(id: "ticket-id") {
    id
    status  # CANCELLED
    deletedBy
  }
}
Response Example:
{
  "data": {
    "deleteTicket": {
      "id": "clx1234567890",
      "status": "CANCELLED",
      "deletedBy": "user-id"
    }
  }
}

Queries (Read Operations)
9. ticket - Get Single Ticket with Full Details
query GetTicket {
  ticket(id: "ticket-id") {
    id
    title
    description
    status
    priority
    category
    company { id, name, email }
    user { id, firstName, lastName, email }
    assignedTo { id, firstName, lastName, email }
    comments {
      id
      content
      isInternal
      user { firstName, lastName }
      attachments {
        id
        fileName
        fileSize
        contentType
        fileUrl
      }
      createdAt
    }
    attachments {
      id
      fileName
      fileUrl
      fileSize
    }
    createdAt
    updatedAt
    resolvedAt
    closedAt
    lastCommentAt
  }
}
Response Example:
{
  "data": {
    "ticket": {
      "id": "clx1234567890",
      "title": "Unable to upload event images",
      "description": "Getting an error when trying to upload images...",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "category": "TECHNICAL",
      "company": {
        "id": "company-id",
        "name": "Acme Corp",
        "email": "billing@acme.com"
      },
      "user": {
        "id": "user-id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@acme.com"
      },
      "assignedTo": {
        "id": "support-staff-id",
        "firstName": "Sarah",
        "lastName": "Support",
        "email": "sarah@support.com"
      },
      "comments": [
        {
          "id": "comment-1",
          "content": "I've checked the S3 bucket permissions...",
          "isInternal": false,
          "user": {
            "firstName": "Sarah",
            "lastName": "Support"
          },
          "attachments": [],
          "createdAt": "2025-10-07T11:30:00Z"
        },
        {
          "id": "comment-2",
          "content": "Customer has exceeded storage quota...",
          "isInternal": true,
          "user": {
            "firstName": "Sarah",
            "lastName": "Support"
          },
          "attachments": [],
          "createdAt": "2025-10-07T11:35:00Z"
        }
      ],
      "attachments": [
        {
          "id": "attach-1",
          "fileName": "error-screenshot.png",
          "fileUrl": "https://s3.amazonaws.com/bucket/...",
          "fileSize": 2048000
        }
      ],
      "createdAt": "2025-10-07T10:30:00Z",
      "updatedAt": "2025-10-07T11:35:00Z",
      "resolvedAt": null,
      "closedAt": null,
      "lastCommentAt": "2025-10-07T11:35:00Z"
    }
  }
}

10. myTickets - Get Current User's Tickets
query GetMyTickets {
  myTickets {
    id
    title
    status
    priority
    category
    assignedTo { firstName, lastName }
    _count { comments, attachments }
    createdAt
    lastCommentAt
  }
}
Response Example:
{
  "data": {
    "myTickets": [
      {
        "id": "clx1234567890",
        "title": "Unable to upload event images",
        "status": "IN_PROGRESS",
        "priority": "HIGH",
        "category": "TECHNICAL",
        "assignedTo": {
          "firstName": "Sarah",
          "lastName": "Support"
        },
        "_count": {
          "comments": 2,
          "attachments": 1
        },
        "createdAt": "2025-10-07T10:30:00Z",
        "lastCommentAt": "2025-10-07T11:35:00Z"
      }
    ]
  }
}

11. myAssignedTickets - Get Tickets Assigned to Me (Support Staff)
query GetMyAssignedTickets {
  myAssignedTickets {
    id
    title
    status
    priority
    category
    company { name }
    user { firstName, lastName, email }
    _count { comments }
    createdAt
    lastCommentAt
  }
}
Response Example:
{
  "data": {
    "myAssignedTickets": [
      {
        "id": "clx1234567890",
        "title": "Unable to upload event images",
        "status": "IN_PROGRESS",
        "priority": "HIGH",
        "category": "TECHNICAL",
        "company": {
          "name": "Acme Corp"
        },
        "user": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@acme.com"
        },
        "_count": {
          "comments": 2
        },
        "createdAt": "2025-10-07T10:30:00Z",
        "lastCommentAt": "2025-10-07T11:35:00Z"
      }
    ]
  }
}

12. ticketsByCompany - Get Company's Tickets
query GetTicketsByCompany {
  ticketsByCompany(companyId: "company-id") {
    id
    title
    status
    priority
    category
    assignedTo { firstName, lastName }
    user { firstName, lastName }
    createdAt
  }
}
Response Example:
{
  "data": {
    "ticketsByCompany": [
      {
        "id": "clx1234567890",
        "title": "Unable to upload event images",
        "status": "IN_PROGRESS",
        "priority": "HIGH",
        "category": "TECHNICAL",
        "assignedTo": {
          "firstName": "Sarah",
          "lastName": "Support"
        },
        "user": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "createdAt": "2025-10-07T10:30:00Z"
      }
    ]
  }
}

13. tickets - Get All Tickets (Admin Only)
query GetAllTickets {
  tickets(filter: {
    status: OPEN
    priority: HIGH
  }) {
    id
    title
    status
    priority
    category
    company { name }
    user { email }
    assignedTo { firstName, lastName }
    _count { comments, attachments }
    createdAt
  }
}
Response Example:
{
  "data": {
    "tickets": [
      {
        "id": "clx1234567890",
        "title": "Unable to upload event images",
        "status": "OPEN",
        "priority": "HIGH",
        "category": "TECHNICAL",
        "company": {
          "name": "Acme Corp"
        },
        "user": {
          "email": "john@acme.com"
        },
        "assignedTo": null,
        "_count": {
          "comments": 0,
          "attachments": 0
        },
        "createdAt": "2025-10-07T10:30:00Z"
      }
    ]
  }
}

14. ticketsPaginated - Get Paginated Tickets with Filters
query GetTicketsPaginated {
  ticketsPaginated(
    first: 20
    after: "cursor-id"
    includeTotalCount: true
    filter: {
      status: OPEN
      priority: HIGH
      category: TECHNICAL
      searchTerm: "upload"
      companyId: "company-id"
      assignedToId: "support-staff-id"
    }
  ) {
    edges {
      node {
        id
        title
        status
        priority
        category
        company { name }
        user { email }
        assignedTo { firstName, lastName }
        _count { comments, attachments }
        createdAt
        lastCommentAt
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
    totalCount
  }
}
Response Example:
{
  "data": {
    "ticketsPaginated": {
      "edges": [
        {
          "node": {
            "id": "clx1234567890",
            "title": "Unable to upload event images",
            "status": "OPEN",
            "priority": "HIGH",
            "category": "TECHNICAL",
            "company": {
              "name": "Acme Corp"
            },
            "user": {
              "email": "john@acme.com"
            },
            "assignedTo": {
              "firstName": "Sarah",
              "lastName": "Support"
            },
            "_count": {
              "comments": 2,
              "attachments": 1
            },
            "createdAt": "2025-10-07T10:30:00Z",
            "lastCommentAt": "2025-10-07T11:35:00Z"
          },
          "cursor": "clx1234567890"
        }
      ],
      "pageInfo": {
        "endCursor": "clx1234567890",
        "hasNextPage": false
      },
      "totalCount": 1
    }
  }
}

15. ticketStats - Get Ticket Statistics
query GetTicketStats {
  ticketStats(companyId: "company-id") {
    total
    open
    inProgress
    waitingForCustomer
    resolved
    closed
    cancelled
    reopened
    urgent
    high
    unassigned
  }
}
Response Example:
{
  "data": {
    "ticketStats": {
      "total": 45,
      "open": 12,
      "inProgress": 8,
      "waitingForCustomer": 5,
      "resolved": 15,
      "closed": 3,
      "cancelled": 2,
      "reopened": 0,
      "urgent": 3,
      "high": 9,
      "unassigned": 4
    }
  }
}

🔄 Complete Workflow Examples
Workflow 1: Customer Creates Ticket
Customer → createTicket → Ticket (OPEN) → Email Notification to Admins
1. Customer calls createTicket
2. System creates ticket with status: OPEN
3. Audit log: CREATED
4. Returns ticket with full details

Workflow 2: Admin Assigns & Responds
Admin → assignTicket → Ticket (IN_PROGRESS) → addTicketComment (reply) → Email to Customer
1. Admin calls assignTicket
2. Status automatically changes to IN_PROGRESS
3. Audit log: TICKET_ASSIGNED
4. Support staff calls addTicketComment (isInternal: false)
5. Ticket lastCommentAt updated
6. Audit log: TICKET_COMMENT_ADDED

Workflow 3: Ticket Resolution
Support → updateTicketStatus (RESOLVED) → Customer confirms → updateTicketStatus (CLOSED)
1. Support calls updateTicketStatus with RESOLVED
2. System sets resolvedAt timestamp
3. Audit log: TICKET_RESOLVED
4. Customer can reopen with REOPENED status
5. Admin calls updateTicketStatus with CLOSED
6. System sets closedAt timestamp
7. Audit log: TICKET_CLOSED

Workflow 4: File Attachment Upload
User → generateTicketAttachmentUploadUrl → Upload to S3 → createAttachment → Link to ticket/comment
1. User calls generateTicketAttachmentUploadUrl
2. Receives pre-signed S3 URL
3. Uploads file directly to S3
4. Backend creates TicketAttachment record
5. Attachment linked to ticket or comment

🔒 Permission Matrix
Operation	Customer (CALENDAR_MEMBER)	Support (SALES)	Admin (ADMIN)	Super Admin
createTicket	✅ Own company	❌	✅	✅
ticket (view)	✅ Own tickets	✅ Assigned	✅ All	✅ All
updateTicket	✅ Own (before closed)	❌	✅	✅
updateTicketStatus	⚠️ Cancel/Reopen only	✅	✅	✅
assignTicket	❌	❌	✅	✅
addTicketComment (public)	✅ Own tickets	✅ Assigned	✅ All	✅ All
addTicketComment (internal)	❌	✅	✅	✅
ticketStats	❌	❌	✅	✅
deleteTicket	✅ Own	❌	✅	✅
📊 Status Transition Flow
OPEN
  ↓
IN_PROGRESS ←→ WAITING_FOR_CUSTOMER
  ↓
RESOLVED
  ↓
CLOSED ←→ REOPENED
  
CANCELLED (from any status)
Valid Transitions:
* OPEN → IN_PROGRESS, CANCELLED, RESOLVED
* IN_PROGRESS → WAITING_FOR_CUSTOMER, RESOLVED, CANCELLED
* WAITING_FOR_CUSTOMER → IN_PROGRESS, RESOLVED, CANCELLED
* RESOLVED → CLOSED, REOPENED
* CLOSED → REOPENED
* REOPENED → IN_PROGRESS, RESOLVED, CANCELLED