import React, { useState } from "react";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { emitCreateCard } from "@/features/final-aiman/board/socket";
import { useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "@/features/final-aiman/board/hooks";
import type { CardDto } from "@ronmordo/contracts";

interface ListFooterProps {
  listId: string;
  boardId: string;
  nextPosition: number;
}

const ListFooter: React.FC<ListFooterProps> = ({ listId, boardId, nextPosition }) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const handleAddCard = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    // Optimistic insert into the cards cache
    const tempCard: CardDto = {
      id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` as any,
      listId,
      title: trimmed,
      description: null,
      position: nextPosition,
      createdAt: new Date().toISOString() as any,
      updatedAt: new Date().toISOString() as any,
      // Optional fields tolerated by UI
      coverImageUrl: null as any,
      dueDate: null as any,
      startDate: null as any,
      labels: [],
      archived: false as any,
      subscribed: false as any,
    } as unknown as CardDto;

    queryClient.setQueryData<CardDto[] | undefined>(
      boardKeys.cards(boardId, listId),
      (prev) => (prev ? [...prev, tempCard] : [tempCard])
    );

    // Emit to server
    emitCreateCard(boardId, listId, trimmed, nextPosition);
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
    <div className="mt-3" data-testid="list-footer">
      {isAddingCard ? (
        <div className="space-y-2">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a title for this card..."
            className="w-full p-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
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
            <Button onClick={handleCancel} variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAddingCard(true)}
            variant="ghost"
            size="sm"
            className="flex-1 justify-start text-[#b6c2cf] hover:bg-[#282f27] hover:text-[#b6c2cf] min-w-0"
            data-testid="list-add-card-button"
          >
            <Plus className="size-4 mr-2 flex-shrink-0" />
            <span className="truncate">Add a card</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#b6c2cf] hover:bg-[#282f27] hover:text-[#b6c2cf] flex-shrink-0"
            data-testid="card-template-list-button"
            aria-label="Create from template…"
          >
            <FileText className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListFooter;
