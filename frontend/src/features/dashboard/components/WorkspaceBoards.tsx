import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWorkspaceDisplayProps } from "@/lib/workspaceUtils";
import { BoardCard, CreateNewBoard } from "../index";
import { useUserBoards } from "../hooks/useUserBoards";
import { getBackgroundPreviewUrl } from "../utils/backgroundUtils";
import * as Icons from "../../../assets";
import type { WorkspaceDto } from "@ronmordo/contracts";

interface WorkspaceBoardsProps {
  workspace: WorkspaceDto;
  index: number;
  isLight: boolean;
  buttonTextColor: string;
}

export const WorkspaceBoards = ({
  workspace,
  index,
  isLight,
  buttonTextColor,
}: WorkspaceBoardsProps) => {
  const { data: boards, isLoading, error } = useUserBoards(workspace.id);

  const { initial, color } = getWorkspaceDisplayProps(
    workspace.name,
    index,
    isLight
  );

  const boardsIcon = isLight ? Icons.boardsIconLight : Icons.boardsIconDark;
  const membersIcon = isLight ? Icons.membersIconLight : Icons.membersIconDark;
  const gearwheelIcon = isLight
    ? Icons.gearwheelIconLight
    : Icons.gearwheelIconDark;
  const upgradeIcon = isLight ? Icons.upgradeIconLight : Icons.upgradeIconDark;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Workspace Header */}
        <div className="flex items-center">
          {/* Workspace Icon with gradient */}
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
              <img src={boardsIcon} alt="Boards" className="w-4 h-4 mr-1" />
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
              <img src={membersIcon} alt="Members" className="w-4 h-4 mr-1" />
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

        {/* Loading State */}
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
            Loading boards...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        {/* Workspace Header */}
        <div className="flex items-center">
          {/* Workspace Icon with gradient */}
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
          {/* Workspace Name */}
          <h3
            className={`text-[16px] font-bold self-start flex-1 mt-1 mr-2 mb-1 ml-1 pt-0.5 ${
              isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
            }`}
          >
            {workspace.name}
          </h3>
        </div>

        {/* Error State */}
        <div className="text-sm text-red-400 px-2 py-4">
          Failed to load boards for {workspace.name}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Workspace Header */}
      <div className="flex items-center">
        {/* Workspace Icon with gradient */}
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
            <img src={boardsIcon} alt="Boards" className="w-4 h-4 mr-1" />
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
            <img src={membersIcon} alt="Members" className="w-4 h-4 mr-1" />
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
            <img src={gearwheelIcon} alt="Settings" className="w-4 h-4 mr-1" />
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
        gap-x-[1%]
      "
      >
        {/* Show actual boards */}
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
        {/* Create Board Button */}
        <CreateNewBoard />
      </div>
    </div>
  );
};
