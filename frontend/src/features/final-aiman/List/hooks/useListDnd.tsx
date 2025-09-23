import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { ListDto } from "@ronmordo/contracts";
import { boardKeys } from "@/features/final-aiman/board/hooks";
import { emitUpdateList } from "@/features/final-aiman/board/socket";

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

  // Auto-scroll when dragging near container edges
  useEffect(() => {
    if (!draggingId) return;
    const el = scrollRef.current;
    if (!el) return;
    let raf: number | null = null;
    const threshold = 80;
    const maxStep = 20;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX;
      let step = 0;
      if (x < rect.left + threshold) {
        step = -maxStep * (1 - Math.max(0, x - rect.left) / threshold);
      } else if (x > rect.right - threshold) {
        step = maxStep * (1 - Math.max(0, rect.right - x) / threshold);
      }
      if (step !== 0) {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.scrollLeft += step;
        });
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [draggingId]);

  // (moved fallback drop effect below handleDrop to avoid TDZ)

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
        queryClient.getQueryData<ListDto[] | undefined>(boardKeys.lists(boardId)) || [];
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
          const hasSpecificTarget = Array.isArray(targets)
            && targets.some((t: any) => t?.data?.type === "list" || t?.data?.type === "lane");
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
          const srcId = typeof source.data?.listId === "string" ? (source.data.listId as string) : undefined;
          if (!draggingId && srcId) setDraggingId(srcId);
          if (beforeListId)
            setPreview({ sourceId: srcId!, targetId: beforeListId, edge: "left" });
          else if (lastListId)
            setPreview({ sourceId: srcId!, targetId: lastListId, edge: "right" });
        },
        onDrag: ({ source }) => {
          const srcId = typeof source.data?.listId === "string" ? (source.data.listId as string) : undefined;
          if (!draggingId && srcId) setDraggingId(srcId);
          if (beforeListId)
            setPreview({ sourceId: srcId!, targetId: beforeListId, edge: "left" });
          else if (lastListId)
            setPreview({ sourceId: srcId!, targetId: lastListId, edge: "right" });
        },
        onDrop: ({ source }) => {
          const srcId = typeof source.data?.listId === "string" ? (source.data.listId as string) : undefined;
          if (!srcId) return;
          if (beforeListId)
            handleDrop({ sourceListId: srcId, targetListId: beforeListId, edge: "left" });
          else if (lastListId)
            handleDrop({ sourceListId: srcId, targetListId: lastListId, edge: "right" });
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
      const el = document.querySelector<HTMLElement>(`[data-list-id="${sourceId}"]`);
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
  } as const;
}

