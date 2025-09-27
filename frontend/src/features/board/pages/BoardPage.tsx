import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "@/features/board/components/Spinner";
import Board from "@/features/board/components/Board";
import { useBoard } from "../hooks";
import {
  generateBoardFavicon,
  updatePageTitle,
  resetPageTitle,
} from "@/lib/faviconUtils";
import {
  getBackgroundPreviewUrl,
  getBoardBackgroundStyle,
} from "@/features/board/utils/backgroundUtils";
import { useTheme } from "@/hooks/useTheme";
import BoardFooter from "../components/BoardFooter";
import { Inbox } from "@/features/inbox";
import { useInbox } from "@/features/inbox/hooks/useInbox";
import { Planner } from "@/features/planner";
import { useAppContext } from "@/hooks/useAppContext";
import { SwitchBoardsModal } from "@/features/board/components/SwitchBoardsModal";

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { theme } = useTheme();
  const { setNavbarBorderHidden } = useAppContext();
  const [activeComponents, setActiveComponents] = useState<{
    inbox: boolean;
    planner: boolean;
    board: boolean;
  }>({ inbox: false, planner: false, board: true });
  const { cards } = useInbox(activeComponents.inbox);

  const [switchBoardsOpen, setSwitchBoardsOpen] = useState(false);

  const handleTabChange = (
    tab: "inbox" | "planner" | "board" | "switch-boards"
  ) => {
    if (tab === "inbox") {
      setActiveComponents((prev) => {
        const newState = { ...prev, inbox: !prev.inbox };
        // Prevent having no components active
        if (!newState.inbox && !newState.board && !newState.planner) {
          newState.board = true;
        }
        return newState;
      });
    } else if (tab === "board") {
      setActiveComponents((prev) => {
        const newState = { ...prev, board: !prev.board };
        // Prevent having no components active
        if (!newState.inbox && !newState.board && !newState.planner) {
          newState.inbox = true;
        }
        return newState;
      });
    } else if (tab === "planner") {
      setActiveComponents((prev) => {
        const newState = { ...prev, planner: !prev.planner };
        // Prevent having no components active
        if (!newState.inbox && !newState.board && !newState.planner) {
          newState.board = true;
        }
        return newState;
      });
    } else if (tab === "switch-boards") {
      setSwitchBoardsOpen(true);
    }
  };

  const bothActive = activeComponents.inbox && activeComponents.board;
  const anyActive =
    activeComponents.inbox ||
    activeComponents.planner ||
    activeComponents.board;
  const multipleActive =
    (activeComponents.inbox ? 1 : 0) +
      (activeComponents.planner ? 1 : 0) +
      (activeComponents.board ? 1 : 0) >
    1;

  // Specific layout scenarios
  const inboxAndBoardOnly =
    activeComponents.inbox &&
    activeComponents.board &&
    !activeComponents.planner;
  const plannerAndBoardOnly =
    activeComponents.planner &&
    activeComponents.board &&
    !activeComponents.inbox;
  const inboxAndPlannerOnly =
    activeComponents.inbox &&
    activeComponents.planner &&
    !activeComponents.board;
  const allThreeActive =
    activeComponents.inbox &&
    activeComponents.planner &&
    activeComponents.board;

  // Keep navbar border hidden state in sync with layout; must be above any early returns
  useEffect(() => {
    console.log("BoardPage setting navbarBorderHidden:", {
      activeComponents,
      multipleActive,
      settingNavbarBorderHidden: multipleActive,
    });
    setNavbarBorderHidden(multipleActive);
  }, [multipleActive, setNavbarBorderHidden, activeComponents]);

  // Kick off data loading to drive a loading state
  const {
    data: board,
    isLoading,
    isFetching,
    isError,
  } = useBoard(boardId || "");

  // Use the board from the API
  const currentBoard = board;

  // Set favicon and title based on current board
  useEffect(() => {
    if (currentBoard) {
      const backgroundImageUrl = getBackgroundPreviewUrl(
        currentBoard.background
      );
      const boardData = {
        name: currentBoard.name,
        background: backgroundImageUrl || undefined,
      };

      updatePageTitle(boardData);
      generateBoardFavicon(boardData);
    }

    return () => {
      resetPageTitle();
    };
  }, [currentBoard]);

  const missingBoardId = !boardId;

  // Get background styling based on current board and theme
  const backgroundStyle = currentBoard
    ? getBoardBackgroundStyle(currentBoard.background, theme)
    : { backgroundColor: theme === "light" ? "#ffffff" : "#1f1f21" };

  if (missingBoardId || isLoading || isFetching) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme === "light" ? "#ffffff" : "#1f1f21" }}
      >
        {missingBoardId ? (
          <div className="text-white/90">Missing board ID</div>
        ) : (
          <Spinner label="Loading board..." size={28} />
        )}
      </div>
    );
  }

  if (isError || !board) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Error loading board
      </div>
    );
  }

  // Delegate rendering to the Board component with Inbox/footer layout
  return (
    <div className="h-full flex flex-col">
      <div
        className={`flex w-full h-full pt-0 min-w-0 min-h-0 items-stretch ${
          multipleActive ? "gap-3 px-4 pb-8" : ""
        } ${theme === "light" ? "bg-white" : "bg-[#1f1f21]"}`}
      >
        {/* Inbox pane */}
        <div
          className={`${
            activeComponents.inbox
              ? multipleActive
                ? inboxAndPlannerOnly
                  ? "opacity-100 translate-x-0 flex-1 my-2"
                  : "opacity-100 translate-x-0 basis-[272px] w-[272px] my-2"
                : "opacity-100 translate-x-0 flex-1 my-0"
              : "opacity-0 -translate-x-4 pointer-events-none basis-0 w-0 my-0 hidden"
          } flex flex-col h-full min-h-0 shrink-0 transition-all duration-200 ease-out`}
        >
          <Inbox
            fullWidth={!multipleActive}
            isSidebar={!inboxAndPlannerOnly}
            boardId={boardId}
          />
        </div>

        {/* Planner pane */}
        <div
          className={`${
            activeComponents.planner
              ? multipleActive
                ? inboxAndPlannerOnly
                  ? "opacity-100 translate-x-0 flex-1 my-2"
                  : "opacity-100 translate-x-0 basis-[272px] w-[272px] my-2"
                : "opacity-100 translate-x-0 flex-1 my-0"
              : "opacity-0 -translate-x-4 pointer-events-none basis-0 w-0 my-0 hidden"
          } flex flex-col h-full min-h-0 shrink-0 transition-all duration-200 ease-out`}
        >
          <Planner
            fullWidth={!multipleActive}
            isSidebar={!inboxAndPlannerOnly && multipleActive}
          />
        </div>

        {/* Board pane */}
        <div
          className={`${
            activeComponents.board
              ? multipleActive
                ? inboxAndBoardOnly
                  ? "flex-1 h-full rounded-lg border border-[#313133] overflow-hidden my-2"
                  : "flex-1 h-full rounded-lg border border-[#313133] overflow-hidden my-2"
                : "flex-1 h-full"
              : "w-0 basis-0 h-full pointer-events-none opacity-0"
          } min-w-0 min-h-0 transition-all duration-200 ease-out`}
        >
          <Board
            board={board}
            backgroundStyle={
              multipleActive
                ? { ...backgroundStyle, minHeight: undefined }
                : backgroundStyle
            }
            bottomGap={!multipleActive}
          />
        </div>
      </div>
      <BoardFooter
        activeComponents={activeComponents}
        onTabChange={handleTabChange}
      />
      {/* Switch Boards Modal */}
      <SwitchBoardsModal
        open={switchBoardsOpen}
        onClose={() => setSwitchBoardsOpen(false)}
      />
    </div>
  );
};

export default BoardPage;
