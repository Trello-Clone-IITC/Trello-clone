// import { useParams } from "react-router-dom";
// import Spinner from "@/features/final-aiman/board/components/Spinner";
// import Board from "@/features/final-aiman/board/components/Board";
// import { useBoard } from "@/features/final-aiman/board/hooks";
// // import BoardHeader from "../components/BoardHeader";

// const BoardPage = () => {
//   const { boardId } = useParams<{ boardId: string }>();
//   if (!boardId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white/90">
//         Missing board ID
//       </div>
//     );
//   }

//   // Kick off data loading to drive a loading state
//   const { data: board, isLoading, isFetching, isError } = useBoard(boardId);


//   if (!boardId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white/90">
//         Missing board ID
//       </div>
//     );
//   }

//   if (isLoading || isFetching) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Spinner label="Loading board..." size={28} />
//       </div>
//     );
//   }

//   if (isError || !board) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-400">
//         Error loading board
//       </div>
//     );
//   }

//   // Delegate rendering to the Board component
//   return (<>
//     {/* <BoardHeader boardName={board.name} boardId={board.id} /> */}
//   <Board board={board} />;
//   </>)
// };

// export default BoardPage;





// ----------------------------------------CASPI---------------------------------------------
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Spinner from "@/features/final-aiman/board/components/Spinner";
import Board from "@/features/final-aiman/board/components/Board";
import BoardHeader from "../components/BoardHeader";
import { useBoard } from "../hooks";
import {
  generateBoardFavicon,
  updatePageTitle,
  resetPageTitle,
} from "@/lib/faviconUtils";
import {
  getBackgroundPreviewUrl,
  getBoardBackgroundStyle,
} from "@/features/final-aiman/board/utils/backgrountUtils";
import { useTheme } from "@/hooks/useTheme";

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { theme } = useTheme();



  // Kick off data loading to drive a loading state
  const {
    data: board,
    isLoading,
    isFetching,
    isError,
  } = useBoard(boardId || "");




  // Set favicon and title based on current board
  useEffect(() => {
    if (board) {
      const backgroundImageUrl = getBackgroundPreviewUrl(
        board.background
      );
      const boardData = {
        name: board.name,
        background: backgroundImageUrl || undefined,
      };

      console.log("Board data for favicon:", {
        name: boardData.name,
        background: boardData.background,
        originalBackground: board.background,
      });

      updatePageTitle(boardData);
      generateBoardFavicon(boardData);
    }

    return () => {
      resetPageTitle();
    };
  }, [board]);

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
  const backgroundStyle = board
    ? getBoardBackgroundStyle(board.background, theme)
    : { backgroundColor: theme === "light" ? "#ffffff" : "#1f1f21" };

  // if (testBoard) {
  //   return (
  //     <div className="h-full flex flex-col" style={backgroundStyle}>
  //       <div className="flex-shrink-0">
  //         <BoardHeader
  //           boardName={testBoard.name}
  //           boardId={testBoard.id}
  //           background={testBoard.background}
  //           theme={theme}
  //         />
  //       </div>
  //       <Board board={testBoard} />
  //     </div>
  //   );
  // }

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
