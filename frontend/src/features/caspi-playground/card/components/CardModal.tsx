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
import React from "react";
import type { CardDto } from "@ronmordo/contracts";
import {
  useCardAttachments,
  useCardChecklists,
  useCardComments,
} from "@/features/caspi-playground/card/hooks/useCardQueries";
import { TitleHeader } from "./TitleHeader";
import { MainContent } from "./MainContent";
import { CommentsSidebar } from "./CommentsSidebar";

export default function CardModal({
  open,
  onClose,
  boardId,
  card,
}: {
  open: boolean;
  onClose: () => void;
  boardId: string;
  card: CardDto;
}) {
  const labels = card.labels || [];
  const displayTitle = card.title || "Card title";
  const displayDescription = card.description;

  // Lazy-load extras only when asked
  const [showDetails, setShowDetails] = React.useState(false);
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
        className="sm:max-w-5xl p-0 bg-[#22272b] border-[#22272b] text-white flex flex-col overflow-hidden gap-0 top-[30px] left-[50%] translate-x-[-50%] translate-y-0"
        showCloseButton={false}
      >
        {/* Cover div */}
        <div className="bg-[#216e4e] h-[116px] rounded-t-lg w-full overflow-hidden relative">
          {/* Header actions in cover */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
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
                className="w-48 bg-[#22272b] border-gray-600 text-white"
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
            className="border border-[#2d363c] border-t-0 border-r-0 w-full overflow-y-auto"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gridTemplateRows: "0fr 1fr",
              flex: "1 1 auto",
            }}
          >
            <TitleHeader title={displayTitle} />

            <MainContent
              labels={labels}
              description={displayDescription}
              boardId={boardId}
              listId={card.listId}
              cardId={card.id}
              startDate={card.startDate as any}
              dueDate={card.dueDate as any}
            />
          </div>

          {/* Right column - Comments & Activity */}
          <aside className="border border-[#2d363c] border-t-0 border-l-0 h-full flex flex-col bg-[#161a1d] overflow-hidden">
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
