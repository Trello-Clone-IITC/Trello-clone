import { Button } from "@/components/ui/button";
import { Zap, Star, Share2, MoreHorizontal, ChevronDown } from "lucide-react";
import { useBoardMembers } from "../hooks";
import HeaderPopoverMenu from "./HeaderPopoverMenu";
import ShareBoardModal from "./ShareBoardModal";
import VisibilityPopover from "./VisibilityPopover";
import { useState } from "react";
import { getIconColor } from "../utils/backgroundUtils";
import type { BoardBackground } from "@ronmordo/contracts";
import SpaceshipIcon from "@/assets/SpaceshipIcon";
interface BoardHeaderProps {
  boardName: string;
  boardId: string;
  background?: BoardBackground;
  theme?: "light" | "dark" | "system";
}

export default function BoardHeader({
  boardName,
  boardId,
  background,
  theme = "dark",
}: BoardHeaderProps) {
  const { data: membersData } = useBoardMembers(boardId);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isVisibilityPopoverOpen, setIsVisibilityPopoverOpen] = useState(false);
  const members = membersData ?? [];

  // Get the appropriate icon color based on background
  const iconColor = getIconColor(background, theme);

  //   return (
  //     <div className="inline-flex relative flex-wrap items-center h-auto w-[calc(100%-2px)] p-3 gap-1 bg-[#ffffff3d] backdrop-blur-[6px]">
  //       {/* Left Section - Board Name and Dropdown */}
  //       <div className="grow shrink basis-[20%] text-ellipsis flex flex-nowrap items-start w-full min-h-[32px]">
  //         <div className="inline-flex gap-0 w-full h-[32px] mr-1 mb-0 rounded-[3px] leading-[32px] whitespace-nowrap">
  //           <h1 className="text-[16px] h-full px-[10px] mb-[12px] bg-transparent font-bold leading-[32px] decoration-0 text-ellipsis whitespace-nowrap">
  //             {boardName}
  //           </h1>
  //           <Button
  //             size="sm"
  //             className="text-white bg-transparent flex shadow-none hover:bg-white/10 rounded-[3px] has-[>svg]:p-1.5"
  //           >
  //             <img
  //               src="/src/assets/three-bar-icon.svg"
  //               alt="Menu"
  //               className="w-5 h-5"
  //             />
  //             <ChevronDown />
  //           </Button>
  //         </div>
  //       </div>

  //       {/* Right Section - All Actions */}
  //       <div className="flex items-center gap-3">
  //         {/* Board Members */}
  //         <div className="flex items-center gap-1">
  //           {members.map((member, index) => {
  //             const displayName = member.user.fullName;
  //             return (
  //               <div
  //                 key={member.userId}
  //                 className="relative"
  //                 style={{ zIndex: 3 - index }}
  //               >
  //                 <Button
  //                   variant="ghost"
  //                   size="sm"
  //                   className="w-8 h-8 rounded-full p-0 hover:bg-white/20"
  //                   title={`${displayName}`}
  //                 >
  //                   <div
  //                     className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white ${getBackgroundColor(
  //                       displayName
  //                     )}`}
  //                   >
  //                     {member.user.avatarUrl && (
  //                       <img
  //                         src={member.user.avatarUrl}
  //                         alt={displayName}
  //                         className="w-7 h-7 rounded-full"
  //                       />
  //                     )}
  //                   </div>
  //                 </Button>
  //               </div>
  //             );
  //           })}
  //         </div>

  //         {/* Power-Ups */}
  //         <Button
  //           variant="ghost"
  //           size="sm"
  //           className="text-white hover:bg-white/20 px-2 py-1"
  //         >
  //           <Zap className="w-4 h-4 mr-1" />
  //           Power-Ups
  //         </Button>

  //         {/* Lightning Bolt (Automation) */}
  //         <Button
  //           variant="ghost"
  //           size="sm"
  //           className="text-white hover:bg-white/20 px-2 py-1"
  //         >
  //           <Zap className="w-4 h-4" />
  //         </Button>

  //         {/* Filter */}
  //         <Button
  //           variant="ghost"
  //           size="sm"
  //           className="text-white hover:bg-white/20 px-2 py-1"
  //         >
  //           <Filter className="w-4 h-4" />
  //         </Button>

  //         {/* Star */}
  //         <Button
  //           variant="ghost"
  //           size="sm"
  //           className="text-white hover:bg-white/20 px-2 py-1"
  //         >
  //           <Star className="w-4 h-4" />
  //         </Button>

  //         {/* People (Visibility) */}
  //         <Button
  //           variant="ghost"
  //           size="sm"
  //           className="text-white hover:bg-white/20 px-2 py-1"
  //         >
  //           <Users className="w-4 h-4" />
  //         </Button>

  //         {/* Share Button */}
  //         <Button
  //           size="sm"
  //           className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1"
  //         >
  //           <Share2 className="w-4 h-4 mr-1" />
  //           Share
  //         </Button>

  //         {/* Three Dots Menu */}
  //         <Button
  //           variant="ghost"
  //           size="sm"
  //           className="text-white hover:bg-white/20 px-2 py-1"
  //         >
  //           <MoreHorizontal className="w-4 h-4" />
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex relative items-center w-full p-3 gap-1 bg-[#ffffff3d] backdrop-blur-[6px] flex-shrink-0">
      {/* Left Section - Board Name and Dropdown */}
      <div className="grow shrink basis-[20%] text-ellipsis flex flex-nowrap items-start w-full min-h-[32px]">
        <div className="inline-flex gap-0 w-full h-[32px] mr-1 mb-0 rounded-[3px] leading-[32px] whitespace-nowrap">
          <h1 className="text-[16px] h-full px-[10px] mb-[12px] bg-transparent font-bold leading-[32px] decoration-0 text-ellipsis whitespace-nowrap text-[#172b4d]">
            {boardName}
          </h1>
          <Button
            size="sm"
            className="text-[#172b4d] bg-transparent flex shadow-none hover:bg-white/10 rounded-[3px] has-[>svg]:p-1.5"
          >
            <img
              src="/src/assets/three-bar-icon.svg"
              alt="Menu"
              className="w-5 h-5"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(20%) sepia(15%) saturate(2000%) hue-rotate(200deg) brightness(90%) contrast(85%)",
                WebkitFilter:
                  "brightness(0) saturate(100%) invert(20%) sepia(15%) saturate(2000%) hue-rotate(200deg) brightness(90%) contrast(85%)",
              }}
            />
            <ChevronDown />
          </Button>
        </div>
      </div>
      {/* מפה למטה שיניתי דברים בעיצוב CASPI */}
      {/* Right Section - All Actions */}
      <div className="flex items-center gap-3">
        {/* Board Members */}
        <div className="flex items-center gap-1">
          {members.map((member, index) => {
            console.log(member.user);

            return (
              <div
                key={member.userId}
                className="relative "
                style={{ zIndex: 3 - index }}
              >
                <Button
                  size="sm"
                  className="w-8 h-8 rounded-full p-0  cursor-pointer hover:bg-transparent bg-transparent focus:outline-none focus:ring-0 active:ring-0"
                  title={`${member.user.fullName}`}
                >
                  {member.user.avatarUrl ? (
                    <img
                      src={member.user.avatarUrl}
                      alt={member.user.fullName}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full  flex items-center   justify-center text-white text-xs font-semibold">
                      {member.user.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Power-Ups */}
        <Button
          size="sm"
          className="bg-transparent hover:bg-black/16  px-2 py-1 shadow-none cursor-pointer"
        >
          <SpaceshipIcon color={iconColor} className="w-4 h-4" />
        </Button>

        {/* Lightning Bolt (Automation) */}
        <Button
          size="sm"
          className="bg-transparent text-[#172b4d] hover:bg-black/16  px-2 py-1 shadow-none cursor-pointer"
        >
          <Zap className="w-4 h-4" />
        </Button>

        {/* Filter */}
        <Button
          size="sm"
          className="bg-transparent text-[#172b4d] hover:bg-black/16 px-2 py-1 shadow-none cursor-pointer"
        >
          <svg
            fill="none"
            viewBox="0 0 16 16"
            role="presentation"
            className="w-4 h-4"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(20%) sepia(15%) saturate(2000%) hue-rotate(200deg) brightness(90%) contrast(85%)",
              WebkitFilter:
                "brightness(0) saturate(100%) invert(20%) sepia(15%) saturate(2000%) hue-rotate(200deg) brightness(90%) contrast(85%)",
            }}
          >
            <path
              fill="currentcolor"
              fillRule="evenodd"
              d="M15 3.5H1V2h14zm-2 5.25H3v-1.5h10zM11 14H5v-1.5h6z"
              clipRule="evenodd"
            />
          </svg>
        </Button>

        {/* Star */}
        <Button
          size="sm"
          className="bg-transparent text-[#172b4d] hover:bg-black/16  px-2 py-1 shadow-none cursor-pointer"
        >
          <Star className="w-4 h-4" />
        </Button>

        {/* People (Visibility) Changed By Caspi */}
        <VisibilityPopover onOpenChange={setIsVisibilityPopoverOpen}>
          <Button
            size="sm"
            className={`px-2 py-1 shadow-none ${
              isVisibilityPopoverOpen
                ? "bg-[#14274a] hover:bg-[#14274a]"
                : "bg-transparent text-[#172b4d] hover:bg-black/16 cursor-pointer"
            }`}
          >
            <img
              src="/src/assets/people-icon.svg"
              alt="People"
              className="w-5 h-5"
              style={{
                filter: isVisibilityPopoverOpen
                  ? "brightness(0) saturate(100%) invert(100%)"
                  : "brightness(0) saturate(100%) invert(20%) sepia(15%) saturate(2000%) hue-rotate(200deg) brightness(90%) contrast(85%)",
                WebkitFilter: isVisibilityPopoverOpen
                  ? "brightness(0) saturate(100%) invert(100%)"
                  : "brightness(0) saturate(100%) invert(20%) sepia(15%) saturate(2000%) hue-rotate(200deg) brightness(90%) contrast(85%)",
              }}
            />
          </Button>
        </VisibilityPopover>

        {/* Share Button */}
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 cursor-pointer"
          onClick={() => setIsShareModalOpen(true)}
        >
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>

        {/* Three Dots Menu */}
        <HeaderPopoverMenu>
          <Button
            size="sm"
            className="bg-transparent text-[#172b4d] hover:bg-black/16 px-2 py-1 shadow-none cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </HeaderPopoverMenu>
      </div>

      <ShareBoardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
