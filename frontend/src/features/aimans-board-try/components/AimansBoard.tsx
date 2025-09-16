import type { AimansBoardAggregated } from "../hooks/useAimansBoard";
import { AimansList } from "./AimansList";
import { AddListDialogButton } from "./dialogs/AddListDialogButton";

type Props = {
  data: AimansBoardAggregated;
};

export function AimansBoard({ data }: Props) {
  const { board, lists } = data;

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
          .sort((a, b) => a.list.position - b.list.position)
          .map(({ list, cards }) => (
            <AimansList key={list.id} list={list} cards={cards} boardId={board.id} />
          ))}

        {/* Add new list button */}
        <div className="bg-[#101204] rounded-lg p-3 w-80 flex-shrink-0 h-fit border border-[#2d363c]">
          <AddListDialogButton boardId={board.id} />
        </div>
      </div>
    </div>
  );
}
