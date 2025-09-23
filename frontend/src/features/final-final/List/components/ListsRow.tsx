import { useMemo } from "react";
import type { ListDto } from "@ronmordo/contracts";
import BoardLists from "./BoardLists";
import { List as ListView } from "../../../caspi-playground/List/components";
import { useListDnd } from "../../../caspi-playground/List/hooks/useListDnd";

export default function ListsRow({
  boardId,
  lists,
  tail,
}: {
  boardId: string;
  lists: ListDto[];
  tail?: React.ReactNode;
}) {
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
    updatePointer,
    isAutoScrolling,
  } = useListDnd(boardId);

  const sortedLists = useMemo(
    () =>
      (lists ? [...lists] : []).sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      ),
    [lists]
  );

  return (
    <div
      ref={scrollRef}
      className={`absolute top-[-2px] right-0 bot-0 left-0 pt-0.5 gap-3 2xl:pb-[105px] xl:pb-[105px] md:pb-[105px] pb-[105px] board-scrollbar overflow-x-auto overflow-y-hidden mb-0 flex px-1.5 list-none ${
        isAutoScrolling ? "auto-scrolling" : ""
      }`}
      style={{
        scrollBehavior: "auto", // Changed to auto for better control
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255, 255, 255, 0.3) transparent",
        position: "relative",
        // Add smooth scrolling via CSS
        transition: "scroll-behavior 0.1s ease-out",
      }}
    >
      {(() => {
        const items = sortedLists || [];
        const laneWidth = 272; // match list width

        // Create optimistic reordered list during drag
        let displayItems = [...items];

        console.log("ListsRow render:", {
          draggingId,
          preview,
          hasPreview: !!preview?.targetId,
        });

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
            // Create the optimistic reordered array
            const draggedList = items[draggedIndex];
            const reorderedItems = items.filter(
              (_, index) => index !== draggedIndex
            );

            // Calculate the correct insertion position
            let insertPosition = targetIndex;
            if (preview.edge === "right") {
              insertPosition = targetIndex + 1;
            }

            // Adjust for the fact that we removed the dragged item
            if (draggedIndex < targetIndex) {
              insertPosition = insertPosition - 1;
            }

            // Insert the dragged list at the calculated position
            reorderedItems.splice(insertPosition, 0, draggedList);
            displayItems = reorderedItems;

            // Debug logging
            console.log("Optimistic reordering:", {
              draggedIndex,
              targetIndex,
              insertPosition,
              originalOrder: items.map((i) => i.id),
              reorderedOrder: displayItems.map((i) => i.id),
            });
          }
        }

        const others = draggingId
          ? displayItems.filter((l) => l.id !== draggingId)
          : displayItems;

        let insertIndex: number | null = null;
        if (draggingId && preview) {
          const targetIndex = others.findIndex(
            (l) => l.id === preview.targetId
          );
          if (targetIndex !== -1) {
            insertIndex =
              preview.edge === "left" ? targetIndex : targetIndex + 1;
          }
        }

        const children = [];
        let processedNonDragging = 0;
        let laneInserted = false;

        // Render the optimistic reordered lists
        displayItems.forEach((l) => {
          // Show lane where the dragged list will be inserted
          if (
            insertIndex !== null &&
            !laneInserted &&
            processedNonDragging === insertIndex
          ) {
            const lastNonDragging = others[others.length - 1]?.id;
            const beforeId = others[insertIndex]?.id; // insert before this non-dragging list
            children.push(
              <Lane
                key={`lane-${insertIndex}`}
                width={laneWidth}
                beforeListId={beforeId}
                lastListId={lastNonDragging}
              />
            );
            laneInserted = true;
          }

          // Add visual drop zone indicator
          if (draggingId && preview?.targetId && l.id === preview.targetId) {
            const dropZoneStyle: React.CSSProperties = {
              position: "absolute",
              top: 0,
              left: preview.edge === "left" ? 0 : laneWidth,
              width: "4px",
              height: "100%",
              backgroundColor: "#3b82f6",
              borderRadius: "2px",
              zIndex: 20,
              boxShadow: "0 0 8px rgba(59, 130, 246, 0.6)",
            };

            children.push(
              <div key={`drop-zone-${l.id}`} style={dropZoneStyle} />
            );
          }

          // Calculate visual styling for the optimistic reordered list
          let visualStyle: React.CSSProperties = {
            transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
          };

          if (draggingId && l.id === draggingId) {
            // Dragged list should be hidden (it's following the cursor)
            visualStyle = {
              ...visualStyle,
              opacity: 0,
              transform: "scale(0.95)",
            };
          } else if (draggingId && preview?.targetId) {
            // Other lists get a subtle visual indication that they're in optimistic state
            visualStyle = {
              ...visualStyle,
              opacity: 0.95,
              transform: "scale(0.98)",
            };
          }

          children.push(
            <div key={l.id} className="flex-shrink-0" style={visualStyle}>
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
                  setPreview({
                    sourceId: sourceListId,
                    targetId: targetListId,
                    edge,
                  });
                }}
                onDrop={handleDrop}
              />
            </div>
          );

          if (l.id !== draggingId) processedNonDragging += 1;
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
                  opacity: 0.95,
                  transform: "scale(1.02)",
                  zIndex: 9999,
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
