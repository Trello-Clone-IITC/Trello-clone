/**
 * Centralized position calculation utilities for drag and drop operations
 */

export interface Positionable {
  id: string;
  position?: number;
}

export interface PositionCalculationParams {
  sourceId: string;
  targetId?: string;
  edge: "top" | "bottom";
  items: Positionable[];
}

/**
 * Calculates the new position for an item based on drag and drop logic
 *
 * @param params - Position calculation parameters
 * @returns The calculated position number
 */
export function calculatePosition({
  sourceId,
  targetId,
  edge,
  items,
}: PositionCalculationParams): number {
  // Filter out the source item to avoid conflicts
  const others = items.filter((item) => item.id !== sourceId);

  // If no target or empty list, add to end
  if (!targetId || targetId === "empty" || others.length === 0) {
    if (others.length === 0) {
      return 1000; // First item
    }
    // Add to end: (last position + 1000)
    const lastItem = others[others.length - 1];
    return (lastItem.position ?? 0) + 1000;
  }

  // Find target item index
  const targetIdx = others.findIndex((item) => item.id === targetId);

  if (targetIdx === -1) {
    console.warn("Target item not found, adding to end");
    const lastItem = others[others.length - 1];
    return (lastItem.position ?? 0) + 1000;
  }

  // Calculate insertion index
  const insertIdx = edge === "top" ? targetIdx : targetIdx + 1;

  // Case 1: Insert at beginning
  if (insertIdx <= 0) {
    const firstItem = others[0];
    return (firstItem.position ?? 0) / 2; // (0 + first position) / 2
  }

  // Case 2: Insert at end
  if (insertIdx >= others.length) {
    const lastItem = others[others.length - 1];
    return (lastItem.position ?? 0) + 1000; // (last position + 1000)
  }

  // Case 3: Insert between two items
  const prevItem = others[insertIdx - 1];
  const nextItem = others[insertIdx];
  return ((prevItem.position ?? 0) + (nextItem.position ?? 0)) / 2;
}

/**
 * Sorts items by position for consistent ordering
 */
export function sortByPosition<T extends Positionable>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

/**
 * Recalculates positions for a list of items to ensure proper spacing
 * Useful for cleanup operations
 */
export function recalculatePositions<T extends Positionable>(items: T[]): T[] {
  const sorted = sortByPosition(items);
  return sorted.map((item, index) => ({
    ...item,
    position: (index + 1) * 1000,
  }));
}
