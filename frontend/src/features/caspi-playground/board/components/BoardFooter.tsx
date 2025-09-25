import { cn } from "@/lib/utils";
import { Inbox, Calendar, Layout, Layers } from "lucide-react";

interface BoardFooterProps {
  activeComponents: { inbox: boolean; board: boolean };
  onTabChange?: (tab: "inbox" | "planner" | "board" | "switch-boards") => void;
}

const navigationItems = [
  {
    id: "inbox" as const,
    label: "Inbox",
    icon: Inbox,
  },
  {
    id: "planner" as const,
    label: "Planner",
    icon: Calendar,
  },
  {
    id: "board" as const,
    label: "Board",
    icon: Layout,
  },
];

const switchBoardsItem = {
  id: "switch-boards" as const,
  label: "Switch boards",
  icon: Layers,
};

export default function BoardFooter({
  activeComponents,
  onTabChange,
}: BoardFooterProps) {
  return (
    <nav className="flex fixed z-1 right-0 left-0 items-end justify-center h-0 gap-2 pointer-events-none bottom-4">
      {/* Main navigation items */}
      <div className="flex p-1.5 border border-[#313133] shadow-md gap-1.5 pointer-events-auto rounded-lg bg-[#1a1a1a]">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          // Determine if this component is active (planner is never active)
          const isActive =
            (item.id === "inbox" && activeComponents.inbox) ||
            (item.id === "board" && activeComponents.board);

          // Disable toggling if it's the only active component, or if it's planner (not implemented yet)
          const isDisabled =
            (isActive &&
              ((item.id === "inbox" && !activeComponents.board) ||
                (item.id === "board" && !activeComponents.inbox))) ||
            item.id === "planner"; // Disable planner for now

          return (
            <div key={item.id} role="presentation">
              <button
                onClick={() => onTabChange?.(item.id)}
                disabled={isDisabled}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                  item.id === "planner"
                    ? "text-gray-500 cursor-not-allowed opacity-60"
                    : isDisabled
                    ? "bg-[#1c2b42] text-[#5786ce] cursor-not-allowed opacity-75"
                    : isActive
                    ? "bg-[#1c2b42] text-[#5786ce] hover:bg-[#123263] hover:text-[#415b84] cursor-pointer"
                    : "text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                )}
                role="checkbox"
                aria-checked={isActive}
                aria-label={item.label}
              >
                <span className="flex items-center justify-center w-4 h-4">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </div>
          );
        })}

        {/* Separator */}
        <div
          className="w-px h-6 bg-[#313133] mx-2 self-center"
          role="separator"
        ></div>

        {/* Switch boards section */}
        <div className="flex items-center">
          <div role="presentation">
            <button
              onClick={() => onTabChange?.(switchBoardsItem.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                "text-gray-300 hover:text-white hover:bg-white/10"
              )}
              role="checkbox"
              aria-checked={false}
              aria-label={switchBoardsItem.label}
            >
              <span className="flex items-center justify-center w-4 h-4">
                <Layers className="w-4 h-4" />
              </span>
              <span className="text-sm font-medium">
                {switchBoardsItem.label}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
