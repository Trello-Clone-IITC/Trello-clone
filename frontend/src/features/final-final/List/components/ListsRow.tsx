import { useMemo } from "react";
import type { ListDto } from "@ronmordo/contracts";
import BoardLists from "./BoardLists";
import { List as ListView } from ".";
import { useListDnd } from "../hooks/useListDnd";

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
      className="absolute top-[-2px] right-0 bot-0 left-0 pt-0.5 gap-3 2xl:pb-[105px] xl:pb-[105px] md:pb-[105px] pb-[105px] board-scrollbar overflow-x-auto overflow-y-hidden mb-0 flex px-1.5 list-none"
    >
      {(() => {
        const items = sortedLists || [];
        const laneWidth = 272; // match list width

        const others = draggingId
          ? items.filter((l) => l.id !== draggingId)
          : items;

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
        items.forEach((l) => {
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

          children.push(
            <div key={l.id} className="flex-shrink-0">
              <BoardLists
                list={l}
                hideWhileDragging={l.id === draggingId}
                onDragStart={(id) => setDraggingId(id)}
                onDragEnd={() => {
                  setDraggingId(null);
                  setPreview(null);
                }}
                onPreview={({
                  sourceListId,
                  targetListId,
                  edge,
                  clientX,
                  clientY,
                }) => {
                  if (!draggingId && typeof sourceListId === "string")
                    setDraggingId(sourceListId);
                  setPreview({
                    sourceId: sourceListId,
                    targetId: targetListId,
                    edge,
                  });
                  if (clientX != null && clientY != null) {
                    updatePointer(sourceListId, clientX, clientY);
                  }
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
