import type { ListDto } from "@ronmordo/contracts";
import { List } from ".";
import { useEffect, useRef } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

// Change this to adjust where a drop is considered "left" vs "right"
// Example: 0.35 means left edge is the first 35% of the list, right is the last 65%
const EDGE_SPLIT = 0.5;

type BoardListProbs = {
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
}: BoardListProbs) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    const cleanupDraggable = draggable({
      element: el,
      getInitialData: () => ({ type: "list", listId: list.id }),
      onDragStart: () => onDragStart?.(list.id),
      // Defer cleanup to allow lane/list/canvas onDrop handlers to run first
      onDrop: () => {
        setTimeout(() => onDragEnd?.(), 0);
      },
    });

    const cleanupDropTarget = dropTargetForElements({
      element: el,
      getData: () => ({ type: "list", listId: list.id }),
      canDrop: ({ source }) => source.data?.type === "list",
      onDragEnter: ({ source, self, location }) => {
        try {
          const srcId = typeof source.data?.listId === "string" ? (source.data.listId as string) : undefined;
          const tgtId: string | undefined = (self.data as any)?.listId;
          if (!srcId || !tgtId || srcId === tgtId) return;
          const rect = (self.element as HTMLElement).getBoundingClientRect();
          const clientX = (location?.current as any)?.input?.clientX ?? rect.left;
          const splitX = rect.left + rect.width * EDGE_SPLIT;
          const edge: "left" | "right" = clientX < splitX ? "left" : "right";
          onPreview?.({ sourceListId: srcId, targetListId: tgtId, edge });
        } catch {}
      },
      onDrag: ({ source, self, location }) => {
        try {
          const srcId = typeof source.data?.listId === "string" ? (source.data.listId as string) : undefined;
          const tgtId: string | undefined = (self.data as any)?.listId;
          if (!srcId || !tgtId || srcId === tgtId) return;
          const rect = (self.element as HTMLElement).getBoundingClientRect();
          const clientX = (location?.current as any)?.input?.clientX ?? rect.left;
          const splitX = rect.left + rect.width * EDGE_SPLIT;
          const edge: "left" | "right" = clientX < splitX ? "left" : "right";
          onPreview?.({ sourceListId: srcId, targetListId: tgtId, edge });
        } catch {}
      },
      onDragLeave: () => {
        // Do nothing; parent reconciles on next enter/drag
      },
      onDrop: ({ source, self, location }) => {
        try {
          const srcId = typeof source.data?.listId === "string" ? (source.data.listId as string) : undefined;
          const tgtId: string | undefined = (self.data as any)?.listId;
          if (!srcId || !tgtId || srcId === tgtId) return;

          // Determine left/right by pointer X relative to target element
          const rect = (self.element as HTMLElement).getBoundingClientRect();
          const clientX = (location?.current as any)?.input?.clientX ?? rect.left;
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
  }, [list.id, onDrop, onPreview, onDragStart, onDragEnd]);

  return (
    <div
      ref={ref}
      style={
        hideWhileDragging
          ? { opacity: 0, pointerEvents: "none", position: "absolute" }
          : undefined
      }
    >
      <List key={list.id} list={list} />
    </div>
  );
}
