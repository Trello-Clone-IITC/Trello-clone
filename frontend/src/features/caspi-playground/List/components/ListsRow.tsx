import { useMemo } from "react";
import type { ListDto } from "@ronmordo/contracts";
import BoardLists from "./BoardLists";
import { List as ListView } from "../../../caspi-playground/List/components";
import { useListDnd } from "../../../caspi-playground/List/hooks/useListDnd";
import { useDragScroll } from "../utils/drag-scroll";

export default function ListsRow({
  boardId,
  lists,
  tail,
  offsetForHeader = false,
  bottomGap = true,
}: {
  boardId: string;
  lists: ListDto[];
  tail?: React.ReactNode;
  offsetForHeader?: boolean; // ADDED THIS CASPI
  bottomGap?: boolean; // ADDED THIS CASPI
}) {
  console.log("ListsRow component called with", lists?.length || 0, "lists");
  const {
    scrollRef,
    draggingId,
    setDraggingId,
    preview,
    setPreview,
    handleDrop,
    Lane,
    dragPos,
    dragOffset,
    isAutoScrolling,
  } = useListDnd(boardId);

  const sortedLists = useMemo(
    () =>
      (lists ? [...lists] : []).sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      ),
    [lists]
  );

  // Enable drag-to-scroll (ignore interactive elements)
  useDragScroll(scrollRef as unknown as React.RefObject<HTMLElement>, {
    blockSelector:
      'button,a,input,textarea,select,[contenteditable],[draggable="true"],[data-dnd-item],[data-dnd-handle],.dnd-handle',
  });

  return (
    <div
      ref={scrollRef}
      className={`absolute ${
        offsetForHeader ? "top-0 pt-2" : "top-[-2px] pt-0.5"
      } right-0 ${
        bottomGap ? "bottom-8" : "bottom-0"
      } left-0 gap-3 select-none touch-pan-y ${
        bottomGap
          ? "2xl:pb-[105px] xl:pb-[105px] md:pb-[105px] pb-[105px]"
          : "pb-8"
      } board-scrollbar overflow-x-auto overflow-y-hidden mb-0 flex px-1.5 list-none ${
        isAutoScrolling ? "auto-scrolling" : ""
      }`}
      style={{
        scrollBehavior: "smooth",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255, 255, 255, 0.3) transparent",
        position: "relative",
        // Optimized for smooth scrolling
        willChange: "scroll-position",
        transform: "translateZ(0)", // Force hardware acceleration
      }}
    >
      {(() => {
        const items = sortedLists || [];
        const laneWidth = 272; // match list width

        const displayItems = items;

        // Only log when dragging to reduce spam
        if (draggingId) {
          console.log(
            "Rendering",
            displayItems.length,
            "lists while dragging:",
            draggingId
          );
        }

        const others = draggingId
          ? displayItems.filter((l) => l.id !== draggingId)
          : displayItems;

        // For swapping, we don't need insertIndex - we just show a shadow on the target
        const insertIndex: number | null = null;

        const children = [];

        // Render the lists - no insertion needed for swapping
        displayItems.forEach((l) => {
          const visualStyle: React.CSSProperties | undefined =
            draggingId && l.id === draggingId ? { opacity: 0 } : undefined;

          children.push(
            <div
              key={l.id}
              className="flex-shrink-0"
              style={{ position: "relative" }}
              data-list-id={l.id}
            >
              {/* Visual container that moves but doesn't affect drop detection */}
              <div style={visualStyle}>
                <BoardLists
                  list={l}
                  hideWhileDragging={l.id === draggingId}
                  onDragStart={(id) => setDraggingId(id)}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setPreview(null);
                  }}
                  onPreview={({ sourceListId, targetListId, edge }) => {
                    if (!draggingId && typeof sourceListId === "string")
                      setDraggingId(sourceListId);

                    // Only update preview if we have valid IDs
                    if (sourceListId && targetListId) {
                      console.log("Setting preview:", {
                        sourceId: sourceListId,
                        targetId: targetListId,
                        edge,
                      });
                      setPreview({
                        sourceId: sourceListId,
                        targetId: targetListId,
                        edge,
                      });
                    } else {
                      // Clear preview if no valid target
                      setPreview(null);
                    }
                  }}
                  onDrop={(params) => {
                    // Use the actual drop target, not the preview
                    console.log("onDrop called:", {
                      dropTarget: params.targetListId,
                      previewTarget: preview?.targetId,
                      usingDropTarget: true,
                    });
                    handleDrop(params);
                  }}
                />
              </div>
            </div>
          );
        });

        if (
          insertIndex !== null &&
          insertIndex === others.length &&
          others.length
        ) {
          const last = others[others.length - 1];
          children.push(
            <Lane
              key={`lane-end`}
              width={laneWidth}
              beforeListId={undefined}
              lastListId={last.id}
            />
          );
        }
        if (tail)
          children.push(
            <div key="lists-tail" className="flex-shrink-0">
              {tail}
            </div>
          );

        // Drop shadow preview - shows where the list will be inserted
        if (draggingId && preview?.targetId) {
          const draggedIndex = items.findIndex(
            (item) => item.id === draggingId
          );
          const targetIndex = items.findIndex(
            (item) => item.id === preview.targetId
          );

          if (
            draggedIndex !== -1 &&
            targetIndex !== -1 &&
            draggedIndex !== targetIndex
          ) {
            // Calculate where the dragged list will be inserted
            let insertIndex: number;
            if (preview.edge === "left") {
              // Insert before the target
              insertIndex =
                draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
            } else {
              // Insert after the target
              insertIndex =
                draggedIndex < targetIndex ? targetIndex : targetIndex + 1;
            }

            // Calculate the position for the drop shadow at the insertion point
            const shadowPosition = insertIndex * laneWidth;

            // Find the dragged item to show in the shadow
            const draggedItem = items.find((x) => x.id === draggingId);
            if (draggedItem) {
              children.push(
                <div
                  key="drop-shadow"
                  style={{
                    position: "absolute",
                    left: shadowPosition,
                    top: 0,
                    width: laneWidth,
                    minWidth: laneWidth,
                    height: "calc(100vh - 6rem)",
                    pointerEvents: "none",
                    zIndex: 10,
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    borderRadius: "12px",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              );
            }
          }
        }

        // Ghost that follows the cursor
        if (draggingId && dragPos && dragOffset) {
          const dragged = items.find((x) => x.id === draggingId);
          if (dragged) {
            const left = dragPos.x - dragOffset.x;
            const top = dragPos.y - dragOffset.y;
            children.push(
              <div
                key="list-ghost"
                style={{
                  position: "fixed",
                  left,
                  top,
                  width: laneWidth,
                  minWidth: laneWidth,
                  pointerEvents: "none",
                  opacity: 0.9,
                  transform: "scale(1.01) rotate(2deg)",
                  zIndex: 9999,
                  filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2))",
                  transition: "none", // Disable transitions for smooth following
                }}
              >
                <ListView list={dragged} />
              </div>
            );
          }
        }
        return children;
      })()}
    </div>
  );
}
