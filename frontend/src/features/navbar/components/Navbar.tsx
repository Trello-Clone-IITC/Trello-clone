import { Button } from "@/components/ui/button";
import { Bell, HelpCircle, MessageSquare } from "lucide-react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import CreateButton from "./CreateButton";
import UserMenu from "./UserMenu";
const AppSwitcherIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-gray-600"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM9 3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM1 11a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5zm6 .5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm2-.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5z"
      fill="currentColor"
    />
  </svg>
);

export default function Navbar() {
  return (
    <nav className="bg-[#1d2125] border-b border-[#31383d] px-2 md:px-4 py-2 flex items-center justify-between h-[47px]">
      {/* Left Section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* App Switcher */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-[#333c43]"
        >
          {AppSwitcherIcon}
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
      <div className="flex items-center gap-1 md:gap-2">
        {/* Feedback Button - Hidden on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-[#333c43] hidden sm:flex"
        >
          <MessageSquare className="h-4 w-4 text-gray-600" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 relative hover:bg-[#333c43]"
        >
          <Bell className="h-4 w-4 text-gray-600" />
          {/* Notification badge could go here */}
        </Button>

        {/* Help - Hidden on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-[#333c43] hidden sm:flex"
        >
          <HelpCircle className="h-4 w-4 text-gray-600" />
        </Button>

        {/* User Menu */}
        <UserMenu />
      </div>
    </nav>
  );
}
