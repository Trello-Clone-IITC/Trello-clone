import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { CardDto } from "@ronmordo/contracts";
import { boardKeys } from "@/features/caspi-playground/board/hooks";
import {
  emitUpdateCard,
  emitMoveCard,
} from "@/features/caspi-playground/board/socket";

type Edge = "top" | "bottom";

export function useCardDnd(boardId: string, listId: string) {
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

  // Auto-scroll when dragging near container edges
  useEffect(() => {
    if (!draggingId) return;
    const el = scrollRef.current;
    if (!el) return;

    let raf: number | null = null;
    let scrollInterval: number | null = null;
    const threshold = 100;
    const maxStep = 20;
    const minStep = 3;
    const acceleration = 1.1;
    let currentStep = 0;
    let isScrolling = false;

    const startScrolling = (direction: "up" | "down") => {
      if (isScrolling) return;
      isScrolling = true;
      setIsAutoScrolling(true);

      const scroll = () => {
        const currentScrollTop = el.scrollTop;
        const maxScrollTop = el.scrollHeight - el.clientHeight;

        if (
          (direction === "up" && currentScrollTop <= 0) ||
          (direction === "down" && currentScrollTop >= maxScrollTop)
        ) {
          stopScrolling();
          return;
        }

        currentStep = Math.min(currentStep * acceleration, maxStep);
        const step = direction === "up" ? -currentStep : currentStep;

        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.scrollTop += step;
        });

        if (isScrolling) {
          scrollInterval = window.setTimeout(scroll, 8);
        }
      };

      scroll();
    };

    const stopScrolling = () => {
      isScrolling = false;
      currentStep = 0;
      setIsAutoScrolling(false);
      if (scrollInterval) {
        clearTimeout(scrollInterval);
        scrollInterval = null;
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;

      const margin = 100;
      if (x < rect.left - margin || x > rect.right + margin) {
        stopScrolling();
        return;
      }

      const topDistance = y - rect.top;
      const bottomDistance = rect.bottom - y;

      const topIntensity = Math.max(0, (threshold - topDistance) / threshold);
      const bottomIntensity = Math.max(
        0,
        (threshold - bottomDistance) / threshold
      );

      if (
        topDistance < threshold &&
        topDistance > -margin &&
        topIntensity > 0.1
      ) {
        if (!isScrolling || currentStep === 0) {
          currentStep = minStep + topIntensity * 3;
        }
        startScrolling("up");
      } else if (
        bottomDistance < threshold &&
        bottomDistance > -margin &&
        bottomIntensity > 0.1
      ) {
        if (!isScrolling || currentStep === 0) {
          currentStep = minStep + bottomIntensity * 3;
        }
        startScrolling("down");
      } else {
        stopScrolling();
      }
    };

    const onMouseLeave = () => {
      setTimeout(() => {
        if (isScrolling) {
          stopScrolling();
        }
      }, 200);
    };

    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      if (raf) cancelAnimationFrame(raf);
      stopScrolling();
    };
  }, [draggingId]);

  const handleDrop = ({
    sourceCardId,
    targetCardId,
    edge,
    sourceListId,
  }: {
    sourceCardId?: string;
    targetCardId?: string;
    edge: Edge;
    sourceListId?: string;
  }) => {
    try {
      if (!sourceCardId) {
        return;
      }

      // Clear preview immediately but keep draggingId for visual positioning
      setPreview(null);

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
        newPosition =
          currentSorted.length === 0
            ? 1000
            : (currentSorted[currentSorted.length - 1].position ?? 0) + 1000;
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
            targetIdx,
            edge,
          });
        }
      }

      // Check if this is a cross-list move
      const isCrossListMove = sourceListId && sourceListId !== listId;

      if (isCrossListMove) {
        // Handle cross-list move
        // First, get the card from the source list
        const sourceCards =
          queryClient.getQueryData<CardDto[] | undefined>(
            boardKeys.cards(boardId, sourceListId)
          ) || [];
        const cardToMove = sourceCards.find((c) => c.id === sourceCardId);

        if (!cardToMove) {
          console.error("Card not found in source list:", sourceCardId);
          return;
        }

        // Remove card from source list
        queryClient.setQueryData<CardDto[] | undefined>(
          boardKeys.cards(boardId, sourceListId),
          (prev) => {
            if (!prev) return prev;
            return prev.filter((x) => x.id !== sourceCardId);
          }
        );

        // Add card to target list with updated listId and position
        queryClient.setQueryData<CardDto[] | undefined>(
          boardKeys.cards(boardId, listId),
          (prev) => {
            if (!prev) return prev;
            const newCard = {
              ...cardToMove,
              position: newPosition,
              listId,
            };
            const next = [...prev, newCard];
            next.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
            return next;
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
    } catch (error) {
      console.error("Error in handleDrop:", error);
    } finally {
      // Clear dragging state after data update
      setDraggingId(null);
    }
  };

  // Fallback drop target on the scroll container
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cleanup = dropTargetForElements({
      element: el,
      getData: () => ({ type: "cards-canvas" }),
      canDrop: ({ source }) => source.data?.type === "card",
      onDrop: ({ location }) => {
        try {
          const targets =
            (location?.current as { dropTargets?: unknown[] })?.dropTargets ??
            [];
          const hasSpecificTarget =
            Array.isArray(targets) &&
            targets.some((t: unknown) => {
              const target = t as { data?: { type?: string } };
              return (
                target?.data?.type === "card" || target?.data?.type === "lane"
              );
            });
          if (hasSpecificTarget) return;
          if (!preview?.sourceId || !preview?.targetId) return;
          handleDrop({
            sourceCardId: preview.sourceId,
            targetCardId: preview.targetId,
            edge: preview.edge,
          });
        } catch {
          // ignore
        }
      },
    });
    return () => cleanup();
  }, [preview, handleDrop]);

  // Lane: a real drop target that maps to before/after a specific card
  const Lane = ({
    height,
    beforeCardId,
    lastCardId,
  }: {
    height: number;
    beforeCardId?: string;
    lastCardId?: string;
  }) => {
    const laneRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      const el = laneRef.current;
      if (!el) return;
      const cleanup = dropTargetForElements({
        element: el,
        getData: () => ({ type: "lane" }),
        canDrop: ({ source }) => source.data?.type === "card",
        onDragEnter: ({ source }) => {
          const srcId =
            typeof source.data?.cardId === "string"
              ? (source.data.cardId as string)
              : undefined;
          if (!draggingId && srcId) setDraggingId(srcId);
          if (beforeCardId)
            setPreview({
              sourceId: srcId!,
              targetId: beforeCardId,
              edge: "top",
            });
          else if (lastCardId)
            setPreview({
              sourceId: srcId!,
              targetId: lastCardId,
              edge: "bottom",
            });
        },
        onDrag: ({ source }) => {
          const srcId =
            typeof source.data?.cardId === "string"
              ? (source.data.cardId as string)
              : undefined;
          if (!draggingId && srcId) setDraggingId(srcId);
          if (beforeCardId)
            setPreview({
              sourceId: srcId!,
              targetId: beforeCardId,
              edge: "top",
            });
          else if (lastCardId)
            setPreview({
              sourceId: srcId!,
              targetId: lastCardId,
              edge: "bottom",
            });
        },
        onDrop: ({ source }) => {
          const srcId =
            typeof source.data?.cardId === "string"
              ? (source.data.cardId as string)
              : undefined;
          if (!srcId) return;
          if (beforeCardId)
            handleDrop({
              sourceCardId: srcId,
              targetCardId: beforeCardId,
              edge: "top",
            });
          else if (lastCardId)
            handleDrop({
              sourceCardId: srcId,
              targetCardId: lastCardId,
              edge: "bottom",
            });
        },
      });
      return () => cleanup();
    }, [beforeCardId, lastCardId, draggingId]);

    return (
      <div
        ref={laneRef}
        className="w-full rounded-[4px] flex-shrink-0"
        style={{
          height,
          minHeight: height,
          background: "rgba(0, 0, 0, 0.1)",
          border: "none",
          position: "relative",
          pointerEvents: "auto",
          zIndex: 2,
        }}
      />
    );
  };

  const updatePointer = (sourceId?: string, x?: number, y?: number) => {
    if (typeof x !== "number" || typeof y !== "number") return;
    setDragPos({ x, y });
    if (!dragOffset && sourceId) {
      const el = document.querySelector<HTMLElement>(
        `[data-card-id="${sourceId}"]`
      );
      if (el) {
        const rect = el.getBoundingClientRect();
        setDragOffset({ x: x - rect.left, y: y - rect.top });
      }
    }
  };

  return {
    scrollRef,
    draggingId,
    setDraggingId,
    preview,
    setPreview,
    handleDrop,
    Lane,
    dragPos,
    dragOffset,
    updatePointer,
    isAutoScrolling,
  } as const;
}
