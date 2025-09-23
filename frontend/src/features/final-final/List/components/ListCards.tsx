import Card from "@/features/final-final/card/components/Card";
import type { CardDto } from "@ronmordo/contracts";
import { useAppContext } from "@/hooks/useAppContext";
import { useCardDnd } from "../hooks/useCardDnd";
import { useMemo, useEffect, useRef } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

const EmptyListDropZone = ({
  onDrop,
  isActive = true,
}: {
  onDrop: (params: {
    sourceCardId: string;
    targetCardId: string;
    edge: "top" | "bottom";
    sourceListId?: string;
  }) => void;
  isActive?: boolean;
}) => {
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = dropZoneRef.current;
    if (!element || !isActive) return;

    const cleanup = dropTargetForElements({
      element,
      getData: () => ({
        type: "empty-list",
        listId: "empty",
      }),
      canDrop: ({ source }) => source.data?.type === "card",
      onDrop: ({ source }) => {
        const sourceCardId = source.data?.cardId as string;
        const sourceListId = source.data?.listId as string;
        console.log("EmptyListDropZone onDrop called:", {
          sourceCardId,
          targetCardId: "empty",
          sourceListId,
          timestamp: Date.now(),
        });
        if (sourceCardId) {
          onDrop({
            sourceCardId,
            targetCardId: "empty",
            edge: "bottom",
            sourceListId,
          });
        }
      },
    });

    return cleanup;
  }, [onDrop, isActive]);

  return (
    <div
      ref={dropZoneRef}
      className="flex-1 min-h-[100px] border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 text-sm"
    >
      Drop cards here
    </div>
  );
};

const ListCards = ({
  cards,
  boardId,
  listId,
}: {
  cards: CardDto[];
  boardId: string;
  listId: string;
}) => {
  const { draggingId, preview, handleDrop } = useCardDnd(boardId, listId);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Calculate visual positions for smooth drag preview
  const visualPositions = useMemo(() => {
    const positions: Record<string, React.CSSProperties> = {};

    if (draggingId && preview?.targetId) {
      const items = cards;
      const draggedIndex = items.findIndex((item) => item.id === draggingId);
      const targetIndex = items.findIndex(
        (item) => item.id === preview.targetId
      );

      if (
        draggedIndex !== -1 &&
        targetIndex !== -1 &&
        draggedIndex !== targetIndex
      ) {
        // Calculate the final insert position based on edge
        let finalInsertIndex: number;
        if (preview.edge === "top") {
          // Insert before the target
          finalInsertIndex = targetIndex;
        } else {
          // Insert after the target
          finalInsertIndex = targetIndex + 1;
        }

        console.log("Visual positioning:", {
          draggedIndex,
          targetIndex,
          edge: preview.edge,
          finalInsertIndex,
          draggedCard: items[draggedIndex]?.title,
          targetCard: items[targetIndex]?.title,
          allCards: items.map((item, idx) => ({
            index: idx,
            id: item.id,
            title: item.title,
            position: item.position,
          })),
        });

        // Calculate visual positions for all items
        items.forEach((item, currentIndex) => {
          if (item.id === draggingId) {
            // Dragged item goes to final position
            const finalPosition = finalInsertIndex * 60; // Approximate card height
            const currentPosition = currentIndex * 60;
            const offset = finalPosition - currentPosition;

            positions[item.id] = {
              transform: `translateY(${offset}px)`,
              transition: "transform 0.2s ease-out",
            };
          } else {
            // Other items shift to make space
            let newIndex = currentIndex;

            if (draggedIndex < finalInsertIndex) {
              // Moving down: items between dragged and insert position shift up
              if (
                currentIndex > draggedIndex &&
                currentIndex <= finalInsertIndex
              ) {
                newIndex = currentIndex - 1;
              }
            } else {
              // Moving up: items between insert position and dragged shift down
              if (
                currentIndex >= finalInsertIndex &&
                currentIndex < draggedIndex
              ) {
                newIndex = currentIndex + 1;
              }
            }

            const finalPosition = newIndex * 60;
            const currentPosition = currentIndex * 60;
            const offset = finalPosition - currentPosition;

            if (offset !== 0) {
              positions[item.id] = {
                transform: `translateY(${offset}px)`,
                transition: "transform 0.2s ease-out",
              };
            }
          }
        });
      }
    }

    return positions;
  }, [draggingId, preview, cards]);

  return (
    <div
      ref={scrollRef}
      className="flex z-1 flex-1 min-h-0 flex-col my-0 mx-1 p-1 overflow-x-hidden overflow-y-auto list-none gap-2 list-scrollbar"
      data-testid="list-cards"
    >
      {(() => {
        const children: React.ReactNode[] = [];

        // Render cards with visual positioning
        cards.forEach((card) => {
          const isDragging = card.id === draggingId;
          const visualStyle = visualPositions[card.id] || {};

          children.push(
            <div
              key={card.id}
              className="flex flex-col gap-y-2 scroll-m-[80px]"
              data-testid="list-card"
              style={visualStyle}
            >
              <div data-testid="list-card-wrapper" className="rounded-[8px]">
                <Card
                  card={card}
                  boardId={boardId}
                  listId={listId}
                  onDragStart={(cardId) => {
                    // Handle drag start if needed
                  }}
                  onDragEnd={(cardId) => {
                    // Handle drag end if needed
                  }}
                  onPreview={({
                    sourceCardId,
                    targetCardId,
                    edge,
                    sourceListId,
                  }) => {
                    // This will be handled by the useCardDnd hook
                  }}
                  onDrop={({
                    sourceCardId,
                    targetCardId,
                    edge,
                    sourceListId,
                  }) => {
                    handleDrop({
                      sourceCardId,
                      targetCardId,
                      edge,
                      sourceListId,
                    });
                  }}
                />
              </div>
            </div>
          );
        });

        // Add empty list drop zone only if no cards
        if (cards.length === 0) {
          children.push(
            <EmptyListDropZone
              key="empty-drop-zone"
              isActive={true}
              onDrop={(params) => {
                handleDrop(params);
              }}
            />
          );
        }

        return children;
      })()}
    </div>
  );
};

export default ListCards;
