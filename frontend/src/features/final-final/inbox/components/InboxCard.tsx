import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Circle, CheckCircle2 } from "lucide-react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { CardDto } from "@ronmordo/contracts";
import { useMe } from "@/features/auth/hooks/useMe";
import { useAppContext } from "@/hooks/useAppContext";
import {
  getLabelColorClass,
  getLabelHoverColorClass,
} from "@/shared/constants";
import { CardStats } from "@/features/final-final/card/components/CardStats";
import CardModal from "@/features/final-final/card/components/CardModal";

interface InboxCardProps {
  card: CardDto;
  onUpdate: (id: string, updates: Partial<CardDto>) => void;
  onDragStart?: (cardId: string) => void;
  onDragEnd?: (cardId: string) => void;
  onPreview?: (preview: {
    sourceCardId: string;
    targetCardId: string;
    edge: "top" | "bottom";
  }) => void;
  onDrop?: (params: {
    sourceCardId: string;
    targetCardId: string;
    edge: "top" | "bottom";
  }) => void;
}

const InboxCardComponent: React.FC<InboxCardProps> = ({
  card,
  onUpdate,
  onDragStart,
  onDragEnd,
  onPreview,
  onDrop,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(
    card.description || ""
  );
  const [openModal, setOpenModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { data: user } = useMe();
  const { labelsExpanded, toggleLabelsExpanded } = useAppContext();
  const cardRef = useRef<HTMLDivElement>(null);

  // Determine if coverImageUrl is a HEX color or a path
  const isHexColor = (value?: string | null): boolean => {
    if (!value) return false;
    const v = value.trim();
    return /^(#)?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
      v
    );
  };
  const normalizeHex = (value: string): string =>
    value.startsWith("#") ? value : `#${value}`;

  const getLabelClassName = (color: string) => {
    const bgClass = getLabelColorClass(color);
    const hoverClass = getLabelHoverColorClass(color);
    return `${bgClass} ${hoverClass} ${
      labelsExpanded ? "text-[#b2ebd3]" : "text-[#1d2125]"
    }`;
  };

  const handleCardClick = () => setOpenModal(true);

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCompleted(!isCompleted);
  };

  const handleLabelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLabelsExpanded();
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(card.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(card.title);
    setEditDescription(card.description || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  // Set up drag functionality
  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const cleanup = draggable({
      element,
      getInitialData: () => ({
        type: "inbox-card",
        cardId: card.id,
        inboxId: user?.id, // Special identifier for inbox
      }),
      onDragStart: () => {
        onDragStart?.(card.id);
      },
      onDrop: () => {
        onDragEnd?.(card.id);
      },
    });

    const dropCleanup = dropTargetForElements({
      element,
      canDrop: ({ source }) => {
        const canDrop =
          source.data?.type === "inbox-card" && source.data?.cardId !== card.id;
        console.log("InboxCard canDrop check:", {
          sourceType: source.data?.type,
          sourceCardId: source.data?.cardId,
          targetCardId: card.id,
          canDrop,
        });
        return canDrop;
      },
      onDrag: ({ source, location }) => {
        const sourceCardId = source.data?.cardId as string;
        if (sourceCardId && sourceCardId !== card.id) {
          // Determine edge based on mouse position relative to card center
          const rect = element.getBoundingClientRect();
          const mouseY = location.current.input.clientY;
          const edge = mouseY - rect.top > rect.height / 2 ? "bottom" : "top";

          onPreview?.({
            sourceCardId,
            targetCardId: card.id,
            edge,
          });
        }
      },
      onDrop: ({ source, location }) => {
        console.log("InboxCard onDrop called:", { source, cardId: card.id });
        const sourceCardId = source.data?.cardId as string;
        if (sourceCardId && sourceCardId !== card.id) {
          // Determine edge based on final mouse position
          const rect = element.getBoundingClientRect();
          const mouseY = location.current.input.clientY;
          const edge = mouseY - rect.top > rect.height / 2 ? "bottom" : "top";

          console.log("InboxCard calling onDrop with:", {
            sourceCardId,
            targetCardId: card.id,
            edge,
          });

          onDrop?.({
            sourceCardId,
            targetCardId: card.id,
            edge,
          });
        }
      },
    });

    return () => {
      cleanup();
      dropCleanup();
    };
  }, [card.id, onDragStart, onDragEnd, onPreview, onDrop, user?.id]);

  return (
    <>
      <div
        ref={cardRef}
        className="card-hover-group relative bg-[#22272b] min-h-[36px] rounded-[8px] cursor-pointer shadow-sm hover:bg-[#2c2e33] transition-colors"
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
              style={{
                backgroundColor: normalizeHex(card.coverImageUrl.trim()),
              }}
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
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-[#1a1a1a] border-[#313133] text-white placeholder:text-gray-400"
                placeholder="Card title"
                autoFocus
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-[#1a1a1a] border-[#313133] text-white placeholder:text-gray-400 resize-none"
                placeholder="Add a description..."
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
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
                  className={`card-completion-button absolute left-0 top-0.5 transition-all duration-500 ease-out cursor-pointer rounded-full z-20 ${
                    isCompleted
                      ? "opacity-100"
                      : "opacity-0 hover:bg-[#ffffff1a]"
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
                  className={`card-title font-medium text-white mb-1 text-sm leading-tight transition-all duration-500 ease-out break-words ${
                    isCompleted ? "ml-6" : ""
                  }`}
                  onDoubleClick={() => setIsEditing(true)}
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
            </>
          )}
        </div>
      </div>

      {openModal && (
        <CardModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          boardId="inbox" // Special identifier for inbox
          card={card}
          isCompleted={isCompleted}
          onComplete={handleComplete}
          isInbox={true}
        />
      )}
    </>
  );
};

export default InboxCardComponent;
