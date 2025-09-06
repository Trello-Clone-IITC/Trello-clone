import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="relative w-full max-w-[770px]">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Search className="h-4 w-4 text-[#8c9bab]" />
        </div>

        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 pr-4 w-full h-[30px] bg-[#22272b] hover:bg-[#282e33] !border !border-[#738496] focus:bg-[#282e33] focus:!border focus:!border-[#85b8ff] focus:!ring-0 focus:!ring-offset-0 focus:outline-none rounded text-sm text-[#8c9bab] placeholder:text-[#8c9bab]"
        />
      </div>
    </div>
  );
}
