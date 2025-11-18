# 🐛 Backend Fix Required: Events Search Location Deduplication

## Problem Description

When searching for events in the global search (`globalEventsSearch`), **locations are being returned with duplicates**:

### Current Behavior (BROKEN):
```
LOCATIONS
Hollywood, FL    1 event
Hollywood, FL    1 event  ← DUPLICATE
```

### Expected Behavior (CORRECT):
```
LOCATIONS
Hollywood, FL    2 events  ← DEDUPLICATED with correct count
```

---

## Root Cause Analysis

### ✅ Working Correctly: `globalVenuesSearch`
The venues search resolver **properly deduplicates locations** by city/state combination.

### ❌ Broken: `globalEventsSearch`
The events search resolver **does NOT deduplicate locations**, returning duplicate entries for the same city/state.

---

## Comparison: Venues vs Events

| Feature | Venues | Events | Status |
|---------|--------|--------|--------|
| Query endpoint | `globalVenuesSearch` | `globalEventsSearch` | Both exist |
| Returns locations | ✅ Yes | ✅ Yes | Both work |
| Deduplicates locations | ✅ Yes | ❌ No | **Events broken** |
| Counts entities correctly | ✅ `venueCount` | ❌ Incorrect count | **Events broken** |

---

## GraphQL Queries (Frontend)

Both queries have **identical structure**:

### Venues Query (Working):
```graphql
query GlobalVenuesSearch($query: String!, $market: String, $maxLocations: Int, $maxVenues: Int) {
  globalVenuesSearch(input: { query: $query, market: $market, maxLocations: $maxLocations, maxVenues: $maxVenues }) {
    locations {
      city
      state
      market
      venueCount  # ✅ Correct deduplicated count
    }
    venues { ... }
    totalResults
  }
}
```

### Events Query (Broken):
```graphql
query GlobalEventsSearch($query: String!, $market: String, $maxLocations: Int, $maxEvents: Int) {
  globalEventsSearch(input: { query: $query, market: $market, maxLocations: $maxLocations, maxEvents: $maxEvents }) {
    locations {
      city
      state
      market
      eventCount  # ❌ NOT deduplicated, returns duplicates
    }
    events { ... }
    totalResults
  }
}
```

---

## Required Backend Fix

### Location to Fix:
**Backend Resolver:** `globalEventsSearch`

### Implementation Needed:
The `globalEventsSearch` resolver needs to **deduplicate locations** the same way `globalVenuesSearch` does.

### Pseudo-code for Fix:
```typescript
// In globalEventsSearch resolver

// 1. Extract unique locations from events
const locationMap = new Map<string, Location>();

events.forEach(event => {
  const key = `${event.city}-${event.state}`.toLowerCase();

  if (locationMap.has(key)) {
    // Increment count for existing location
    locationMap.get(key).eventCount++;
  } else {
    // Add new unique location
    locationMap.set(key, {
      city: event.city,
      state: event.state,
      market: event.market,
      eventCount: 1
    });
  }
});

// 2. Return deduplicated array
const locations = Array.from(locationMap.values());
```

### Key Requirements:
1. ✅ **Deduplicate** by `city` + `state` combination (case-insensitive)
2. ✅ **Sum counts** - If 2 events in same location → `eventCount: 2`
3. ✅ **Preserve market** - Keep market field from first occurrence
4. ✅ **Limit results** - Respect `maxLocations` parameter after deduplication

---

## Testing Instructions

### Before Fix:
1. Search for "hollywood" in events search
2. See: `Hollywood, FL` appears **twice** with `1 event` each

### After Fix:
1. Search for "hollywood" in events search
2. See: `Hollywood, FL` appears **once** with `2 events`

### Test Cases:
- [ ] Single location with multiple events → Shows once with correct count
- [ ] Multiple different locations → All show separately
- [ ] Case sensitivity → "Hollywood" and "HOLLYWOOD" treated as same
- [ ] Empty results → Returns empty array
- [ ] maxLocations parameter → Respects limit after deduplication

---

## Reference Implementation

Copy the deduplication logic from `globalVenuesSearch` resolver to `globalEventsSearch` resolver.

**Files to check in backend:**
- Resolver: `src/resolvers/events/globalEventsSearch.resolver.ts` (or similar)
- Compare with: `src/resolvers/venues/globalVenuesSearch.resolver.ts`

---

## Frontend Changes Already Made

The frontend has been updated to handle the corrected backend response:

### Files Modified:
1. ✅ `types/search.ts` - Added `eventCount` field to `SearchLocation`
2. ✅ `components/search/search-entity-item.tsx` - Event badge shows date
3. ✅ `components/search/search-location-item.tsx` - Supports `eventCount`
4. ✅ `components/search/search-dropdown.tsx` - Passes `entityLabel` prop
5. ✅ `hooks/use-event-search.ts` - Maps `eventCount` to `venueCount`

### Frontend Status: ✅ READY
The frontend is **already prepared** to receive deduplicated data from backend.

---

## Priority: HIGH 🔴

This is a **user-facing bug** that affects the search experience for events. Users see confusing duplicate locations.

**Impact:**
- Poor UX: Confusing to see same location twice
- Incorrect counts: Shows "1 event" instead of "2 events"
- Inconsistency: Works correctly for venues but not events

---

## Questions?

Contact: Frontend team has completed all necessary changes.
Backend team needs to implement deduplication in `globalEventsSearch` resolver.
