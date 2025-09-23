import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { ListDto } from "@ronmordo/contracts";
import { boardKeys } from "@/features/caspi-playground/board/hooks";
import { emitUpdateList } from "@/features/caspi-playground/board/socket";

type Edge = "left" | "right";

export function useListDnd(boardId: string) {
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
    const threshold = 200; // Much larger threshold for natural triggering
    const maxStep = 35; // Faster scroll speed
    const minStep = 8; // Higher minimum scroll step
    const acceleration = 1.25; // Faster acceleration
    let currentStep = 0;
    let isScrolling = false;

    const startScrolling = (direction: "left" | "right") => {
      if (isScrolling) return;
      isScrolling = true;
      setIsAutoScrolling(true);

      const scroll = () => {
        const currentScrollLeft = el.scrollLeft;
        const maxScrollLeft = el.scrollWidth - el.clientWidth;

        // Check if we can still scroll in this direction
        if (
          (direction === "left" && currentScrollLeft <= 0) ||
          (direction === "right" && currentScrollLeft >= maxScrollLeft)
        ) {
          stopScrolling();
          return;
        }

        // Accelerate the scroll speed with smoother progression
        currentStep = Math.min(currentStep * acceleration, maxStep);
        const step = direction === "left" ? -currentStep : currentStep;

        el.scrollLeft += step;

        if (isScrolling) {
          scrollInterval = window.setTimeout(scroll, 12); // ~83fps for smoother scrolling
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

      // Check if mouse is within reasonable bounds (allow some margin outside screen)
      const margin = 150; // Increased margin for multi-screen setups
      if (y < rect.top - margin || y > rect.bottom + margin) {
        stopScrolling();
        return;
      }

      const leftDistance = x - rect.left;
      const rightDistance = rect.right - x;

      // More natural edge detection with progressive intensity
      const leftIntensity = Math.max(0, (threshold - leftDistance) / threshold);
      const rightIntensity = Math.max(
        0,
        (threshold - rightDistance) / threshold
      );

      // Check if we're near the edges with progressive sensitivity
      if (
        leftDistance < threshold &&
        leftDistance > -margin &&
        leftIntensity > 0.1
      ) {
        // Near left edge - scroll left with intensity-based speed
        if (!isScrolling || currentStep === 0) {
          currentStep = minStep + leftIntensity * 5; // Start with higher speed based on intensity
        }
        startScrolling("left");
      } else if (
        rightDistance < threshold &&
        rightDistance > -margin &&
        rightIntensity > 0.1
      ) {
        // Near right edge - scroll right with intensity-based speed
        if (!isScrolling || currentStep === 0) {
          currentStep = minStep + rightIntensity * 5; // Start with higher speed based on intensity
        }
        startScrolling("right");
      } else {
        // Not near any edge
        stopScrolling();
      }
    };

    // Also listen for mouse leave events to handle when mouse goes off screen
    const onMouseLeave = () => {
      // Don't stop immediately, let the current scroll continue for a bit
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
    sourceListId,
    targetListId,
    edge,
  }: {
    sourceListId?: string;
    targetListId?: string;
    edge: Edge;
  }) => {
    try {
      if (!sourceListId || !targetListId) return;
      const current =
        queryClient.getQueryData<ListDto[] | undefined>(
          boardKeys.lists(boardId)
        ) || [];
      const currentSorted = [...current].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      );
      const others = currentSorted.filter((x) => x.id !== sourceListId);
      const targetIdx = others.findIndex((x) => x.id === targetListId);
      if (targetIdx === -1) return;
      const insIdx = edge === "left" ? targetIdx : targetIdx + 1;

      let newPosition: number;
      if (others.length === 0) {
        newPosition = 1000;
      } else if (insIdx <= 0) {
        newPosition = (others[0].position ?? 0) - 1000;
      } else if (insIdx >= others.length) {
        newPosition = (others[others.length - 1].position ?? 0) + 1000;
      } else {
        const prev = others[insIdx - 1];
        const next = others[insIdx];
        newPosition = ((prev.position ?? 0) + (next.position ?? 0)) / 2;
      }

      queryClient.setQueryData<ListDto[] | undefined>(
        boardKeys.lists(boardId),
        (prev) => {
          if (!prev) return prev;
          const next = prev.map((x) =>
            x.id === sourceListId ? { ...x, position: newPosition } : x
          );
          next.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
          return next;
        }
      );

      emitUpdateList(boardId, sourceListId, { position: newPosition });
    } catch {
      // ignore
    } finally {
      // Always clear preview/drag state so the placeholder disappears,
      // even if nothing changed or an early return occurred.
      setPreview(null);
      setDraggingId(null);
    }
  };

  // Fallback drop target on the scroll container: if the user drops while
  // hovering the preview lane (or any gap) without moving the cursor after
  // the lane mounts, ensure we still commit using the current preview.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cleanup = dropTargetForElements({
      element: el,
      getData: () => ({ type: "lists-canvas" }),
      canDrop: ({ source }) => source.data?.type === "list",
      onDrop: ({ location }) => {
        try {
          const targets = (location?.current as any)?.dropTargets ?? [];
          // If a specific list or lane handled the drop, do nothing here
          const hasSpecificTarget =
            Array.isArray(targets) &&
            targets.some(
              (t: any) => t?.data?.type === "list" || t?.data?.type === "lane"
            );
          if (hasSpecificTarget) return;
          if (!preview?.sourceId || !preview?.targetId) return;
          handleDrop({
            sourceListId: preview.sourceId,
            targetListId: preview.targetId,
            edge: preview.edge,
          });
        } catch {}
      },
    });
    return () => cleanup();
  }, [preview, handleDrop]);

  // Lane: a real drop target that maps to before/after a specific list
  const Lane = ({
    width,
    beforeListId,
    lastListId,
  }: {
    width: number;
    beforeListId?: string;
    lastListId?: string;
  }) => {
    const laneRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      const el = laneRef.current;
      if (!el) return;
      const cleanup = dropTargetForElements({
        element: el,
        getData: () => ({ type: "lane" }),
        canDrop: ({ source }) => source.data?.type === "list",
        onDragEnter: ({ source }) => {
          const srcId =
            typeof source.data?.listId === "string"
              ? (source.data.listId as string)
              : undefined;
          if (!draggingId && srcId) setDraggingId(srcId);
          if (beforeListId)
            setPreview({
              sourceId: srcId!,
              targetId: beforeListId,
              edge: "left",
            });
          else if (lastListId)
            setPreview({
              sourceId: srcId!,
              targetId: lastListId,
              edge: "right",
            });
        },
        onDrag: ({ source }) => {
          const srcId =
            typeof source.data?.listId === "string"
              ? (source.data.listId as string)
              : undefined;
          if (!draggingId && srcId) setDraggingId(srcId);
          if (beforeListId)
            setPreview({
              sourceId: srcId!,
              targetId: beforeListId,
              edge: "left",
            });
          else if (lastListId)
            setPreview({
              sourceId: srcId!,
              targetId: lastListId,
              edge: "right",
            });
        },
        onDrop: ({ source }) => {
          const srcId =
            typeof source.data?.listId === "string"
              ? (source.data.listId as string)
              : undefined;
          if (!srcId) return;
          if (beforeListId)
            handleDrop({
              sourceListId: srcId,
              targetListId: beforeListId,
              edge: "left",
            });
          else if (lastListId)
            handleDrop({
              sourceListId: srcId,
              targetListId: lastListId,
              edge: "right",
            });
        },
      });
      return () => cleanup();
    }, [beforeListId, lastListId, draggingId]);

    return (
      <div
        ref={laneRef}
        className="self-start rounded-[12px] h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)] flex-shrink-0"
        style={{
          width,
          minWidth: width,
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
        `[data-list-id="${sourceId}"]`
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
