import React, { useState, useImperativeHandle, forwardRef } from "react";
import { Plus, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  emitCreateCard,
  getBoardSocket,
} from "@/features/final-final/board/socket";
import { useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "@/features/final-final/board/hooks";
import type { CardDto } from "@ronmordo/contracts";
import { calculatePosition } from "@/features/final-final/shared/utils/positionUtils";

interface ListFooterProps {
  listId: string;
  boardId: string;
}

export interface ListFooterRef {
  triggerAddCard: () => void;
}

const ListFooter = forwardRef<ListFooterRef, ListFooterProps>(
  ({ listId, boardId }, ref) => {
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [title, setTitle] = useState("");
    const queryClient = useQueryClient();

    useImperativeHandle(ref, () => ({
      triggerAddCard: () => {
        setIsAddingCard(true);
      },
    }));

    const handleAddCard = () => {
      const trimmed = title.trim();
      if (!trimmed) return;

      // Calculate position using centralized utility
      const currentCards =
        queryClient.getQueryData<CardDto[] | undefined>(
          boardKeys.cards(boardId, listId)
        ) || [];
      const position = calculatePosition({
        sourceId: "new-card", // Dummy ID for new card
        targetId: "empty", // Add to end
        edge: "bottom",
        items: currentCards,
      });

      // Optimistic insert into the cards cache
      const tempCard: CardDto = {
        id: `temp-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}` as CardDto["id"],
        listId,
        title: trimmed,
        description: null,
        position: position,
        isWatch: false,
        cardAssignees: [],
        attachmentsCount: 0,
        commentsCount: 0,
        checklistItemsCount: 0,
        completedChecklistItemsCount: 0,
        labels: [],
        location: null,
        isArchived: false,
        createdBy: `temp-user-${Date.now()}` as CardDto["createdBy"],
        coverImageUrl: null,
        dueDate: null,
        startDate: null,
        createdAt: new Date().toISOString() as CardDto["createdAt"],
        updatedAt: new Date().toISOString() as CardDto["updatedAt"],
      };

      queryClient.setQueryData<CardDto[] | undefined>(
        boardKeys.cards(boardId, listId),
        (prev) => (prev ? [...prev, tempCard] : [tempCard])
      );

      // Emit socket event for real-time collaboration
      console.log("Emitting createCard socket event:", {
        boardId,
        listId,
        title: trimmed,
        position,
      });

      emitCreateCard(boardId, listId, trimmed, position);

      setTitle("");
      setIsAddingCard(false);
    };

    const handleCancel = () => {
      setTitle("");
      setIsAddingCard(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddCard();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    };

    return (
      <div className="mt-3 flex-shrink-0" data-testid="list-footer">
        {isAddingCard ? (
          <div className="space-y-2">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a title or paste a link"
              className="w-full p-2 text-sm bg-[#242528] border border-gray-600 rounded-lg resize-none focus:outline-none focus:border-blue-500 text-white placeholder:text-gray-400"
              rows={2}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddCard}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add card
              </Button>
              <Button
                onClick={handleCancel}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-600"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Button
              onClick={() => setIsAddingCard(true)}
              variant="ghost"
              size="sm"
              className="flex-1 justify-start text-[#b6c2cf] hover:bg-[#ffffff1a] hover:text-[#b6c2cf] min-w-0 h-8 px-2 text-sm font-normal"
              data-testid="list-add-card-button"
            >
              <Plus className="size-4 mr-1 flex-shrink-0" />
              <span className="truncate">Add a card</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#b6c2cf] hover:bg-[#ffffff1a] hover:text-[#b6c2cf] flex-shrink-0 h-8 w-8 p-0"
              data-testid="card-template-list-button"
              aria-label="Create from template…"
            >
              <FileText className="size-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }
);

ListFooter.displayName = "ListFooter";

export default ListFooter;
