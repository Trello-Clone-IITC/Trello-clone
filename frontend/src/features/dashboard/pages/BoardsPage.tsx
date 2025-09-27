import * as Icons from "@/assets";
import { useTheme } from "@/hooks/useTheme";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserWorkspaces } from "../index";
import { WorkspaceBoards } from "../components/WorkspaceBoards";
import { useEffect } from "react";
import { resetPageTitle } from "@/lib/faviconUtils";
import { AIButton } from "@/features/ai";

export default function BoardsPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { data: workspaces, isLoading, error } = useUserWorkspaces();

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

  const buttonTextColor = isLight ? "text-[#292a2e]" : "text-[#bfc1c4]";

  // For now, we'll hide starred and recently viewed sections since we don't have
  // a way to collect all boards across workspaces efficiently
  // In a real implementation, you'd have separate API endpoints for these
  const starredBoards: never[] = [];
  const recentlyViewedBoards: never[] = [];

  return (
    <div className="space-y-6">
      {/* AI Assistant floating button for dashboard (no boardId so it can create boards) */}
      <AIButton variant="floating" />
      {/* Starred Boards Section - Only show if there are starred boards */}
      {starredBoards.length > 0 && (
        <section className="max-w-[1266px] pb-6">
          <div
            className={`flex items-center gap-2 font-bold text-[16px] ${buttonTextColor} mb-4`}
          >
            <img src={starIcon} alt="Star" className="w-6 h-6" />
            <span>Starred boards</span>
          </div>
          <div
            className="
            grid 
            [grid-template-columns:repeat(auto-fill,minmax(272px,1fr))]
            gap-y-[8px] 
            gap-x-[8px]
          "
          >
            {/* Starred boards will be rendered here when implemented */}
          </div>
        </section>
      )}
      {/* Recently Viewed Section - Only show if there are recently viewed boards */}
      {recentlyViewedBoards.length > 0 && (
        <section className="max-w-[1266px] pb-6">
          <div
            className={`flex items-center gap-2 font-bold text-[16px] ${buttonTextColor} mb-4`}
          >
            <img src={clockIcon} alt="Clock" className="w-6 h-6" />
            <span>Recently viewed</span>
          </div>
          <div
            className="
            grid 
            [grid-template-columns:repeat(auto-fill,minmax(272px,1fr))]
            gap-y-[8px] 
            gap-x-[8px]
          "
          >
            {/* Recently viewed boards will be rendered here when implemented */}
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
          <div className="space-y-4">
            {workspaces.map((workspace, index) => (
              <WorkspaceBoards
                key={workspace.id}
                workspace={workspace}
                index={index}
                isLight={isLight}
                buttonTextColor={buttonTextColor}
              />
            ))}
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
