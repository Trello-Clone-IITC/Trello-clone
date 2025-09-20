import { useParams } from "react-router-dom";
import Spinner from "@/features/caspi-playground/board/components/Spinner";
import Board from "@/features/caspi-playground/board/components/Board";
import { useBoard } from "@/features/caspi-playground/board/hooks";
import { testBoards } from "@/features/caspi-playground/board/data/testBoards";

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  if (!boardId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/90">
        Missing board ID
      </div>
    );
  }

  // For testing purposes, use test boards if the boardId matches a test board
  const testBoard = testBoards[boardId];
  if (testBoard) {
    return <Board board={testBoard} />;
  }

  // Kick off data loading to drive a loading state
  const { data: board, isLoading, isFetching, isError } = useBoard(boardId);

  if (!boardId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/90">
        Missing board ID
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner label="Loading board..." size={28} />
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

  // Delegate rendering to the Board component
  return <Board board={board} />;
};

export default BoardPage;
