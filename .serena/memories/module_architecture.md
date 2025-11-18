# Dashboard Module Architecture (MANDATORY)

## Required Module Structure
🏗️ **ALL dashboard modules MUST follow this pattern**:

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

## Architecture Rules
1. ✅ **page.tsx** = orchestrator only (~50-150 lines)
2. ✅ **Components** = self-contained, <250 lines each
3. ✅ **Hooks** = reusable logic, <100 lines each  
4. ✅ **Utils** = pure functions, no side effects
5. ✅ **Barrel exports** for clean imports
6. ✅ **Sortable tables** with column sorting
7. ✅ **Filter state** isolated in custom hooks
8. ✅ **Cursor-based pagination** (Previous/Next) - ALWAYS use `first`, `after`
9. ✅ **Skeleton loading states** - MANDATORY content-specific loading
10. ❌ **NO monolithic pages** >200 lines
11. ❌ **NO numeric pagination** (1,2,3...) - cursor-based only
12. ❌ **NO simple spinners** - structured skeleton loading instead

## Reference Implementations
- ✅ `companies/` - Complete implementation
- ✅ `employees/` - Working employee management
- ✅ `roles-management/` - Complete RBAC system
- ✅ `audit/` - Audit logs system
- ✅ `tags/` - Tags management
- ✅ `settings/` - Settings with skeleton loading