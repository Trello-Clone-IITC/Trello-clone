import { Navbar } from "@/features/navbar";
import { Outlet } from "react-router-dom";

export function BoardLayout() {
  // Transform board members data for the header

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Board Header */}
      {/* <BoardHeader boardName={boardData.name} members={members} /> */}

      {/* Main content area - Outlet for board content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
      {/* BOARDFOOTER */}
    </div>
  );
}
