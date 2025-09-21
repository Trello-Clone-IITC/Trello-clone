// import { Navbar } from "@/features/navbar";
// import { Outlet } from "react-router-dom";
// import { useTheme } from "@/hooks/useTheme";
// import { useEffect, useMemo } from "react";
// import BoardHeader from "@/features/final-aiman/board/components/BoardHeader";
// import {
//   generateBoardFavicon,
//   updatePageTitle,
//   resetPageTitle,
// } from "@/lib/faviconUtils";
// import { getBoardBackgroundStyle } from "@/features/caspi-playground/board/utils/backgroundUtils";
// import type { BoardWithMembersDto } from "@ronmordo/contracts";

// export function CaspiBoardLayout() {
//   const { theme } = useTheme();

//   // Dynamic title and favicon based on board
//   useEffect(() => {
//     if (boardData) {
//       // Update page title
//       updatePageTitle(boardData);

//       // Update favicon
//       generateBoardFavicon(boardData);
//     }

//     // Cleanup function to reset title when component unmounts
//     return () => {
//       resetPageTitle();
//     };
//   }, [boardData]);

//   // Transform board members data for the header
//   const members =
//     boardData.members?.map((member) => ({
//       id: member.user.id,
//       name: member.user.fullName || member.user.email,
//       avatar: member.user.avatarUrl,
//       isAdmin: member.role === "admin",
//     })) || [];

//   return (
//     <div
//       className="h-screen w-full flex flex-col"
//       style={getBoardBackgroundStyle(
//         boardData.background,
//         theme === "system" ? "dark" : theme
//       )}
//     >
//       {/* Navbar */}
//       <Navbar />

//       {/* Board Header */}
//       <BoardHeader boardName={boardData.name} members={members} />

//       {/* Main content area - Outlet for board content */}
//       <main className="flex-1 overflow-hidden">
//         <Outlet />
//       </main>
//     </div>
//   );
// }
