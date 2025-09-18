import React from "react";
import { useParams } from "react-router-dom";
import { useFullBoard } from "../hooks/useBoard";
import List from "./List/components/List";
import CardModal from "./card/components/CardModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Board: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { data: boardData, isLoading, error } = useFullBoard(boardId || "");

  const handleAddList = () => {
    // TODO: Implement add list functionality
    console.log("Add list clicked");
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
    <div className="board-canvas" data-testid="board-canvas">
      <ol
        id="board"
        className="flex gap-4 p-4 overflow-x-auto min-h-screen"
        data-testid="lists"
        data-auto-scrollable="true"
        data-drag-scroll-enabled="true"
      >
        {lists.length > 0 ? (
          lists.map((list) => (
            <List key={list.id} id={list.id} title={list.name} cards={[]} />
          ))
        ) : (
          <li className="xiDAKk58vfamwR">
            <div
              className="Hdr1lvVT_9hdOt"
              data-testid="list-composer-button-container"
              role="presentation"
            >
              <Button
                onClick={handleAddList}
                className="hCjCvLRiJAOgje PhzBALMp63PY_y ybVBgfOiuWZJtD _St8_YSRMkLv07 bg-[#ffffff3d] hover:bg-[#ffffff52] text-white px-3 py-2 rounded-md flex items-center gap-2 min-w-[272px] h-8"
                type="button"
                data-testid="list-composer-button"
                data-drag-scroll-disabled="true"
              >
                <span className="nch-icon hChYpzFshATQo8 GzZMAuibTh5l1i HRDK8sNF4Ja3BM">
                  <span
                    data-testid="AddIcon"
                    data-vc="icon-AddIcon"
                    aria-hidden="true"
                  >
                    <Plus className="w-4 h-4" />
                  </span>
                </span>
                Add a list
              </Button>
            </div>
          </li>
        )}
      </ol>
      <CardModal />
    </div>
  );
};

export default Board;
