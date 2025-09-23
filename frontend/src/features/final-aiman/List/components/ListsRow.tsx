import { useMemo } from "react";
import type { ListDto } from "@ronmordo/contracts";
import BoardLists from "./Boardlists";
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
  const { scrollRef, draggingId, setDraggingId, preview, setPreview, handleDrop, Lane } =
    useListDnd(boardId);

  const sortedLists = useMemo(
    () => (lists ? [...lists] : []).sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [lists]
  );

  return (
    <div ref={scrollRef} className="flex gap-4 p-4 overflow-x-auto min-h-screen">
      {(() => {
        const items = sortedLists || [];
        const laneWidth = 272; // match list width

        const others = draggingId ? items.filter((l) => l.id !== draggingId) : items;

        let insertIndex: number | null = null;
        if (draggingId && preview) {
          const targetIndex = others.findIndex((l) => l.id === preview.targetId);
          if (targetIndex !== -1) {
            insertIndex = preview.edge === "left" ? targetIndex : targetIndex + 1;
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
            <BoardLists
              key={l.id}
              list={l}
              hideWhileDragging={l.id === draggingId}
              onDragStart={(id) => setDraggingId(id)}
              onDragEnd={() => {
                setDraggingId(null);
                setPreview(null);
              }}
              onPreview={({ sourceListId, targetListId, edge }) => {
                if (!draggingId && typeof sourceListId === "string") setDraggingId(sourceListId);
                setPreview({ sourceId: sourceListId, targetId: targetListId, edge });
              }}
              onDrop={handleDrop}
            />
          );
          if (l.id !== draggingId) processedNonDragging += 1;
        });

        if (insertIndex !== null && insertIndex === others.length && others.length) {
          const last = others[others.length - 1];
          children.push(
            <Lane key={`lane-end`} width={laneWidth} beforeListId={undefined} lastListId={last.id} />
          );
        }
        if (tail) children.push(<div key="lists-tail">{tail}</div>);
        return children;
      })()}
    </div>
  );
}
