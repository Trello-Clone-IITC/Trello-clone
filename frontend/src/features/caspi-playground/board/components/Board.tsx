import { useState } from "react";
// import CardModal from "./components/card/components/CardModal";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { BoardDto } from "@ronmordo/contracts";
import { useBoardRealtime } from "@/features/caspi-playground/board/hooks";
import { useLists } from "@/features/caspi-playground/List/hooks/useListQueries";
import { List } from "@/features/caspi-playground/List/components";
import { emitCreateList } from "@/features/caspi-playground/board/socket";

const Board = ({ board }: { board: BoardDto }) => {
  // const { boardId } = useParams<{ boardId: string }>();

  // Use dummy data instead of hooks
  const boardData: BoardDto = board;

  const { data: lists, isLoading, error } = useLists(board.id);
  // Wire realtime updates into the split caches
  useBoardRealtime(board.id);

  const [isCreatingList, setIsCreatingList] = useState(false);
  const [listName, setListName] = useState("");
  // const [lists, setLists] = useState<(ListDto & { cards?: CardDto[] })[]>(
  //   boardData.lists
  // );

  const handleAddList = () => {
    setIsCreatingList(true);
  };

  const handleCancelCreateList = () => {
    setIsCreatingList(false);
    setListName("");
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = listName.trim();
    if (!name) return;
    const nextPosition =
      (lists?.reduce((max, l) => Math.max(max, l.position ?? 0), 0) ?? 0) +
      1000;
    emitCreateList(board.id, name, nextPosition);
    setIsCreatingList(false);
    setListName("");
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
    <div className="flex-1 h-full">
      <div className="flex gap-6 px-2 sm:px-4 pt-[2px] pb-[72px] overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent scroll-smooth min-h-full mt-3">
        {lists &&
          lists.map((list) => {
            return <List key={list.id} list={list} />;
          })}

        <div className="w-72 flex-shrink-0">
          {isCreatingList ? (
            <form
              onSubmit={handleCreateList}
              className="bg-[#101204] hover:bg-[#101204] rounded-md p-3"
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
              className="bg-[#ffffff3d] hover:bg-[#ffffff52] text-white px-3 py-2 rounded-md flex h-8 text-sm font-normal"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add a list
            </Button>
          )}
        </div>
      </div>
      {/* <CardModal /> */}
    </div>
  );
};

export default Board;
