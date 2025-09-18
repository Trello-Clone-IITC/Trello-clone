import { Navbar } from "@/features/navbar";
import { useTheme } from "@/hooks/useTheme";
import { useParams } from "react-router-dom";
import { useFullBoard } from "../hooks/useBoard";
import Board from "../components/Board";
import BoardHeader from "../components/BoardHeader";

export default function BoardPage() {
  const { theme } = useTheme();
  const { boardId } = useParams<{ boardId: string }>();
  const { data: boardData, isLoading, error } = useFullBoard(boardId || "");

  const getMainBackgroundColor = () => {
    if (theme === "light") return "#ffffff";
    return "#1f1f21";
  };

  const getBoardBackgroundStyle = () => {
    if (!boardData?.background) {
      return {
        backgroundColor: getMainBackgroundColor(),
      };
    }

    // Check if it's a color (hex or rgb)
    if (
      boardData.background.startsWith("#") ||
      boardData.background.startsWith("rgb")
    ) {
      return {
        backgroundColor: boardData.background,
      };
    }

    // Check if it's a URL (photo background)
    if (boardData.background.startsWith("http")) {
      return {
        backgroundImage: `url(${boardData.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }

    // Check if it's a pattern path (gradient with pattern)
    if (boardData.background.startsWith("/")) {
      return {
        backgroundImage: `url(${boardData.background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }

    // Default fallback
    return {
      backgroundColor: getMainBackgroundColor(),
    };
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col">
        <Navbar />
        <div className="flex items-center justify-center flex-1">
          <div className="text-white">Loading board...</div>
        </div>
      </div>
    );
  }

  if (error || !boardData) {
    return (
      <div className="h-screen w-full flex flex-col">
        <Navbar />
        <div className="flex items-center justify-center flex-1">
          <div className="text-red-400">Error loading board</div>
        </div>
      </div>
    );
  }

  // Transform board members data for the header
  const members =
    boardData.members?.map((member) => ({
      id: member.user.id,
      name: member.user.fullName || member.user.email,
      avatar: member.user.avatarUrl,
      isAdmin: member.role === "admin",
    })) || [];

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Board Header */}

      {/* Main content area - full width, no sidebar */}
      <main
        className="flex-1 overflow-hidden"
        style={getBoardBackgroundStyle()}
      >
        <BoardHeader boardName={boardData.name} members={members} />
        <Board />
      </main>
    </div>
  );
}
