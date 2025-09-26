import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { CardDto } from "@ronmordo/contracts";

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
    ({
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
        const currentSorted = [...current].sort(
          (a, b) => (a.position || 0) - (b.position || 0)
        );

        console.log(
          "Current inbox cards before update:",
          currentSorted.map((c) => ({
            id: c.id,
            position: c.position,
            title: c.title,
          }))
        );

        let newPosition: number;

        // Handle empty inbox drop
        if (targetCardId === "empty") {
          newPosition =
            currentSorted.length === 0
              ? 1000
              : (currentSorted[currentSorted.length - 1].position || 0) + 1000;
        } else {
          // Handle normal card drop
          const others = currentSorted.filter((x) => x.id !== sourceCardId);
          const targetIdx = others.findIndex((x) => x.id === targetCardId);

          if (targetIdx === -1) {
            console.log("Target card not found in others array:", targetCardId);
            return;
          }

          const insIdx = edge === "top" ? targetIdx : targetIdx + 1;

          if (others.length === 0) {
            newPosition = 1000;
            console.log("Position calculation: empty inbox, using 1000");
          } else if (insIdx <= 0) {
            newPosition = (others[0].position || 0) - 1000;
            console.log("Position calculation: insert at beginning", {
              firstCardPosition: others[0].position,
              newPosition,
            });
          } else if (insIdx >= others.length) {
            newPosition = (others[others.length - 1].position || 0) + 1000;
            console.log("Position calculation: insert at end", {
              lastCardPosition: others[others.length - 1].position,
              newPosition,
            });
          } else {
            const prev = others[insIdx - 1];
            const next = others[insIdx];
            newPosition = ((prev.position || 0) + (next.position || 0)) / 2;
            console.log("Position calculation: insert between", {
              prevCard: {
                id: prev.id,
                position: prev.position,
                title: prev.title,
              },
              nextCard: {
                id: next.id,
                position: next.position,
                title: next.title,
              },
              newPosition,
              insIdx,
              targetIdx,
              edge,
            });
          }
        }

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
            updated.sort((a, b) => (a.position || 0) - (b.position || 0));

            console.log("Same-inbox reorder details:", {
              sourceCardId,
              targetCardId,
              edge,
              newPosition,
              finalCards: updated.map((c, index) => ({
                index,
                id: c.id,
                position: c.position,
                title: c.title,
              })),
            });

            return updated;
          }
        );

        // TODO: Send position update to backend
        // This would require a batch update endpoint for inbox cards
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
