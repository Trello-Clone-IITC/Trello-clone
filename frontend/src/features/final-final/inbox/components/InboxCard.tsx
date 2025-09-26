import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Check } from "lucide-react";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { CardDto } from "@ronmordo/contracts";

interface InboxCardProps {
  card: CardDto;
  onUpdate: (id: string, updates: Partial<CardDto>) => void;
  onDelete: (id: string) => void;
  onToggleCompletion: (id: string) => void;
  onDragStart?: (cardId: string) => void;
  onDragEnd?: (cardId: string) => void;
}

const InboxCardComponent: React.FC<InboxCardProps> = ({
  card,
  onUpdate,
  onDelete,
  onToggleCompletion,
  onDragStart,
  onDragEnd,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(
    card.description || ""
  );
  const cardRef = useRef<HTMLDivElement>(null);

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
        inboxId: "inbox", // Special identifier for inbox
      }),
      onDragStart: () => {
        onDragStart?.(card.id);
      },
      onDrop: () => {
        onDragEnd?.(card.id);
      },
    });

    return cleanup;
  }, [card.id, onDragStart, onDragEnd]);

  return (
    <div
      ref={cardRef}
      className="bg-[#22272b] rounded-lg p-3 mb-2 border border-[#313133] hover:border-[#44546f] transition-colors cursor-grab active:cursor-grabbing"
    >
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
        <div className="group">
          <div className="flex items-start gap-2">
            <button
              onClick={() => onToggleCompletion(card.id)}
              className={cn(
                "mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                card.isCompleted
                  ? "bg-green-600 border-green-600 text-white"
                  : "border-[#44546f] hover:border-green-600"
              )}
            >
              {card.isCompleted && <Check className="w-3 h-3" />}
            </button>
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  "text-sm font-medium text-white cursor-pointer hover:bg-[#313133] rounded px-1 py-0.5 -mx-1 -my-0.5",
                  card.isCompleted && "line-through text-gray-400"
                )}
                onClick={() => setIsEditing(true)}
              >
                {card.title}
              </h3>
              {card.description && (
                <p className="text-xs text-gray-400 mt-1 whitespace-pre-wrap">
                  {card.description}
                </p>
              )}
            </div>
            <button
              onClick={() => onDelete(card.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#313133] rounded transition-all"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InboxCardComponent;
