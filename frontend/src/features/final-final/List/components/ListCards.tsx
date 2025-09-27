import Card from "@/features/final-final/card/components/Card";
import type { CardDto } from "@ronmordo/contracts";
import { useAppContext } from "@/hooks/useAppContext";
import { useCardDnd } from "../hooks/useCardDnd";
import { useMemo, useEffect, useRef } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { sortByPosition } from "@/features/final-final/shared/utils/positionUtils";

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
  const {
    draggingId,
    setDraggingId,
    preview,
    setPreview,
    scrollRef,
    handleDrop,
    isAutoScrolling,
  } = useCardDnd(boardId, listId);
  // Use the hook's scrollRef so fallback drop targets work correctly

  // Use a stable, de-duplicated, position-sorted array for all DnD math
  const items = useMemo(() => {
    const unique = (cards || []).filter(
      (c, idx, arr) => arr.findIndex((x) => x.id === c.id) === idx
    );
    return sortByPosition(unique);
  }, [cards]);

  // Calculate visual positions for smooth drag preview
  const visualPositions = useMemo(() => {
    const positions: Record<string, React.CSSProperties> = {};

    if (draggingId && preview?.targetId) {
      const draggedIndex = items.findIndex((item) => item.id === draggingId);
      const targetIndex = items.findIndex(
        (item) => item.id === preview.targetId
      );

      if (
        draggedIndex !== -1 &&
        targetIndex !== -1 &&
        draggedIndex !== targetIndex
      ) {
        // Calculate the final insert position based on edge and direction
        let finalInsertIndex: number;

        if (draggedIndex < targetIndex) {
          // Moving down: if bottom edge, insert after target (target moves up)
          // if top edge, insert before target (target stays, previous moves up)
          finalInsertIndex =
            preview.edge === "bottom" ? targetIndex + 1 : targetIndex;
        } else {
          // Moving up: if top edge, insert before target (target moves down)
          // if bottom edge, insert after target (target stays, next moves down)
          finalInsertIndex =
            preview.edge === "top" ? targetIndex : targetIndex + 1;
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

        // Calculate visual positions for all items (same-list)
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

            // Visual feedback: move the target card immediately when hovering
            if (draggedIndex < targetIndex) {
              // Moving down: target card moves up to dragged position
              if (currentIndex === targetIndex) {
                // Target card moves to dragged position
                newIndex = draggedIndex;
              } else if (
                currentIndex > draggedIndex &&
                currentIndex < targetIndex
              ) {
                // Cards between dragged and target shift up
                newIndex = currentIndex - 1;
              }
            } else if (draggedIndex > targetIndex) {
              // Moving up: target card moves down to dragged position
              if (currentIndex === targetIndex) {
                // Target card moves to dragged position
                newIndex = draggedIndex;
              } else if (
                currentIndex > targetIndex &&
                currentIndex < draggedIndex
              ) {
                // Cards between target and dragged shift down
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
      } else if (draggedIndex === -1 && targetIndex !== -1) {
        // Cross-list hover: virtually insert the dragged card into this list
        const cardHeight = 60;
        const finalInsertIndex =
          preview.edge === "top" ? targetIndex : targetIndex + 1;
        items.forEach((item, currentIndex) => {
          // All items at or after the insertion index shift down by one slot
          if (currentIndex >= finalInsertIndex) {
            positions[item.id] = {
              transform: `translateY(${cardHeight}px)`,
              transition: "transform 0.2s ease-out",
            };
          }
        });
      }
    }

    return positions;
  }, [draggingId, preview, cards]);

  return (
    <div
      ref={scrollRef}
      className={`flex z-1 flex-1 min-h-0 flex-col my-0 mx-1 p-1 overflow-x-hidden overflow-y-auto list-none gap-2 list-scrollbar ${
        isAutoScrolling ? "auto-scrolling" : ""
      }`}
      data-testid="list-cards"
      style={{
        scrollBehavior: "smooth",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255, 255, 255, 0.3) transparent",
        willChange: "scroll-position",
        transform: "translateZ(0)",
      }}
    >
      {(() => {
        const children: React.ReactNode[] = [];
        const cardHeight = 60;

        // Compute in-flow placeholder index based on preview
        let placeholderIndex: number | null = null;
        if (draggingId && preview?.targetId) {
          const draggedIndex = items.findIndex((it) => it.id === draggingId);
          const targetIndex = items.findIndex(
            (it) => it.id === preview.targetId
          );
          if (targetIndex !== -1) {
            const baseIndex =
              preview.edge === "top" ? targetIndex : targetIndex + 1;
            placeholderIndex = Math.max(0, Math.min(items.length, baseIndex));
          }
        }

        // Render cards with in-flow placeholder and skip dragged in-flow
        items.forEach((card, index) => {
          if (placeholderIndex !== null && index === placeholderIndex) {
            children.push(
              <div
                key={`placeholder-${index}`}
                style={{
                  height: cardHeight,
                  borderRadius: 8,
                  backgroundColor: "rgba(0,0,0,0.3)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                  margin: "2px 0",
                  flexShrink: 0,
                }}
              />
            );
          }

          const isDragging = card.id === draggingId;
          if (isDragging) return; // ghost handles the dragged card

          let visualStyle: React.CSSProperties = {
            transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          };
          if (placeholderIndex === null && visualPositions[card.id]) {
            visualStyle = {
              ...visualStyle,
              ...visualPositions[card.id],
            };
          }

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
                  onDragStart={(id) => setDraggingId(id)}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setPreview(null);
                  }}
                  onPreview={({
                    sourceCardId,
                    targetCardId,
                    edge,
                    sourceListId,
                  }) => {
                    if (!draggingId && typeof sourceCardId === "string")
                      setDraggingId(sourceCardId);
                    if (sourceCardId && targetCardId) {
                      setPreview({
                        sourceId: sourceCardId,
                        targetId: targetCardId,
                        edge,
                      });
                    } else {
                      setPreview(null);
                    }
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

        if (placeholderIndex !== null && placeholderIndex === items.length) {
          children.push(
            <div
              key={`placeholder-end`}
              style={{
                height: cardHeight,
                borderRadius: 8,
                backgroundColor: "rgba(0,0,0,0.3)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                margin: "2px 0",
                flexShrink: 0,
              }}
            />
          );
        }

        // Absolute shadow no longer needed; in-flow placeholder above handles spacing

        // Add empty list drop zone only if no cards
        if (items.length === 0) {
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
