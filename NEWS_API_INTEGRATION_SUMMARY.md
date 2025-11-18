# News API Integration Summary

## ✅ Completed Updates

### 1. GraphQL Schema ([lib/graphql/news.ts](lib/graphql/news.ts))
- ✅ Updated `LIST_NEWS_ARTICLES` to use `news` query (returns array, not paginated)
- ✅ Changed `GET_NEWS_DETAIL` to use `newsById(id: ID!)`
- ✅ Updated all field names: `content` → `body`, `writerName` → `authorName`, `type` → `articleType`
- ✅ Added `featuredUntil` and `declinedReason` fields
- ✅ Changed categories query to use `postCategories` and `activePostCategories`
- ✅ Added `UPDATE_NEWS_STATUS` mutation for admin approval workflow
- ✅ Updated image upload mutation to `generateHeroImageUploadUrl`
- ✅ Removed video type and computed fields (`isPublished`, `isScheduled`)

### 2. TypeScript Types ([types/news.ts](types/news.ts))
- ✅ Updated `NewsStatus` enum: added `PENDING`, `APPROVED`, `DECLINED`, `DELETED`
- ✅ Replaced `NewsCategory` with `PostCategory`
- ✅ Replaced `NewsTag` with `Tag`
- ✅ Updated `NewsArticle` interface with correct field names
- ✅ Updated response types to match API structure
- ✅ Updated input types (`CreateNewsInput`, `UpdateNewsInput`)
- ✅ Added `UpdateNewsStatusInput` for admin approval
- ✅ Removed pagination types (API doesn't use cursor pagination)
- ✅ Updated filter types to match API

### 3. Validation Schemas ([app/dashboard/news/lib/validations.ts](app/dashboard/news/lib/validations.ts))
- ✅ Renamed all field patterns: `content` → `body`, `writerName` → `authorName`, `type` → `articleType`
- ✅ Renamed `categories` → `categoryIds`, `tags` → `tagIds`
- ✅ Added `featuredUntil` pattern
- ✅ Updated status options to include all API statuses
- ✅ Removed video type options (not in API)
- ✅ Updated default form data with new field names

### 4. Hooks
- ✅ **use-news-data.ts**: Removed pagination logic, updated to handle array response
- ✅ **use-create-news.ts**: Updated field mappings to match API
- ✅ **use-update-news.ts**: Fixed mutation structure, updated field mappings
- ✅ **use-news-categories.ts**: Changed to use `postCategories` query

## 📝 Remaining Component Updates Needed

The following components still reference old field names and need manual updates:

### Critical Updates (High Priority)

#### 1. [app/dashboard/news/[id]/edit/page.tsx](app/dashboard/news/[id]/edit/page.tsx#L99-L103)
**Lines to update:**
```typescript
// Line 99-103: Transform NewsDetail to form data
const newsFormData = {
  title: news.title,
  content: news.content,           // ❌ Change to: body: news.body
  heroImage: news.heroImage,
  // ...
  writerName: news.writerName,     // ❌ Change to: authorName: news.authorName
  type: news.type,                  // ❌ Change to: articleType: news.articleType
```

#### 2. [app/dashboard/news/[id]/components/news-content.tsx](app/dashboard/news/[id]/components/news-content.tsx#L55-L68)
**Lines to update:**
```typescript
// Line 55, 61, 65, 68: All references to news.content
__html: news?.content            // ❌ Change to: news?.body
{news?.content && (              // ❌ Change to: {news?.body && (
Math.ceil(news.content.split    // ❌ Change to: news.body.split
{news.content.split(' ')         // ❌ Change to: {news.body.split(' ')
```

#### 3. [app/dashboard/news/[id]/components/news-overview.tsx](app/dashboard/news/[id]/components/news-overview.tsx#L37)
**Line to update:**
```typescript
// Line 37
<Badge variant="outline">{news?.type || 'Editorial'}</Badge>
// ❌ Change to:
<Badge variant="outline">{news?.articleType || 'Editorial'}</Badge>
```

#### 4. [app/dashboard/news/components/create-news-form.tsx](app/dashboard/news/components/create-news-form.tsx)
**Updates needed:**
- Line 56: Update `useNewsCategories({ type: selectedType })` → remove type parameter
- Line 515: Update `name="writerName"` → `name="authorName"`
- Update all form field references from old names to new names

#### 5. [app/dashboard/news/components/news-drafts-sidebar.tsx](app/dashboard/news/components/news-drafts-sidebar.tsx)
**Lines to update:**
```typescript
// Line 168, 182, 184
draft.data.type                  // ❌ Change to: draft.data.articleType
draft.data.content               // ❌ Change to: draft.data.body
```

### Medium Priority Updates

#### 6. News Table Component
- Update any column definitions that reference old field names
- Update sorting logic if it references old field names

#### 7. News Stats Component
- Update status filters to use new status enum values
- Change "Published" → "Approved", "Scheduled" → "Pending"

#### 8. News Filters Component
- Update filter options to use new status values

## 🆕 New Features to Implement

### Admin Status Management
The API uses an approval workflow that needs UI implementation:

1. **Status Flow**: DRAFT → PENDING → APPROVED/DECLINED
2. **Admin Actions Needed**:
   - Approve button (changes status to APPROVED)
   - Decline button (changes status to DECLINED, with reason)
   - Status indicator showing current state

**Recommended Implementation**:
Create `use-news-status.ts` hook:
```typescript
import { useMutation } from "@apollo/client";
import { UPDATE_NEWS_STATUS } from "@/lib/graphql/news";

export function useNewsStatus(newsId: string) {
  const [updateStatus] = useMutation(UPDATE_NEWS_STATUS, {
    refetchQueries: ['GetNewsDetail', 'ListNewsArticles']
  });

  const approveNews = async () => {
    return updateStatus({
      variables: {
        updateNewsStatusInput: {
          id: newsId,
          status: 'APPROVED'
        }
      }
    });
  };

  const declineNews = async (reason: string) => {
    return updateStatus({
      variables: {
        updateNewsStatusInput: {
          id: newsId,
          status: 'DECLINED',
          declinedReason: reason
        }
      }
    });
  };

  return { approveNews, declineNews };
}
```

### Image Upload Updates
The API uses `generateHeroImageUploadUrl` mutation:
- Update image upload to use `newsId` parameter (after news is created)
- Use placeholder or optional image during creation
- Upload hero image after article is created

## 🔧 API Integration Notes

### Key Differences from Original Design:
1. **No Pagination**: API returns all news as an array, not cursor-paginated
2. **Post Categories**: Uses shared `postCategories`, not news-specific categories
3. **Tag System**: Uses global tags system from `/lib/graphql/tags.ts`
4. **Status Workflow**: Uses DRAFT → PENDING → APPROVED/DECLINED flow
5. **No Computed Fields**: Remove `isPublished`, `isScheduled` from frontend
6. **No Comments/Engagement**: These features not yet implemented in API

### Testing Checklist:
- [ ] Create news article with minimum required fields
- [ ] Upload hero image after creation
- [ ] Update news article
- [ ] Filter by status, category, tag
- [ ] Search news articles
- [ ] Admin approval workflow
- [ ] Delete news article (soft delete)
- [ ] Featured articles filtering

## 📚 Reference API Examples

All API examples provided by the user are documented in the original message, including:
- Create News with full field examples
- Update News
- Update News Status (approve/decline)
- Generate Hero Image Upload URL
- Get All News with filters
- Get News by ID
- Get News by Slug
- Post Categories queries

## 🎯 Next Steps

1. Update remaining component files listed above
2. Test the create flow end-to-end
3. Test the update flow
4. Implement admin status management UI
5. Add featured articles indicator
6. Update any dashboard stats components
7. Remove references to comments and engagement (not in API yet)
