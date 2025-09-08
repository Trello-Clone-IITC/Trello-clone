import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useUserWorkspaces } from "../hooks/useUserWorkspaces";

// Custom SVG Icons
const HomeIcon: React.FC<{ className?: string; isActive?: boolean }> = ({
  className,
  isActive,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="Layer_1"
    data-name="Layer 1"
    viewBox="0 0 24 24"
    width="512"
    height="512"
    className={className}
  >
    <path
      fill={isActive ? "#579dff" : "#9fadbc"}
      d="m24,12c0,.552-.447,1-1,1h-2.466c-.452,0-.849.305-.966.74l-1.677,6.242c-.191.625-.725,1.018-1.341,1.018h-.017c-.623-.007-1.155-.415-1.324-1.014l-3.274-13.226-3.178,11.239c-.191.597-.69.976-1.28.999-.612.033-1.119-.315-1.345-.862l-1.6-4.474c-.143-.396-.521-.663-.942-.663H1c-.553,0-1-.448-1-1s.447-1,1-1h2.591c1.264,0,2.398.799,2.825,1.989l.938,2.626,3.284-11.615c.201-.625.727-1.027,1.361-1,.618.011,1.146.418,1.315,1.012l3.259,13.166,1.062-3.956c.351-1.308,1.542-2.222,2.897-2.222h2.466c.553,0,1,.448,1,1Z"
    />
  </svg>
);

const BoardsIcon: React.FC<{ className?: string; isActive?: boolean }> = ({
  className,
  isActive,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    version="1.1"
    id="Capa_1"
    x="0px"
    y="0px"
    viewBox="0 0 24 24"
    xmlSpace="preserve"
    width="512"
    height="512"
    className={className}
  >
    <path
      fill={isActive ? "#579dff" : "#9fadbc"}
      style={{ fillRule: "evenodd", clipRule: "evenodd" }}
      d="M21.151,0.008H2.853c-0.756,0-1.481,0.3-2.016,0.834  C0.302,1.376,0.001,2.101,0,2.857c0,0,0,18.25,0,18.271c0,0.753,0.3,1.491,0.831,2.025c0.528,0.53,1.275,0.84,2.022,0.84  c0,0,18.274,0,18.298,0c0.748,0,1.493-0.312,2.019-0.841c0.529-0.532,0.833-1.274,0.83-2.023V2.857  c-0.001-0.755-0.302-1.479-0.836-2.013C22.63,0.309,21.906,0.009,21.151,0.008z M10.351,17.283c0,0.253-0.104,0.497-0.283,0.675  c-0.181,0.179-0.424,0.275-0.678,0.275c0,0-3.999,0-3.999,0c-0.251-0.001-0.492-0.101-0.669-0.28  c-0.177-0.178-0.277-0.419-0.277-0.67v-11.9c0-0.251,0.1-0.492,0.277-0.67c0.177-0.178,0.418-0.278,0.669-0.28h3.999  c0.252,0.001,0.492,0.101,0.67,0.279c0.178,0.178,0.278,0.419,0.279,0.67C10.339,5.383,10.351,17.282,10.351,17.283z M19.578,11.819  c0.001,0.253-0.102,0.498-0.282,0.676c-0.176,0.174-0.432,0.277-0.679,0.274h-3.999c-0.252-0.001-0.493-0.101-0.67-0.279  c-0.178-0.178-0.278-0.419-0.279-0.67V5.383c0.001-0.252,0.101-0.493,0.279-0.67c0.178-0.178,0.419-0.278,0.67-0.279h3.999  c0.251,0.001,0.492,0.102,0.669,0.28c0.177,0.178,0.277,0.419,0.277,0.67C19.563,5.383,19.578,11.819,19.578,11.819z"
    />
  </svg>
);

const TemplatesIcon: React.FC<{ className?: string; isActive?: boolean }> = ({
  className,
  isActive,
}) => (
  <div className="relative group">
    {/* Background icon - dashed kanban outline only */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={isActive ? "#579dff" : "#9fadbc"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="2,2"
      className={cn("absolute -left-1 -top-1", className)}
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
      width="512"
      height="512"
      className={cn("relative z-10", className)}
    >
      <path
        fill={isActive ? "#579dff" : "#9fadbc"}
        style={{ fillRule: "evenodd", clipRule: "evenodd" }}
        d="M21.151,0.008H2.853c-0.756,0-1.481,0.3-2.016,0.834  C0.302,1.376,0.001,2.101,0,2.857c0,0,0,18.25,0,18.271c0,0.753,0.3,1.491,0.831,2.025c0.528,0.53,1.275,0.84,2.022,0.84  c0,0,18.274,0,18.298,0c0.748,0,1.493-0.312,2.019-0.841c0.529-0.532,0.833-1.274,0.83-2.023V2.857  c-0.001-0.755-0.302-1.479-0.836-2.013C22.63,0.309,21.906,0.009,21.151,0.008z M10.351,17.283c0,0.253-0.104,0.497-0.283,0.675  c-0.181,0.179-0.424,0.275-0.678,0.275c0,0-3.999,0-3.999,0c-0.251-0.001-0.492-0.101-0.669-0.28  c-0.177-0.178-0.277-0.419-0.277-0.67v-11.9c0-0.251,0.1-0.492,0.277-0.67c0.177-0.178,0.418-0.278,0.669-0.28h3.999  c0.252,0.001,0.492,0.101,0.67,0.279c0.178,0.178,0.278,0.419,0.279,0.67C10.339,5.383,10.351,17.282,10.351,17.283z M19.578,11.819  c0.001,0.253-0.102,0.498-0.282,0.676c-0.176,0.174-0.432,0.277-0.679,0.274h-3.999c-0.252-0.001-0.493-0.101-0.67-0.279  c-0.178-0.178-0.278-0.419-0.279-0.67V5.383c0.001-0.252,0.101-0.493,0.279-0.67c0.178-0.178,0.419-0.278,0.67-0.279h3.999  c0.251,0.001,0.492,0.102,0.669,0.28c0.177,0.178,0.277,0.419,0.277,0.67C19.563,5.383,19.578,11.819,19.578,11.819z"
      />
      {/* Inner columns with solid color */}
      <path
        className={cn(
          "transition-colors",
          isActive
            ? "fill-[#579dff]"
            : "fill-[#1d2125] group-hover:fill-[#333c43]"
        )}
        d="M10.351,17.283c0,0.253-0.104,0.497-0.283,0.675  c-0.181,0.179-0.424,0.275-0.678,0.275c0,0-3.999,0-3.999,0c-0.251-0.001-0.492-0.101-0.669-0.28  c-0.177-0.178-0.277-0.419-0.277-0.67v-11.9c0-0.251,0.1-0.492,0.277-0.67c0.177-0.178,0.418-0.278,0.669-0.28h3.999  c0.252,0.001,0.492,0.101,0.67,0.279c0.178,0.178,0.278,0.419,0.279,0.67C10.339,5.383,10.351,17.282,10.351,17.283z M19.578,11.819  c0.001,0.253-0.102,0.498-0.282,0.676c-0.176,0.174-0.432,0.277-0.679,0.274h-3.999c-0.252-0.001-0.493-0.101-0.67-0.279  c-0.178-0.178-0.278-0.419-0.279-0.67V5.383c0.001-0.252,0.101-0.493,0.279-0.67c0.178-0.178,0.419-0.278,0.67-0.279h3.999  c0.251,0.001,0.492,0.102,0.669,0.28c0.177,0.178,0.277,0.419,0.277,0.67C19.563,5.383,19.578,11.819,19.578,11.819z"
      />
    </svg>
  </div>
);

const navigationItems = [
  { name: "Boards", href: "/boards", icon: BoardsIcon, current: true },
  {
    name: "Templates",
    href: "/templates",
    icon: TemplatesIcon,
    current: false,
  },
  { name: "Home", href: "/", icon: HomeIcon, current: false },
];

const getWorkspaceDisplayProps = (name: string, index: number) => {
  const initial = name.charAt(0).toUpperCase();
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-orange-500",
  ];
  return {
    initial,
    color: colors[index % colors.length],
  };
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { data: workspaces, isLoading, error } = useUserWorkspaces();

  return (
    <div
      className="flex h-full w-64 flex-col border-r border-gray-700 pl-8"
      style={{ backgroundColor: "#1d2125" }}
    >
      {/* Main Navigation */}
      <div className="flex-1 flex flex-col pt-3 pb-4 overflow-y-auto">
        <nav className="mt-2 h-48 px-2 space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive ? "text-blue-700" : "hover:text-gray-900"
                )}
                style={{
                  color: isActive ? "#579dff" : "#b6c2cf",
                  backgroundColor: isActive ? "#1c2b41" : undefined,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#333c43";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  )}
                  isActive={isActive}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <Separator className="mb-2" />

        {/* Workspaces Section */}
        <div className="px-2">
          <div className="flex items-center justify-between py-2 w-full text-[#9aa7b6] text-xs font-semibold">
            Workspaces
          </div>

          <nav className="space-y-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2
                  className="h-4 w-4 animate-spin"
                  style={{ color: "#b6c2cf" }}
                />
                <span className="ml-2 text-sm" style={{ color: "#b6c2cf" }}>
                  Loading workspaces...
                </span>
              </div>
            ) : error ? (
              <div className="text-sm text-red-400 px-2 py-2">
                Failed to load workspaces
              </div>
            ) : workspaces && workspaces.length > 0 ? (
              workspaces.map((workspace, index) => {
                const { initial, color } = getWorkspaceDisplayProps(
                  workspace.name,
                  index
                );
                return (
                  <div key={workspace.id} className="space-y-1">
                    <div className="flex items-center justify-between group">
                      <div
                        className="flex items-center flex-1 min-w-0 px-2 py-2 rounded-md transition-colors cursor-pointer"
                        style={{ color: "#b6c2cf" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#333c43";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <div
                          className={cn(
                            "flex-shrink-0 h-6 w-6 rounded flex items-center justify-center text-white text-xs font-medium",
                            color
                          )}
                        >
                          {initial}
                        </div>
                        <span className="ml-3 text-sm font-medium truncate flex-1">
                          {workspace.name}
                        </span>
                        <ChevronDown
                          className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: "#b6c2cf" }}
                        />
                      </div>
                    </div>

                    {/* Workspace Boards - for now just show placeholder */}
                    <div className="ml-9 space-y-1">
                      <div className="text-xs text-gray-500 px-2 py-1">
                        No boards yet
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-gray-500 px-2 py-2">
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
