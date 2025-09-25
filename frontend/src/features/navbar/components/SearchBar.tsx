import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/useTheme";
import { useLocation } from "react-router-dom";
import { useAppContext } from "@/hooks/useAppContext";

export default function SearchBar() {
  const { theme } = useTheme();
  const location = useLocation();
  const { navbarBorderHidden } = useAppContext();
  const [searchValue, setSearchValue] = useState("");
  const isLight = theme === "light";

  // Check if we're in board view (handles both /board/ and /b/ routes)
  const isBoardView =
    location.pathname.startsWith("/board/") ||
    location.pathname.startsWith("/b/");

  // When only board is active (inbox closed), apply board styling
  const isBoardOnly = isBoardView && !navbarBorderHidden;

  return (
    <div className="relative w-full max-w-[780px] -mr-5">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none -ml-4">
          <Search className="h-3.5 w-3.5 text-[#7e8188]" />
        </div>

        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={`pl-10 pr-4 -ml-5 w-full h-[30px] border-1 focus-visible:border-[#85b8ff] text-sm rounded  focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none  ${
            isBoardOnly && isLight
              ? " bg-[#3b3d41] hover:bg-[#626468] border-[#8c8f97] focus-visible:bg-[#626468] text-white placeholder:text-white"
              : isLight && !isBoardOnly
              ? " bg-white hover:bg-white border-[#8590a2] focus-visible:bg-white  text-[#727e92] placeholder:text-[#727e92]"
              : "bg-[#fff] text-[#7e8188] border-[#7e8188] placeholder:text-[#7e8188]"
          }`}
        />
      </div>
    </div>
  );
}
