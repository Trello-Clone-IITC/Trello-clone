import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "@/features/final-final/board/hooks";
import {
  emitUpdateCard,
  emitMoveCard,
} from "@/features/final-final/board/socket";
import type { CardDto } from "@ronmordo/contracts";

export const useCardDnd = (boardId: string, listId: string) => {
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    targetId: string;
    edge: "top" | "bottom";
  } | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const handleDrop = ({
    sourceCardId,
    targetCardId,
    edge,
    sourceListId,
  }: {
    sourceCardId: string;
    targetCardId: string;
    edge: "top" | "bottom";
    sourceListId?: string;
  }) => {
    // Clear preview immediately
    setPreview(null);

    try {
      // Get current cards from the target list
      const current =
        queryClient.getQueryData<CardDto[] | undefined>(
          boardKeys.cards(boardId, listId)
        ) || [];

      const currentSorted = [...current].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      );

      console.log(
        "Current cards before update:",
        currentSorted.map((c) => ({
          id: c.id,
          position: c.position,
          title: c.title,
        }))
      );

      let newPosition: number;

      // Handle empty list drop
      if (targetCardId === "empty") {
        if (currentSorted.length === 0) {
          newPosition = 1000;
        } else {
          newPosition =
            (currentSorted[currentSorted.length - 1].position ?? 0) + 1000;
        }
      } else {
        // Find the target card
        const targetIdx = currentSorted.findIndex((c) => c.id === targetCardId);
        if (targetIdx === -1) {
          console.log("Target card not found");
          return;
        }

        // Filter out the source card to get "others"
        const others = currentSorted.filter((c) => c.id !== sourceCardId);
        const targetIdxInOthers = others.findIndex(
          (c) => c.id === targetCardId
        );

        if (targetIdxInOthers === -1) {
          console.log("Target card not found in others");
          return;
        }

        const insIdx =
          edge === "top" ? targetIdxInOthers : targetIdxInOthers + 1;

        if (others.length === 0) {
          newPosition = 1000;
          console.log("Position calculation: empty list, using 1000");
        } else if (insIdx <= 0) {
          newPosition = (others[0].position ?? 0) - 1000;
          console.log("Position calculation: insert at beginning", {
            firstCardPosition: others[0].position,
            newPosition,
          });
        } else if (insIdx >= others.length) {
          newPosition = (others[others.length - 1].position ?? 0) + 1000;
          console.log("Position calculation: insert at end", {
            lastCardPosition: others[others.length - 1].position,
            newPosition,
          });
        } else {
          const prev = others[insIdx - 1];
          const next = others[insIdx];
          newPosition = ((prev.position ?? 0) + (next.position ?? 0)) / 2;
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
            targetIdx: targetIdxInOthers,
            edge,
          });
        }
      }

      // Check if this is a cross-list move
      const isCrossListMove = sourceListId && sourceListId !== listId;

      if (isCrossListMove) {
        // Handle cross-list move
        console.log("Cross-list move:", {
          sourceCardId,
          targetCardId,
          edge,
          newPosition,
          sourceListId,
          targetListId: listId,
        });

        // Get the card from the source list
        const sourceListCards =
          queryClient.getQueryData<CardDto[] | undefined>(
            boardKeys.cards(boardId, sourceListId)
          ) || [];

        const cardToMove = sourceListCards.find((c) => c.id === sourceCardId);
        if (!cardToMove) {
          console.log("Card not found in source list");
          return;
        }

        // Remove from source list
        queryClient.setQueryData<CardDto[] | undefined>(
          boardKeys.cards(boardId, sourceListId),
          (prev) => prev?.filter((c) => c.id !== sourceCardId) || []
        );

        // Add to target list
        const newCard = {
          ...cardToMove,
          listId,
          position: newPosition,
        };

        queryClient.setQueryData<CardDto[] | undefined>(
          boardKeys.cards(boardId, listId),
          (prev) => {
            if (!prev) return [newCard];
            return [...prev, newCard];
          }
        );

        // Emit cross-list move event
        emitMoveCard(boardId, sourceCardId, listId, newPosition);
      } else {
        // Handle same-list reorder - match the visual positioning logic
        console.log("Same-list reorder:", {
          sourceCardId,
          targetCardId,
          edge,
          newPosition,
          isCrossListMove: false,
          timestamp: Date.now(),
        });

        queryClient.setQueryData<CardDto[] | undefined>(
          boardKeys.cards(boardId, listId),
          (prev) => {
            if (!prev) return prev;

            // Use the simple approach that was working - just update position and sort
            const updated = prev.map((x) =>
              x.id === sourceCardId ? { ...x, position: newPosition } : x
            );
            updated.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

            console.log("Same-list reorder details:", {
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

        // Emit position update event
        emitUpdateCard(boardId, sourceCardId, { position: newPosition });
      }
    } finally {
      setDraggingId(null);
    }
  };

  return {
    scrollRef,
    draggingId,
    setDraggingId,
    preview,
    setPreview,
    dragPos,
    setDragPos,
    dragOffset,
    setDragOffset,
    isAutoScrolling,
    setIsAutoScrolling,
    handleDrop,
  };
};
