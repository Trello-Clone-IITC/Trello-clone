import * as Icons from "../../../assets";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWorkspaceDisplayProps } from "@/lib/workspaceUtils";
import { BoardCard, CreateNewBoard, useUserWorkspaces } from "../index";
import { useAllBoards } from "@/features/board/hooks/useBoard";
import { useEffect } from "react";
import { resetPageTitle } from "@/lib/faviconUtils";

export default function BoardsPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { data: workspaces, isLoading, error } = useUserWorkspaces();
  const { data: allBoards } = useAllBoards();

  // Set page title and reset favicon to default
  useEffect(() => {
    document.title = "Boards | Trello";

    // Reset favicon to default
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
      existingFavicon.remove();
    }

    // Set default favicon (same as in HTML)
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = "/favicon.svg";
    document.head.appendChild(link);

    // Cleanup function to reset title when component unmounts
    return () => {
      resetPageTitle();
    };
  }, []);

  const starIcon = isLight ? Icons.starIconLight : Icons.starIconDark;
  const clockIcon = isLight ? Icons.clockIconLight : Icons.clockIconDark;
  const boardsIcon = isLight ? Icons.boardsIconLight : Icons.boardsIconDark;
  const membersIcon = isLight ? Icons.membersIconLight : Icons.membersIconDark;
  const gearwheelIcon = isLight
    ? Icons.gearwheelIconLight
    : Icons.gearwheelIconDark;
  const upgradeIcon = isLight ? Icons.upgradeIconLight : Icons.upgradeIconDark;

  const buttonTextColor = isLight ? "text-[#292a2e]" : "text-[#bfc1c4]";

  // Filter boards for starred and recently viewed (for now, we'll use all boards as placeholder)
  // In a real implementation, you'd have starred/recently viewed properties on boards
  const starredBoards =
    allBoards?.filter(
      (board) =>
        // Placeholder logic - in real app, check board.isStarred or similar
        board.name.toLowerCase().includes("starred") ||
        board.name.toLowerCase().includes("important")
    ) || [];

  const recentlyViewedBoards =
    allBoards?.filter(
      (board) =>
        // Placeholder logic - in real app, check board.lastViewedAt or similar
        board.name.toLowerCase().includes("recent") ||
        board.name.toLowerCase().includes("new")
    ) || [];

  // Group boards by workspace
  const boardsByWorkspace =
    workspaces?.map((workspace) => ({
      ...workspace,
      boards:
        allBoards?.filter((board) => board.workspaceId === workspace.id) || [],
    })) || [];

  return (
    <div className="space-y-6">
      {/* Starred Boards Section - Only show if there are starred boards */}
      {starredBoards.length > 0 && (
        <section className="max-w-[1266px] pb-10">
          <div
            className={`flex items-center gap-2 font-bold text-[16px] ${buttonTextColor} mb-4`}
          >
            <img src={starIcon} alt="Star" className="w-6 h-6" />
            <span>Starred boards</span>
          </div>
          <div
            className="
            grid 
            [grid-template-columns:repeat(auto-fill,minmax(23%,1fr))]
            gap-y-[20px] 
            gap-x-[2%]
          "
          >
            {starredBoards.map((board) => (
              <BoardCard
                key={board.id}
                id={board.id}
                title={board.name}
                backgroundImage={board.background}
                isStarred={true}
              />
            ))}
          </div>
        </section>
      )}
      {/* Recently Viewed Section - Only show if there are recently viewed boards */}
      {recentlyViewedBoards.length > 0 && (
        <section className="max-w-[1266px] pb-10">
          <div
            className={`flex items-center gap-2 font-bold text-[16px] ${buttonTextColor} mb-4`}
          >
            <img src={clockIcon} alt="Clock" className="w-6 h-6" />
            <span>Recently viewed</span>
          </div>
          <div
            className="
            grid 
            [grid-template-columns:repeat(auto-fill,minmax(23%,1fr))]
            gap-y-[20px] 
            gap-x-[2%]
          "
          >
            {recentlyViewedBoards.map((board) => (
              <BoardCard
                key={board.id}
                id={board.id}
                title={board.name}
                backgroundImage={board.background}
              />
            ))}
          </div>
        </section>
      )}

      {/* Your Workspaces Section */}
      <section>
        <h3
          className={`text-[16px] uppercase font-bold mt-3 mb-5 ${
            isLight ? "text-[#505258]" : "text-[#a9abaf]"
          }`}
        >
          YOUR WORKSPACES
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2
              className={cn(
                "h-6 w-6 animate-spin mr-2",
                isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
              )}
            />
            <span
              className={cn(
                "text-sm",
                isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
              )}
            >
              Loading workspaces...
            </span>
          </div>
        ) : error ? (
          <div className="text-sm text-red-400 px-2 py-4">
            Failed to load workspaces
          </div>
        ) : workspaces && workspaces.length > 0 ? (
          <div className="space-y-6">
            {boardsByWorkspace.map((workspace, index) => {
              const { initial, color } = getWorkspaceDisplayProps(
                workspace.name,
                index,
                isLight
              );

              return (
                <div key={workspace.id} className="space-y-4">
                  {/* Workspace Header */}
                  <div className="flex items-center">
                    {/* Workspace Icon with gradient */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded flex items-center justify-center font-bold text-sm mr-2",
                        color
                      )}
                    >
                      <span
                        className={`${
                          isLight ? "text-[#fff]" : "text-[#1f1f21]"
                        }`}
                      >
                        {initial}
                      </span>
                    </div>
                    {/* Workspace Name */}
                    <h3
                      className={`text-[16px] font-bold self-start flex-1 mt-1 mr-2 mb-1 ml-1 pt-0.5 ${
                        isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
                      }`}
                    >
                      {workspace.name}
                    </h3>
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className={`${buttonTextColor} rounded-[3px] cursor-pointer ${
                          isLight
                            ? "bg-[#f0f1f2] hover:bg-[#dddedd]"
                            : "bg-[#2c2c2e] hover:bg-[#37373a]"
                        }`}
                      >
                        <img
                          src={boardsIcon}
                          alt="Boards"
                          className="w-4 h-4 mr-1"
                        />
                        Boards
                      </Button>
                      <Button
                        size="sm"
                        className={`${buttonTextColor} rounded-[3px] cursor-pointer ${
                          isLight
                            ? "bg-[#f0f1f2] hover:bg-[#dddedd]"
                            : "bg-[#2c2c2e] hover:bg-[#37373a]"
                        }`}
                      >
                        <img
                          src={membersIcon}
                          alt="Members"
                          className="w-4 h-4 mr-1"
                        />
                        Members
                      </Button>
                      <Button
                        size="sm"
                        className={`${buttonTextColor} rounded-[3px] cursor-pointer ${
                          isLight
                            ? "bg-[#f0f1f2] hover:bg-[#dddedd]"
                            : "bg-[#2c2c2e] hover:bg-[#37373a]"
                        }`}
                      >
                        <img
                          src={gearwheelIcon}
                          alt="Settings"
                          className="w-4 h-4 mr-1"
                        />
                        Settings
                      </Button>
                      <Button
                        size="sm"
                        className={`${buttonTextColor} rounded-[3px] cursor-pointer ${
                          isLight
                            ? "bg-[#f8eefe] hover:bg-[#eed7fc]"
                            : "bg-[#35243f] hover:bg-[#48245d]"
                        }`}
                      >
                        <div className="w-5 h-5 mr-1 rounded-[3px] bg-[#964ac0] flex items-center justify-center">
                          <img
                            src={upgradeIcon}
                            alt="Upgrade"
                            className={`w-4 h-4 ${
                              isLight ? "brightness-0 invert" : "brightness-0"
                            }`}
                            style={
                              !isLight
                                ? {
                                    filter:
                                      "brightness(0) saturate(100%) invert(8%) sepia(8%) saturate(1038%) hue-rotate(180deg) brightness(95%) contrast(89%)",
                                  }
                                : {}
                            }
                          />
                        </div>
                        Upgrade
                      </Button>
                    </div>
                  </div>

                  {/* Workspace Boards Grid */}
                  <div
                    className="
                    grid 
                    [grid-template-columns:repeat(auto-fill,minmax(23%,1fr))]
                    gap-y-[20px] 
                    gap-x-[2%]
                  "
                  >
                    {/* Show actual boards */}
                    {workspace.boards.map((board) => (
                      <BoardCard
                        key={board.id}
                        id={board.id}
                        title={board.name}
                        backgroundImage={board.background}
                      />
                    ))}
                    {/* Create Board Button */}
                    <CreateNewBoard />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className={cn(
              "text-sm px-2 py-4",
              isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
            )}
          >
            No workspaces found
          </div>
        )}
      </section>
    </div>
  );
}
