import type { BoardDto, ListDto } from "@ronmordo/contracts";
import { AimansList } from "./AimansList";
import { AddListDialogButton } from "./dialogs/AddListDialogButton";

type Props = {
  board: BoardDto;
  lists: ListDto[];
};

export function AimansBoard({ board, lists }: Props) {

  return (
    <div className="min-h-screen bg-[#1d2125]">
      {/* Board Header */}
      <div className="bg-[#1d2125] border-b border-[#2d363c] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">{board.name}</h1>
            {board.description && (
              <p className="text-sm text-[#b6c2cf] mt-1">{board.description}</p>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-[#b6c2cf]">
            <span>Lists: {lists.length}</span>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex gap-4 p-4 overflow-x-auto min-h-[calc(100vh-80px)]">
        {lists
          .sort((a, b) => a.position - b.position)
          .map((list) => (
            <AimansList key={list.id} list={list} boardId={board.id} />
          ))}

        {/* Add new list button */}
        <div className="bg-[#101204] rounded-lg p-3 w-80 flex-shrink-0 h-fit border border-[#2d363c]">
          <AddListDialogButton boardId={board.id} />
        </div>
      </div>
    </div>
  );
}
