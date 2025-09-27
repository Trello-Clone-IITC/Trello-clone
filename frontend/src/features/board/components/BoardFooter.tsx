import { cn } from "@/lib/utils";
import { Inbox, Calendar, Layout, Layers } from "lucide-react";
import { AIButton } from "@/features/ai";

interface BoardFooterProps {
  activeComponents: { inbox: boolean; planner: boolean; board: boolean };
  onTabChange?: (tab: "inbox" | "planner" | "board" | "switch-boards") => void;
  boardId?: string;
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
  boardId,
}: BoardFooterProps) {
  return (
    <nav className="flex fixed z-1 right-0 left-0 items-end justify-center h-0 gap-2 pointer-events-none bottom-4">
      {/* Main navigation items */}
      <div className="flex p-1.5 border border-[#313133] shadow-md gap-1.5 pointer-events-auto rounded-lg bg-[#1a1a1a] light:bg-white">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          // Determine if this component is active
          const isActive =
            (item.id === "inbox" && activeComponents.inbox) ||
            (item.id === "planner" && activeComponents.planner) ||
            (item.id === "board" && activeComponents.board);

          // Disable toggling if it's the only active component
          const isDisabled =
            isActive &&
            ((item.id === "inbox" &&
              !activeComponents.board &&
              !activeComponents.planner) ||
              (item.id === "planner" &&
                !activeComponents.board &&
                !activeComponents.inbox) ||
              (item.id === "board" &&
                !activeComponents.inbox &&
                !activeComponents.planner));

          return (
            <div key={item.id} role="presentation" className="relative">
              <button
                onClick={() => onTabChange?.(item.id)}
                disabled={isDisabled}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
                  isDisabled
                    ? "bg-[#1c2b42] text-[#5786ce] cursor-not-allowed opacity-75"
                    : isActive
                    ? "bg-[#1c2b42] text-[#669df1] hover:bg-[#123263] hover:text-[#5786ce] cursor-pointer light:bg-[#e9f2fe] light:hover:bg-[#cfe1fd] light:text-[#1868db]"
                    : "text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer light:text-[#292a2e] light:hover:bg-[#dddedd]"
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
              {/* Blue indicator bar for active tab */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-[#669df1] rounded-full light:bg-[#1868db]"></div>
              )}
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
                "text-gray-300 hover:text-white hover:bg-white/10 light:text-[#292a2e] light:hover:bg-[#dddedd]"
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

      {/* AI Assistant Button */}
      <div className="pointer-events-auto">
        <AIButton boardId={boardId} variant="floating" className="ml-4" />
      </div>
    </nav>
  );
}
