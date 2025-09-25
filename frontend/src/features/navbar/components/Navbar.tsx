import { Button } from "@/components/ui/button";
import { Bell, HelpCircle, Megaphone } from "lucide-react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import CreateButton from "./CreateButton";
import UserMenuPopover from "./UserMenuPopover";
import { useTheme } from "@/hooks/useTheme";
import { useAppContext } from "@/hooks/useAppContext";
const AppSwitcherIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM9 3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM1 11a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5zm6 .5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5z"
      fill="currentColor"
    />
  </svg>
);

export default function Navbar() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { navbarBorderHidden } = useAppContext();

  return (
    <nav
      className={`sticky top-0 z-50 px-2 py-2 flex items-center justify-between h-[47px] ${
        navbarBorderHidden ? "border-b-0" : "border-b-1"
      } ${
        isLight ? "bg-white border-[#dcdfe4]" : "bg-[#1f1f21] border-[#434345]"
      }`}
    >
      {/* Left Section */}
      <div className="flex items-center gap-1 md:gap-1">
        {/* App Switcher */}
        <Button
          size="icon"
          className={`h-8 w-8 bg-transparent shadow-none cursor-pointer  ${
            isLight
              ? "text-[#505258] hover:bg-[#dddedd]"
              : "text-[#a9abaf] hover:bg-[#37373a]"
          }`}
        >
          {AppSwitcherIcon()}
        </Button>

        {/* Logo */}
        <Logo />
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 flex justify-center items-center gap-2 mx-2 md:mx-4">
        <SearchBar />
        {/* Create Button - Hidden on mobile */}
        <div className="hidden sm:block">
          <CreateButton />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-[0.5px]">
        {/* Feedback Button - Hidden on mobile */}
        <Button
          size="icon"
          className={`h-8 w-8 relative bg-transparent shadow-none cursor-pointer ${
            isLight
              ? "text-[#505258] hover:bg-[#dddedd]"
              : "text-[#a9abaf] hover:bg-[#37373a]"
          }`}
        >
          <Megaphone
            className={`h-4 w-4 ${
              isLight
                ? "text-[#505258] hover:bg-[#dddedd]"
                : "text-[#a9abaf] hover:bg-[#37373a]"
            }`}
          />
        </Button>

        {/* Notifications */}
        <Button
          size="icon"
          className={`h-8 w-8 relative bg-transparent shadow-none cursor-pointer ${
            isLight
              ? "text-[#505258] hover:bg-[#dddedd]"
              : "text-[#a9abaf] hover:bg-[#37373a]"
          }`}
        >
          <Bell
            className={`h-4 w-4 ${
              isLight
                ? "text-[#505258] hover:bg-[#dddedd]"
                : "text-[#a9abaf] hover:bg-[#37373a]"
            }`}
          />
          {/* Notification badge could go here */}
        </Button>

        {/* Help - Hidden on mobile */}
        <Button
          size="icon"
          className={`h-8 w-8 bg-transparent relative shadow-none cursor-pointer ${
            isLight
              ? "text-[#505258] hover:bg-[#dddedd]"
              : "text-[#a9abaf] hover:bg-[#37373a]"
          }`}
        >
          <HelpCircle
            className={`h-4 w-4 ${
              isLight
                ? "text-[#505258] hover:bg-[#dddedd]"
                : "text-[#a9abaf] hover:bg-[#37373a]"
            }`}
          />
        </Button>

        {/* User Menu */}

        <UserMenuPopover />
      </div>
    </nav>
  );
}
