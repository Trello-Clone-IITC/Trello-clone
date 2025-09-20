# Caspi Playground - Board Backgrounds

This feature implements board backgrounds for the caspi-playground boards using the backend-defined background types.

## Background Types

The following background types are supported:

- **Mountain** - Mountain landscape background
- **Valley** - Valley/landscape background
- **Tree** - Tree/forest background
- **Snow** - Snowy landscape background

## How to Test

You can test the different backgrounds by navigating to these URLs:

- **Mountain Background**: `http://localhost:5173/caspi/mountain`
- **Valley Background**: `http://localhost:5173/caspi/valley`
- **Tree Background**: `http://localhost:5173/caspi/tree`
- **Snow Background**: `http://localhost:5173/caspi/snow`

## Implementation Details

### Files Created/Modified

1. **`board/utils/backgroundUtils.ts`** - Utility functions for handling board backgrounds
2. **`board/components/Board.tsx`** - Updated to apply background styling
3. **`board/pages/BoardPage.tsx`** - Updated to support test boards
4. **`board/data/testBoards.ts`** - Test data with different background types

### Background Images

The backgrounds use the existing assets:

- `background-1-hd.webp` - Mountain
- `background-2-hd.webp` - Valley
- `background-3-hd.webp` - Tree
- `background-4-hd.webp` - Snow

### Styling

The backgrounds are applied with:

- `background-size: cover`
- `background-position: center`
- `background-repeat: no-repeat`
- `min-height: 100vh`

The implementation respects the theme (light/dark) and provides appropriate fallback colors when no background is specified.
