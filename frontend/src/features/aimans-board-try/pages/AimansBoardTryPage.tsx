import {
  useAimanBoard,
  useAimanLists,
  useAimansBoardRealtime,
} from "../hooks/useAimansBoard";
import { AimansBoard } from "../components/AimansBoard";

// Same board ID used in BoardExample
const BOARD_ID = "f60e4949-5bd0-48a5-a89f-3457b546a35a";

export function AimansBoardTryPage() {
  // Fetch board and lists separately for incremental rendering
  const {
    data: board,
    isLoading: boardLoading,
    error: boardError,
  } = useAimanBoard(BOARD_ID);
  const {
    data: lists,
    isLoading: listsLoading,
    error: listsError,
  } = useAimanLists(BOARD_ID);
  // Wire realtime updates into the split caches
  useAimansBoardRealtime(BOARD_ID);

  if (boardLoading || listsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1d2125]">
        <div className="text-white text-lg">Loading board...</div>
      </div>
    );
  }

  if (boardError || listsError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1d2125]">
        <div className="text-red-400 text-lg">
          Error loading board:{" "}
          {(boardError as Error)?.message || (listsError as Error)?.message}
        </div>
      </div>
    );
  }

  if (!board || !lists) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1d2125]">
        <div className="text-white text-lg">No board data found</div>
      </div>
    );
  }
  console.log("Board:", board);
  console.log("Lists:", lists);

  return <AimansBoard board={board} lists={lists} />;
}
