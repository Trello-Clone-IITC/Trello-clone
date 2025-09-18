import type { CardDto } from "@ronmordo/contracts";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { EditCardDialogButton } from "./dialogs/EditCardDialogButton";
import { ConfirmDeleteDialog } from "./dialogs/ConfirmDeleteDialog";
import { emitDeleteCard } from "../socket";
import { CardDetailsDialog } from "./dialogs/CardDetailsDialog";

type Props = {
  card: CardDto;
  boardId: string;
};

export function AimansCard({ card, boardId }: Props) {
  return (
    <CardDetailsDialog
      boardId={boardId}
      card={card}
      trigger={
        <div className="bg-[#101204] rounded-md p-2 text-[#b6c2cf] border border-[#2d363c] cursor-pointer hover:bg-[#13161a]">
          <div className="flex items-center justify-between">
            <div className="font-medium">{card.title}</div>
            <div className="flex items-center gap-1">
              <EditCardDialogButton
                boardId={boardId}
                card={card}
                trigger={
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-[#b6c2cf]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                }
              />
              <ConfirmDeleteDialog
                title="Delete card?"
                onConfirm={() => {
                  emitDeleteCard(boardId, card.id, card.listId);
                }}
                trigger={
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-red-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          </div>
          {card.description && (
            <div className="text-xs mt-1 opacity-80 line-clamp-2">
              {card.description}
            </div>
          )}
        </div>
      }
    />
  );
}
