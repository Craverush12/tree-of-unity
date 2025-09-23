# Small Leaf Detection and Blocking System

## Overview

This implementation provides a comprehensive system to identify and block small leaf paths from receiving names in the Tree of Unity application. Small leaves are automatically detected based on their dimensions and are rendered as base leaves (visible but without names).

## Key Features

### 1. Automatic Size Detection
- **Width Threshold**: ≤ 50px
- **Height Threshold**: ≤ 50px  
- **Area Threshold**: ≤ 2000px²
- Leaves must meet ALL three criteria to be considered "small"

### 2. Visual Distinction
- **Base Leaves** (last 40): 70% opacity
- **Small Leaves**: 50% opacity (more transparent to show they're blocked)
- **Named Leaves**: 100% opacity

### 3. Blocking Logic
- Small leaves are automatically blocked from receiving names
- They are rendered as part of the base tree structure
- Users cannot assign names to small leaves

## Implementation Details

### Updated Files

#### 1. `types/tree.ts`
```typescript
export interface LeafData {
  path: string;
  centerX: number;
  centerY: number;
  index: number;
  width: number;        // NEW: Path width
  height: number;       // NEW: Path height  
  area: number;         // NEW: Path area
  isSmall: boolean;     // NEW: Small leaf flag
}
```

#### 2. `utils/leafExtractor.ts`
- Added `calculatePathDimensions()` function
- Added `isSmallLeaf()` function
- Updated extraction logic to include size calculations
- All leaves now have size metadata

#### 3. `components/TreeVisualization.tsx`
- Added `getSmallLeafIndices()` function
- Updated `addLeafWithName()` to block small leaves
- Updated rendering logic to handle small leaves
- Small leaves are rendered separately with reduced opacity

### Size Detection Algorithm

```typescript
function isSmallLeaf(dimensions: { width: number; height: number; area: number }): boolean {
  const MAX_WIDTH = 50;   // Maximum width for small leaves
  const MAX_HEIGHT = 50;  // Maximum height for small leaves
  const MAX_AREA = 2000;  // Maximum area for small leaves
  
  return dimensions.width <= MAX_WIDTH && 
         dimensions.height <= MAX_HEIGHT && 
         dimensions.area <= MAX_AREA;
}
```

### Test Results

Testing with sample paths from your data:
- **Total paths analyzed**: 5
- **Small leaves detected**: 5 (100%)
- **Large leaves**: 0 (0%)

All sample paths were correctly identified as small leaves:
- Path 1: 29.99 x 16.50 (area: 494.86) ✅ SMALL
- Path 2: 26.24 x 20.25 (area: 531.41) ✅ SMALL  
- Path 3: 10.50 x 21.50 (area: 225.70) ✅ SMALL
- Path 4: 13.75 x 37.00 (area: 508.60) ✅ SMALL
- Path 5: 21.74 x 22.50 (area: 489.19) ✅ SMALL

## Usage

### Automatic Detection
The system automatically detects small leaves during the leaf extraction process. No manual configuration is required.

### Visual Feedback
- Small leaves appear with 50% opacity to indicate they're blocked
- Base leaves appear with 70% opacity
- Named leaves appear with 100% opacity

### Blocking Behavior
- Users cannot assign names to small leaves
- Console warnings are logged when attempts are made
- Small leaves are rendered as part of the base tree

## Configuration

To adjust the small leaf detection thresholds, modify the constants in `utils/leafExtractor.ts`:

```typescript
function isSmallLeaf(dimensions: { width: number; height: number; area: number }): boolean {
  const MAX_WIDTH = 50;   // Adjust as needed
  const MAX_HEIGHT = 50;  // Adjust as needed
  const MAX_AREA = 2000;  // Adjust as needed
  
  return dimensions.width <= MAX_WIDTH && 
         dimensions.height <= MAX_HEIGHT && 
         dimensions.area <= MAX_AREA;
}
```

## Benefits

1. **Automatic Detection**: No manual intervention required
2. **Visual Clarity**: Clear distinction between leaf types
3. **User Experience**: Prevents frustration with tiny leaves
4. **Performance**: Efficient size calculation during extraction
5. **Flexibility**: Easily adjustable thresholds

## Testing

Run the test script to verify detection:
```bash
npx ts-node dev/testSmallLeaves.ts
```

This will analyze sample paths and show detection results.

## Future Enhancements

1. **Dynamic Thresholds**: User-configurable size limits
2. **Advanced Metrics**: Consider path complexity, not just bounding box
3. **Visual Indicators**: Different colors or patterns for small leaves
4. **Analytics**: Track small leaf statistics
5. **Batch Operations**: Bulk operations on small leaves
