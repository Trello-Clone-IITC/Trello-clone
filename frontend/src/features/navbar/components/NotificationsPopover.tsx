import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EllipsisVertical } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function NotificationsPopover({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [open, setOpen] = useState(false);
  const [onlyUnread, setOnlyUnread] = useState(true);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="p-0 w-[480px] max-h-[70vh] overflow-hidden rounded-[8px] border-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        style={{
          backgroundColor: isLight ? "#ffffff" : "#2b2c2f",
          boxShadow:
            "0px 0px 0px 1px #BDBDBD1F, 0px 8px 12px #0104045C, 0px 0px 1px 1px #01040480",
        }}
      >
        {/* Header */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <h2
            className="text-[16px] font-semibold"
            style={{ color: isLight ? "#172b4d" : "#cecfd2" }}
          >
            Notifications
          </h2>
          <div className="flex items-center gap-3">
            <label
              htmlFor="notif-unread"
              className="text-sm"
              style={{ color: isLight ? "#626f86" : "#abadb0" }}
            >
              Only show unread
            </label>
            <button
              id="notif-unread"
              aria-pressed={onlyUnread}
              onClick={() => setOnlyUnread((v) => !v)}
              className={`relative inline-flex items-center h-[20px] w-[36px] rounded-full transition-colors duration-200 ${
                onlyUnread ? "bg-[#94c748]" : "bg-[#6b778c]"
              }`}
            >
              {/* Left checkmark when ON */}
              <svg
                viewBox="0 0 24 24"
                className={`absolute left-[3px] h-[14px] w-[14px] transition-opacity duration-200 ${
                  onlyUnread ? "opacity-100" : "opacity-0"
                }`}
                style={{ color: "#1F1F21" }}
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M9.3 16.2 5.6 12.5a1 1 0 0 1 1.4-1.4l2.3 2.3 5.7-5.7a1 1 0 1 1 1.4 1.4l-7.1 7.1a1 1 0 0 1-1.4 0Z"
                />
              </svg>
              <span
                className={`inline-block h-[16px] w-[16px] rounded-full bg-white transform transition-transform duration-200 ${
                  onlyUnread ? "translate-x-[18px]" : "translate-x-[2px]"
                }`}
                style={{ backgroundColor: "#1f1f21" }}
              />
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              style={{ color: isLight ? "#172b4d" : "#abadb0" }}
            >
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className={isLight ? "bg-[#dcdfe4]" : "bg-[#3d3f43]"} />

        {/* Body */}
        <div className="p-6 flex items-center justify-center">
          <div className="flex flex-col items-center text-center gap-3">
            <img
              src="https://trello.com/assets/ee2660df9335718b1a80.svg"
              alt="Taco"
              className="w-[96px] h-[96px] opacity-80"
            />
            <h3
              className="text-base font-medium"
              style={{ color: isLight ? "#172b4d" : "#cecfd2" }}
            >
              {onlyUnread ? "No unread notifications" : "No notifications"}
            </h3>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
