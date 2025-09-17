import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useUserWorkspaces } from "../hooks/useUserWorkspaces";
import { useTheme } from "@/hooks/useTheme";
import * as Icons from "../../../assets";
import { getWorkspaceDisplayProps } from "@/lib/workspaceUtils";

// Custom SVG Icons
const HomeIcon: React.FC<{
  className?: string;
  isActive?: boolean;
  isLight?: boolean;
}> = ({ isActive, isLight = false }) => {
  const getFillColor = () => {
    if (isActive) return isLight ? "#186de5" : "#579dff";
    return isLight ? "#292a2e" : "#bfc1c4";
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_1"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      className=""
    >
      <path
        fill={getFillColor()}
        d="m24,12c0,.552-.447,1-1,1h-2.466c-.452,0-.849.305-.966.74l-1.677,6.242c-.191.625-.725,1.018-1.341,1.018h-.017c-.623-.007-1.155-.415-1.324-1.014l-3.274-13.226-3.178,11.239c-.191.597-.69.976-1.28.999-.612.033-1.119-.315-1.345-.862l-1.6-4.474c-.143-.396-.521-.663-.942-.663H1c-.553,0-1-.448-1-1s.447-1,1-1h2.591c1.264,0,2.398.799,2.825,1.989l.938,2.626,3.284-11.615c.201-.625.727-1.027,1.361-1,.618.011,1.146.418,1.315,1.012l3.259,13.166,1.062-3.956c.351-1.308,1.542-2.222,2.897-2.222h2.466c.553,0,1,.448,1,1Z"
      />
    </svg>
  );
};

const BoardsIcon: React.FC<{
  className?: string;
  isActive?: boolean;
  isLight?: boolean;
}> = ({ className, isActive, isLight = false }) => {
  const getFillColor = () => {
    if (isActive) return isLight ? "#186de5" : "#579dff";
    return isLight ? "#292a2e" : "#bfc1c4";
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-4 h-4", className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5ZM5 6C5 5.44772 5.44772 5 6 5H10C10.5523 5 11 5.44772 11 6V16C11 16.5523 10.5523 17 10 17H6C5.44772 17 5 16.5523 5 16V6ZM14 5C13.4477 5 13 5.44772 13 6V12C13 12.5523 13.4477 13 14 13H18C18.5523 13 19 12.5523 19 12V6C19 5.44772 18.5523 5 18 5H14Z"
        fill={getFillColor()}
      />
    </svg>
  );
};

const TemplatesIcon: React.FC<{
  className?: string;
  isActive?: boolean;
  isLight?: boolean;
}> = ({ isActive, isLight = false }) => {
  const getStrokeColor = () => {
    if (isActive) return isLight ? "#186de5" : "#579dff";
    return isLight ? "#292a2e" : "#bfc1c4";
  };

  const getFillColor = () => {
    if (isActive) return isLight ? "#186de5" : "#579dff";
    return isLight ? "#292a2e" : "#bfc1c4";
  };

  return (
    <div className="relative group">
      {/* Background icon - dashed kanban outline only */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke={getStrokeColor()}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2,2"
        className="absolute -left-1 -top-1"
      >
        <path d="M5 3a2 2 0 0 0-2 2" />
        <path d="M3 3h14" />
        <path d="M19 3a2 2 0 0 1 2 2" />
        <path d="M21 3v14" />
        <path d="M21 19a2 2 0 0 1-2 2" />
        <path d="M5 21a2 2 0 0 1-2-2" />
        <path d="M3 21v-14" />
      </svg>
      {/* Foreground icon - Trello board */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Capa_1"
        x="0px"
        y="0px"
        viewBox="0 0 24 24"
        xmlSpace="preserve"
        width="12"
        height="12"
        className="relative z-10"
      >
        <path
          fill={getFillColor()}
          style={{ fillRule: "evenodd", clipRule: "evenodd" }}
          d="M21.151,0.008H2.853c-0.756,0-1.481,0.3-2.016,0.834  C0.302,1.376,0.001,2.101,0,2.857c0,0,0,18.25,0,18.271c0,0.753,0.3,1.491,0.831,2.025c0.528,0.53,1.275,0.84,2.022,0.84  c0,0,18.274,0,18.298,0c0.748,0,1.493-0.312,2.019-0.841c0.529-0.532,0.833-1.274,0.83-2.023V2.857  c-0.001-0.755-0.302-1.479-0.836-2.013C22.63,0.309,21.906,0.009,21.151,0.008z M10.351,17.283c0,0.253-0.104,0.497-0.283,0.675  c-0.181,0.179-0.424,0.275-0.678,0.275c0,0-3.999,0-3.999,0c-0.251-0.001-0.492-0.101-0.669-0.28  c-0.177-0.178-0.277-0.419-0.277-0.67v-11.9c0-0.251,0.1-0.492,0.277-0.67c0.177-0.178,0.418-0.278,0.669-0.28h3.999  c0.252,0.001,0.492,0.101,0.67,0.279c0.178,0.178,0.278,0.419,0.279,0.67C10.339,5.383,10.351,17.282,10.351,17.283z M19.578,11.819  c0.001,0.253-0.102,0.498-0.282,0.676c-0.176,0.174-0.432,0.277-0.679,0.274h-3.999c-0.252-0.001-0.493-0.101-0.67-0.279  c-0.178-0.178-0.278-0.419-0.279-0.67V5.383c0.001-0.252,0.101-0.493,0.279-0.67c0.178-0.178,0.419-0.278,0.67-0.279h3.999  c0.251,0.001,0.492,0.102,0.669,0.28c0.177,0.178,0.277,0.419,0.277,0.67C19.563,5.383,19.578,11.819,19.578,11.819z"
        />
        {/* Inner columns with solid color */}
        <path
          className={cn(
            "transition-colors",
            isActive
              ? isLight
                ? "fill-[#186de5]"
                : "fill-[#579dff]"
              : isLight
              ? "fill-[#ffffff] group-hover:fill-[#dcdfe4]"
              : "fill-[#1f1f21] group-hover:fill-[#333c43]"
          )}
          d="M10.351,17.283c0,0.253-0.104,0.497-0.283,0.675  c-0.181,0.179-0.424,0.275-0.678,0.275c0,0-3.999,0-3.999,0c-0.251-0.001-0.492-0.101-0.669-0.28  c-0.177-0.178-0.277-0.419-0.277-0.67v-11.9c0-0.251,0.1-0.492,0.277-0.67c0.177-0.178,0.418-0.278,0.669-0.28h3.999  c0.252,0.001,0.492,0.101,0.67,0.279c0.178,0.178,0.278,0.419,0.279,0.67C10.339,5.383,10.351,17.282,10.351,17.283z M19.578,11.819  c0.001,0.253-0.102,0.498-0.282,0.676c-0.176,0.174-0.432,0.277-0.679,0.274h-3.999c-0.252-0.001-0.493-0.101-0.67-0.279  c-0.178-0.178-0.278-0.419-0.279-0.67V5.383c0.001-0.252,0.101-0.493,0.279-0.67c0.178-0.178,0.419-0.278,0.67-0.279h3.999  c0.251,0.001,0.492,0.102,0.669,0.28c0.177,0.178,0.277,0.419,0.277,0.67C19.563,5.383,19.578,11.819,19.578,11.819z"
        />
      </svg>
    </div>
  );
};

const navigationItems = [
  { name: "Boards", href: "/boards", icon: BoardsIcon },
  {
    name: "Templates",
    href: "/templates",
    icon: TemplatesIcon,
  },
  { name: "Home", href: "/", icon: HomeIcon },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { data: workspaces, isLoading, error } = useUserWorkspaces();
  const [openWorkspaces, setOpenWorkspaces] = useState<Set<string>>(new Set());
  const { theme } = useTheme();

  const isLight = theme === "light";

  const displayWorkspaces = workspaces;

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col pl-8 min-w-[288px]",
        isLight ? "bg-white" : "bg-[#1f1f21]"
      )}
    >
      {/* Main Navigation */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex flex-col w-full pt-10 border-b-1 border-b-[#37373a] ">
          <ul className="flex flex-col gap-[1px]">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name} className="flex mb-1">
                  <Link
                    to={item.href}
                    className={cn(
                      "group flex items-center gap-2 text-sm font-medium rounded-md transition-colors px-2 py-1.5 w-full",
                      isActive
                        ? isLight
                          ? "text-[#186de5] bg-[#e9f2ff]"
                          : "text-[#579dff] bg-[#1c2b41]"
                        : isLight
                        ? "text-[#292a2e] hover:bg-[#dcdfe4]"
                        : "text-[#bfc1c4] hover:bg-[#333c43]"
                    )}
                  >
                    <span className="flex items-center">
                      <span className="flex items-center justify-center w-6 h-6">
                        <item.icon
                          className="w-4 h-4"
                          isActive={isActive}
                          isLight={isLight}
                        />
                      </span>
                    </span>
                    <span className="flex items-center">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Workspaces Section */}
        <div className="py-4">
          <div
            className={cn(
              "flex items-center justify-between py-2 w-full text-xs font-semibold",
              isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
            )}
          >
            Workspaces
          </div>

          <nav className="space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2
                  className={cn(
                    "h-4 w-4 animate-spin",
                    isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
                  )}
                />
                <span
                  className={cn(
                    "ml-2 text-sm",
                    isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
                  )}
                >
                  Loading workspaces...
                </span>
              </div>
            ) : error ? (
              <div className="text-sm text-red-400 px-2 py-2">
                Failed to load workspaces
              </div>
            ) : displayWorkspaces && displayWorkspaces.length > 0 ? (
              displayWorkspaces.map((workspace, index) => {
                const { initial, color } = getWorkspaceDisplayProps(
                  workspace.name,
                  index,
                  isLight
                );
                const isOpen = openWorkspaces.has(workspace.id);

                return (
                  <Collapsible
                    key={workspace.id}
                    open={isOpen}
                    onOpenChange={(open) => {
                      setOpenWorkspaces((prev) => {
                        const newSet = new Set(prev);
                        if (open) {
                          newSet.add(workspace.id);
                        } else {
                          newSet.delete(workspace.id);
                        }
                        return newSet;
                      });
                    }}
                  >
                    <div className="flex flex-col items-stretch gap-0.5 justify-center">
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between group">
                          <div
                            className={cn(
                              "flex items-center flex-1 min-w-0 px-2 py-1.5 rounded-md transition-colors cursor-pointer",
                              isLight
                                ? "text-[#292a2e] hover:bg-[#dcdfe4]"
                                : "text-[#bfc1c4] hover:bg-[#37373a]"
                            )}
                          >
                            <div
                              className={cn(
                                `flex-shrink-0 h-6 w-6 rounded flex items-center justify-center text-xs font-medium  `,
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
                            <span className="ml-3 text-sm font-medium truncate flex-1">
                              {workspace.name}
                            </span>
                            {isOpen ? (
                              <ChevronUp
                                className={cn(
                                  "h-4 w-4 opacity-100 transition-opacity",
                                  isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
                                )}
                              />
                            ) : (
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 opacity-100 transition-opacity",
                                  isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
                                )}
                              />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="ml-9 space-y-0.5">
                          {/* Boards */}
                          <div
                            className={cn(
                              "flex items-center px-2 py-1.5 rounded-md transition-colors cursor-pointer hover:bg-opacity-50",
                              isLight
                                ? "text-[#292a2e] hover:bg-[#dcdfe4]"
                                : "text-[#bfc1c4] hover:bg-[#37373a]"
                            )}
                          >
                            <BoardsIcon
                              className="mr-2 w-3 h-3"
                              isActive={false}
                              isLight={isLight}
                            />
                            <span className="text-xs font-medium">Boards</span>
                          </div>

                          {/* Members */}
                          <div
                            className={cn(
                              "flex items-center justify-between px-2 py-1.5 rounded-md transition-colors cursor-pointer hover:bg-opacity-50",
                              isLight
                                ? "text-[#292a2e] hover:bg-[#dcdfe4]"
                                : "text-[#bfc1c4] hover:bg-[#37373a]"
                            )}
                          >
                            <div className="flex items-center">
                              <img
                                src={
                                  isLight
                                    ? Icons.peopleLightIcon
                                    : Icons.peopleIcon
                                }
                                alt="Members"
                                className="mr-2 h-3 w-3"
                              />
                              <span className="text-xs font-medium">
                                Members
                              </span>
                            </div>
                            <Plus className="h-3 w-3 opacity-60" />
                          </div>

                          {/* Settings */}
                          <div
                            className={cn(
                              "flex items-center px-2 py-1.5 rounded-md transition-colors cursor-pointer hover:bg-opacity-50",
                              isLight
                                ? "text-[#292a2e] hover:bg-[#dcdfe4]"
                                : "text-[#bfc1c4] hover:bg-[#37373a]"
                            )}
                          >
                            <img
                              src={
                                isLight
                                  ? Icons.gearwheelLightIcon
                                  : Icons.gearwheelIcon
                              }
                              alt="Settings"
                              className="mr-2 h-3 w-3"
                            />
                            <span className="text-xs font-medium">
                              Settings
                            </span>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })
            ) : (
              <div
                className={cn(
                  "text-sm px-2 py-2",
                  isLight ? "text-[#292a2e]" : "text-[#bfc1c4]"
                )}
              >
                No workspaces found
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
