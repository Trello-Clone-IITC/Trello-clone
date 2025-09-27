import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { CardDto } from "@ronmordo/contracts";
import {
  calculatePosition,
  sortByPosition,
} from "@/features/shared/utils/positionUtils";
import { api } from "@/lib/axiosInstance";

type Edge = "top" | "bottom";

type DndSource = { data?: { type?: string; cardId?: string } };
type DndLocation = { current?: { input?: { clientY?: number } } };

export function useInboxCardDnd() {
  const queryClient = useQueryClient();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    sourceId: string;
    targetId: string;
    edge: Edge;
  } | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const isProcessingDropRef = useRef(false);

  const INBOX_QUERY_KEY = ["inbox-cards"];

  const handleDrop = useCallback(
    async ({
      sourceCardId,
      targetCardId,
      edge,
    }: {
      sourceCardId?: string;
      targetCardId?: string;
      edge: Edge;
    }) => {
      let timeoutId: NodeJS.Timeout | null = null;

      try {
        console.log("handleDrop called with:", {
          sourceCardId,
          targetCardId,
          edge,
        });

        if (!sourceCardId) {
          console.log("handleDrop: No sourceCardId provided");
          return;
        }

        // Prevent multiple simultaneous drop processing
        if (isProcessingDropRef.current) {
          console.log("handleDrop: Already processing a drop, skipping");
          return;
        }

        isProcessingDropRef.current = true;

        // Safety timeout to reset processing flag in case of errors
        timeoutId = setTimeout(() => {
          isProcessingDropRef.current = false;
        }, 5000);

        const current =
          queryClient.getQueryData<CardDto[] | undefined>(INBOX_QUERY_KEY) ||
          [];
        const currentSorted = sortByPosition(current);

        console.log(
          "Current inbox cards before update:",
          currentSorted.map((c) => ({
            id: c.id,
            position: c.position,
            title: c.title,
          }))
        );

        // Calculate new position using centralized utility
        const newPosition = calculatePosition({
          sourceId: sourceCardId,
          targetId: targetCardId,
          edge,
          items: currentSorted,
        });

        console.log("Position calculation result:", {
          sourceId: sourceCardId,
          targetId: targetCardId,
          edge,
          newPosition,
          currentSorted: currentSorted.map((c, idx) => ({
            index: idx,
            id: c.id,
            title: c.title,
            position: c.position,
          })),
        });

        // Handle same-inbox reorder
        console.log("Same-inbox reorder:", {
          sourceCardId,
          targetCardId,
          edge,
          newPosition,
          timestamp: Date.now(),
        });

        queryClient.setQueryData<CardDto[] | undefined>(
          INBOX_QUERY_KEY,
          (prev) => {
            if (!prev) return prev;

            // Update position and sort
            const updated = prev.map((x) =>
              x.id === sourceCardId ? { ...x, position: newPosition } : x
            );
            const sorted = sortByPosition(updated);

            console.log("Same-inbox reorder details:", {
              sourceCardId,
              targetCardId,
              edge,
              newPosition,
              finalCards: sorted.map((c, index) => ({
                index,
                id: c.id,
                position: c.position,
                title: c.title,
              })),
            });

            return sorted;
          }
        );

        // Send position update to backend
        try {
          await api.patch(`/cards/${sourceCardId}`, {
            position: newPosition,
          });

          console.log("Card position updated successfully:", {
            cardId: sourceCardId,
            newPosition,
          });
        } catch (error) {
          console.error("Failed to update card position:", error);
          // Revert the optimistic update on error
          queryClient.setQueryData<CardDto[] | undefined>(
            INBOX_QUERY_KEY,
            (prev) => {
              if (!prev) return prev;
              return prev.map((x) =>
                x.id === sourceCardId
                  ? {
                      ...x,
                      position:
                        currentSorted.find((c) => c.id === sourceCardId)
                          ?.position || 0,
                    }
                  : x
              );
            }
          );
        }
      } catch (error) {
        console.error("Error in handleDrop:", error);
      } finally {
        setPreview(null);
        setDraggingId(null);
        isProcessingDropRef.current = false;
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    },
    [queryClient]
  );

  // Fallback drop target on the scroll container
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cleanup = dropTargetForElements({
      element: el,
      getData: () => ({
        type: "inbox-drop-zone",
        inboxId: "inbox",
      }),
      canDrop: ({ source }) => source.data?.type === "inbox-card",
      onDrop: ({ source }) => {
        const sourceCardId = source.data?.cardId as string;
        if (sourceCardId) {
          handleDrop({
            sourceCardId,
            targetCardId: "empty",
            edge: "bottom",
          });
        }
      },
    });

    return cleanup;
  }, [handleDrop]);

  return {
    scrollRef,
    draggingId,
    setDraggingId,
    preview,
    setPreview,
    handleDrop,
    dragPos,
    dragOffset,
    isAutoScrolling,
  };
}
