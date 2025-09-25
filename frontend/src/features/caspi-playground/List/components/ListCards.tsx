import Card from "@/features/caspi-playground/card/components/Card";
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
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        transition: "all 0.2s ease",
      }}
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
  } = useCardDnd(boardId, listId);

  const sortedCards = useMemo(() => {
    if (!cards) return [];

    // Filter out any cards that might be duplicated during drag operations
    const uniqueCards = cards.filter(
      (card, index, arr) => arr.findIndex((c) => c.id === card.id) === index
    );

    return uniqueCards.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }, [cards]);

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
        const items = sortedCards || [];
        const cardHeight = 80; // approximate card height

        // Calculate visual positions for optimistic updates
        const visualPositions: { [key: string]: { transform: string } } = {};

        // Visual positioning for smooth drag experience
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
                const finalPosition = finalInsertIndex * cardHeight;
                const currentPosition = currentIndex * cardHeight;
                const offset = finalPosition - currentPosition;

                visualPositions[item.id] = {
                  transform: `translateY(${offset}px)`,
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

                const finalPosition = newIndex * cardHeight;
                const currentPosition = currentIndex * cardHeight;
                const offset = finalPosition - currentPosition;

                if (offset !== 0) {
                  visualPositions[item.id] = {
                    transform: `translateY(${offset}px)`,
                  };
                }
              }
            });
          }
        }

        const children = [];

        // Render the cards
        items.forEach((card, index) => {
          // Calculate visual styling with smooth transitions
          let visualStyle: React.CSSProperties = {
            transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          };

          // Apply visual positioning for optimistic updates
          if (visualPositions[card.id]) {
            visualStyle = {
              ...visualStyle,
              ...visualPositions[card.id],
            };
          }

          if (draggingId && card.id === draggingId) {
            // Dragged card should be hidden (it's following the cursor)
            visualStyle = {
              ...visualStyle,
              opacity: 0,
            };
          }

          children.push(
            <div
              key={card.id}
              className="flex flex-col gap-y-2 scroll-m-[80px]"
              data-testid="list-card"
              data-card-id={card.id}
              style={{ position: "relative" }}
            >
              <div style={visualStyle}>
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

                      // Only update preview if we have valid IDs
                      if (sourceCardId && targetCardId) {
                        setPreview({
                          sourceId: sourceCardId,
                          targetId: targetCardId,
                          edge,
                        });
                      } else {
                        // Clear preview if no valid target
                        setPreview(null);
                      }
                    }}
                    onDrop={(params) => {
                      handleDrop(params);
                    }}
                  />
                </div>
              </div>
            </div>
          );
        });

        // Drop shadow preview - shows where the card will be inserted
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
            // Calculate where the dragged card will be inserted
            let insertIndex: number;
            if (preview.edge === "top") {
              // Insert before the target
              insertIndex =
                draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
            } else {
              // Insert after the target
              insertIndex =
                draggedIndex < targetIndex ? targetIndex : targetIndex + 1;
            }

            // Calculate the position for the drop shadow at the insertion point
            let shadowPosition = insertIndex * cardHeight;

            // Find the dragged item to show in the shadow
            const draggedItem = items.find((x) => x.id === draggingId);
            if (draggedItem) {
              children.push(
                <div
                  key="drop-shadow"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: shadowPosition,
                    width: "100%",
                    height: cardHeight,
                    pointerEvents: "none",
                    zIndex: 10,
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
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
                key="card-ghost"
                style={{
                  position: "fixed",
                  left,
                  top,
                  width: "272px", // match list width
                  pointerEvents: "none",
                  opacity: 0.9,
                  transform: "scale(1.01) rotate(1deg)",
                  zIndex: 9999,
                  filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2))",
                  transition: "none", // Disable transitions for smooth following
                }}
              >
                <Card card={dragged} boardId={boardId} />
              </div>
            );
          }
        }

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
