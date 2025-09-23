import { Ellipsis, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { CardDto, LabelDto } from "@ronmordo/contracts";
import {
  useCardAttachments,
  useCardChecklists,
  useCardComments,
} from "@/features/final-aiman/card/hooks/useCardQueries";
import { TitleHeader } from "./TitleHeader";
import { MainContent } from "./MainContent";
import { CommentsSidebar } from "./CommentsSidebar";
import { CoverPopover } from "./CoverPopover";

export default function CardModal({
  open,
  onClose,
  boardId,
  card,
  isCompleted,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  boardId: string;
  card: CardDto;
  isCompleted: boolean;
  onComplete: (e: React.MouseEvent) => void;
}) {
  // Convert card.labels (which only has color and name) to LabelDto format
  const labels: LabelDto[] = (card.labels || []).map((label) => ({
    id: `temp-${label.color}` as LabelDto["id"],
    boardId: boardId as LabelDto["boardId"],
    name: label.name,
    color: label.color,
  }));
  const displayTitle = card.title || "Card title";
  const displayDescription = card.description;

  // Lazy-load extras only when asked
  const [showDetails, setShowDetails] = useState(false);
  const enableExtras = open && showDetails;
  const { data: comments } = useCardComments(
    boardId,
    card.listId,
    card.id,
    open
  );
  const { data: checklists } = useCardChecklists(
    boardId,
    card.listId,
    card.id,
    enableExtras
  );
  const { data: attachments } = useCardAttachments(
    boardId,
    card.listId,
    card.id,
    enableExtras
  );
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-5xl p-0 bg-[#242528] text-white flex flex-col overflow-hidden gap-0 top-[30px] left-[50%] translate-x-[-50%] translate-y-0 rounded-[12px] border-0"
        showCloseButton={false}
      >
        {/* Cover div */}
        <div className="bg-[#216e4e] h-[116px] rounded-t-lg w-full border-b border-[#3c3d40] overflow-hidden relative">
          {/* Header actions in cover */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {/* Cover menu */}
            <CoverPopover>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <svg
                  fill="none"
                  viewBox="0 0 16 16"
                  role="presentation"
                  className="size-4"
                >
                  <path
                    fill="currentColor"
                    d="M5.75 4a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5"
                  />
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zM3 2.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h.644l6.274-7.723.053-.058a.75.75 0 0 1 1.06 0L13.5 8.19V3a.5.5 0 0 0-.5-.5zm2.575 11H13a.5.5 0 0 0 .5-.5v-2.69l-2.943-2.943z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </CoverPopover>

            {/* 3-dot menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <Ellipsis className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-[#242528] border-gray-600 text-white"
              >
                <DropdownMenuItem className="hover:bg-gray-700">
                  Join
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700">
                  Move
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700">
                  Copy
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700">
                  Mirror
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700">
                  Make template
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700">
                  Watch
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-gray-700">
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700">
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Bottom content container */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_460px] -mt-px overflow-hidden">
          {/* Left side - Title + Main content */}
          <div
            className="border-t border-[#3c3d40] w-full overflow-y-auto"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gridTemplateRows: "0fr 1fr",
              flex: "1 1 auto",
            }}
          >
            <TitleHeader
              title={displayTitle}
              isCompleted={isCompleted}
              onComplete={onComplete}
            />

            <MainContent
              labels={labels}
              description={displayDescription}
              boardId={boardId}
              listId={card.listId}
              cardId={card.id}
              startDate={card.startDate as string | null | undefined}
              dueDate={card.dueDate as string | null | undefined}
              isCompleted={isCompleted}
            />
          </div>

          {/* Right column - Comments & Activity */}
          <aside className="border-l border-t border-[#3c3d40] h-full flex flex-col bg-[#18191a] overflow-hidden">
            <CommentsSidebar
              showDetails={showDetails}
              setShowDetails={setShowDetails}
              comments={comments}
              boardId={boardId}
              listId={card.listId}
              cardId={card.id}
              checklistsCount={checklists?.length ?? 0}
              attachmentsCount={attachments?.length ?? 0}
            />
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
