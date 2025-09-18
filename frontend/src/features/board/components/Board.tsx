import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFullBoard } from "../hooks/useBoard";
import List from "./List/components/List";
import CardModal from "./card/components/CardModal";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useCreateList } from "./List/hooks/useListQueries";
import { Input } from "@/components/ui/input";

const Board: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { data: boardData, isLoading, error } = useFullBoard(boardId || "");
  const createListMutation = useCreateList();

  const [isCreatingList, setIsCreatingList] = useState(false);
  const [listName, setListName] = useState("");

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
      await createListMutation.mutateAsync({
        name: listName.trim(),
        position: boardData?.lists?.length || 0,
        boardId,
      });
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

  const lists = boardData.lists || [];

  return (
    <div>
      <div className="flex gap-4 p-4 overflow-x-auto min-h-screen">
        {lists.map((list) => (
          <List key={list.id} id={list.id} title={list.name} cards={[]} />
        ))}

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
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    handleCancelCreateList();
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!listName.trim() || createListMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {createListMutation.isPending ? "Adding..." : "Add list"}
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
