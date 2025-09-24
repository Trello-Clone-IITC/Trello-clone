import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X } from "lucide-react";

type UserInfo = {
  fullName: string;
  username?: string | null;
  avatarUrl?: string | null;
};

export function UserModal({
  trigger,
  user,
  onRemove,
  children,
}: {
  trigger: React.ReactNode;
  user: UserInfo;
  onRemove?: () => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const initials = (user.fullName || user.username || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 bg-[#2b2c2f] border-0 rounded-lg overflow-hidden"
        align="start"
        side="bottom"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-[#6a9cf8] text-white relative">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-teal-600 flex items-center justify-center text-lg font-bold">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName || user.username || "user"}
                className="w-12 h-12 object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {user.fullName || user.username}
            </div>
            {user.username ? (
              <div className="text-xs opacity-90 truncate">
                @{user.username}
              </div>
            ) : null}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 w-6 h-6 flex items-center justify-center rounded hover:bg-white/20"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="bg-[#1f2123]">
          <button
            type="button"
            className="w-full text-left px-4 py-3 text-sm text-[#bfc1c4] hover:bg-[#32373c]"
          >
            View profile
          </button>
          <div className="h-px bg-[#3a3d42] mx-4" />
          <button
            type="button"
            onClick={onRemove}
            className="w-full text-left px-4 py-3 text-sm text-[#bfc1c4] hover:bg-[#32373c]"
          >
            Remove from card
          </button>
        </div>

        {/* Custom content (e.g., "View members board activity") */}
        {/* {children} */}
      </PopoverContent>
    </Popover>
  );
}

export default UserModal;
