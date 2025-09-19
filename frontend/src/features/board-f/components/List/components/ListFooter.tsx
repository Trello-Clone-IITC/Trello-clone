import React, { useState } from "react";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListFooterProps {
  listId: string;
}

const ListFooter: React.FC<ListFooterProps> = ({ listId }) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      // TODO: Dispatch action to add card to Redux store
      console.log("Adding card:", newCardTitle, "to list:", listId);
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCard();
    } else if (e.key === "Escape") {
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  return (
    <div className="mt-3" data-testid="list-footer">
      {isAddingCard ? (
        <div className="space-y-2">
          <textarea
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
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
            <Button
              onClick={() => {
                setNewCardTitle("");
                setIsAddingCard(false);
              }}
              variant="ghost"
              size="sm"
            >
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
