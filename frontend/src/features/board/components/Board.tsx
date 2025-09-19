import { useState } from "react";
import { useParams } from "react-router-dom";
import List from "./List/components/List";
import CardModal from "./card/components/CardModal";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { dummyBoardData, createDummyList } from "../data/dummyData";
import type { BoardFullDto, ListDto, CardDto } from "@ronmordo/contracts";

const Board = () => {
  const { boardId } = useParams<{ boardId: string }>();

  // Use dummy data instead of hooks
  const boardData: BoardFullDto = dummyBoardData;
  const isLoading = false;
  const error = null;

  const [isCreatingList, setIsCreatingList] = useState(false);
  const [listName, setListName] = useState("");
  const [lists, setLists] = useState<(ListDto & { cards?: CardDto[] })[]>(
    boardData.lists
  );

  const handleAddList = () => {
    setIsCreatingList(true);
  };

  const handleCancelCreateList = () => {
    setIsCreatingList(false);
    setListName("");
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim() || !boardId) return;

    try {
      // Create a new list with dummy data
      const newList = createDummyList(listName.trim(), lists.length, boardId);

      // Add the new list to the state
      setLists((prevLists) => [...prevLists, newList]);

      setIsCreatingList(false);
      setListName("");
    } catch (error) {
      console.error("Failed to create list:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading board...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400">Error loading board</div>
      </div>
    );
  }

  if (!boardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Board not found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-4 p-4 overflow-x-auto min-h-screen">
        {lists.map((list) => {
          // Get cards for this list from the board data or from the list itself
          const listWithCards = boardData.lists.find((l) => l.id === list.id);
          const cards = listWithCards?.cards || list.cards || [];

          return (
            <List
              key={list.id}
              id={list.id}
              title={list.name}
              cards={cards.map((card: CardDto) => ({
                id: card.id,
                title: card.title,
                description: card.description || undefined,
                labels: card.labels || [],
              }))}
            />
          );
        })}

        <div className="min-w-[272px]">
          {isCreatingList ? (
            <form
              onSubmit={handleCreateList}
              className="bg-[#101204] hover:bg-[#101204] rounded-md p-2"
            >
              <Input
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Enter list name..."
                className="bg-white text-[#bfc1c4] placeholder:text-gray-500 mb-2"
                autoFocus
                onBlur={(e) => {
                  // Only cancel if the blur is not caused by clicking the submit button
                  const relatedTarget = e.relatedTarget as HTMLElement;
                  if (
                    !relatedTarget ||
                    !relatedTarget.closest('button[type="submit"]')
                  ) {
                    handleCancelCreateList();
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!listName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add list
                </Button>
                <Button
                  type="button"
                  onClick={handleCancelCreateList}
                  className="text-[#bfc1c4] hover:bg-[#2a2c21] bg-transparent text-lg p-1.5 has-[>svg]:px-1.5 flex items-center justify-center cursor-pointer rounded-[3px] text-[14px]"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </form>
          ) : (
            <Button
              onClick={handleAddList}
              type="button"
              className="bg-[#ffffff3d] hover:bg-[#ffffff52] text-white px-3 py-2 rounded-md flex"
            >
              <Plus className="w-4 h-4" />
              Add a list
            </Button>
          )}
        </div>
      </div>
      <CardModal />
    </div>
  );
};

export default Board;
