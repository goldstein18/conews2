# Skeleton Loading States (MANDATORY)

🎨 **ALL pages MUST implement structured loading placeholders instead of simple spinners**

## Core Implementation
```typescript
import { Skeleton } from '@/components/ui/skeleton';

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
```

## Loading Rules
1. ✅ **Match content dimensions**: Skeleton should approximate real content size
2. ✅ **Maintain layout structure**: Keep same grid/flex layouts in loading state
3. ✅ **Use meaningful placeholders**: Show cards, forms, tables structure
4. ✅ **Progressive disclosure**: Load sections independently as data arrives
5. ❌ **NO simple spinners**: Never use basic loading spinners alone
6. ❌ **NO layout shifts**: Skeleton dimensions should prevent content jumping

## Reference Implementations
- **Settings Module**: `app/dashboard/settings/components/settings-skeleton.tsx`
- **Companies Module**: Existing skeleton patterns
- **Base Component**: `/components/ui/skeleton.tsx`