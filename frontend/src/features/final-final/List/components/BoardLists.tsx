import type { ListDto } from "@ronmordo/contracts";
import { List } from "@/features/final-final/List/components";
import { useEffect, useRef } from "react";
// Updated imports to use final-final routes
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

// Change this to adjust where a drop is considered "left" vs "right"
// 0.5 means left edge is the first 50% of the list, right is the last 50%
const EDGE_SPLIT = 0.5;

type BoardListProps = {
  list: ListDto;
  onDrop?: (args: {
    sourceListId: string;
    targetListId: string;
    edge: "left" | "right";
  }) => void;
  onPreview?: (args: {
    sourceListId: string;
    targetListId: string;
    edge: "left" | "right";
  }) => void;
  onDragStart?: (listId: string) => void;
  onDragEnd?: () => void;
  hideWhileDragging?: boolean;
};

export default function BoardLists({
  list,
  onDrop,
  onPreview,
  onDragStart,
  onDragEnd,
  hideWhileDragging,
}: BoardListProps) {
  // console.log("BoardLists component rendered for list:", list.id);
  const ref = useRef(null);
  const initialDragPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      console.error("Element ref is null for list:", list.id);
      return;
    }
    invariant(el);

    const cleanupDraggable = draggable({
      element: el,
      getInitialData: () => {
        const data = { type: "list", listId: list.id };
        return data;
      },
      onDragStart: ({ location }) => {
        // Capture initial drag position
        const clientX = (location?.current as any)?.input?.clientX ?? 0;
        const clientY = (location?.current as any)?.input?.clientY ?? 0;
        initialDragPos.current = { x: clientX, y: clientY };
        console.log("Drag started for list:", list.id);
        onDragStart?.(list.id);
      },
      // Defer cleanup to allow lane/list/canvas onDrop handlers to run first
      onDrop: () => {
        initialDragPos.current = null;
        setTimeout(() => onDragEnd?.(), 0);
      },
    });

    const cleanupDropTarget = dropTargetForElements({
      element: el,
      getData: () => ({ type: "list", listId: list.id }),
      canDrop: ({ source }) => {
        const sourceType = source.data?.type;
        const sourceListId = source.data?.listId;
        const targetListId = list.id;

        // Only allow list-to-list drags, not card drags
        return sourceType === "list" && sourceListId !== targetListId;
      },
      onDragEnter: ({ source, self, location }) => {
        console.log("Drag entered list:", list.id);
        try {
          const srcId =
            typeof source.data?.listId === "string"
              ? (source.data.listId as string)
              : undefined;
          const tgtId: string | undefined = (self.data as any)?.listId;

          console.log("Drag enter details:", { srcId, tgtId, listId: list.id });

          if (!srcId || !tgtId || srcId === tgtId) {
            console.log("Drag enter rejected:", {
              srcId,
              tgtId,
              sameId: srcId === tgtId,
            });
            return;
          }

          const rect = (self.element as HTMLElement).getBoundingClientRect();
          const clientX =
            (location?.current as any)?.input?.clientX ?? rect.left;

          // Determine left/right by pointer X relative to target element
          const splitX = rect.left + rect.width * EDGE_SPLIT;
          const edge: "left" | "right" = clientX < splitX ? "left" : "right";

          console.log("Drag enter triggered:", { srcId, tgtId, edge });
          // Add a small delay to prevent flickering
          setTimeout(() => {
            onPreview?.({ sourceListId: srcId, targetListId: tgtId, edge });
          }, 10);
        } catch (error) {
          console.error("onDragEnter error:", error);
        }
      },
      onDrag: ({ source, self, location }) => {
        try {
          const srcId =
            typeof source.data?.listId === "string"
              ? (source.data.listId as string)
              : undefined;
          const tgtId: string | undefined = (self.data as any)?.listId;

          if (!srcId || !tgtId || srcId === tgtId) {
            return;
          }

          const rect = (self.element as HTMLElement).getBoundingClientRect();
          const clientX =
            (location?.current as any)?.input?.clientX ?? rect.left;

          // Track mouse position for direction checking
          (window as any).lastMouseX = clientX;

          // Determine left/right by pointer X relative to target element
          const splitX = rect.left + rect.width * EDGE_SPLIT;
          const edge: "left" | "right" = clientX < splitX ? "left" : "right";

          // Update preview continuously during drag
          onPreview?.({ sourceListId: srcId, targetListId: tgtId, edge });
        } catch (error) {
          console.error("onDrag error:", error);
        }
      },
      onDragLeave: () => {
        // Don't clear preview immediately - let onDragEnter handle it
        console.log("Drag left list:", list.id);
        // onPreview?.({ sourceListId: "", targetListId: "", edge: "left" });
      },
      onDrop: ({ source, self, location }) => {
        try {
          const srcId =
            typeof source.data?.listId === "string"
              ? (source.data.listId as string)
              : undefined;
          const tgtId: string | undefined = (self.data as any)?.listId;
          if (!srcId || !tgtId || srcId === tgtId) return;

          // Determine left/right by pointer X relative to target element
          const rect = (self.element as HTMLElement).getBoundingClientRect();
          const clientX =
            (location?.current as any)?.input?.clientX ?? rect.left;
          const splitX = rect.left + rect.width * EDGE_SPLIT;
          const edge: "left" | "right" = clientX < splitX ? "left" : "right";

          onDrop?.({ sourceListId: srcId, targetListId: tgtId, edge });
        } catch {
          // ignore
        }
      },
    });

    return () => {
      cleanupDraggable();
      cleanupDropTarget();
    };
  }, [list.id]);

  return (
    <div
      ref={ref}
      style={
        hideWhileDragging ? { opacity: 0.6, pointerEvents: "none" } : undefined
      }
    >
      <List key={list.id} list={list} />
    </div>
  );
}
