# Minor Fix - Selected Fruits Persistence

## Problem
When selecting a fruit from search results and then clearing the search, the selected fruit disappeared because it wasn't in the current loaded list.

**Example scenario:**
1. Search for "Fuji"
2. Select "Fuji Apple"
3. Clear search
4. ❌ "Fuji Apple" disappears from selected list (even though it's still selected)

## Solution
Implemented a **cache system** to persist selected fruit data across searches and filters.

## Implementation

### 1. Added Cache Storage
```typescript
const selectedFruitsCache = ref<Map<string, Fruit>>(new Map());
```

### 2. Updated `selectedFruits` Computed Property
```typescript
const selectedFruits = computed(() => {
  const selected: Fruit[] = [];
  
  localSelected.forEach((slug) => {
    // Try current list first
    const fruitInList = allFruits.value.find(f => f.slug === slug);
    if (fruitInList) {
      selected.push(fruitInList);
    } else {
      // Fall back to cache
      const cachedFruit = selectedFruitsCache.value.get(slug);
      if (cachedFruit) {
        selected.push(cachedFruit);
      }
    }
  });
  
  return selected;
});
```

### 3. Cache Updates
The cache is automatically updated in:
- `toggleSelection()` - when selecting a fruit
- `selectAll()` - when selecting all visible fruits
- `loadFruits()` - when loading new fruits that are already selected
- Modal open watcher - when initializing with pre-selected fruits

## Behavior Now

✅ **Select fruit from search → Clear search → Fruit still visible in selected list**

✅ **Unselect fruit not in current list → Just removes from selection**

✅ **All selected fruits always displayed at top**

✅ **Cache persists throughout modal session**

✅ **Cache resets when modal reopens**

## Benefits

- ✅ Better UX - selected items don't disappear
- ✅ Consistent behavior across searches
- ✅ No additional API calls needed
- ✅ Minimal performance impact (Map lookup is O(1))
- ✅ Cache automatically managed

## Technical Details

**Data Structure:** `Map<string, Fruit>`
- Key: fruit slug (string)
- Value: complete fruit object

**Lookup Priority:**
1. Check `allFruits` (current loaded list)
2. Fall back to `selectedFruitsCache` if not found

**Cache Lifecycle:**
- Created: When modal opens
- Updated: When fruits are selected or loaded
- Cleared: When modal closes (via component lifecycle)
