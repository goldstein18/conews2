# Project Context for Claude

## IMPORTANT: use Serena to search through the codebase. If you get any errors using Serena, retry with different Serena tools.

## Tech Stack
- **Frontend**: Next.js 15 (App Router)
- **UI**: Shadcn/ui + Tailwind CSS
- **State**: Zustand (MANDATORY for all React state management)
- **Forms**: React Hook Form + Zod
- **API**: BFF + Apollo Client (secure GraphQL proxy)
- **Auth**: JWT with httpOnly cookies
- **Lang**: TypeScript

## Security Architecture
🚨 **CRITICAL**: All GraphQL requests MUST use BFF (Backend for Frontend) pattern via `/api/graphql` endpoint. NEVER expose GraphQL backend directly to client.

### BFF Endpoints (Required)
- `/api/auth/login` - Secure login with httpOnly cookies
- `/api/auth/logout` - Clear secure cookies
- `/api/auth/me` - Get current user
- `/api/auth/refresh` - Token refresh
- `/api/graphql` - GraphQL proxy (ALL GraphQL queries go here)

## Commands
```bash
npm run dev    # Development
npm run build  # Production build
npm run lint   # Code linting
```

## System Architecture: Company-Only Model
🏢 **ALL users are companies** - No individual members exist. Each user creates/owns a company (even single-person companies).

### Company Management
- **Companies Dashboard**: `/dashboard/companies` (manages all companies)
- **Company Status**: `PENDING` → `ACTIVE` → `SUSPENDED` → `CANCELLED`
- **Super Admin Control**: Only super admins can change company status
- **Plan Assignment**: Each company has a plan with specific allowances

### Key Features
- **Multi-role Dashboard**: SUPER_ADMIN, ADMIN, CALENDAR_MEMBER, DINNING_MEMBER, SALES, AGENCY, EDITORIAL_WRITER
- **Dynamic Permissions System**: API-based role and permission management
- **Companies Management**: Dashboard with real-time stats and filtering
- **Employee Management**: Comprehensive employee dashboard and controls
- **Roles & Permissions**: Super admin interface for role/permission management
- **Audit System**: Activity tracking and audit logs
- **Secure Auth**: httpOnly cookies, JWT refresh tokens, rate limiting
- **CSP & Security Headers**: XSS/CSRF protection
- **Input Validation**: Zod schemas with sanitization

## Companies Dashboard Features
- **Dashboard Stats**: Plan distribution, active/pending companies, expiring
- **Clickable Filters**: Plan cards and summary cards filter the company list
- **Advanced Search**: Email, name, market filtering with debounced search
- **Server-side Pagination**: Cursor-based pagination for performance
- **Real-time Data**: Parallel queries for stats and company list

## GraphQL Schema Notes
- **ID Types**: Backend expects `ID!` type for entity identifiers, `String` for companyId parameters
- **Company Filters**: `activeOnly`, `pendingOnly`, `planSlug`, `expiringThisMonth`
- **Cursor Pagination**: Use `first`, `after` for pagination, not offset-based
- **Stats Query**: `membersDashboardStats` for dashboard metrics
- **Roles & Permissions**: Use `String` type for `companyId` in queries, not `ID`

## Dashboard Module Architecture (MANDATORY)
🏗️ **ALL dashboard modules MUST follow this scalable structure pattern**:

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

### Module Architecture Rules
1. ✅ **page.tsx** = orchestrator only (~50-150 lines)
2. ✅ **Components** = self-contained, <250 lines each
3. ✅ **Hooks** = reusable logic, <100 lines each  
4. ✅ **Utils** = pure functions, no side effects
5. ✅ **Barrel exports** for clean imports
6. ✅ **Sortable tables** with column sorting
7. ✅ **Filter state** isolated in custom hooks
8. ✅ **Cursor-based pagination** (Previous/Next) - ALWAYS use `first`, `after` parameters
9. ✅ **Skeleton loading states** - MANDATORY content-specific loading placeholders
10. ❌ **NO monolithic pages** >200 lines
11. ❌ **NO mixing concerns** in single files
12. ❌ **NO numeric pagination** (1,2,3...) - use cursor-based only
13. ❌ **NO simple spinners** - use structured skeleton loading instead

### Examples
- ✅ `companies/` - Reference implementation
- ✅ `employees/` - Working implementation
- ✅ `roles-management/` - Complete RBAC system
- ✅ `audit/` - Audit logs system
- ✅ `tags/` - Tags management system
- ✅ `settings/` - Settings with skeleton loading example
- ✅ `venues/` - 2-Step Wizard with image upload
- ✅ `restaurants/` - 2-Step Wizard with image upload
- ✅ `arts-groups/` - 2-Step Wizard with image upload
- ✅ `news/` - 2-Step Wizard with hero image upload (EDITORIAL_WRITER role)
- 📋 Future: `events/`, `banners/`

## Development Methodology (CRITICAL)
🔍 **ALWAYS ANALYZE EXISTING IMPLEMENTATIONS FIRST**

### Pattern Analysis Rule
**BEFORE creating any new module or feature, ALWAYS:**

1. **🔍 Find Similar Working Code**:
   - Search for similar functionality in existing modules
   - Check `companies/`, `employees/`, `roles-management/`, `audit/` modules
   - Look for patterns in GraphQL queries, mutations, and components

2. **📋 Analyze & Document Patterns**:
   - Identify working GraphQL schemas and queries
   - Note successful API integration patterns
   - Document filtering, sorting, and pagination approaches

3. **🔄 Replicate Working Methodology**:
   - Copy the exact query structure that works
   - Replicate successful mutation patterns
   - Use the same data hooks and state management approach
   - Follow identical error handling patterns

4. **✅ Examples of This Success**:
   - **Employees Module**: Initially failed with custom schemas
   - **Solution**: Analyzed `companies/members` working queries
   - **Result**: Used exact `membersPaginated` pattern → Success
   - **Key**: `LIST_EMPLOYEES` replicated `LIST_COMPANY_OWNERS` structure

### Pattern Replication Strategy
```bash
# Step 1: Identify working patterns
find app/dashboard -name "*.ts" -o -name "*.tsx" | grep -E "(companies|employees|plans)"

# Step 2: Copy successful query structures  
cp lib/graphql/members.ts lib/graphql/new-module.ts

# Step 3: Adapt existing hooks pattern
cp app/dashboard/companies/hooks app/dashboard/new-module/hooks -R
```

### Anti-Patterns to Avoid
❌ **DO NOT**:
- Create new GraphQL schemas without checking existing ones
- Invent new API patterns when working ones exist
- Skip analysis of similar working modules
- Start from scratch when patterns exist

✅ **ALWAYS DO**:
- Find the closest working implementation first
- Test GraphQL queries in Postman if available
- Replicate working patterns exactly
- Adapt incrementally from working base

## RBAC & Permissions System
🔐 **Dynamic role-based access control with API-driven permissions**

### Roles Management (`/dashboard/roles-management`)
- **Super Admin Only**: Complete role and permission management
- **Three-Tab Interface**: Roles, Permissions, User Assignments
- **Role Types**: Global roles, company-specific roles, system roles
- **Permission Assignment**: Granular permission control per role
- **User Assignment**: Assign roles to employees and company owners

### Key Components
- `roles-management/` - Main interface with tabs
- `lib/permissions-dynamic.ts` - Dynamic permission checks
- `lib/graphql/roles-permissions.ts` - GraphQL operations
- `hooks/use-role-access.ts` - Role-based access hook
- `components/protected-page.tsx` - Page protection HOC

### Permission Patterns
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

## Skeleton Loading States (MANDATORY)
🎨 **ALL pages MUST implement structured loading placeholders instead of simple spinners**

### Core Skeleton Component
Use the base skeleton component from Shadcn/ui:
```typescript
import { Skeleton } from '@/components/ui/skeleton';

// Basic usage
<Skeleton className="h-6 w-32" />

// Custom skeleton with animate-pulse
<div className="h-4 bg-gray-200 rounded animate-pulse" />
```

### Loading State Architecture
1. **Content-Specific Skeletons**: Match actual content layout and dimensions
2. **Component-Level Loading**: Pass `loading={true}` props to components
3. **Progressive Loading**: Load individual sections as data becomes available
4. **Tab-Specific Skeletons**: Different loading states for different content types

### Skeleton Implementation Pattern
```typescript
// ✅ CORRECT: Content-specific skeleton
export function ModuleSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Card skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ❌ INCORRECT: Simple spinner
return (
  <div className="flex justify-center py-12">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);
```

### Reference Implementation
- **Settings Module**: `app/dashboard/settings/components/settings-skeleton.tsx`
- **Company Profile**: Existing skeleton patterns in companies module
- **Reusable Components**: `/components/ui/skeleton.tsx`

### Skeleton Loading Rules
1. ✅ **Match content dimensions**: Skeleton should approximate real content size
2. ✅ **Maintain layout structure**: Keep same grid/flex layouts in loading state
3. ✅ **Use meaningful placeholders**: Show cards, forms, tables structure
4. ✅ **Progressive disclosure**: Load sections independently as data arrives
5. ❌ **NO simple spinners**: Never use basic loading spinners alone
6. ❌ **NO layout shifts**: Skeleton dimensions should prevent content jumping

## React State Management Rules (CRITICAL)
🧠 **ZUSTAND IS MANDATORY FOR ALL REACT STATE MANAGEMENT**

### State Management Architecture
- **Global State**: Use Zustand stores for cross-component state
- **Local State**: Use useState only for component-specific UI state
- **Server State**: Use Apollo Client for GraphQL data caching
- **Form State**: Use React Hook Form with Zod validation

### Zustand Implementation Rules
1. ✅ **ALL complex state management MUST use Zustand stores**
2. ✅ **Create stores in `/store/` directory with descriptive names**
3. ✅ **Use TypeScript interfaces for store state and actions**
4. ✅ **Implement persistence when data needs to survive page refreshes**
5. ✅ **Use proper cleanup for memory-sensitive data (blobs, URLs)**
6. ❌ **NEVER use useState for global or cross-component state**
7. ❌ **NEVER use Context API for complex state management**
8. ❌ **NEVER use Redux or other state management libraries**

### Store Pattern Example
```typescript
// ✅ CORRECT: Zustand store structure
export interface MyModuleState {
  data: MyData[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setData: (data: MyData[]) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
  reset: () => void;
}

export const useMyModuleStore = create<MyModuleState>()((set, get) => ({
  data: [],
  loading: false,
  error: null,
  
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  clearError: () => set({ error: null }),
  reset: () => set({ data: [], loading: false, error: null })
}));
```

## Image Upload System (STANDARD COMPONENT)
🖼️ **USE `ImageUploadAdvanced` FOR ALL IMAGE UPLOAD REQUIREMENTS**

### Advanced Image Upload Component
- **Location**: `components/ui/image-upload-advanced/`
- **Features**: Drag & drop, cropping, rotation, zoom, validation
- **State Management**: Zustand-based temporary storage before S3 upload
- **Upload Flow**: Local storage → Form submission → S3 upload

### Implementation for Future Modules
```typescript
// ✅ CORRECT: Usage in any module form
import { ImageUploadAdvanced } from '@/components/ui/image-upload-advanced';

<FormField
  control={form.control}
  name="image"
  render={({ field }) => (
    <FormItem>
      <ImageUploadAdvanced
        config={{
          module: 'events', // or 'restaurants', 'banners', etc.
          minWidth: 1080,
          minHeight: 1080,
          aspectRatio: 1, // Optional: square images
          allowRotation: true,
          allowZoom: true
        }}
        generatePresignedUrl={generatePresignedUrl}
        onUploadComplete={(imageKey) => field.onChange(imageKey)}
        onUploadError={(error) => console.error(error)}
        currentImageUrl={field.value}
        label="Module Image"
        description="Upload high-quality image (min 1080x1080px)"
      />
    </FormItem>
  )}
/>
```

### Key Features Available
1. ✅ **Minimum dimension validation** (prevents crops smaller than required size)
2. ✅ **Two-phase upload** (local storage first, S3 on form submit)
3. ✅ **Visual pending indicators** for unsaved images
4. ✅ **Memory management** with automatic blob cleanup
5. ✅ **Reusable across modules** (events, venues, restaurants, banners)
6. ✅ **TypeScript integration** with proper error handling

### Reference Implementation
- **Working Example**: `app/dashboard/venues/create/page.tsx`
- **Store**: `store/image-upload-store.ts`
- **Hooks**: `components/ui/image-upload-advanced/hooks.ts`

## 2-Step Creation Wizard Pattern (STANDARD FOR COMPLEX MODULES)
🧙‍♂️ **USE for modules with image upload and complex validation (venues, events, restaurants, banners)**

### When to Use 2-Step Wizard
- ✅ Modules requiring image upload with real entity ID
- ✅ Complex forms with 10+ fields across multiple sections
- ✅ When circular dependency exists (need entity ID for image upload)
- ✅ Forms with optional advanced sections (operating hours, FAQs, etc.)

### Architecture Pattern (MANDATORY STRUCTURE)
```
app/dashboard/{module}/create/
├── page.tsx                           # Route container (~30-50 lines)
├── components/
│   ├── {module}-creation-wizard.tsx   # Main wizard orchestrator
│   ├── {module}-basic-form.tsx        # Step 1: Essential fields
│   ├── {module}-advanced-form.tsx     # Step 2: Image + optional fields
│   └── index.ts                      # Barrel exports
└── hooks/
    ├── use-{module}-actions.ts        # Create/update mutations
    ├── use-{module}-image-upload.ts   # Image upload configuration
    └── index.ts                      # Barrel exports
```

### Step 1 (Basic Form) - Required Implementation
```typescript
// ✅ CORRECT: Basic form structure
interface ModuleBasicFormProps {
  onSubmit: (entity: EntityType) => void;
  onCancel: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;  // MANDATORY for loading states
}

const handleSubmit = async (data: BasicFormData) => {
  try {
    // 1. Start loading
    if (onLoadingStart) onLoadingStart();
    
    // 2. Create entity with placeholder image
    const entity = await createEntity({
      ...data,
      image: 'placeholder'  // ALWAYS use placeholder in Step 1
    });
    
    // 3. Pass entity to Step 2
    onSubmit(entity);
  } catch (error) {
    // Handle error
  }
};

// Loading button with spinner
<Button type="submit" disabled={loading}>
  {loading ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
      Creating {ModuleName}...
    </>
  ) : (
    `Continue to Step 2`
  )}
</Button>
```

### Step 2 (Advanced Form) - Required Implementation
```typescript
// ✅ CORRECT: Advanced form with image upload
interface ModuleAdvancedFormProps {
  entity: EntityType;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
  onLoadingStart?: () => void;  // MANDATORY
}

const handleSubmit = async (data: AdvancedFormData) => {
  try {
    if (onLoadingStart) onLoadingStart();
    
    // 1. Handle temporary image upload FIRST
    let finalImageKey = data.image;
    if (data.image && imageUploadStore.isTemporaryImage(data.image)) {
      finalImageKey = await imageUploadStore.uploadPendingImage(
        data.image, 
        generatePresignedUrl
      );
    }
    
    // 2. Update entity with real S3 key
    await updateEntity({
      id: entity.id,
      ...otherFields,
      ...(finalImageKey && finalImageKey !== 'placeholder' && { 
        image: finalImageKey 
      })
    });
    
    onSubmit(); // Navigate to list
  } catch (error) {
    // Handle error
  }
};
```

### Wizard Orchestrator - Required Implementation
```typescript
// ✅ CORRECT: Wizard with loading state management
export function ModuleCreationWizard({ onCancel }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [createdEntity, setCreatedEntity] = useState<EntityType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStep1Start = () => setIsLoading(true);
  const handleStep1Complete = (entity: EntityType) => {
    setCreatedEntity(entity);
    setCurrentStep(2);
    setIsLoading(false); // Reset loading
  };

  const handleStep2Start = () => setIsLoading(true);
  const handleStep2Complete = () => {
    router.push(`/dashboard/${module}`);
  };

  // Pass loading handlers to forms
  return (
    <>
      {currentStep === 1 && (
        <ModuleBasicForm
          onSubmit={handleStep1Complete}
          onLoadingStart={handleStep1Start}
          loading={isLoading}
        />
      )}
      {currentStep === 2 && createdEntity && (
        <ModuleAdvancedForm
          entity={createdEntity}
          onSubmit={handleStep2Complete}
          onLoadingStart={handleStep2Start}
          loading={isLoading}
        />
      )}
    </>
  );
}
```

### Image Upload Hook Pattern
```typescript
// ✅ CORRECT: Module-specific image upload hook
export function useModuleImageUpload({ entityId, onUploadComplete }: Props) {
  const [generatePresignedUrl] = useMutation(GENERATE_MODULE_IMAGE_UPLOAD_URL);
  
  const handleGeneratePresignedUrl = async (fileName, contentType, fileSize) => {
    const response = await generatePresignedUrl({
      variables: {
        generateModuleImageUploadUrlInput: {
          fileName,
          contentType,
          fileSize,
          entityId: entityId || 'temp-entity-id',
          imageType: 'main'
        }
      }
    });
    return response.data.generateModuleImageUploadUrl;
  };

  return {
    config: {
      ...MODULE_CONFIGS[module],
      module: module
    },
    generatePresignedUrl: handleGeneratePresignedUrl,
    // ... other handlers
  };
}
```

### Module Configuration Requirements
```typescript
// Add to MODULE_CONFIGS in image-upload-advanced/index.ts
export const MODULE_CONFIGS = {
  venues: { minWidth: 1080, minHeight: 1080, aspectRatio: 1, module: 'venues' },
  events: { minWidth: 1200, minHeight: 630, aspectRatio: 1.9, module: 'events' },
  restaurants: { minWidth: 1080, minHeight: 1080, aspectRatio: 1, module: 'restaurants' },
  banners: { minWidth: 1920, minHeight: 1080, aspectRatio: 16/9, module: 'banners' }
};
```

### Step Indicator UI Pattern
```typescript
// ✅ CORRECT: Visual progress with step validation
const renderStepIndicator = () => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        {/* Step 1 */}
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            ${currentStep >= 1 
              ? (currentStep > 1 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white')
              : 'bg-gray-200 text-gray-600'
            }`}>
            {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
          </div>
          <span>Basic Information</span>
        </div>
        
        {/* Connector line */}
        <div className={`h-0.5 w-16 ${currentStep > 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
        
        {/* Step 2 */}
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
            ${currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <span>Advanced Details</span>
        </div>
      </div>
      <div className="text-sm text-gray-500">Step {currentStep} of 2</div>
    </div>
    <Progress value={(currentStep / 2) * 100} className="h-2" />
  </div>
);
```

### Implementation Checklist for New Modules
- ✅ **Step 1 Form**: Essential fields only, creates entity with `image: 'placeholder'`
- ✅ **Step 2 Form**: Image upload + optional fields, updates entity with real S3 key
- ✅ **Loading States**: Spinners on buttons, `onLoadingStart` handlers
- ✅ **Image Upload**: Temporary storage → S3 upload → entity update
- ✅ **Progress UI**: Step indicator with visual progress bar
- ✅ **Navigation**: Back button, cancel button, proper routing
- ✅ **Error Handling**: Try/catch blocks, user-friendly error messages
- ✅ **Form Validation**: Zod schemas for both steps
- ✅ **Company Assignment**: Admin can assign to any company, members to own company

### Examples to Follow
- ✅ **Reference**: `app/dashboard/venues/create/` - Complete implementation
- ✅ **News**: `app/dashboard/news/create/` - Hero image upload with newsId required
- 🔄 **Next**: Apply pattern to `events/`, `banners/`

## News Module (EDITORIAL_WRITER)
📰 **Complete 2-Step Wizard implementation for news article management**

### News Module Architecture
```
app/dashboard/news/
├── page.tsx                          # Main news list with table
├── create/
│   ├── page.tsx                      # Create route with ProtectedPage
│   └── components/
│       ├── news-creation-wizard.tsx  # 2-Step wizard orchestrator
│       ├── news-basic-form.tsx       # Step 1: Essential fields
│       ├── news-advanced-form.tsx    # Step 2: Hero image + metadata
│       └── index.ts
├── [id]/edit/
│   ├── page.tsx                      # Edit route with pre-filled data
│   └── components/
│       ├── news-edit-wizard.tsx      # Edit wizard with unsaved changes
│       ├── news-basic-edit-form.tsx  # Step 1: Basic fields (editable)
│       ├── news-advanced-edit-form.tsx # Step 2: Image + metadata (editable)
│       └── index.ts
├── components/
│   ├── news-sidebar-navigation.tsx  # Desktop sidebar with preview
│   ├── news-mobile-navigation.tsx   # Mobile header with progress
│   ├── news-table.tsx               # Main table with sorting
│   ├── news-stats.tsx               # Dashboard statistics
│   └── index.ts
├── hooks/
│   ├── use-news-data.ts             # GraphQL query for list
│   ├── use-news-detail.ts           # GraphQL query for single article
│   ├── use-news-actions.ts          # Update mutation
│   ├── use-create-news.ts           # Create mutation
│   ├── use-news-image-upload.ts     # Hero image upload with newsId
│   ├── use-news-categories.ts       # PostCategories query
│   └── use-news-tags.ts             # Global tags query
└── lib/
    └── validations.ts               # newsBasicSchema, newsAdvancedSchema
```

### News-Specific Features

**Article Types:**
- `EDITORIAL` - Consumer-facing content
- `INDUSTRY` - B2B content

**Status Workflow:**
- `DRAFT` → `PENDING` → `APPROVED` / `DECLINED` → `DELETED`
- No `PUBLISHED` or `SCHEDULED` status (different from other modules)

**Hero Image Upload:**
- **Mutation**: `generateHeroImageUploadUrl` (NOT generic image upload)
- **Required Field**: `newsId` (String!) - MUST be provided in Step 2
- **Image Dimensions**: 1200x628px (1.91:1 aspect ratio - standard news hero)
- **Flow**: Create with placeholder → Upload with newsId → Update with S3 key

**Categories & Tags:**
- **Categories**: Uses global `postCategories` (1-2 required)
- **Tags**: Uses global `tags` system (0-2 optional)
- **Markets**: `publishedMarkets` array (miami, orlando, tampa, jacksonville)

### News GraphQL Schema

**Key Fields:**
```graphql
type NewsArticle {
  id: ID!
  title: String!
  slug: String!
  body: String!              # NOT "content"
  heroImage: String          # S3 key
  heroImageUrl: String       # CDN URL for preview
  heroImageAlt: String
  authorName: String         # String, NOT author object
  articleType: NewsType!     # EDITORIAL | INDUSTRY
  status: NewsStatus!
  publishedMarkets: [String!]!
  publishedAt: DateTime
  featuredUntil: DateTime
  videoUrl: String
  metaTitle: String
  metaDescription: String
  declinedReason: String     # If status is DECLINED
  categories: [PostCategory!]!
  tags: [Tag!]
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

**Create Flow:**
```graphql
# Step 1: Create with placeholder
mutation CreateNews($createNewsInput: CreateNewsInput!) {
  createNews(createNewsInput: {
    title: "Article Title"
    body: "Content..."
    articleType: EDITORIAL
    publishedMarkets: ["miami"]
    categoryIds: ["cat-id-1"]
    heroImage: "placeholder"  # ← Temporary
  }) {
    id  # ← Use this ID for Step 2
    title
    slug
  }
}

# Step 2: Generate upload URL with newsId
mutation GenerateHeroImageUploadUrl($generateHeroImageUploadUrlInput: GenerateHeroImageUploadUrlInput!) {
  generateHeroImageUploadUrl(generateHeroImageUploadUrlInput: {
    newsId: "cmXXXXXXXXX"  # ← ID from Step 1 (REQUIRED!)
    fileName: "hero.png"
    contentType: "image/png"
    fileSize: 101069
  }) {
    uploadUrl
    key
    expiresIn
    maxFileSize
    recommendedDimensions
  }
}

# Step 3: Update with real S3 key
mutation UpdateNews($updateNewsInput: UpdateNewsInput!) {
  updateNews(updateNewsInput: {
    id: "cmXXXXXXXXX"
    heroImage: "news/hero-123.png"  # ← Real S3 key
    heroImageAlt: "Description"
    tagIds: ["tag-1"]
    # ... other optional fields
  }) {
    id
    heroImage
    heroImageUrl
  }
}
```

### News Validation Schemas

**Step 1 - Basic Schema (Required Fields):**
```typescript
export const newsBasicSchema = z.object({
  title: z.string().min(5).max(200).trim(),
  body: z.string().min(50).max(50000).trim(),
  articleType: z.enum(['EDITORIAL', 'INDUSTRY']),
  categoryIds: z.array(z.string()).min(1).max(2),  // API requires 1-2
  publishedMarkets: z.array(z.string()).min(1),
});
```

**Step 2 - Advanced Schema (Optional Fields):**
```typescript
export const newsAdvancedSchema = z.object({
  heroImage: z.string().optional(),
  heroImageAlt: z.string().max(150).optional(),
  authorName: z.string().max(100).optional(),
  tagIds: z.array(z.string()).max(2).optional(),
  videoUrl: z.string().url().optional(),
  publishedAt: z.string().datetime().optional(),
  featuredUntil: z.string().datetime().optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
});
```

### News Image Upload Hook

**Critical Implementation:**
```typescript
export function useNewsImageUpload({ newsId, onUploadComplete }: Props) {
  const [generatePresignedUrl] = useMutation(GENERATE_NEWS_IMAGE_UPLOAD_URL);

  const handleGeneratePresignedUrl = async (fileName, contentType, fileSize) => {
    // newsId is REQUIRED by backend (String!)
    if (!newsId) {
      throw new Error('News ID is required to generate upload URL');
    }

    const response = await generatePresignedUrl({
      variables: {
        generateHeroImageUploadUrlInput: {
          newsId,  // ✅ REQUIRED - from Step 1
          fileName,
          contentType,
          fileSize
          // NO imageType field for news
        }
      }
    });

    return response.data.generateHeroImageUploadUrl;
  };

  return {
    config: MODULE_CONFIGS.news,  // 1200x628px
    generatePresignedUrl: handleGeneratePresignedUrl,
    // ...
  };
}
```

### News-Specific Considerations

**Field Mappings (Frontend → Backend):**
- `body` (NOT `content`)
- `authorName` (String, NOT `author` object)
- `articleType` (NOT `type`)
- `categoryIds` (array of IDs, NOT `categories` objects)
- `tagIds` (array of IDs, NOT `tags` objects)

**No Pagination:**
- API returns plain array, NOT cursor-paginated data
- Use `news(filter: NewsFilterInput)` query
- Filter by: `searchTerm`, `status`, `articleType`, `market`

**No Draft System:**
- Backend doesn't support separate draft mutations
- Use `status: DRAFT` on main news entity
- No `createNewsDraft` or `updateNewsDraft` mutations

**Roles & Permissions:**
- **Create/Edit**: `SUPER_ADMIN`, `ADMIN`, `EDITORIAL_WRITER`
- **View**: All authenticated users
- **Approve/Decline**: `SUPER_ADMIN`, `ADMIN` only

### News Module Image Config
```typescript
// components/ui/image-upload-advanced/types.ts
news: {
  minWidth: 1200,
  minHeight: 628,
  aspectRatio: 1200 / 628,  // ~1.91:1 (standard news hero)
  maxFileSize: 10 * 1024 * 1024,
  quality: 0.9,
  allowRotation: true,
  allowZoom: true,
  zoomRange: [1, 3],
  module: 'news'
}
```

### Common Pitfalls to Avoid

❌ **Don't:**
- Use `content` field (it's `body`)
- Omit `newsId` from image upload mutation (it's required!)
- Try to use draft mutations (they don't exist)
- Use author object (it's `authorName` string)
- Expect pagination (it's a plain array)

✅ **Do:**
- Create with `heroImage: 'placeholder'` in Step 1
- Use the returned `id` for image upload in Step 2
- Require 1-2 categories (API validation)
- Handle `heroImageUrl` for preview (not just `heroImage` key)
- Use `newsAdvancedSchema` for Step 2 validation

## Validation Patterns (MANDATORY)
🏗️ **ALL form validation schemas MUST be module-specific in each dashboard module's `lib/validations.ts` file**

### Validation Architecture
- **Module-Specific Schemas**: Each dashboard module has its own `lib/validations.ts` file
- **Self-Contained Modules**: No external validation dependencies between modules
- **Global Only for Shared**: Only auth validations remain global in `/lib/validations/auth.ts`
- **Type Safety**: Export TypeScript types from module validation files
- **Form Integration**: Use relative imports within modules

### Module-Specific File Structure
```
app/dashboard/{module}/
├── lib/
│   └── validations.ts          # All validation schemas for this module
├── components/
│   └── {module}-form.tsx       # Import from ../lib/validations
├── hooks/
│   └── use-{module}-actions.ts # Import from ../lib/validations
└── [id]/edit/
    └── page.tsx                # Import from ../../lib/validations
```

### Validation File Structure
```typescript
// app/dashboard/{module}/lib/validations.ts
import { z } from 'zod';
import { ModuleType } from '@/types/{module}';

// Constants (exported for reuse within module)
export const MODULE_OPTIONS = [
  { value: 'option1', label: 'Option 1' },
  // ...
] as const;

// Base schema
export const moduleBaseSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  // ... other fields
});

// Dynamic schema function (for conditional validation)
export const createModuleSchema = (type?: ModuleType) => {
  return moduleBaseSchema.extend({
    conditionalField: type === 'SPECIAL' 
      ? z.string().min(1, 'Required for special type')
      : z.string().optional()
  });
};

// Specific form schemas
export const moduleBasicSchema = (type?: ModuleType) => { /* ... */ };
export const moduleEditSchema = (type?: ModuleType) => { /* ... */ };
export const moduleImageSchema = z.object({ /* ... */ });

// Export types
export type ModuleFormData = z.infer<ReturnType<typeof createModuleSchema>>;
export type ModuleBasicFormData = z.infer<ReturnType<typeof moduleBasicSchema>>;
// ... other types

// Default values
export const defaultModuleValues = { /* ... */ };
```

### Form Component Integration
```typescript
// Import from module-specific validations using relative paths
import { 
  moduleBasicSchema, 
  ModuleBasicFormData,
  MODULE_OPTIONS,
  defaultModuleValues 
} from '../lib/validations';

// Or from deeper nested components
import { moduleEditSchema } from '../../lib/validations';

// Use in form component
const schema = moduleBasicSchema(moduleType);
const form = useForm<ModuleBasicFormData>({
  resolver: zodResolver(schema),
  defaultValues: defaultModuleValues
});
```

### Validation Rules
1. ✅ **Module-Specific Location**: All schemas in `app/dashboard/{module}/lib/validations.ts`
2. ✅ **Export Constants**: Reusable options arrays and constants within module
3. ✅ **Type Exports**: All form data types exported from module validation files
4. ✅ **Dynamic Schemas**: Functions for conditional validation based on type
5. ✅ **Default Values**: Module-specific default values for forms
6. ✅ **Relative Imports**: Use relative paths within modules (e.g., `../lib/validations`)
7. ✅ **Self-Contained**: Each module is independent with no cross-validation dependencies
8. ❌ **NO inline schemas**: Never define Zod schemas in form components
9. ❌ **NO duplicate constants**: Reuse exported constants from module validations
10. ❌ **NO scattered types**: Import all types from module validation files
11. ❌ **NO cross-module imports**: Never import validations from other modules

### Reference Implementations
- ✅ `app/dashboard/venues/lib/validations.ts` - Complete validation patterns
- ✅ `app/dashboard/banners/lib/validations.ts` - Dynamic schemas with banner types
- ✅ `app/dashboard/companies/lib/validations.ts` - Complex forms with nested schemas
- ✅ `app/dashboard/plans/lib/validations.ts` - Simple validation schemas
- ✅ `/lib/validations/auth.ts` - Global auth validations (exception to module rule)

## Security Rules
1. ✅ Use `/api/graphql` for ALL GraphQL operations
2. ✅ Tokens stored in httpOnly cookies only
3. ✅ All inputs validated with Zod schemas
4. ✅ Rate limiting on auth endpoints
5. ✅ Use `ID!` type for entity IDs in GraphQL mutations
6. ✅ Dynamic permissions loaded from API
7. ✅ Use Zustand for ALL React state management
8. ❌ NEVER use direct GraphQL backend URLs
9. ❌ NEVER store tokens in localStorage
10. ❌ NEVER hardcode permissions in frontend code
11. ❌ NEVER use useState for global state management

## SEO Architecture (MANDATORY FOR PUBLIC DIRECTORIES)
🔍 **ALL public-facing directories (venues, restaurants, arts-groups, events, news) MUST implement this SEO pattern**

### Environment-Based SEO Protection
**Staging Protection**: All `.vercel.app` deployments are automatically blocked from search engine indexing
**Production Indexing**: Only custom domain (cultureowl.com) allows full search engine indexing

### Core SEO Utilities (`lib/seo-utils.ts`)
```typescript
// Auto-detect environment
isProductionEnvironment(): boolean  // true if custom domain, false if staging

// Get correct site URL
getSiteUrl(): string  // Returns production/staging URL

// Dynamic robots configuration
getRobotsConfig()  // staging: noindex/nofollow, production: full indexing
```

### SEO Implementation Checklist (MANDATORY)
When creating a new public directory, implement ALL of these:

#### 1. Global SEO Files (Already Implemented)
- ✅ `app/robots.ts` - Dynamic robots.txt (staging blocks, production allows)
- ✅ `app/sitemap.ts` - Dynamic sitemap generator
- ✅ `app/layout.tsx` - Uses `getRobotsConfig()`

#### 2. Directory-Level SEO Structure
```
app/{directory}/
├── layout.tsx                    # Static metadata for directory homepage
├── page.tsx                      # Main listing page (client component)
├── location/[slug]/
│   ├── page.tsx                  # Server component with generateMetadata()
│   └── location-page-content.tsx # Client component with UI logic
├── {directory}/[slug]/
│   ├── page.tsx                  # Server component with generateMetadata()
│   ├── {directory}-detail-content.tsx  # Client component with UI logic
│   └── components/
│       └── {directory}-structured-data.tsx  # JSON-LD schemas
└── components/
    └── {directory}-breadcrumb.tsx  # With JSON-LD BreadcrumbList
```

### Public Directory SEO Pattern (Step-by-Step Implementation Guide)

#### Step 1: Directory Layout with Static Metadata
Create `app/{directory}/layout.tsx`:
```typescript
import { Metadata } from 'next';
import { getSiteUrl } from '@/lib/seo-utils';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: '{Directory Name} Directory | CultureOwl',
  description: 'Discover {description} across Florida...',
  keywords: ['{directory}', 'Florida {directory}', 'Miami {directory}', ...],
  openGraph: {
    title: '{Directory Name} Directory | CultureOwl',
    description: '...',
    url: `${siteUrl}/{directory}`,
    siteName: 'CultureOwl',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '...',
    description: '...',
  },
  alternates: {
    canonical: `${siteUrl}/{directory}`,
  },
};

export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

#### Step 2: Location Pages with Dynamic Metadata
Create server component `app/{directory}/location/[slug]/page.tsx`:
```typescript
import { Metadata } from 'next';
import { getSiteUrl } from '@/lib/seo-utils';
import { slugToLocation, getLocationDisplayName } from '../../utils';
import DirectoryByLocationContent from './location-page-content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = slugToLocation(slug);

  if (!location) {
    return { title: 'Location Not Found' };
  }

  const { city, state } = location;
  const locationName = getLocationDisplayName(city, state);
  const siteUrl = getSiteUrl();

  return {
    title: `{Directory} in ${locationName} | CultureOwl`,
    description: `Discover {directory} in ${city}, ${state}...`,
    keywords: [`${city} {directory}`, ...],
    openGraph: {
      title: `{Directory} in ${locationName} | CultureOwl`,
      description: `...`,
      url: `${siteUrl}/{directory}/location/${slug}`,
      siteName: 'CultureOwl',
      locale: 'en_US',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', ... },
    alternates: { canonical: `${siteUrl}/{directory}/location/${slug}` },
  };
}

export default async function DirectoryByLocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = slugToLocation(slug);

  if (!location) notFound();

  return <DirectoryByLocationContent location={location} />;
}
```

Create client component `location-page-content.tsx`:
```typescript
'use client';

interface ContentProps {
  location: { city: string; state: string };
}

export default function DirectoryByLocationContent({ location }: ContentProps) {
  // All hooks, state management, and UI logic here
  const { city, state } = location;
  // ... rest of client-side logic
}
```

#### Step 3: Detail Pages with Dynamic Metadata
Create server component `app/{directory}/{directory}/[slug]/page.tsx`:
```typescript
import { Metadata } from 'next';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { getSiteUrl } from '@/lib/seo-utils';
import DirectoryDetailContent from './{directory}-detail-content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getEntityData(slug: string) {
  const siteUrl = getSiteUrl();
  try {
    const client = new ApolloClient({
      uri: `${siteUrl}/api/graphql`,
      cache: new InMemoryCache(),
    });

    const { data } = await client.query({
      query: GET_ENTITY_QUERY,
      variables: { identifier: slug },
    });

    return data.entity;
  } catch (error) {
    console.error('Error fetching entity for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entity = await getEntityData(slug);
  const siteUrl = getSiteUrl();

  if (!entity) {
    return {
      title: '{Entity} Not Found | CultureOwl',
      description: 'The {entity} you are looking for could not be found.',
    };
  }

  const title = `${entity.name} | CultureOwl`;
  const description = entity.metadescription ||
    entity.description ||
    `Discover ${entity.name} in ${entity.city}, ${entity.state}...`;

  const imageUrl = entity.imageBigUrl || entity.imageUrl || `${siteUrl}/images/default.jpg`;

  return {
    title,
    description,
    keywords: [entity.name, `${entity.name} ${entity.city}`, ...],
    openGraph: {
      title,
      description,
      url: `${siteUrl}/{directory}/{directory}/${entity.slug}`,
      siteName: 'CultureOwl',
      locale: 'en_US',
      type: 'website',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: entity.name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
    alternates: { canonical: `${siteUrl}/{directory}/{directory}/${entity.slug}` },
  };
}

export default async function DirectoryDetailPage({ params }: PageProps) {
  return <DirectoryDetailContent params={params} />;
}
```

#### Step 4: JSON-LD Structured Data Component
Create `components/{directory}-structured-data.tsx`:
```typescript
'use client';

import { getSiteUrl } from '@/lib/seo-utils';

interface Props {
  entity: EntityType;
}

export function DirectoryStructuredData({ entity }: Props) {
  const siteUrl = getSiteUrl();

  // Place/Organization Schema
  const placeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place', // or 'Restaurant', 'Museum', 'EventVenue', etc.
    '@id': `${siteUrl}/{directory}/{directory}/${entity.slug}#place`,
    name: entity.name,
    description: entity.description,
    url: `${siteUrl}/{directory}/{directory}/${entity.slug}`,
    image: entity.imageBigUrl || entity.imageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: entity.address,
      addressLocality: entity.city,
      addressRegion: entity.state,
      postalCode: entity.zipcode,
      addressCountry: 'US',
    },
    ...(entity.phone && { telephone: entity.phone }),
    ...(entity.website && { url: entity.website }),
    ...(entity.social && {
      sameAs: [entity.facebook, entity.instagram, entity.twitter].filter(Boolean),
    }),
  };

  // FAQ Schema (if applicable)
  const faqJsonLd = entity.faqs && entity.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entity.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </>
  );
}
```

#### Step 5: Breadcrumb with JSON-LD
Add to existing breadcrumb component:
```typescript
'use client';

import { getSiteUrl } from '@/lib/seo-utils';

export function DirectoryBreadcrumb({ items }: Props) {
  const siteUrl = getSiteUrl();

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        ...(item.href && { item: `${siteUrl}${item.href}` }),
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav aria-label="Breadcrumb">
        {/* Visual breadcrumb UI */}
      </nav>
    </>
  );
}
```

#### Step 6: Update Sitemap to Include New Directory
Edit `app/sitemap.ts` to fetch and include entities:
```typescript
// Add to existing sitemap.ts
const { data: directoryData } = await client.query({
  query: GET_ALL_ENTITIES_QUERY,
  variables: { first: 100 },
});

const directoryPages: MetadataRoute.Sitemap = allEntities.map((entity) => ({
  url: `${siteUrl}/{directory}/{directory}/${entity.slug}`,
  lastModified: new Date(entity.createdAt),
  changeFrequency: 'weekly' as const,
  priority: 0.8,
}));
```

### SEO Implementation Rules (MANDATORY)

#### Do's ✅
1. ✅ **Server Components for Metadata**: Use async server components with `generateMetadata()`
2. ✅ **Client Components for UI**: Separate client-side logic into `*-content.tsx` files
3. ✅ **Dynamic Metadata**: Fetch real data server-side for accurate SEO tags
4. ✅ **JSON-LD Structured Data**: Implement Schema.org schemas for rich snippets
5. ✅ **Breadcrumb Schema**: Always include BreadcrumbList JSON-LD
6. ✅ **Canonical URLs**: Always set canonical URLs to avoid duplicate content
7. ✅ **Open Graph Tags**: Full OG tags for social media sharing
8. ✅ **Twitter Cards**: summary_large_image for better Twitter previews
9. ✅ **Location-Specific Keywords**: Use city, state in meta descriptions
10. ✅ **Image Alt Text**: Always provide descriptive alt text for images
11. ✅ **Update Sitemap**: Add new directory URLs to sitemap.ts

#### Don'ts ❌
1. ❌ **NO Client-Only Pages**: Never use 'use client' on pages that need metadata
2. ❌ **NO Hardcoded URLs**: Always use `getSiteUrl()` for dynamic URLs
3. ❌ **NO Missing Canonical**: Every page must have a canonical URL
4. ❌ **NO Duplicate Metadata**: Don't repeat metadata in both layout and page
5. ❌ **NO Static Sitemap**: Sitemap must be dynamic and fetch from API
6. ❌ **NO Missing Schema.org**: Always implement appropriate JSON-LD schemas
7. ❌ **NO Staging Indexing**: Never allow staging URLs to be indexed
8. ❌ **NO Missing Keywords**: Always include location-specific keywords
9. ❌ **NO Low-Quality Images**: OG images must be at least 1200x630px
10. ❌ **NO Missing Breadcrumbs**: Every detail page needs breadcrumbs with schema

### Reference Implementation
- ✅ **Venues Directory** (`app/venues/`) - Complete SEO implementation
  - `app/venues/layout.tsx` - Static metadata
  - `app/venues/location/[slug]/page.tsx` - Dynamic location metadata
  - `app/venues/venue/[slug]/page.tsx` - Dynamic venue metadata
  - `app/venues/venue/[slug]/components/venue-structured-data.tsx` - JSON-LD schemas
  - `app/venues/components/venue-breadcrumb.tsx` - Breadcrumb with schema
  - `lib/seo-utils.ts` - SEO utility functions
  - `app/robots.ts` - Dynamic robots.txt
  - `app/sitemap.ts` - Dynamic sitemap with venues

### Schema.org Types by Directory
- **Venues**: Place, EventVenue, Museum, Theater, ArtGallery
- **Restaurants**: Restaurant, FoodEstablishment
- **Arts Groups**: PerformingGroup, Organization
- **Events**: Event, TheaterEvent, MusicEvent, Festival
- **News**: NewsArticle, Article

### Testing SEO Implementation
Before deploying, verify:
1. ✅ Build succeeds: `npm run build`
2. ✅ No TypeScript errors
3. ✅ Metadata appears in page source (View Page Source)
4. ✅ JSON-LD validates: https://validator.schema.org/
5. ✅ Robots.txt accessible: `/robots.txt`
6. ✅ Sitemap accessible: `/sitemap.xml`
7. ✅ Staging blocks indexing (check meta robots tag)
8. ✅ Production allows indexing (check meta robots tag)

