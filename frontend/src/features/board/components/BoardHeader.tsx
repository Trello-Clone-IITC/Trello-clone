import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  List,
  Zap,
  Filter,
  Star,
  Users,
  Share2,
  MoreHorizontal,
} from "lucide-react";

interface BoardHeaderProps {
  boardName: string;
  members?: Array<{
    id: string;
    name: string;
    avatar?: string;
    isAdmin?: boolean;
  }>;
}

export default function BoardHeader({
  boardName,
  members = [],
}: BoardHeaderProps) {
  return (
    <div className="inline-flex relative flex-wrap items-center h-auto w-[calc(100%-2px)] p-3 gap-1  bg-[#ffffff3d] backdrop-blur-[6px]">
      {/* Left Section - Board Name and Dropdown */}
      <div className="grow shrink basis-[20%] text-ellipsis flex flex-nowrap items-start w-full min-h-[32px]">
        <div className="inline-flex w-full h-[32px] mr-1 mb-0 rounded-[3px] leading-[32px] whitespace-nowrap">
          <h1 className="text-[16px] h-full  px-[10px] mb-[12px] bg-transparent font-bold leading-[32px] decoration-0 text-ellipsis whitespace-nowrap">
            {boardName}
          </h1>
        </div>
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 px-2 py-1"
          >
            <List className="w-4 h-4 mr-1" />
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right Section - All Actions */}
      <div className="flex items-center gap-3">
        {/* Board Members */}
        <div className="flex items-center gap-1">
          {members.slice(0, 3).map((member, index) => (
            <div
              key={member.id}
              className="relative"
              style={{ zIndex: 3 - index }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 rounded-full p-0 hover:bg-white/20"
                title={`${member.name}${member.isAdmin ? " (Admin)" : ""}`}
              >
                <div
                  className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-xs font-semibold text-white bg-cover bg-center"
                  style={{
                    backgroundImage: member.avatar
                      ? `url("${member.avatar}")`
                      : undefined,
                  }}
                >
                  {!member.avatar && member.name.charAt(0).toUpperCase()}
                </div>
                {member.isAdmin && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full" />
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Power-Ups */}
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 px-2 py-1"
        >
          <Zap className="w-4 h-4 mr-1" />
          Power-Ups
        </Button>

        {/* Lightning Bolt (Automation) */}
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 px-2 py-1"
        >
          <Zap className="w-4 h-4" />
        </Button>

        {/* Filter */}
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 px-2 py-1"
        >
          <Filter className="w-4 h-4" />
        </Button>

        {/* Star */}
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 px-2 py-1"
        >
          <Star className="w-4 h-4" />
        </Button>

        {/* People (Visibility) */}
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 px-2 py-1"
        >
          <Users className="w-4 h-4" />
        </Button>

        {/* Share Button */}
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1"
        >
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>

        {/* Three Dots Menu */}
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 px-2 py-1"
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
