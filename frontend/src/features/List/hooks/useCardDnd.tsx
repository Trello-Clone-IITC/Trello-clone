import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { CardDto } from "@ronmordo/contracts";
import { boardKeys } from "@/features/board/hooks";
import { emitUpdateCard, emitMoveCard } from "@/features/board/socket";
import { useInbox } from "@/features/inbox/hooks/useInbox";
import {
  calculatePosition,
  sortByPosition,
} from "@/features/shared/utils/positionUtils";

type Edge = "top" | "bottom";

type DndSource = { data?: { type?: string; cardId?: string } };
type DndLocation = { current?: { input?: { clientY?: number } } };

export function useCardDnd(boardId: string, listId: string) {
  const queryClient = useQueryClient();
  const { moveCardToList } = useInbox(false);

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
        setPreview(null);
      }, 120);
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

  const handleDrop = useCallback(
    ({
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

        // Additional check: if this is a cross-list move, verify the card is still in source list
        if (sourceListId && sourceListId !== listId) {
          let sourceCards: CardDto[] = [];

          if (sourceListId === "inbox") {
            // For inbox moves, check inbox cache
            sourceCards =
              queryClient.getQueryData<CardDto[] | undefined>([
                "inbox-cards",
              ]) || [];
          } else {
            // For regular cross-list moves, check board list cache
            sourceCards =
              queryClient.getQueryData<CardDto[] | undefined>(
                boardKeys.cards(boardId, sourceListId)
              ) || [];
          }

          const cardInSource = sourceCards.find((c) => c.id === sourceCardId);

          if (!cardInSource) {
            console.log(
              "handleDrop: Card no longer in source list, likely already moved, skipping"
            );
            return;
          }
        }

        isProcessingDropRef.current = true;

        // Safety timeout to reset processing flag in case of errors
        timeoutId = setTimeout(() => {
          isProcessingDropRef.current = false;
        }, 5000);

        // Keep preview until we decide to clear in finally (immediate vs delayed)

        const current =
          queryClient.getQueryData<CardDto[] | undefined>(
            boardKeys.cards(boardId, listId)
          ) || [];

        const currentSorted = sortByPosition(current);

        console.log(
          "Current cards before update:",
          currentSorted.map((c) => ({
            id: c.id,
            position: c.position,
            title: c.title,
          }))
        );

        // Calculate new position using centralized utility.
        // When dropping across lists, onDrop can arrive without a targetCardId/edge
        // from the list container. In that case, fall back to the latest preview
        // (which tracks the hovered target card and edge in this list).
        const effectiveTargetId = targetCardId ?? preview?.targetId;
        const effectiveEdge = edge ?? (preview?.edge as Edge | undefined);

        const newPosition = calculatePosition({
          sourceId: sourceCardId,
          targetId: effectiveTargetId,
          edge: (effectiveEdge as Edge) ?? "bottom",
          items: currentSorted,
        });

        console.log("Position calculation result:", {
          sourceId: sourceCardId,
          targetId: targetCardId,
          edge,
          newPosition,
        });

        // Check if this is a cross-list move or inbox move.
        // Some onDrop events may omit sourceListId; in that case infer by
        // checking whether the source card already exists in this list.
        const sourceInTargetList = currentSorted.some(
          (c) => c.id === sourceCardId
        );
        const isCrossListMove =
          (sourceListId && sourceListId !== listId) || !sourceInTargetList;
        const isInboxMove = sourceListId === "inbox";

        if (isCrossListMove || isInboxMove) {
          // Handle cross-list move or inbox move
          let sourceCards: CardDto[] = [];
          let cardToMove: CardDto | undefined;

          if (isInboxMove) {
            // Get card from inbox cache
            sourceCards =
              queryClient.getQueryData<CardDto[] | undefined>([
                "inbox-cards",
              ]) || [];
            cardToMove = sourceCards.find((c) => c.id === sourceCardId);
          } else {
            // Get card from source list
            if (sourceListId) {
              sourceCards =
                queryClient.getQueryData<CardDto[] | undefined>(
                  boardKeys.cards(boardId, sourceListId)
                ) || [];
              cardToMove = sourceCards.find((c) => c.id === sourceCardId);
            }

            // Fallback: search all board list caches to locate the card and its list
            if (!cardToMove) {
              const matches = queryClient.getQueriesData<CardDto[]>({
                queryKey: ["board", "cards", boardId],
              });
              for (const [key, arr] of matches) {
                const maybe = (arr || []).find((c) => c.id === sourceCardId);
                if (maybe && Array.isArray(key) && key.length >= 4) {
                  const detectedSourceListId = String(key[3]);
                  sourceCards = arr || [];
                  cardToMove = maybe;
                  sourceListId = detectedSourceListId as string;
                  break;
                }
              }
            }
          }

          if (!cardToMove) {
            console.error("Card not found in source list:", sourceCardId);
            console.log(
              "Available cards in source list:",
              sourceCards.map((c) => ({ id: c.id, title: c.title }))
            );

            // Check if the card is already in the target list (might be a duplicate call)
            const targetCards =
              queryClient.getQueryData<CardDto[] | undefined>(
                boardKeys.cards(boardId, listId)
              ) || [];
            const cardInTarget = targetCards.find((c) => c.id === sourceCardId);

            if (cardInTarget) {
              console.log("Card already exists in target list, skipping move");
              return;
            }

            // As a last resort, insert a minimal card into the target list using
            // the computed position; server/socket will reconcile full data.
            queryClient.setQueryData<CardDto[] | undefined>(
              boardKeys.cards(boardId, listId),
              (prev) => {
                if (!prev) return prev;
                const minimal: CardDto = {
                  id: sourceCardId,
                  listId,
                  boardId,
                  title: "",
                  description: null,
                  position: newPosition,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  startDate: null,
                  dueDate: null,
                  isCompleted: false,
                  creatorId: "",
                  coverImageUrl: null,
                  order: 0,
                  // optional arrays
                  labels: [],
                } as unknown as CardDto;
                const next = [...prev, minimal];
                return sortByPosition(next);
              }
            );
            emitMoveCard(
              boardId,
              sourceCardId,
              newPosition,
              sourceListId,
              listId
            );
            console.log("Inserted minimal card into target list (fallback)");
            // Continue to finally which clears state
            return;
          }

          // Remove card from source list first
          if (isInboxMove) {
            // Remove from inbox cache
            queryClient.setQueryData<CardDto[] | undefined>(
              ["inbox-cards"],
              (prev) => {
                if (!prev) return prev;
                const filtered = prev.filter((x) => x.id !== sourceCardId);
                console.log("Removed card from inbox:", {
                  removedCardId: sourceCardId,
                  remainingCards: filtered.length,
                });
                return filtered;
              }
            );
          } else {
            // Remove from source list
            queryClient.setQueryData<CardDto[] | undefined>(
              boardKeys.cards(boardId, sourceListId),
              (prev) => {
                if (!prev) return prev;
                const filtered = prev.filter((x) => x.id !== sourceCardId);
                console.log("Removed card from source list:", {
                  sourceListId,
                  removedCardId: sourceCardId,
                  remainingCards: filtered.length,
                });
                return filtered;
              }
            );
          }

          // Add card to target list with updated listId and position
          queryClient.setQueryData<CardDto[] | undefined>(
            boardKeys.cards(boardId, listId),
            (prev) => {
              if (!prev) return prev;

              // Check if card already exists in target list
              const existingCard = prev.find((c) => c.id === sourceCardId);
              if (existingCard) {
                console.log(
                  "Card already exists in target list, updating position only"
                );
                return prev
                  .map((c) =>
                    c.id === sourceCardId
                      ? { ...c, position: newPosition, listId }
                      : c
                  )
                  .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
              }

              const newCard = {
                ...cardToMove,
                position: newPosition,
                listId,
              };
              const next = [...prev, newCard];
              const sorted = sortByPosition(next);

              console.log("Added card to target list:", {
                targetListId: listId,
                addedCardId: sourceCardId,
                newPosition,
                totalCards: sorted.length,
              });

              return sorted;
            }
          );

          // Handle API call and socket emission
          if (isInboxMove) {
            // For inbox moves: Call API first, then emit socket event
            moveCardToList(sourceCardId, listId, newPosition);

            // Emit socket event to notify other clients
            emitMoveCard(
              boardId,
              sourceCardId,
              newPosition,
              sourceListId,
              listId
            );
          } else {
            // For cross-list moves: emit socket event
            emitMoveCard(
              boardId,
              sourceCardId,
              newPosition,
              sourceListId,
              listId
            );
          }
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
              const sorted = sortByPosition(updated);

              console.log("Same-list reorder details:", {
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

          // Emit position update event
          emitUpdateCard(boardId, sourceCardId, { position: newPosition });
        }
      } catch (error) {
        console.error("Error in handleDrop:", error);
      } finally {
        // Clear state: immediate for same-list, slight delay for cross-list to show settle animation
        const wasCrossList = !!(sourceListId && sourceListId !== listId);
        const wasInboxMove = sourceListId === "inbox";

        if (wasCrossList || wasInboxMove) {
          const delay = 180;
          window.setTimeout(() => {
            setDraggingId(null);
            setPreview(null);
          }, delay);
        } else {
          setPreview(null);
          setDraggingId(null);
        }
        isProcessingDropRef.current = false;
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    },
    [boardId, listId, queryClient, setDraggingId, moveCardToList]
  );

  // Fallback drop target on the scroll container
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cleanup = dropTargetForElements({
      element: el,
      getData: () => ({ type: "cards-canvas" }),
      canDrop: ({ source }) => source.data?.type === "card",
      onDragEnter: ({
        source,
        location,
      }: {
        source: DndSource;
        location: DndLocation;
      }) => {
        try {
          const srcId =
            typeof source.data?.cardId === "string"
              ? (source.data.cardId as string)
              : undefined;
          if (!draggingId && srcId) setDraggingId(srcId);

          const current =
            queryClient.getQueryData<CardDto[] | undefined>(
              boardKeys.cards(boardId, listId)
            ) || [];
          if (current.length === 0) return;
          const sorted = [...current].sort(
            (a, b) => (a.position ?? 0) - (b.position ?? 0)
          );

          const rect = el.getBoundingClientRect();
          const mouseY = location?.current?.input?.clientY ?? 0;
          const topZone = rect.top + 40;
          const bottomZone = rect.bottom - 40;

          const desired =
            mouseY <= topZone
              ? {
                  sourceId: srcId!,
                  targetId: sorted[0].id,
                  edge: "top" as const,
                }
              : mouseY >= bottomZone
              ? {
                  sourceId: srcId!,
                  targetId: sorted[sorted.length - 1].id,
                  edge: "bottom" as const,
                }
              : null;

          if (
            desired &&
            (preview?.sourceId !== desired.sourceId ||
              preview?.targetId !== desired.targetId ||
              preview?.edge !== desired.edge)
          ) {
            setPreview(desired);
          }
        } catch {
          // ignore
        }
      },
      onDrag: ({
        source,
        location,
      }: {
        source: DndSource;
        location: DndLocation;
      }) => {
        try {
          const srcId =
            typeof source.data?.cardId === "string"
              ? (source.data.cardId as string)
              : undefined;
          if (!draggingId && srcId) setDraggingId(srcId);

          const current =
            queryClient.getQueryData<CardDto[] | undefined>(
              boardKeys.cards(boardId, listId)
            ) || [];
          if (current.length === 0) return;
          const sorted = [...current].sort(
            (a, b) => (a.position ?? 0) - (b.position ?? 0)
          );

          const rect = el.getBoundingClientRect();
          const mouseY = location?.current?.input?.clientY ?? 0;
          const topZone = rect.top + 40;
          const bottomZone = rect.bottom - 40;

          const desired =
            mouseY <= topZone
              ? {
                  sourceId: srcId!,
                  targetId: sorted[0].id,
                  edge: "top" as const,
                }
              : mouseY >= bottomZone
              ? {
                  sourceId: srcId!,
                  targetId: sorted[sorted.length - 1].id,
                  edge: "bottom" as const,
                }
              : null;

          if (
            desired &&
            (preview?.sourceId !== desired.sourceId ||
              preview?.targetId !== desired.targetId ||
              preview?.edge !== desired.edge)
          ) {
            setPreview(desired);
          }
        } catch {
          // ignore
        }
      },
      onDragLeave: () => {
        setPreview(null);
      },
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
  }, [preview, handleDrop, boardId, listId, queryClient, draggingId]);

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
        onDragLeave: () => {
          setPreview(null);
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
    }, [beforeCardId, lastCardId]);

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
