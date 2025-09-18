import type { CardDto } from "@ronmordo/contracts";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  Eye,
  MessageSquare,
  Paperclip,
  CalendarDays,
  CheckSquare,
} from "lucide-react";
import { EditCardDialogButton } from "./dialogs/EditCardDialogButton";
import { ConfirmDeleteDialog } from "./dialogs/ConfirmDeleteDialog";
import { emitDeleteCard } from "../socket";
import { CardDetailsDialog } from "./dialogs/CardDetailsDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

type Props = {
  card: CardDto;
  boardId: string;
};

function initials(fullName: string, username?: string | null) {
  const base = fullName || username || "";
  const parts = base.trim().split(" ");
  const inits = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  return inits.toUpperCase() || "?";
}

const labelColorToHex: Record<string, string> = {
  subtle_yellow: "#F5E8A3",
  subtle_orange: "#F6C79A",
  subtle_red: "#F5B0B0",
  subtle_purple: "#D6C3F5",
  subtle_blue: "#BFD7FF",
  subtle_sky: "#BFEAFF",
  subtle_lime: "#D9F7A3",
  subtle_pink: "#F8C6DF",
  subtle_black: "#9AA3AE",
  green: "#22C55E",
  yellow: "#EAB308",
  orange: "#F59E0B",
  red: "#EF4444",
  purple: "#A855F7",
  blue: "#3B82F6",
  sky: "#0EA5E9",
  lime: "#84CC16",
  pink: "#EC4899",
  black: "#111827",
  bold_green: "#16A34A",
  bold_yellow: "#CA8A04",
  bold_orange: "#EA580C",
  bold_red: "#DC2626",
  bold_purple: "#7C3AED",
  bold_blue: "#2563EB",
  bold_sky: "#0284C7",
  bold_lime: "#65A30D",
  bold_pink: "#DB2777",
  bold_black: "#000000",
  default: "#7A869A",
};

export function AimansCard({ card, boardId }: Props) {
  const hasDates = card.startDate || card.dueDate;
  const dateText = hasDates
    ? card.startDate && card.dueDate
      ? `${format(new Date(card.startDate), "MMM d")} - ${format(
          new Date(card.dueDate),
          "MMM d"
        )}`
      : format(new Date(card.startDate || card.dueDate!), "MMM d")
    : null;

  return (
    <CardDetailsDialog
      boardId={boardId}
      card={card}
      trigger={
        <div className="bg-[#101204] rounded-md p-0 text-[#b6c2cf] border border-[#2d363c] cursor-pointer hover:bg-[#13161a] overflow-hidden">
          {/* Cover image */}
          {card.coverImageUrl ? (
            <div className="w-full h-24 bg-black/20">
              <img
                src={card.coverImageUrl}
                alt="Card cover"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ) : null}

          <div className="p-2">
            {/* Labels row */}
            {card.labels?.length ? (
              <div className="flex items-center gap-1 mb-1">
                {card.labels.slice(0, 5).map((l, idx) => (
                  <span
                    key={idx}
                    className="inline-block h-2 w-10 rounded-full"
                    style={{ backgroundColor: labelColorToHex[l.color] || labelColorToHex.default }}
                  />
                ))}
                {card.labels.length > 5 ? (
                  <span className="ml-1 text-[10px] opacity-70">+{card.labels.length - 5}</span>
                ) : null}
              </div>
            ) : null}

            {/* Title and actions */}
            <div className="flex items-start justify-between">
              <div className="font-medium leading-snug break-words pr-1">{card.title}</div>
              <div className="flex items-center gap-1 ml-2">
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

            {/* Meta row: dates, eye/watch, comments, attachments */}
            {(hasDates || card.isWatch || card.commentsCount > 0 || card.attachmentsCount > 0) && (
              <div className="mt-2 flex items-center gap-3 text-xs text-[#b6c2cf] opacity-90">
                {hasDates && (
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{dateText}</span>
                  </div>
                )}
                {card.commentsCount > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{card.commentsCount}</span>
                  </div>
                )}
                {card.attachmentsCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Paperclip className="h-3.5 w-3.5" />
                    <span>{card.attachmentsCount}</span>
                  </div>
                )}
                {card.isWatch && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            )}

            {/* Checklist progress */}
            {card.checklistItemsCount > 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs">
                <CheckSquare className="h-3.5 w-3.5 opacity-80" />
                <span className="opacity-90">
                  {card.completedChecklistItemsCount}/{card.checklistItemsCount}
                </span>
              </div>
            )}

            {/* Assignees */}
            {card.cardAssignees?.length ? (
              <div className="mt-2 flex items-center justify-end gap-1">
                {card.cardAssignees.slice(0, 3).map((u) => (
                  <Avatar key={u.id} className="h-6 w-6 border border-[#2d363c]">
                    <AvatarImage src={u.avatarUrl} alt={u.fullName} />
                    <AvatarFallback className="text-[10px] bg-[#0f1115] text-[#b6c2cf]">
                      {initials(u.fullName, u.username)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {card.cardAssignees.length > 3 && (
                  <div className="h-6 min-w-6 px-1 rounded-full bg-[#0f1115] border border-[#2d363c] text-[10px] flex items-center justify-center">
                    +{card.cardAssignees.length - 3}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      }
    />
  );
}
