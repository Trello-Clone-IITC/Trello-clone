import { Navbar } from "@/features/navbar";
import { Outlet } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useMemo } from "react";
import BoardHeader from "@/features/caspi-playground/board/components/BoardHeader";
import { testBoards } from "@/features/caspi-playground/board/data/testBoards";
import {
  generateBoardFavicon,
  updatePageTitle,
  resetPageTitle,
} from "@/lib/faviconUtils";
import { getBoardBackgroundStyle } from "@/features/caspi-playground/board/utils/backgroundUtils";
import type { BoardWithMembersDto } from "@ronmordo/contracts";

export function CaspiBoardLayout() {
  const { theme } = useTheme();

  // For now, use a default test board for the header
  // In a real app, this would come from the route params or context
  const boardData: BoardWithMembersDto = useMemo(
    () => ({
      ...testBoards.mountain, // Default to mountain for now
      members: [
        {
          boardId: testBoards.mountain.id,
          userId: "550e8400-e29b-41d4-a716-446655440000",
          role: "admin",
          joinedAt: "2024-01-15T10:30:00.000Z",
          user: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            clerkId: "user_2abc123def456",
            email: "john.doe@example.com",
            username: "johndoe",
            fullName: "John Doe",
            avatarUrl: "/src/assets/background-3-hd.webp",
            theme: "dark",
            emailNotification: true,
            pushNotification: true,
            createdAt: "2024-01-15T10:30:00.000Z",
            bio: "Product Manager at TechCorp",
          },
        },
        {
          boardId: testBoards.mountain.id,
          userId: "550e8400-e29b-41d4-a716-446655440001",
          role: "member",
          joinedAt: "2024-01-16T10:30:00.000Z",
          user: {
            id: "550e8400-e29b-41d4-a716-446655440001",
            clerkId: "user_2def456ghi789",
            email: "jane.smith@example.com",
            username: "janesmith",
            fullName: "Jane Smith",
            avatarUrl: "/src/assets/background-1-hd.webp",
            theme: "light",
            emailNotification: true,
            pushNotification: false,
            createdAt: "2024-01-16T10:30:00.000Z",
            bio: "Frontend Developer",
          },
        },
      ],
    }),
    []
  );

  // Dynamic title and favicon based on board
  useEffect(() => {
    if (boardData) {
      // Update page title
      updatePageTitle(boardData);

      // Update favicon
      generateBoardFavicon(boardData);
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      resetPageTitle();
    };
  }, [boardData]);

  // Transform board members data for the header
  const members =
    boardData.members?.map((member) => ({
      id: member.user.id,
      name: member.user.fullName || member.user.email,
      avatar: member.user.avatarUrl,
      isAdmin: member.role === "admin",
    })) || [];

  return (
    <div
      className="h-screen w-full flex flex-col"
      style={getBoardBackgroundStyle(
        boardData.background,
        theme === "system" ? "dark" : theme
      )}
    >
      {/* Navbar */}
      <Navbar />

      {/* Board Header */}
      <BoardHeader boardName={boardData.name} members={members} />

      {/* Main content area - Outlet for board content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
