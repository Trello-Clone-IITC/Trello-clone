import type { ListDto } from "@ronmordo/contracts";
import { AimansCard } from "./AimansCard";
import { AddCardDialogButton } from "./dialogs/AddCardDialogButton";
import { EditListDialogButton } from "./dialogs/EditListDialogButton";
import { ConfirmDeleteDialog } from "./dialogs/ConfirmDeleteDialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { emitDeleteList } from "../socket";
import { useAimanCards } from "../hooks/useAimansBoard";

type Props = {
  list: ListDto;
  boardId: string;
};

export function AimansList({ list, boardId }: Props) {
  const { data: cards, isLoading, error } = useAimanCards(boardId, list.id);
  return (
    <div className="bg-[#1d2125] rounded-lg p-3 w-80 flex-shrink-0 border border-[#2d363c]">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[#b6c2cf] font-semibold">{list.name}</div>
        <div className="flex items-center gap-1">
          <EditListDialogButton
            boardId={boardId}
            list={list}
            trigger={
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-[#b6c2cf]"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
          <ConfirmDeleteDialog
            title="Delete list?"
            description="This will remove the list and its cards."
            onConfirm={() => {
              emitDeleteList(boardId, list.id);
            }}
            trigger={
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="text-xs text-[#b6c2cf] opacity-70">
            Loading cards...
          </div>
        )}
        {error && (
          <div className="text-xs text-red-400">Failed to load cards</div>
        )}
        {cards?.map((c) => (
          <AimansCard key={c.id} card={c} boardId={boardId} />
        ))}
      </div>

      <div className="mt-3">
        <AddCardDialogButton boardId={boardId} listId={list.id} />
      </div>
    </div>
  );
}
