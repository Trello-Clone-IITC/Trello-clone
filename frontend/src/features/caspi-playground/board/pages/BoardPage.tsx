import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Spinner from "@/features/caspi-playground/board/components/Spinner";
import Board from "@/features/caspi-playground/board/components/Board";
import BoardHeader from "../components/BoardHeader";
import { useBoard } from "../hooks";
import { testBoards } from "@/features/caspi-playground/board/data/testBoards";
import {
  generateBoardFavicon,
  updatePageTitle,
  resetPageTitle,
} from "@/lib/faviconUtils";
import {
  getBackgroundPreviewUrl,
  getBoardBackgroundStyle,
} from "@/features/caspi-playground/board/utils/backgroundUtils";
import { useTheme } from "@/hooks/useTheme";

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { theme } = useTheme();

  // For testing purposes, use test boards if the boardId matches a test board
  const testBoard = boardId ? testBoards[boardId] : null;

  // Kick off data loading to drive a loading state
  const {
    data: board,
    isLoading,
    isFetching,
    isError,
  } = useBoard(boardId || "");

  // Determine which board to use (test board takes priority)
  const currentBoard = testBoard || board;

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

      console.log("Board data for favicon:", {
        name: boardData.name,
        background: boardData.background,
        originalBackground: currentBoard.background,
      });

      updatePageTitle(boardData);
      generateBoardFavicon(boardData);
    }

    return () => {
      resetPageTitle();
    };
  }, [currentBoard]);

  if (!boardId) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white/90"
        style={{ backgroundColor: theme === "light" ? "#ffffff" : "#1f1f21" }}
      >
        Missing board ID
      </div>
    );
  }

  // Get background styling based on current board and theme
  const backgroundStyle = currentBoard
    ? getBoardBackgroundStyle(currentBoard.background, theme)
    : { backgroundColor: theme === "light" ? "#ffffff" : "#1f1f21" };

  if (testBoard) {
    return (
      <div className="h-full flex flex-col" style={backgroundStyle}>
        <div className="flex-shrink-0">
          <BoardHeader
            boardName={testBoard.name}
            boardId={testBoard.id}
            background={testBoard.background}
            theme={theme}
          />
        </div>
        <Board board={testBoard} />
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={backgroundStyle}
      >
        <Spinner label="Loading board..." size={28} />
      </div>
    );
  }

  if (isError || !board) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-red-400"
        style={backgroundStyle}
      >
        Error loading board
      </div>
    );
  }

  // Delegate rendering to the Board component
  return (
    <div className="h-full flex flex-col" style={backgroundStyle}>
      <div className="flex-shrink-0">
        <BoardHeader
          boardName={board.name}
          boardId={board.id}
          background={board.background}
          theme={theme}
        />
      </div>
      <Board board={board} />
    </div>
  );
};

export default BoardPage;
