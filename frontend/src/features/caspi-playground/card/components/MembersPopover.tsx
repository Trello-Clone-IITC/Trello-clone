import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";
import { addMembersIconDark, addMembersIconLight } from "@/assets";
import { useTheme } from "@/hooks/useTheme";

interface Member {
  id: string;
  fullName: string;
  username: string;
  avatarUrl?: string | null;
}

interface MembersPopoverProps {
  children: React.ReactNode;
  members?: Member[];
}

export const MembersPopover: React.FC<MembersPopoverProps> = ({
  children,
  members = [],
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();

  const filteredMembers = members.filter(
    (member) =>
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-teal-500",
      "bg-orange-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-red-500",
      "bg-yellow-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 bg-[#2b2c2f] border-0 rounded-lg"
        align="start"
        side="bottom"
      >
        {/* Header */}
        <div className="flex items-center justify-center p-4 relative">
          <h3 className="text-[#a9abaf] font-medium text-sm">Members</h3>
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 w-6 h-6 flex items-center justify-center hover:bg-gray-600 transition-colors rounded"
          >
            <X className="w-4 h-4 text-[#a9abaf]" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#96999e]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members"
              className="w-full h-[41px] py-1 pl-10 pr-3 rounded-[3px] border-1 border-[#7e8188] bg-[#242528] placeholder:text-[#96999e] text-[#bfc1c4] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-[#85b8ff] focus-visible:border-1"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="px-4 pb-4">
          <div className="text-xs font-medium text-[#a9abaf] mb-2">
            Board members
          </div>
          <div className="space-y-2">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2 hover:bg-[#3a4249] rounded cursor-pointer transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(
                    member.fullName
                  )}`}
                >
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.fullName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    getInitials(member.fullName)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">
                    {member.fullName}
                  </div>
                  <div className="text-xs text-[#96999e] truncate">
                    @{member.username}
                  </div>
                </div>
                <div className="w-6 h-6 flex items-center justify-center">
                  <img
                    src={
                      theme === "dark"
                        ? addMembersIconDark
                        : addMembersIconLight
                    }
                    alt="Add member"
                    className="w-4 h-4 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            ))}
            {filteredMembers.length === 0 && (
              <div className="text-sm text-[#96999e] text-center py-4">
                No members found
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
