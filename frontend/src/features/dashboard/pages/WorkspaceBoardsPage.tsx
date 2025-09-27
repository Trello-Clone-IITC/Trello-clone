import { useParams } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useUserWorkspaces } from "../index";
import { BoardCard } from "../components/BoardCard";
import { useUserBoards } from "../hooks/useUserBoards";
import { getWorkspaceDisplayProps } from "@/lib/workspaceUtils";
import { getBackgroundPreviewUrl } from "../utils/backgroundUtils";
import { resetPageTitle } from "@/lib/faviconUtils";

export default function WorkspaceBoardsPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: workspaces, isLoading, error } = useUserWorkspaces();

  useEffect(() => {
    document.title = "Boards | Trello";
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) existingFavicon.remove();
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = "/favicon.svg";
    document.head.appendChild(link);
    return () => resetPageTitle();
  }, []);

  const buttonTextColor = isLight ? "text-[#292a2e]" : "text-[#bfc1c4]";

  const workspaceWithIndex = useMemo(() => {
    if (!workspaces || !workspaceId) return undefined;
    const idx = workspaces.findIndex((w) => w.id === workspaceId);
    if (idx === -1) return undefined;
    return { workspace: workspaces[idx], index: idx } as const;
  }, [workspaces, workspaceId]);

  if (isLoading) {
    return (
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
          Loading workspace...
        </span>
      </div>
    );
  }

  if (error || !workspaceWithIndex) {
    return (
      <div
        className={cn(
          "text-sm px-2 py-4",
          isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
        )}
      >
        Workspace not found
      </div>
    );
  }

  const { workspace, index } = workspaceWithIndex;
  const { initial, color } = getWorkspaceDisplayProps(
    workspace.name,
    index,
    isLight
  );
  const { data: boards } = useUserBoards(workspace.id);

  return (
    <div className="space-y-6">
      {/* Header with workspace name */}
      <div className="flex items-center">
        <div
          className={cn(
            "w-8 h-8 rounded flex items-center justify-center font-bold text-sm mr-2",
            color
          )}
        >
          <span className={`${isLight ? "text-[#fff]" : "text-[#1f1f21]"}`}>
            {initial}
          </span>
        </div>
        <h1
          className={`text-[16px] font-bold ${
            isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
          }`}
        >
          {workspace.name}
        </h1>
      </div>

      {/* Separator */}
      <div
        className={cn("h-px w-full", isLight ? "bg-[#dcdfe4]" : "bg-[#313133]")}
      />

      {/* Your boards */}
      <section className="max-w-[1266px] pb-6">
        <div
          className={`flex items-center gap-2 font-bold text-[16px] ${buttonTextColor} mb-4`}
        >
          <span>Your boards</span>
        </div>
        <div className="grid [grid-template-columns:repeat(auto-fill,minmax(272px,1fr))] gap-y-[8px] gap-x-[8px]">
          {boards?.map((board) => (
            <BoardCard
              key={board.id}
              id={board.id}
              title={board.name}
              backgroundImage={
                getBackgroundPreviewUrl(board.background) || undefined
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
