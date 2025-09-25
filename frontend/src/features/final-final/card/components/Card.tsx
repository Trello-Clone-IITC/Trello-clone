import {
  getLabelColorClass,
  getLabelHoverColorClass,
} from "@/shared/constants";
import type { CardDto } from "@ronmordo/contracts";
import { CardStats } from "./CardStats";
import { useState, useRef, useEffect } from "react";
import CardModal from "./CardModal";
import { Circle, CheckCircle2 } from "lucide-react";
import { useAppContext } from "@/hooks/useAppContext";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

type Props = {
  card: CardDto;
  boardId: string;
  listId: string;
  onDragStart?: (cardId: string) => void;
  onDragEnd?: (cardId: string) => void;
  onPreview?: (params: {
    sourceCardId: string;
    targetCardId: string;
    edge: "top" | "bottom";
    sourceListId?: string;
  }) => void;
  onDrop?: (params: {
    sourceCardId: string;
    targetCardId: string;
    edge: "top" | "bottom";
    sourceListId?: string;
  }) => void;
};

const Card = ({
  card,
  boardId,
  listId,
  onDragStart,
  onDragEnd,
  onPreview,
  onDrop,
}: Props) => {
  const { labelsExpanded, toggleLabelsExpanded } = useAppContext();
  const [openModal, setOpenModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardClick = () => setOpenModal(true);

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCompleted(!isCompleted);
  };

  const handleLabelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLabelsExpanded();
  };
  // Determine if coverImageUrl is a HEX color or a path
  const isHexColor = (value?: string | null): boolean => {
    if (!value) return false;
    const v = value.trim();
    return /^(#)?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v);
  };
  const normalizeHex = (value: string): string =>
    value.startsWith("#") ? value : `#${value}`;
  //  CASPI CHANGED LINES 38-40
  const getLabelClassName = (color: string) => {
    const bgClass = getLabelColorClass(color);
    const hoverClass = getLabelHoverColorClass(color);
    return `${bgClass} ${hoverClass} ${
      labelsExpanded ? "text-[#b2ebd3]" : "text-[#1d2125]"
    }`;
  };

  // Set up draggable
  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const cleanup = draggable({
      element,
      getInitialData: () => ({
        type: "card",
        cardId: card.id,
        listId: listId,
      }),
      onDragStart: () => {
        onDragStart?.(card.id);
      },
      onDrop: () => {
        onDragEnd?.(card.id);
      },
    });

    return cleanup;
  }, [card.id, listId, onDragStart, onDragEnd]);

  // Set up drop target
  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const cleanup = dropTargetForElements({
      element,
      getData: () => ({
        type: "card",
        cardId: card.id,
      }),
      canDrop: ({ source }) => source.data?.type === "card",
      onDragEnter: ({ source }) => {
        const sourceCardId = source.data?.cardId as string;
        const sourceListId = source.data?.listId as string;
        console.log("Card onDragEnter:", {
          sourceCardId,
          targetCardId: card.id,
          sourceListId,
        });
        if (sourceCardId && sourceCardId !== card.id) {
          onPreview?.({
            sourceCardId,
            targetCardId: card.id,
            edge: "top", // Default to top, will be updated based on mouse position
            sourceListId,
          });
        }
      },
      onDrag: ({ source, location }) => {
        const sourceCardId = source.data?.cardId as string;
        const sourceListId = source.data?.listId as string;
        if (sourceCardId && sourceCardId !== card.id) {
          // Determine edge based on mouse position relative to card center
          // Make it more forgiving by using a larger zone for "top"
          const rect = element.getBoundingClientRect();
          const mouseY = location.current.input.clientY;
          const cardCenterY = rect.top + rect.height / 2;

          // Use 60% of the card height for the top zone to make it easier to hit
          const topZoneHeight = rect.height * 0.6;
          const edge = mouseY < rect.top + topZoneHeight ? "top" : "bottom";

          console.log("Card onDrag:", {
            sourceCardId,
            targetCardId: card.id,
            edge,
            sourceListId,
            mouseY,
            cardTop: rect.top,
            cardCenter: cardCenterY,
            topZoneEnd: rect.top + topZoneHeight,
          });

          onPreview?.({
            sourceCardId,
            targetCardId: card.id,
            edge,
            sourceListId,
          });
        }
      },
      onDrop: ({ source, location }) => {
        const sourceCardId = source.data?.cardId as string;
        const sourceListId = source.data?.listId as string;
        console.log("Card onDrop called:", {
          sourceCardId,
          targetCardId: card.id,
          sourceListId,
        });
        if (sourceCardId && sourceCardId !== card.id) {
          // Determine edge based on final mouse position
          // Use the same forgiving logic as onDrag
          const rect = element.getBoundingClientRect();
          const mouseY = location.current.input.clientY;
          const cardCenterY = rect.top + rect.height / 2;

          // Use 60% of the card height for the top zone to make it easier to hit
          const topZoneHeight = rect.height * 0.6;
          const edge = mouseY < rect.top + topZoneHeight ? "top" : "bottom";

          console.log("Card onDrop calling onDrop with:", {
            sourceCardId,
            targetCardId: card.id,
            edge,
            sourceListId,
            mouseY,
            cardTop: rect.top,
            cardCenter: cardCenterY,
            topZoneEnd: rect.top + topZoneHeight,
          });

          onDrop?.({
            sourceCardId,
            targetCardId: card.id,
            edge,
            sourceListId,
          });
        }
      },
    });

    return cleanup;
  }, [card.id, onPreview, onDrop]);

  // Caspi Changed styling
  return (
    <>
      <div
        ref={cardRef}
        className="group relative bg-[#22272b] min-h-[36px] rounded-[8px] cursor-pointer shadow-sm hover:bg-[#2c2e33] transition-colors"
        onClick={handleCardClick}
        style={{
          // Add some padding to make drop target area larger
          marginTop: "2px",
          marginBottom: "2px",
        }}
      >
        {card.coverImageUrl ? (
          isHexColor(card.coverImageUrl) ? (
            <div
              className="h-9 overflow-hidden rounded-t-[8px]"
              style={{ backgroundColor: normalizeHex(card.coverImageUrl.trim()) }}
            ></div>
          ) : (
            <div className="h-9 overflow-hidden rounded-t-[8px]">
              <img
                src={card.coverImageUrl}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          )
        ) : null}
        <div className="z-10 min-h-[24px] px-3 pt-2 pb-1">
          {card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {card.labels.map((label, index) => (
                <span
                  key={label.name || `label-${index}`}
                  className={`${
                    labelsExpanded ? "h-4 px-2 py-0" : "h-2 px-0"
                  } my-0 rounded-[4px] text-xs font-normal cursor-pointer overflow-hidden transition-all duration-200 ${
                    labelsExpanded
                      ? "max-w-none min-w-[56px] flex items-center justify-center text-center"
                      : "max-w-[40px] min-w-[40px]"
                  } text-ellipsis ${getLabelClassName(
                    label.color
                  )} text-black text-opacity-100 mix-blend-normal`}
                  title={label.name || ""}
                  onClick={handleLabelClick}
                >
                  {labelsExpanded && label.name ? label.name : ""}
                </span>
              ))}
            </div>
          )}

          {/* Title with completion circle */}
          <div className="relative">
            {/* Completion circle - appears on hover/focus next to title */}
            <span
              role="img"
              aria-label={`Mark this card complete (${card.title})`}
              className={`absolute left-0 top-0.5 transition-all duration-500 ease-out cursor-pointer rounded-full z-20 ${
                isCompleted
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-[#ffffff1a]"
              }`}
              onClick={handleComplete}
            >
              {isCompleted ? (
                <CheckCircle2
                  className="w-4 h-4 transition-all duration-300"
                  fill="#a5cd6b"
                  stroke="#242528"
                  strokeWidth="2"
                />
              ) : (
                <Circle
                  className="w-4 h-4 text-[#626F86] hover:text-[#ffffff] transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              )}
            </span>

            <h3
              className={`font-medium text-white mb-1 text-sm leading-tight transition-all duration-500 ease-out ${
                isCompleted
                  ? "ml-6"
                  : "group-hover:ml-6 group-focus-within:ml-8"
              }`}
            >
              {card.title}
            </h3>
          </div>

          <CardStats card={card} isCompleted={isCompleted} />

          {/* Member avatar - bottom right */}
          {card.cardAssignees && card.cardAssignees.length > 0 && (
            <div className="flex justify-end mt-2">
              <div className="flex -space-x-1">
                {card.cardAssignees.slice(0, 3).map((assignee, index) => (
                  <div
                    key={assignee.id}
                    className="relative"
                    title={assignee.fullName}
                  >
                    {index === 2 && card.cardAssignees.length > 3 && (
                      <div className="absolute inset-0 w-6 h-6 rounded-full border-2 border-[#22272b] bg-[#dfe1e6] flex items-center justify-center text-xs font-medium text-[#5e6c84]">
                        +{card.cardAssignees.length - 3}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {openModal && (
        <CardModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          boardId={boardId}
          card={card}
          isCompleted={isCompleted}
          onComplete={handleComplete}
        />
      )}
    </>
  );
};

export default Card;
