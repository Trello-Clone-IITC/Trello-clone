import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Layout,
  ChevronDown,
  SquareDashedKanban,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Mock data - in a real app, this would come from your API/state management
const workspaces = [
  {
    id: "1",
    name: "Best Workspace",
    initial: "B",
    color: "bg-blue-500",
    boards: [
      { id: "1", name: "Project Alpha", href: "/boards/1" },
      { id: "2", name: "Marketing Campaign", href: "/boards/2" },
    ],
  },
  {
    id: "2",
    name: "Trello Clone",
    initial: "T",
    color: "bg-green-500",
    boards: [
      { id: "3", name: "Development", href: "/boards/3" },
      { id: "4", name: "Design", href: "/boards/4" },
    ],
  },
  {
    id: "3",
    name: "Personal",
    initial: "P",
    color: "bg-purple-500",
    boards: [{ id: "5", name: "Personal Tasks", href: "/boards/5" }],
  },
];

const navigationItems = [
  { name: "Boards", href: "/boards", icon: Layout, current: true },
  {
    name: "Templates",
    href: "/templates",
    icon: SquareDashedKanban,
    current: false,
  },
  { name: "Home", href: "/", icon: Home, current: false },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div
      className="flex h-full w-64 flex-col border-r border-gray-700"
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
                  color: isActive ? undefined : "#b6c2cf",
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
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <Separator className="my-2" />

        {/* Workspaces Section */}
        <div className="px-2">
          <div className="flex items-center justify-between mb-2">
            <h3
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#b6c2cf" }}
            >
              Workspaces
            </h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <nav className="space-y-1">
            {workspaces.map((workspace) => (
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
                        workspace.color
                      )}
                    >
                      {workspace.initial}
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

                {/* Workspace Boards - could be collapsible */}
                <div className="ml-9 space-y-1">
                  {workspace.boards.map((board) => {
                    const isActive = location.pathname === board.href;
                    return (
                      <Link
                        key={board.id}
                        to={board.href}
                        className={cn(
                          "group flex items-center px-2 py-2 text-sm font-normal rounded-md transition-colors",
                          isActive ? "text-blue-700" : "hover:text-gray-900"
                        )}
                        style={{
                          color: isActive ? undefined : "#b6c2cf",
                          backgroundColor: isActive ? "#1c2b41" : undefined,
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = "#333c43";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }
                        }}
                      >
                        {board.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
