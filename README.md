# Events Platform Frontend

A modern event management platform built with Next.js 15, featuring role-based dashboards, real-time data via GraphQL, and a beautiful UI powered by Shadcn/ui.

## 🚀 Features

- **Company Management System**
  - Complete company creation workflow with user management
  - Plan selection with real-time asset preview
  - Payment method configuration (Check/Stripe invoicing)
  - Market selection and company profile management
  - Company status tracking (PENDING → ACTIVE → SUSPENDED → CANCELLED)

- **Multi-Role Dashboard System**
  - Super Admin: Full system access, company management, roles & permissions
  - Admin: User and event management, company oversight
  - Calendar Member: Event scheduling and calendar management
  - Dining Member: Restaurant and event access
  - Sales: Sales and client management
  - Agency: Agency-specific event management
  - Editorial Writer: Content and event management

- **Modern Tech Stack**
  - Next.js 15 with App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Shadcn/ui for UI components
  - React Hook Form with Zod validation
  - Zustand for state management
  - Dark/Light theme support

- **Authentication & Security**
  - JWT-based authentication with httpOnly cookies
  - Dynamic Role-based access control (RBAC) system
  - API-driven permissions management
  - Protected routes with middleware
  - BFF (Backend for Frontend) security pattern
  - Input validation and sanitization

- **Real-time Data**
  - Apollo Client for GraphQL
  - Secure GraphQL proxy via BFF
  - Optimistic UI updates
  - Real-time subscriptions ready

- **Advanced Admin Features**
  - **Employee Management**: Complete employee dashboard with market assignments
  - **Roles & Permissions**: Dynamic RBAC system with API-driven permissions
  - **Audit System**: Activity tracking and audit logs
  - **Tags Management**: Music tags system with 4 hierarchical levels
  - **Company Oversight**: Full company lifecycle management
  - **User Role Assignment**: Flexible role assignment for employees and owners
  - **Settings Management**: Complete organization settings with file uploads and team management
  - **Reports & Analytics**: Asset performance reporting system with client reports and overall analytics

- **Event Management System**
  - **Venues Management**: Complete venue creation, editing, and management with image upload
  - **Restaurants Management**: Restaurant listing, approval workflow, and company assignment
  - **Arts Groups Management**: Cultural organization management with approval workflow and image upload
  - **Banners Management**: Marketing banner creation with different types (Standard, Feature, Sponsored)
  - **2-Step Creation Wizards**: Advanced creation workflows for complex entities with S3 image integration

- **Enhanced User Experience**
  - **Skeleton Loading States**: Content-specific loading placeholders for all pages
  - **Progressive Loading**: Individual components load independently as data becomes available
  - **File Upload System**: Drag & drop file uploads with Amazon S3 integration via FilePond
  - **Responsive Design**: Mobile-first design with tablet and desktop optimization

## 📋 Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Backend API running on port 3001

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd frontend-eventos
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3001/graphql
JWT_SECRET=your-secret-key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
frontend-eventos/
├── app/                  # Next.js app directory
│   ├── api/             # Backend for Frontend (BFF)
│   │   ├── auth/        # Authentication endpoints
│   │   └── graphql/     # GraphQL proxy endpoint
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # Protected dashboard area
│   │   ├── companies/   # Company management module
│   │   │   ├── create/  # Company creation page
│   │   │   ├── components/      # Company-specific components
│   │   │   ├── hooks/          # Company data hooks
│   │   │   └── utils/          # Company helper functions
│   │   ├── employees/   # Employee management module
│   │   ├── roles-management/    # RBAC system module
│   │   ├── audit/      # Audit logs module
│   │   ├── tags/       # Tags management module
│   │   ├── settings/   # Settings module with file uploads
│   │   ├── venues/     # Venues management module
│   │   ├── restaurants/# Restaurants management module
│   │   ├── arts-groups/# Arts groups management module
│   │   ├── banners/    # Banners management module
│   │   ├── events/     # Events management module
│   │   ├── escoops/    # Email campaigns management module
│   │   │   └── [id]/builder/  # Email campaign builder with Brevo integration
│   │   ├── escoop-entries/    # Event submission system for escoops
│   │   ├── dedicated/  # Dedicated email campaigns module
│   │   │   └── [id]/builder/  # Dedicated campaign builder with Brevo integration
│   │   ├── reports/    # Reports & Analytics module
│   │   └── {module}/    # Other dashboard modules (MANDATORY structure)
│   │       ├── page.tsx          # Main orchestrator
│   │       ├── components/       # Module components
│   │       ├── hooks/           # Custom hooks
│   │       └── utils/           # Helper functions
│   └── subscriber/      # Subscriber portal
├── components/          # Global React components
│   ├── ui/             # Shadcn/ui components
│   │   ├── skeleton.tsx # Base skeleton loading component
│   │   ├── file-upload.tsx # FilePond S3 upload component
│   │   └── ...         # Other shadcn components
│   └── ...             # Custom components
├── lib/                # Utilities and configurations
│   ├── apollo-client.ts # Apollo Client setup
│   ├── graphql/        # GraphQL operations
│   │   ├── members.ts  # Company/member queries
│   │   ├── employees.ts # Employee queries
│   │   ├── roles-permissions.ts # RBAC queries
│   │   ├── tags.ts     # Tags queries and mutations
│   │   ├── settings.ts # Settings and file upload queries
│   │   ├── venues.ts   # Venues queries and mutations
│   │   ├── restaurants.ts # Restaurants queries and mutations
│   │   ├── arts-groups.ts # Arts groups queries and mutations
│   │   ├── banners.ts  # Banners queries and mutations
│   │   ├── events.ts   # Events queries and mutations
│   │   ├── escoops.ts  # Escoops queries and mutations
│   │   ├── escoop-entries.ts # Escoop entries queries and mutations
│   │   ├── dedicated.ts # Dedicated campaigns queries and mutations
│   │   ├── brevo-campaigns.ts # Brevo email marketing integration
│   │   ├── asset-reports.ts # Reports & Analytics queries and mutations
│   │   └── ...         # Other GraphQL operations
│   ├── services/       # Business logic services
│   │   └── s3-upload.service.ts # S3 file upload service
│   ├── permissions-dynamic.ts # Dynamic permission system
│   ├── roles.ts        # Role utilities
│   └── validations/    # Zod schemas
├── store/              # Zustand stores
│   ├── escoop-builder-store.ts # Email campaign builder state
│   ├── dedicated-builder-store.ts # Dedicated campaign builder state
│   └── ...             # Other Zustand stores
├── types/              # TypeScript type definitions
│   ├── escoops.ts      # Escoop campaign types
│   ├── escoop-entries.ts # Escoop entries types
│   ├── dedicated.ts    # Dedicated campaign types
│   └── ...             # Other type definitions
├── lib/email-templates/
│   └── components/     # Shared React Email components
│       ├── email-header.tsx   # Reusable email header
│       └── email-footer.tsx   # Reusable email footer
└── middleware.ts       # Next.js middleware
```

## 🏗️ Dashboard Module Architecture (REQUIRED)

**ALL dashboard modules MUST follow this scalable pattern**:

```
app/dashboard/{module}/
├── page.tsx                 # Main orchestrator (~50-150 lines)
├── components/
│   ├── {module}-stats.tsx   # Dashboard stats & summary cards
│   ├── {module}-filters.tsx # Search & filter controls  
│   ├── {module}-table.tsx   # Data table with sorting/pagination
│   └── index.ts            # Barrel exports
├── hooks/
│   ├── use-{module}-data.ts     # GraphQL queries & data logic
│   ├── use-{module}-filters.ts  # Filter state management
│   ├── use-{module}-sorting.ts  # Sorting state & logic
│   └── index.ts                # Barrel exports
└── utils/
    ├── {module}-helpers.ts  # Pure utility functions
    └── index.ts            # Barrel exports
```

### 📋 Module Architecture Rules

1. ✅ **page.tsx** = orchestrator only (~50-150 lines)
2. ✅ **Components** = self-contained, <250 lines each
3. ✅ **Hooks** = reusable logic, <100 lines each  
4. ✅ **Utils** = pure functions, no side effects
5. ✅ **Barrel exports** for clean imports
6. ✅ **Sortable tables** with column sorting
7. ✅ **Filter state** isolated in custom hooks
8. ✅ **Cursor-based pagination** (Previous/Next) - ALWAYS use `first`, `after` parameters
9. ✅ **Skeleton loading states** - ALWAYS implement content-specific loading placeholders
10. ❌ **NO monolithic pages** >200 lines
11. ❌ **NO mixing concerns** in single files
12. ❌ **NO numeric pagination** (1,2,3...) - use cursor-based only
13. ❌ **NO simple spinners** - use structured skeleton loading instead

### 🎯 Benefits

- **Scalable**: Consistent pattern across all modules
- **Maintainable**: Files <250 lines, clear separation
- **Testable**: Logic isolated in custom hooks
- **Reusable**: Components and hooks are independent
- **Team-friendly**: Predictable structure for all developers

### 📖 Reference Implementations

- **Companies Module**: `app/dashboard/companies/` - Complete implementation with creation workflow, user management, plan selection, and form validation
- **Employees Module**: `app/dashboard/employees/` - Full employee management with market assignments and role controls
- **RBAC System**: `app/dashboard/roles-management/` - Complete role and permission management with three-tab interface
- **Audit System**: `app/dashboard/audit/` - Activity tracking and audit log visualization
- **Tags Management**: `app/dashboard/tags/` - Music tags management with 4 levels (Main Genre, Sub Genre, Supporting, Audience)
- **Settings Module**: `app/dashboard/settings/` - Complete organization settings with FilePond uploads, social channels, and team management
- **Venues Module**: `app/dashboard/venues/` - Complete venue management with 2-step creation wizard, image upload, and approval workflow
- **Restaurants Module**: `app/dashboard/restaurants/` - Restaurant management with cuisine types, dietary options, amenities, and company assignment
- **Arts Groups Module**: `app/dashboard/arts-groups/` - Cultural organization management with art type classification, location tracking, and approval workflow
- **Banners Module**: `app/dashboard/banners/` - Marketing banner creation with different types (Standard, Feature, Sponsored) and image management
- **Reports & Analytics Module**: `app/dashboard/reports/` - Asset performance reporting with client reports, preview functionality, and download capabilities
- **Events Module**: `app/dashboard/events/` - Advanced event management with 3-step creation wizard, draft system, recurring events, and comprehensive features
- **Escoops Module**: `app/dashboard/escoops/` - Email campaign management system for admins with location targeting and send date scheduling
- **Escoops Builder**: `app/dashboard/escoops/[id]/builder/` - Advanced email campaign builder with Brevo integration, drag-and-drop content management, and React Email templates
- **Escoop Entries**: `app/dashboard/escoop-entries/` - Event submission system with approval workflow and status management
- **Dedicated Module**: `app/dashboard/dedicated/` - Dedicated email campaigns with 3-step wizard, image upload, and Brevo integration
- **Dedicated Builder**: `app/dashboard/dedicated/[id]/builder/` - Campaign builder with React Email templates, shared components, draft/schedule control, and automatic campaign loading
- **Skeleton Loading**: All modules implement structured loading placeholders that match actual content layout

## 🧙‍♂️ 2-Step Creation Wizard Pattern

For complex modules requiring image upload and extensive validation, the platform uses a **2-step creation wizard**:

### 📋 When to Use
- ✅ Modules requiring image upload with real entity ID (venues, restaurants, banners)
- ✅ Complex forms with 10+ fields across multiple sections  
- ✅ Circular dependency (need entity ID for S3 presigned URL generation)
- ✅ Forms with optional advanced sections

### 🏗️ Architecture Pattern
```
app/dashboard/{module}/create/
├── page.tsx                           # Route container (~30-50 lines)
├── components/
│   ├── {module}-creation-wizard.tsx   # Main wizard orchestrator
│   ├── {module}-basic-form.tsx        # Step 1: Essential fields only
│   ├── {module}-advanced-form.tsx     # Step 2: Image + optional fields
│   └── index.ts                      # Barrel exports
└── hooks/
    ├── use-{module}-actions.ts        # Create/update mutations
    ├── use-{module}-image-upload.ts   # Image upload configuration
    └── index.ts                      # Barrel exports
```

### 🔄 Implementation Flow
1. **Step 1 (Basic Form)**: Creates entity with essential fields + `image: 'placeholder'`
2. **Entity Created**: Backend returns real entity ID for S3 uploads
3. **Step 2 (Advanced Form)**: Image upload + optional fields using real entity ID
4. **Final Update**: Replace placeholder with actual S3 image key

### 🎯 Key Features
- **Visual Progress Indicator**: Step-by-step progress with validation
- **Loading States**: Proper button spinners and disabled states
- **Image Upload Integration**: Advanced image upload with cropping and validation
- **Form Validation**: Separate Zod schemas for each step
- **Error Handling**: Comprehensive error handling with user feedback
- **Company Assignment**: Admin can assign to any company, members to own company

### 📖 Reference Implementations
- **Venues**: `app/dashboard/venues/create/` - Complete 2-step wizard with image upload
- **Restaurants**: `app/dashboard/restaurants/create/` - Restaurant creation with cuisine types and amenities
- **Arts Groups**: `app/dashboard/arts-groups/create/` - Arts organization creation with art type classification and approval workflow
- **Banners**: `app/dashboard/banners/create/` - Banner creation with different banner types
- **Events**: `app/dashboard/events/create/` - Advanced 3-step wizard evolution with draft system and recurring events

### 🎨 Advanced Integration Patterns
- **Escoops Builder**: `app/dashboard/escoops/[id]/builder/` - Complete example of:
  - External service integration (Brevo email marketing)
  - Complex multi-panel builder interface
  - Real-time preview generation with React Email
  - Advanced state management with Zustand
  - Drag-and-drop content management system

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Component Management
npx shadcn@latest add [component]  # Add new UI component
```

## 🎨 UI Components

This project uses [Shadcn/ui](https://ui.shadcn.com/) for UI components. To add a new component:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
```

## 🔐 Authentication Flow

1. User logs in via `/auth/login`
2. JWT token stored in secure httpOnly cookies only
3. BFF endpoints handle all authentication (`/api/auth/*`)
4. Middleware validates token on protected routes
5. Dashboard access determined by user role
6. Non-dashboard users redirected to subscriber portal

### 🔒 Security Architecture

All GraphQL operations must use the BFF pattern:
- **Secure Endpoint**: `/api/graphql` (proxy to backend)
- **Auth Endpoints**: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/refresh`
- **Token Storage**: httpOnly cookies only (never localStorage)
- **Input Validation**: Zod schemas with sanitization
- **Rate Limiting**: Applied to authentication endpoints

## 📊 Reports & Analytics System

### Advanced Reporting Dashboard (`/dashboard/reports`)

**Admin and Super Admin exclusive interface** for comprehensive asset performance reporting:

#### 🎯 Key Features
- **Two-Tab Interface**: Client Reports and Overall Analytics
- **Client Asset Reports**: Generate detailed performance reports for specific companies
- **Report Preview**: Preview report data before generating full PDF
- **Report Generation**: Asynchronous PDF generation with polling status updates
- **Report History**: Complete history of all generated reports with download links
- **Overall Analytics**: Platform-wide performance metrics and insights

#### 🏗️ Report Generation Workflow
```typescript
1. Select Client → Choose Date Range → Select Asset Types
2. Preview Report → See summary statistics before generation  
3. Generate Report → Async PDF creation with S3 storage
4. Polling Status → Real-time updates (PENDING → GENERATING → COMPLETED)
5. Download Report → Direct PDF download from S3 presigned URLs
```

#### 📋 Report Types
- **Client Asset Reports**: Company-specific asset performance analysis
  - Events performance metrics
  - Banner click-through rates and impressions
  - Date range filtering with quick presets
  - Asset type filtering (Events, Banners, or both)
- **Overall Analytics**: Platform-wide performance insights
  - Total asset reach and engagement
  - Top performing assets and types
  - Monthly performance trends
  - Export capabilities (CSV, PDF)

#### 🛠️ Technical Implementation
- **GraphQL Operations**: Complete CRUD operations for report management
- **Async Processing**: Backend report generation with status polling
- **S3 Integration**: PDF storage and presigned URL generation
- **Zustand State Management**: Report state, polling intervals, and preview data
- **Custom Validation**: Form validation optimized for report parameters
- **Skeleton Loading**: Content-specific loading states during generation

#### 📁 Key Components
```
app/dashboard/reports/
├── components/
│   ├── client-reports/
│   │   ├── client-report-form.tsx    # Report generation form
│   │   ├── report-preview.tsx        # Preview and status component
│   │   └── report-history.tsx        # Historical reports list
│   ├── overall-analytics/
│   │   ├── analytics-filters.tsx     # Analytics filter controls
│   │   ├── analytics-stats.tsx       # Performance metrics display
│   │   └── performance-chart.tsx     # Data visualization
│   └── common/
│       ├── date-picker-range.tsx     # Date range selector
│       └── report-skeleton.tsx       # Loading placeholders
├── lib/
│   └── validations.ts               # Report form validation schemas
└── page.tsx                        # Main reports orchestrator
```

#### 🔧 GraphQL Schema Notes
- **Mixed ID Types**: Backend uses both `String!` and `ID!` for different parameters
- **Inline Parameters**: Mutations use inline input objects, not typed inputs
- **Pagination**: Report history uses `Float` type for pagination limits
- **Status Polling**: Real-time report generation status via GraphQL polling

#### 🚀 Features
- **Real-time Polling**: Automatic status updates during report generation
- **Progress Indicators**: Visual progress bars and status messages
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Download Management**: One-click PDF downloads from S3
- **Date Presets**: Quick select options (Last 7 days, 30 days, 3 months, etc.)
- **Form Persistence**: Report parameters saved in Zustand store
- **Responsive Design**: Mobile-optimized report interface

## 📧 Escoops Management System

### Email Campaign Administration (`/dashboard/escoops`)

**Admin and Super Admin exclusive interface** for comprehensive email campaign management:

## 🎨 Escoops Builder System

### Advanced Email Campaign Builder (`/dashboard/escoops/[id]/builder`)

**Comprehensive email newsletter builder** with drag-and-drop content management and Brevo integration:

#### 🎯 Key Features
- **Multi-Panel Builder Interface**: Creator, Settings, Campaign, and Preview panels
- **Brevo Email Marketing Integration**: Complete integration with Brevo (formerly Sendinblue) for email delivery
- **Visual Email Templates**: React Email powered templates with real-time preview
- **Content Management System**: Drag-and-drop selection for events, restaurants, banners, and editorial content
- **Campaign Workflow**: Create → Test → Send workflow with status tracking
- **HTML Generation**: Real-time HTML email generation with template rendering
- **State Persistence**: Advanced Zustand store for complex builder state management

#### 🏗️ Builder Architecture
```typescript
// Multi-panel interface
1. Creator Panel → Select events, restaurants, editorial content
2. Settings Panel → Configure subject, Brevo lists, email settings
3. Campaign Panel → Brevo campaign management and sending
4. Preview Panel → Real-time email preview with responsive design
```

#### 📧 Brevo Integration Features
- **Contact Lists Management**: Import and manage Brevo contact lists
- **Audience Segmentation**: Advanced segmentation with Brevo segments
- **Campaign Creation**: Direct campaign creation in Brevo platform
- **Test Campaigns**: Send test emails to specified addresses
- **Campaign Status Tracking**: Real-time status updates (not_created → created → test_sent → sent)
- **Subscriber Analytics**: Track campaign performance and subscriber engagement

#### 🎨 Email Template System
- **React Email Components**: Modern email templates using React Email
- **Classic Newsletter Template**: Professional newsletter layout with sections
- **Responsive Design**: Mobile-optimized email templates
- **Dynamic Content**: Real-time content insertion from selected items
- **Banner Integration**: Positioned banner slots with image management
- **Brand Consistency**: Consistent CultureOwl branding and styling

#### 🔧 Content Management
- **Event Cards**: Automatically formatted event information with images
- **Restaurant Picks**: Curated restaurant recommendations with "Pick of the Month"
- **Editorial Blocks**: Custom editorial content with rich text
- **Banner Slots**: Positioned advertising banners with click tracking
- **Content Ordering**: Drag-and-drop content arrangement
- **Selection Management**: Toggle content inclusion/exclusion

#### 🛠️ Technical Implementation
- **Zustand State Management**: Complex builder state with persistence
- **GraphQL Operations**: Complete Brevo API integration via GraphQL
- **React Email Rendering**: Server-side email HTML generation
- **Image Upload Integration**: S3 image storage with presigned URLs
- **Real-time Preview**: Live email preview updates
- **Error Handling**: Comprehensive error handling with user feedback

#### 📁 Builder Components Structure
```
app/dashboard/escoops/[id]/builder/
├── page.tsx                           # Builder interface orchestrator
├── components/
│   ├── escoop-builder.tsx             # Main builder container
│   ├── escoop-creator-panel.tsx       # Content selection panel
│   ├── escoop-settings-panel.tsx      # Email configuration panel
│   ├── escoop-campaign-panel.tsx      # Brevo campaign management
│   ├── escoop-preview-panel.tsx       # Email preview interface
│   ├── escoop-banners-panel.tsx       # Banner management
│   ├── escoop-sidebar-navigation.tsx  # Desktop navigation
│   ├── escoop-mobile-navigation.tsx   # Mobile navigation
│   └── animated-events-list.tsx       # Event selection interface
├── hooks/
│   ├── use-escoop-builder.ts          # Builder state management
│   ├── use-brevo-campaigns.ts         # Brevo API integration
│   ├── use-escoop-entries.ts          # Entry management
│   ├── use-save-escoop.ts             # Save functionality
│   └── use-restaurant-search.ts       # Restaurant search
├── lib/
│   └── email-templates/
│       ├── classic-newsletter.tsx     # Main email template
│       └── components/
│           ├── newsletter-header.tsx  # Email header component
│           ├── newsletter-footer.tsx  # Email footer component
│           ├── event-card.tsx         # Event display component
│           ├── restaurant-card.tsx    # Restaurant display component
│           └── banner-slot.tsx        # Banner advertisement component
└── store/
    └── escoop-builder-store.ts        # Zustand builder state
```

#### 🔄 Campaign Workflow
```typescript
1. Content Selection → Choose events, restaurants, editorial content
2. Email Configuration → Set subject line, select Brevo lists/segments
3. Preview Generation → Generate HTML email with selected content
4. Campaign Creation → Create campaign in Brevo with generated HTML
5. Test Sending → Send test emails to specified addresses
6. Final Send → Deliver campaign to all selected subscribers
7. Performance Tracking → Monitor campaign delivery and engagement
```

#### 🎯 Brevo Operations
- **Lists Query**: `GET_BREVO_LISTS` - Fetch all contact lists
- **Segments Query**: `GET_BREVO_SEGMENTS` - Fetch audience segments
- **Campaign Creation**: `CREATE_ESCOOP_CAMPAIGN` - Create campaign in Brevo
- **Campaign Updates**: `UPDATE_ESCOOP_CAMPAIGN` - Update campaign content
- **Test Sending**: `SEND_TEST_CAMPAIGN` - Send test emails
- **Final Send**: `SEND_CAMPAIGN` - Send to all subscribers

#### 🚀 Advanced Features
- **Auto-save**: Automatic state persistence during content selection
- **Real-time Validation**: Live validation of email configuration
- **Mobile Responsive**: Optimized mobile builder interface
- **Drag & Drop**: Intuitive content selection and ordering
- **Preview Modes**: Desktop and mobile email preview
- **Content Filters**: Advanced filtering for events and restaurants
- **Template Customization**: Flexible template system for different layouts
- **Performance Analytics**: Integration with Brevo analytics

#### 🎯 Email Campaign Features
- **Campaign Overview**: Complete dashboard with stats showing draft, scheduled, and sent campaigns
- **Location Targeting**: Multi-location selection with automatic market assignment
- **Send Date Scheduling**: Calendar-based scheduling with date validation
- **Status Management**: Campaign status tracking (DRAFT → SCHEDULED → SENT)
- **Remaining Counts**: Track remaining entries and banner slots per campaign
- **Advanced Filtering**: Search by name, filter by status, market, and send status
- **Campaign Editing**: Full edit capabilities with change tracking
- **Builder Integration**: Direct access to email builder for campaign content creation

#### 🎫 Escoop Entries Management (`/dashboard/escoop-entries`)
- **Event Submission System**: Companies can submit events for inclusion in escoops
- **Approval Workflow**: Admin approval process for submitted events (PENDING → APPROVED/DECLINED)
- **Location-based Targeting**: Events can be targeted to specific markets/locations
- **Status Tracking**: Complete lifecycle tracking from submission to publication
- **Approval Reasons**: Admin can provide feedback for declined entries
- **Entry Limits**: Track remaining entry slots per escoop campaign
- **Company Assignment**: Events automatically linked to submitting company

#### 🏗️ Campaign Management Workflow
```typescript
1. Create Campaign → Set name, title, send date, locations
2. Configure Remaining → Set remaining entries and banner slots
3. Schedule Campaign → Change status from DRAFT to SCHEDULED
4. Campaign Sent → Backend automatically updates to SENT status
5. Track Performance → Monitor remaining counts and campaign metrics
```

#### 📋 Campaign Fields
- **Campaign Information**:
  - Name: Internal campaign identifier (usually contains send date)
  - Title: Public-facing campaign title for escoops
  - Send Date: Scheduled date for campaign delivery
  - Status: DRAFT, SCHEDULED, or SENT
- **Location Targeting**:
  - Multi-location checkbox selection
  - Automatic market assignment based on selected locations
  - Market groupings: Miami, NYC, LA, etc.
- **Campaign Metrics**:
  - Remaining Entries: Available spots for events/content
  - Banners Remaining: Available banner advertisement slots

#### 🛠️ Technical Implementation
- **Module Architecture**: Follows standard dashboard module pattern
- **GraphQL Operations**: Complete CRUD operations with `EscoopsPaginatedFilterInput`
- **Cursor-based Pagination**: Standard `first`, `after` pagination pattern
- **Form Validation**: Zod schemas for create and update operations
- **Status Filtering**: Dropdown filters for status, market, and send status
- **Skeleton Loading**: Content-specific loading states during data fetch

#### 📁 Key Components
```
app/dashboard/escoops/
├── components/
│   ├── escoops-stats.tsx          # Dashboard stats with clickable filters
│   ├── escoops-filters.tsx        # Search and filter controls
│   ├── escoops-table.tsx          # Data table with sorting and actions
│   └── escoops-skeleton.tsx       # Loading placeholder
├── hooks/
│   ├── use-escoops-data.ts        # GraphQL queries and data management
│   ├── use-escoops-filters.ts     # Filter state management
│   └── use-escoops-sorting.ts     # Table sorting logic
├── lib/
│   └── validations.ts             # Zod schemas for forms
├── create/
│   └── components/
│       └── escoop-form.tsx        # Campaign creation form
├── [id]/edit/
│   └── components/
│       └── escoop-edit-form.tsx   # Campaign editing form
└── [id]/builder/                  # Email campaign builder (see Builder System above)
    ├── components/                # Builder UI components
    ├── hooks/                     # Builder state management
    ├── lib/email-templates/       # React Email templates
    └── store/                     # Zustand builder state

app/dashboard/escoop-entries/      # Event submission system
├── components/
│   ├── escoop-entry-mobile-navigation.tsx
│   ├── escoop-entry-sidebar-navigation.tsx
│   └── ...                       # Entry management components
├── hooks/
│   └── use-escoop-entry-actions.ts # Entry CRUD operations
├── create/                       # Event submission interface
└── [id]/edit/                    # Entry editing interface
```

#### 🔧 GraphQL Schema Notes
- **Filter Input**: Uses `EscoopsPaginatedFilterInput` with search, status, market filters
- **Location Options**: Predefined location constants with market mappings
- **Status Enum**: `DRAFT`, `SCHEDULED`, `SENT` status values
- **Market Assignment**: Automatic market detection from selected locations
- **Change Tracking**: Edit operations only send modified fields to backend

#### 📧 Brevo Integration Technical Details
- **API Integration**: Complete GraphQL wrapper for Brevo REST API
- **Contact Management**: Real-time sync with Brevo contact lists and segments
- **Campaign Operations**: Direct campaign creation, testing, and sending via Brevo
- **Authentication**: Secure API key management for Brevo integration
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Rate Limiting**: Proper handling of Brevo API rate limits

#### 🎨 React Email Template System
- **Component Architecture**: Modular email components using React Email
- **Template Engine**: Server-side rendering of React components to HTML
- **Responsive Design**: Mobile-first email templates with Outlook compatibility
- **Dynamic Content**: Real-time content injection from builder selections
- **Brand Consistency**: Centralized styling and brand elements
- **Preview System**: Live preview generation with desktop/mobile views

#### 🎯 Admin Features
- **Status Management**: Admins can change campaign status and scheduling
- **Location Control**: Configure campaign targeting across multiple markets
- **Metrics Tracking**: Monitor campaign performance and remaining capacity
- **Quick Actions**: Bulk operations and status updates from table interface
- **Search & Filter**: Advanced filtering by name, status, market, and send date
- **Campaign History**: Complete audit trail of campaign modifications

## 📧 Dedicated Campaigns Management System

### Dedicated Email Campaigns (`/dashboard/dedicated`)

**Admin and Super Admin exclusive interface** for dedicated email campaign management with full Brevo integration:

#### 🎯 Key Features
- **Dedicated Campaign Creation**: 3-step wizard for creating single-image email campaigns
- **Brevo Campaign Builder**: Advanced campaign builder with real-time preview and Brevo integration
- **React Email Templates**: Professional email templates with shared header/footer components
- **Campaign Scheduling**: Create as draft or schedule for specific send dates
- **List & Segment Management**: Select Brevo contact lists and audience segments
- **Test Email System**: Send test campaigns before final delivery
- **Campaign Status Tracking**: Track campaign lifecycle (draft → created → scheduled → sent)
- **Load Existing Campaigns**: Automatically load and edit existing Brevo campaigns

#### 🏗️ Module Architecture
```
app/dashboard/dedicated/
├── page.tsx                          # Main list with stats & filtering
├── components/
│   ├── dedicated-stats.tsx           # Dashboard stats cards
│   ├── dedicated-filters.tsx         # Search and filter controls
│   ├── dedicated-table.tsx           # Data table with "Open Builder" action
│   ├── dedicated-skeleton.tsx        # Loading states
│   ├── dedicated-sidebar-navigation.tsx   # Shared navigation
│   └── dedicated-mobile-navigation.tsx    # Mobile navigation
├── create/
│   ├── page.tsx                      # Creation wizard entry
│   └── components/
│       ├── dedicated-creation-wizard.tsx  # 3-step wizard orchestrator
│       ├── dedicated-basic-form.tsx       # Step 1: Essential info
│       ├── dedicated-campaign-form.tsx    # Step 2: Brevo lists/segments
│       └── dedicated-image-form.tsx       # Step 3: Image upload
├── [id]/edit/
│   ├── page.tsx                      # Edit existing dedicated
│   └── components/
│       └── dedicated-edit-form.tsx   # Edit form with validation
├── [id]/builder/                     # 🎨 Dedicated Campaign Builder
│   ├── page.tsx                      # Builder interface entry
│   ├── components/
│   │   ├── dedicated-builder.tsx     # Main builder container
│   │   ├── dedicated-preview-panel.tsx    # Email preview with React Email
│   │   ├── dedicated-campaign-panel.tsx   # Brevo campaign management
│   │   ├── dedicated-sidebar-navigation.tsx  # Desktop navigation
│   │   ├── dedicated-mobile-navigation.tsx   # Mobile navigation
│   │   └── dedicated-builder-skeleton.tsx    # Loading state
│   ├── hooks/
│   │   └── use-dedicated-builder.ts  # Builder state management
│   └── lib/
│       └── email-templates/
│           └── dedicated-email-template.tsx  # React Email template
├── hooks/
│   ├── use-dedicated-data.ts         # GraphQL queries
│   ├── use-dedicated-filters.ts      # Filter state
│   ├── use-dedicated-actions.ts      # CRUD mutations
│   └── use-dedicated-image-upload.ts # S3 image config
├── lib/
│   └── validations.ts                # Module-specific Zod schemas
└── utils/
    └── dedicated-helpers.ts          # Helper utilities
```

#### 🎨 Dedicated Campaign Builder Features

**Advanced Builder Interface** (`/dashboard/dedicated/[id]/builder`):

##### 📧 Email Preview Panel
- **React Email Templates**: Professional email templates using `@react-email/components`
- **Shared Components**: Reusable `EmailHeader` and `EmailFooter` across all templates
- **Real-time HTML Generation**: Live preview with `@react-email/render`
- **Visual Email Preview**: iframe preview showing exact email appearance
- **Validation Indicators**: Visual feedback for required fields and image status

##### ⚙️ Campaign Management Panel
- **Brevo Lists Selection**: Checkbox selection with subscriber counts
- **Brevo Segments**: Optional audience segmentation for targeting
- **Campaign Summary**: Real-time subscriber count calculation
- **Draft vs Schedule**: Checkbox control for creating draft or scheduling campaign
- **Send Date Validation**: Automatic validation for future dates when scheduling
- **Campaign Status Tracking**: Visual status badges (Not Created → Created → Sent)
- **Test Email Functionality**: Send test emails to multiple addresses
- **Update Campaign**: Modify existing campaigns in Brevo

##### 🔄 Campaign Creation Workflow
```typescript
1. Access Builder → Navigate from dedicated table "Open Builder" action
2. Preview Email → See React Email rendered preview with image
3. Configure Campaign:
   - Select Brevo contact lists (required)
   - Select audience segments (optional)
   - Choose draft or schedule option
4. Create Campaign → Create in Brevo as draft or scheduled
5. Test Campaign → Send test emails for verification
6. Monitor Status → Track campaign delivery status
```

##### 📊 Load Existing Campaigns
- **Automatic Loading**: Detects and loads existing Brevo campaigns
- **Campaign Data Restoration**: Restores previously selected lists and segments
- **Status Detection**: Shows correct campaign status (draft/scheduled/sent)
- **Number to String Conversion**: Handles Brevo API number IDs correctly
- **Campaign ID Display**: Shows Brevo campaign ID for reference

#### 🎯 Dedicated Email Template System

**React Email Components** (`lib/email-templates/components/`):

##### 🎨 Shared Email Components
- **EmailHeader**: Reusable header with logo, title, and subtitle
  - Customizable background color (brand green #14532d)
  - Market-based title generation ("CultureOwl Miami")
  - Optional logo support
  - Responsive design

- **EmailFooter**: Reusable footer with unsubscribe and social links
  - Social media links (Instagram, Facebook, Twitter)
  - Dynamic copyright year
  - Unsubscribe and preferences links
  - CAN-SPAM compliant
  - Company address display

##### 📧 Dedicated Template Structure
```typescript
<Html>
  <EmailHeader
    title="CultureOwl Miami"
    subtitle="Discover culture, food & events"
  />

  <Section>
    <Link href={dedicated.link}>
      <Img src={dedicated.imageUrl} alt={dedicated.alternateText} />
    </Link>
  </Section>

  <EmailFooter
    unsubscribeUrl="#unsubscribe"
    showSocialLinks={true}
  />
</Html>
```

#### 🔧 GraphQL Operations

##### Dedicated Management
- **List Query**: `dedicatedPaginated` with status, market filtering
- **Stats Query**: `dedicatedStats` returns counts by status
- **Create Mutation**: `createDedicated` with placeholder image
- **Update Mutation**: `updateDedicated` with real S3 image key
- **Image Upload**: `generateDedicatedImageUploadUrl` for presigned URLs

##### Brevo Campaign Integration
- **Create Campaign**: `createDedicatedCampaign`
  - Optional `scheduledAt` parameter (if omitted, creates as draft)
  - Automatic HTML generation from React Email template
  - List and segment selection
  - Sender configuration
- **Update Campaign**: `updateDedicatedCampaign`
  - Modify lists, segments, subject, HTML content
  - Update scheduling or convert draft to scheduled
- **Get Dedicated with Campaign**: Query includes nested `campaign` object
  - Loads existing Brevo campaign data
  - Includes brevoCampaignId, status, lists, segments
  - Recipient count and timestamps

##### Brevo API Operations (Reused from Escoops)
- **Get Lists**: `GET_BREVO_LISTS` - Fetch all contact lists with subscriber counts
- **Get Segments**: `GET_BREVO_SEGMENTS` - Fetch audience segments
- **Send Test**: `SEND_TEST_CAMPAIGN` - Send test emails to specified addresses

#### 🛠️ Technical Implementation

##### State Management
- **Zustand Store**: `store/dedicated-builder-store.ts`
  - Campaign settings (selected lists, segments)
  - Campaign state (ID, status, errors)
  - Generated HTML preview
  - Builder initialization and reset

##### Image Upload Integration
- **Advanced Upload Component**: Drag & drop with cropping
- **Minimum Dimensions**: Configurable per module
- **S3 Integration**: Presigned URLs with temporary storage
- **Two-phase Upload**: Local storage → S3 on form submit

##### Form Validation
- **Module-specific Schemas**: `app/dashboard/dedicated/lib/validations.ts`
- **Step-based Validation**: Different schemas for each creation step
- **Dynamic Validation**: Conditional validation based on scheduling choice
- **Type Safety**: Full TypeScript integration

#### 🎯 Key Features

##### Draft vs Scheduled Creation
- **Draft Mode (Default)**:
  - Creates campaign without `scheduledAt` parameter
  - Campaign saved in Brevo as draft status
  - Can be scheduled later from Brevo dashboard
  - No send date validation required

- **Scheduled Mode**:
  - User checks "Schedule campaign" checkbox
  - Includes `scheduledAt` parameter in mutation
  - Validates send date is in the future
  - Campaign auto-sends at scheduled time

##### Campaign Loading & Editing
- **Existing Campaign Detection**: Automatically detects campaign in database
- **Data Restoration**: Loads Brevo campaign ID, lists, segments, status
- **Type Conversion**: Handles Brevo number IDs → frontend string IDs
- **Update Mode**: Shows "Update Campaign" instead of "Create Campaign"
- **Visual Indicators**: Campaign ID and status badges displayed

##### Validation States
```typescript
// Creating as draft (no date required)
✅ Valid image uploaded
✅ At least one list selected
⚠️ Send date can be past or future

// Creating scheduled (date required)
✅ Valid image uploaded
✅ At least one list selected
✅ Send date must be future
```

#### 📱 Mobile Optimization
- **Responsive Builder**: Mobile-optimized builder interface
- **Touch Navigation**: Touch-friendly panel switching
- **Mobile Preview**: Mobile-specific navigation header
- **Responsive Forms**: Optimized checkbox lists for mobile

#### 🚀 Advanced Features
- **Real-time HTML Generation**: React Email rendering on-demand
- **Image Validation**: Ensures valid image before campaign creation
- **Error Handling**: Comprehensive error messages and recovery
- **Toast Notifications**: User feedback for all actions
- **Loading States**: Skeleton loading and button spinners
- **Campaign Status Badges**: Visual status indicators throughout UI

#### 📊 Dashboard Stats
```typescript
// Clickable stat cards with filtering
- Total: All dedicated campaigns
- Pending: Awaiting action
- Scheduled: Campaigns with future send dates
- Sent: Delivered campaigns
- Market-based counts: Per-market campaign stats
```

#### 🔄 Integration Points
- **Brevo Email Platform**: Complete integration via GraphQL
- **React Email System**: Shared email components
- **S3 Image Storage**: Presigned URL uploads
- **Companies System**: Company-based campaign ownership
- **Escoops Builder**: Shares Brevo integration hooks

## 🎭 Events Management System

### Advanced Event Platform (`/dashboard/events`)

**Comprehensive event management system** with advanced creation workflows and draft functionality:

#### 🎯 Key Features
- **3-Step Creation Wizard**: Advanced event creation with guided workflow
- **Draft System**: Save and resume event creation with automatic draft management
- **Recurring Events**: Support for complex recurring patterns with custom schedules
- **Multi-format Events**: Physical venues, virtual events, and hybrid formats
- **Rich Event Details**: Comprehensive event information with agenda, pricing, FAQs
- **Company Assignment**: Admin can assign events to any company, members to own company
- **Status Management**: Draft, scheduled, and published event states
- **Advanced Filtering**: Search, status, market, and company filtering with real-time stats

#### 🧙‍♂️ 3-Step Creation Wizard Workflow
```typescript
1. Basic Information → Event details, dates, venue selection
2. Event Details → Description, media, lineup, agenda, pricing
3. Additional Information → FAQs, contact info, final review
```

#### 📋 Step 1: Basic Information
- **Event Essentials**:
  - Title, summary, and description
  - Market and company assignment
  - Event categories and tags
- **Date & Time Configuration**:
  - Single events with start/end dates
  - Recurring events with pattern selection
  - Time slot management for multiple sessions
  - Custom recurring patterns (daily, weekly, monthly)
- **Venue Selection**:
  - Physical venue combobox with search
  - Virtual event configuration with links
  - Hybrid event support

#### 📋 Step 2: Event Details
- **Event Media**:
  - Advanced image upload with cropping and validation
  - Minimum dimensions enforcement (1200x630px, 1.9 aspect ratio)
  - S3 integration with presigned URLs
- **Event Content**:
  - Rich text description with formatting
  - Event lineup and performer management
  - Agenda management with time slots
  - Pricing tiers and ticket information

#### 📋 Step 3: Additional Information
- **Enhanced Details**:
  - Frequently Asked Questions (FAQs)
  - Contact information and organizer details
  - Additional event metadata
  - Final review and publication

#### 🔄 Draft System Features
- **Auto-save Functionality**: Automatic draft saving during form completion
- **Resume Creation**: Continue from any step where creation was left off
- **Draft Management**: Navigate directly to edit mode for draft events
- **Status Indicators**: Visual indicators for draft vs published events
- **Draft Cleanup**: Automatic cleanup of abandoned drafts

#### 🔁 Recurring Events Support
- **Pattern Types**:
  - Daily: Every N days with custom intervals
  - Weekly: Specific weekdays with weekly/bi-weekly patterns
  - Monthly: Specific dates or weekday occurrences
  - Custom: Complex patterns with manual date selection
- **Advanced Options**:
  - End date configuration or occurrence limits
  - Exception dates for holidays/breaks
  - Pattern preview with calendar visualization
  - Bulk editing for recurring event series

#### 🛠️ Technical Implementation
- **3-Step Wizard Architecture**: Each step as separate component with validation
- **Draft State Management**: Zustand store for draft persistence and auto-save
- **Form Validation**: Step-specific Zod schemas with progressive validation
- **Navigation Controls**: Step indicator with validation-based navigation
- **Image Upload Integration**: Advanced image upload component with S3 storage
- **Recurring Logic**: Complex pattern calculation and date generation

#### 📁 Key Components
```
app/dashboard/events/
├── page.tsx                       # Events list orchestrator
├── components/
│   ├── events-stats.tsx           # Dashboard stats with filtering
│   ├── events-filters.tsx         # Advanced search and filters
│   ├── events-table.tsx           # Events data table
│   ├── event-preview-card.tsx     # Event preview with image
│   ├── event-sidebar-navigation.tsx # Wizard step navigation
│   ├── event-step-indicator.tsx   # Progress indicator
│   ├── event-auto-save-indicator.tsx # Draft save status
│   └── events-skeleton.tsx        # Loading placeholders
├── create/
│   ├── page.tsx                   # Creation wizard entry point
│   └── components/
│       ├── event-creation-wizard.tsx      # Main wizard orchestrator
│       ├── event-details-form.tsx         # Step 1: Basic info
│       ├── event-media-form.tsx           # Step 2: Media & details
│       ├── event-additional-info-panel.tsx # Step 3: Additional info
│       ├── recurring-calendar-selector.tsx # Recurring pattern UI
│       ├── venue-combobox.tsx             # Venue selection
│       ├── event-agenda-panel.tsx         # Agenda management
│       ├── event-pricing-panel.tsx        # Pricing configuration
│       └── event-faqs-panel.tsx           # FAQ management
├── [id]/edit/
│   └── page.tsx                   # Edit existing events
├── hooks/
│   ├── use-events-data.ts         # Events listing data
│   ├── use-event-draft.ts         # Draft management
│   ├── use-event-form.ts          # Form state management
│   ├── use-event-actions.ts       # Create/update mutations
│   ├── use-recurring-transformation.ts # Recurring pattern logic
│   └── use-event-image-upload.ts  # Image upload configuration
├── lib/
│   ├── validations.ts             # Comprehensive form schemas
│   ├── date-utils.ts              # Date manipulation utilities
│   └── recurring-patterns.ts      # Recurring event logic
└── utils/
    └── events-helpers.ts          # Event formatting utilities
```

#### 🔧 GraphQL Operations
- **Events Listing**: `EventsPaginated` with comprehensive filtering
- **Event Creation**: `InitializeDraft` → multi-step creation → `UpdateEvent`
- **Draft Management**: Draft initialization, auto-save, and cleanup
- **Recurring Events**: Pattern-based event generation and management
- **Image Upload**: `GenerateEventImageUploadUrl` for S3 presigned URLs

#### 🎯 Advanced Features
- **Smart Draft Detection**: Automatically detect and resume incomplete events
- **Company-based Access**: Role-based event assignment and visibility
- **Mobile-Responsive Wizard**: Optimized mobile navigation for event creation
- **Real-time Validation**: Progressive validation across wizard steps
- **Auto-save Integration**: Seamless draft saving without user intervention
- **Pattern Preview**: Visual calendar preview for recurring events
- **Tag Integration**: Music tag system integration for event categorization
- **Venue Integration**: Complete integration with venue management system

#### 📱 Mobile Optimization
- **Mobile Navigation**: Touch-friendly wizard navigation
- **Responsive Forms**: Optimized form layouts for mobile devices
- **Touch Interactions**: Gesture-based navigation between steps
- **Mobile Image Upload**: Mobile-optimized image capture and upload

#### 🔄 Integration Points
- **Venues Module**: Seamless venue selection and assignment
- **Tags System**: Music tag integration for event categorization
- **Companies System**: Company-based event ownership and access control
- **Image Upload System**: Advanced image processing with S3 storage

## 🔍 SEO Architecture for Public Directories

### Environment-Based SEO Protection

**Complete SEO implementation for all public-facing content** with automatic staging protection and production optimization:

#### 🎯 Key Features
- **Automatic Environment Detection**: Staging (.vercel.app) automatically blocked from search engines
- **Production Optimization**: Custom domain (cultureowl.com) fully optimized for search engines
- **Dynamic Robots.txt**: Environment-aware robots.txt generation
- **Dynamic Sitemap**: Real-time sitemap generation from database
- **Rich Snippets**: Schema.org JSON-LD structured data for enhanced search results
- **Open Graph & Twitter Cards**: Complete social media sharing optimization

### 📋 Implemented Public Directories

#### ✅ Venues Directory (`/venues`)
**Complete SEO implementation** - Reference implementation for all future directories:

**Pages with SEO**:
- **Directory Homepage** (`/venues`): Static metadata with keywords and descriptions
- **Location Pages** (`/venues/location/[slug]`): Dynamic metadata per city/state
  - Example: `/venues/location/miami-fl`
  - City-specific keywords, descriptions, Open Graph tags
  - Location-specific breadcrumb navigation
- **Venue Detail Pages** (`/venues/venue/[slug]`): Full venue metadata with images
  - Server-side data fetching for accurate metadata
  - Venue images in Open Graph tags
  - Rich descriptions from venue data

**Structured Data Implemented**:
- **BreadcrumbList**: Hierarchical navigation for all pages
- **Place Schema**: Complete venue information with address, phone, website
- **EventVenue Schema**: For venues hosting events
- **Organization Schema**: For cultural organizations (Museums, Theaters, Galleries)
- **FAQPage Schema**: For venues with FAQ sections

**Technical Implementation**:
```
app/venues/
├── layout.tsx                        # Static metadata
├── page.tsx                          # Main listing (client component)
├── location/[slug]/
│   ├── page.tsx                      # Server component with generateMetadata()
│   └── location-page-content.tsx     # Client component with UI
├── venue/[slug]/
│   ├── page.tsx                      # Server component with generateMetadata()
│   ├── venue-detail-content.tsx      # Client component with UI
│   └── components/
│       └── venue-structured-data.tsx # JSON-LD schemas
└── components/
    └── venue-breadcrumb.tsx          # Breadcrumb with JSON-LD
```

### 🏗️ SEO Implementation Pattern (For Future Directories)

When implementing SEO for new public directories (restaurants, arts-groups, etc.), follow this pattern:

#### 1️⃣ Directory Layout (`layout.tsx`)
```typescript
import { Metadata } from 'next';
import { getSiteUrl } from '@/lib/seo-utils';

export const metadata: Metadata = {
  title: '{Directory} Directory | CultureOwl',
  description: 'Discover {directory} across Florida...',
  keywords: [/* directory-specific keywords */],
  openGraph: { /* OG tags */ },
  twitter: { /* Twitter cards */ },
  alternates: { canonical: `${getSiteUrl()}/{directory}` },
};
```

#### 2️⃣ Location Pages (`location/[slug]/page.tsx`)
**Server Component** with `generateMetadata()`:
- Parse location slug (e.g., "miami-fl" → "Miami, FL")
- Generate location-specific metadata
- Pass location data to client component

**Client Component** (`location-page-content.tsx`):
- All UI logic, hooks, state management
- Receives location data as props

#### 3️⃣ Detail Pages (`{directory}/[slug]/page.tsx`)
**Server Component** with `generateMetadata()`:
- Fetch entity data server-side for metadata
- Generate SEO tags from database
- Include images in Open Graph tags

**Client Component** (`{directory}-detail-content.tsx`):
- UI rendering with entity data
- Structured data component integration

#### 4️⃣ Structured Data Component
**Create `{directory}-structured-data.tsx`**:
- Schema.org Place/Organization types
- FAQPage for entities with FAQs
- Social media links (sameAs property)
- Address and contact information

#### 5️⃣ Breadcrumb Component
**Enhance existing breadcrumb** with JSON-LD:
```typescript
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [/* breadcrumb items */],
};
```

#### 6️⃣ Update Sitemap (`app/sitemap.ts`)
Add new directory URLs to dynamic sitemap:
```typescript
// Fetch entities from GraphQL
const entities = await fetchDirectoryEntities();

// Generate sitemap entries
const directoryPages = entities.map(entity => ({
  url: `${siteUrl}/{directory}/{directory}/${entity.slug}`,
  lastModified: new Date(entity.createdAt),
  changeFrequency: 'weekly',
  priority: 0.8,
}));
```

### 🔧 SEO Utilities (`lib/seo-utils.ts`)

**Core Functions**:
```typescript
// Environment detection
isProductionEnvironment(): boolean  // true = custom domain, false = staging

// Site URL based on environment
getSiteUrl(): string  // Returns correct domain

// Robots configuration
getRobotsConfig()  // Returns proper robots meta tags
```

### 📊 Schema.org Types by Directory

Recommended Schema.org types for each directory:

- **Venues**: `Place`, `EventVenue`, `Museum`, `Theater`, `ArtGallery`
- **Restaurants**: `Restaurant`, `FoodEstablishment`
- **Arts Groups**: `PerformingGroup`, `Organization`
- **Events**: `Event`, `TheaterEvent`, `MusicEvent`, `Festival`

### ✅ SEO Implementation Checklist

Before deploying a new public directory, verify:

**Required Files**:
- [x] `app/{directory}/layout.tsx` - Static metadata
- [x] `app/{directory}/location/[slug]/page.tsx` - Location metadata
- [x] `app/{directory}/{directory}/[slug]/page.tsx` - Detail metadata
- [x] `components/{directory}-structured-data.tsx` - JSON-LD schemas
- [x] `components/{directory}-breadcrumb.tsx` - Breadcrumb with schema
- [x] Updated `app/sitemap.ts` with directory URLs

**Testing**:
- [x] Build succeeds: `npm run build`
- [x] No TypeScript errors
- [x] Metadata in page source
- [x] JSON-LD validates: https://validator.schema.org/
- [x] Robots.txt accessible: `/robots.txt`
- [x] Sitemap accessible: `/sitemap.xml`
- [x] Staging blocks indexing (meta robots = noindex, nofollow)
- [x] Production allows indexing (meta robots = index, follow)

### 🚀 SEO Best Practices

**Do's** ✅:
1. Use async server components for `generateMetadata()`
2. Fetch real data server-side for accurate metadata
3. Include all Open Graph and Twitter Card tags
4. Implement appropriate Schema.org types
5. Set canonical URLs on all pages
6. Include location-specific keywords in metadata
7. Use high-quality images (min 1200x630px) for OG tags

**Don'ts** ❌:
1. Never use 'use client' on pages needing metadata
2. Never hardcode URLs (always use `getSiteUrl()`)
3. Never omit canonical URLs
4. Never allow staging to be indexed
5. Never skip structured data implementation
6. Never use low-quality images in Open Graph

### 📁 Reference Files

**Global SEO Files**:
- `lib/seo-utils.ts` - Core SEO utilities
- `app/robots.ts` - Dynamic robots.txt
- `app/sitemap.ts` - Dynamic sitemap generator
- `app/layout.tsx` - Root layout with robots config

**Venues Implementation** (Reference):
- `app/venues/layout.tsx`
- `app/venues/location/[slug]/page.tsx`
- `app/venues/venue/[slug]/page.tsx`
- `app/venues/venue/[slug]/components/venue-structured-data.tsx`
- `app/venues/components/venue-breadcrumb.tsx`

### 🎯 Expected Results

**Staging Environment** (.vercel.app):
- ❌ Not indexed by search engines
- ❌ Robots.txt blocks all crawlers
- ❌ Meta robots: `noindex, nofollow`

**Production Environment** (cultureowl.com):
- ✅ Fully indexed by search engines
- ✅ Complete sitemap with all entities
- ✅ Rich snippets in search results
- ✅ Proper social media previews
- ✅ Meta robots: `index, follow`

## 🎨 Arts Groups Management System

### Cultural Organization Platform (`/dashboard/arts-groups`)

**Comprehensive management system for arts and cultural organizations** with approval workflows and modern split-screen interface:

#### 🎯 Key Features
- **2-Step Creation/Edit Wizard**: Modern split-screen layout with sidebar navigation
- **Approval Workflow**: Complete status management (PENDING → APPROVED → DECLINED)
- **Art Type Classification**: Categorization by art type (Music, Theater, Dance, Visual Arts, etc.)
- **Location Tracking**: Market-based organization with address and contact details
- **Image Upload System**: Advanced S3 integration with cropping and validation (1080x1080px)
- **Company Assignment**: Admin can assign to any company, members to own company
- **Real-time Stats**: Dashboard with approved, pending, and declined counts

#### 🏗️ Module Architecture
```
app/dashboard/arts-groups/
├── page.tsx                          # Main orchestrator with stats & table
├── components/
│   ├── arts-groups-stats.tsx         # Stats cards with clickable filters
│   ├── arts-groups-filters.tsx       # Search and filter controls
│   ├── arts-groups-table.tsx         # Data table with actions
│   ├── arts-groups-skeleton.tsx      # Loading states
│   ├── arts-group-sidebar-navigation.tsx  # Split-screen sidebar (purple theme)
│   └── arts-group-mobile-navigation.tsx   # Mobile navigation
├── create/
│   ├── page.tsx                      # Creation wizard entry
│   └── components/
│       ├── arts-group-creation-wizard.tsx  # Main wizard orchestrator
│       ├── arts-group-basic-form.tsx       # Step 1: Essential info
│       └── arts-group-advanced-form.tsx    # Step 2: Image & details
├── [id]/edit/
│   ├── page.tsx                      # Edit wizard entry
│   └── components/
│       ├── arts-group-edit-wizard.tsx      # Edit wizard (no auto-save)
│       ├── arts-group-basic-edit-form.tsx  # Step 1: Basic info
│       └── arts-group-advanced-edit-form.tsx # Step 2: Image & advanced
├── hooks/
│   ├── use-arts-groups-data.ts       # GraphQL queries with useMemo
│   ├── use-arts-groups-filters.ts    # Filter state management
│   ├── use-arts-group-actions.ts     # Create/update/delete mutations
│   └── use-arts-group-image-upload.ts # S3 image upload config
├── lib/
│   └── validations.ts                # Module-specific Zod schemas
└── utils/
    └── arts-group-helpers.ts         # Helper utilities
```

#### 🎨 Split-Screen Layout
- **Desktop**: Fixed sidebar (320px) with preview card + main content area
- **Mobile**: Top navigation bar with step indicator
- **Theme**: Purple/Pink gradient for arts groups differentiation
- **Preview Card**: Real-time arts group preview with image, status badge
- **Clickable Steps**: Navigate between steps with validation

#### 📋 Step 1: Basic Information
- **Organization Details**:
  - Arts group name (required)
  - Art type classification (Music, Theater, Dance, Visual Arts, Folk Arts, etc.)
  - Market selection (Miami, NYC, LA, etc.)
  - Company assignment (admin-only or own company)
- **Location & Contact**:
  - Physical address
  - Phone number and email
  - Website URL
- **Navigation**: "Continue to Step 2 →" button (no auto-save)

#### 📋 Step 2: Advanced Details
- **Image Upload**:
  - Advanced image component with cropping and zoom
  - Minimum dimensions: 1080x1080px (square aspect ratio)
  - S3 integration with presigned URLs
  - Temporary storage before final submission
- **Additional Information**:
  - Description (10-500 characters)
  - Member count
  - Founded year
- **Actions**:
  - "← Back to Step 1" button
  - "Update Arts Group" / "Create Arts Group" button

#### 🔄 Edit Mode (No Auto-Save Pattern)
- **Form State Accumulation**: Changes tracked but not saved automatically
- **Explicit Update**: User must press "Update" button in sidebar or form
- **forwardRef Pattern**: Forms expose `submitForm()` via refs for external triggers
- **Change Tracking**: `hasUnsavedChanges` indicator in sidebar
- **Dual Update Options**:
  - Sidebar "Update" button (when unsaved changes detected)
  - Form "Update Arts Group" button (always visible)

#### 🛠️ Technical Implementation
- **useMemo Optimization**: Prevent infinite loops with memoized array references
- **Cursor-based Pagination**: Forward-only pagination with `hasNextPage` and `endCursor`
- **GraphQL Schema**:
  - Stats: `{ total, approved, pending, declined, deleted }`
  - Pagination: No `hasPreviousPage` or `startCursor` (forward-only)
- **Image Upload**: `{ artsGroupId, fileName, contentType, fileSize, imageType: 'main' }`
- **Form Validation**: Module-specific Zod schemas in `lib/validations.ts`
- **Skeleton Loading**: Split-screen skeleton matching actual layout

#### 📊 Stats Dashboard
```typescript
// Clickable stat cards with real-time filtering
- Approved: Active arts groups (green indicator)
- Pending: Awaiting approval (yellow indicator)
- Declined: Declined organizations (red indicator)
- Total: All arts groups (blue indicator)
```

#### 🔧 GraphQL Operations
- **List Query**: `artsGroupsPaginated` with filtering by status, market, art type
- **Stats Query**: `artsGroupStats` returns `{ total, approved, pending, declined, deleted }`
- **Create Mutation**: `createArtsGroup` with placeholder image in Step 1
- **Update Mutation**: `updateArtsGroup` with real S3 key in Step 2
- **Image Upload**: `generateArtsGroupImageUploadUrl` with metadata
- **Status Management**: `updateArtsGroupStatus` (super admin only)

#### 🎯 Admin Features
- **Approval Workflow**: Change status between PENDING, APPROVED, DECLINED
- **Company Management**: Assign arts groups to any company
- **Bulk Filtering**: Filter by status, market, art type
- **Search**: Real-time search by arts group name
- **Delete Protection**: Confirmation dialogs for destructive actions

#### 🚀 Key Features
- **Modern UI**: Consistent with venues/restaurants/banners modules
- **Mobile Responsive**: Optimized mobile navigation and forms
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Content-specific skeleton loading
- **Image Validation**: Enforced minimum dimensions and file types
- **Form Persistence**: Draft data maintained during navigation

#### 🔄 Integration Points
- **Companies System**: Company-based arts group ownership
- **Image Upload System**: Shared S3 upload infrastructure
- **Approval System**: Status-based workflow management
- **Market System**: Location-based organization

## 🔐 RBAC & Permissions System

### Dynamic Permission Management (`/dashboard/roles-management`)

**Super Admin exclusive interface** for comprehensive role and permission management:

#### 🎯 Key Features
- **Three-Tab Interface**: Roles, Permissions, User Assignments
- **Role Types**: Global roles, company-specific roles, system roles
- **Permission Assignment**: Granular permission control per role
- **User Assignment**: Assign roles to both employees and company owners
- **Real-time Updates**: All changes reflect immediately across the system

#### 🏗️ System Architecture
```typescript
// Dynamic permission checking
hasPermission(user, 'user:manage')
hasAnyPermission(user, ['company:read', 'company:manage'])
canAccessPage(user, ['system:admin'])

// Page protection
<ProtectedPage requiredRoles={['SUPER_ADMIN']}>
  <AdminContent />
</ProtectedPage>
```

#### 📁 Key Components
- `lib/permissions-dynamic.ts` - Dynamic permission checks
- `lib/graphql/roles-permissions.ts` - Complete GraphQL operations
- `hooks/use-role-access.ts` - Role-based access control hook
- `components/protected-page.tsx` - Page protection HOC
- `store/auth-store.ts` - Enhanced with permission loading

#### 🔧 Implementation Notes
- **GraphQL Schema**: Use `String` type for `companyId` parameters, not `ID`
- **API-Driven**: All permissions loaded dynamically from backend
- **No Hardcoding**: Never hardcode permissions in frontend code
- **Consistent UI**: All interfaces use English for consistency

## 🌙 Theme Support

The app supports light and dark themes using `next-themes`. Users can toggle between themes using the theme toggle button in the UI.

## 📝 Form Validation

All forms use React Hook Form with Zod schemas for robust validation:

```typescript
// Example: Company creation schema
const createCompanySchema = z.object({
  users: z.array(companyUserSchema).min(1, "At least one user is required"),
  companyName: z.string().min(1, "Company name is required"),
  planSlug: z.string().min(1, "Plan selection is required"),
  checkPayment: z.boolean(),
  marketSlug: z.string().min(1, "Market selection is required")
});
```

### 🎯 Company Creation Features

- **Multi-User Management**: Owner and Manager roles with validation
- **Dynamic Plan Selection**: Real-time asset preview with filtering
- **Payment Configuration**: Check payment vs Stripe invoicing options
- **Market Selection**: Dropdown with all available markets
- **Form Validation**: Comprehensive Zod validation with error handling
- **GraphQL Integration**: Secure mutations via BFF pattern

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Docker

```bash
docker build -t events-frontend .
docker run -p 3000:3000 events-frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@events-platform.com or join our Slack channel.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Apollo GraphQL](https://www.apollographql.com/)
