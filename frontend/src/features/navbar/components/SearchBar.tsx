import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/hooks/useTheme";
import { useLocation } from "react-router-dom";
import { useAppContext } from "@/hooks/useAppContext";
import { useSearch } from "../hooks/useSearch";
import SearchPopover from "./SearchPopover";

export default function SearchBar() {
  const { theme } = useTheme();
  const location = useLocation();
  const { navbarBorderHidden } = useAppContext();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const isLight = theme === "light";

  const { data, isLoading } = useSearch(debouncedValue);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(searchValue), 500); // wait 500ms
    return () => clearTimeout(handler);
  }, [searchValue]);

  // Check if we're in board view (handles both /board/ and /b/ routes)
  const isBoardView =
    location.pathname.startsWith("/board/") ||
    location.pathname.startsWith("/b/");

  // When only board is active (inbox closed), apply board styling
  const isBoardOnly = isBoardView && !navbarBorderHidden;

  return (
    <div className="relative w-full max-w-[780px] -mr-5">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none -ml-4 z-10">
            <Search className="h-3.5 w-3.5 text-[#7e8188]" />
          </div>

          {/* Search Input */}
          <PopoverTrigger asChild>
            <Input
              type="text"
              placeholder="Search Trello"
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
          </PopoverTrigger>
        </div>
        <PopoverContent
          className="w-[780px] p-0 border-0 shadow-none bg-transparent"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <SearchPopover
            searchResults={data}
            isLoading={isLoading}
            searchValue={searchValue}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
