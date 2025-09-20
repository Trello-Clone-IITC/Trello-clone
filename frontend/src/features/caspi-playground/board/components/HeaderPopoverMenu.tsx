import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Share2,
  Info,
  Users,
  Share,
  Star,
  Settings,
  Mountain,
  FolderUp,
  Zap,
  Rocket,
  Tag,
  Smile,
  SquarePlus,
  MoreHorizontal,
  Eye,
  Copy,
  Mail,
  X,
  Wifi,
} from "lucide-react";
import ShareBoardModal from "./ShareBoardModal";

interface HeaderPopoverMenuProps {
  children: React.ReactNode;
}

export default function HeaderPopoverMenu({
  children,
}: HeaderPopoverMenuProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          className="w-80 bg-[#2b2c2f] border-[#3c434a] text-white p-0 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto header-popover-scrollbar"
          align="start"
          side="bottom"
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Menu</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-[#3c434a] rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* User Avatars and Share Button on same row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 border-[#282e33]">
                  NC
                </div>
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 border-[#282e33] relative">
                  RM
                  <Wifi className="h-2 w-2 absolute -top-1 -right-1 text-white" />
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-white hover:bg-[#3c434a] p-2 h-auto"
                onClick={() => {
                  console.log("Share button clicked!");
                  setIsPopoverOpen(false);
                  setIsShareModalOpen(true);
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Divider */}
            <div className="border-t border-[#3c434a] mb-4"></div>

            {/* About and Visibility Section */}
            <div className="space-y-2 mb-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <Info className="h-4 w-4 mr-3" />
                <div className="flex flex-col items-start">
                  <span>About this board</span>
                  <span className="text-xs text-gray-400">
                    Add a description to your board
                  </span>
                </div>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <Users className="h-4 w-4 mr-3" />
                Visibility: Workspace
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <Share className="h-4 w-4 mr-3" />
                Print, export, and share
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <Star className="h-4 w-4 mr-3" />
                Star
              </Button>
            </div>

            {/* Divider */}
            <div className="border-t border-[#3c434a] mb-4"></div>

            {/* Settings Section */}
            <div className="space-y-2 mb-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <Mountain className="h-4 w-4 mr-3" />
                Change background
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <FolderUp className="h-4 w-4 mr-3" />
                <div className="flex items-center justify-between w-full">
                  <span>Upgrade</span>
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    Upgrade
                  </span>
                </div>
              </Button>
            </div>

            {/* Upgrade Block */}
            <div className="bg-[#3c434a] rounded-lg p-4 mb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">
                    Upgrade to add Custom Fields
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">
                    Add dropdowns, text fields, dates, and more to your cards.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-white underline"
                  >
                    Upgrade
                  </Button>
                </div>
                <FolderUp className="h-8 w-8 text-purple-500" />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#3c434a] mb-4"></div>

            {/* Power-ups and Tools Section */}
            <div className="space-y-2 mb-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <Zap className="h-4 w-4 mr-3" />
                Automation
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <Rocket className="h-4 w-4 mr-3" />
                Power-Ups
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <Tag className="h-4 w-4 mr-3" />
                Labels
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <Smile className="h-4 w-4 mr-3" />
                Stickers
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <SquarePlus className="h-4 w-4 mr-3" />
                <div className="flex items-center justify-between w-full">
                  <span>Make template</span>
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    Upgrade
                  </span>
                </div>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <MoreHorizontal className="h-4 w-4 mr-3" />
                Activity
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <SquarePlus className="h-4 w-4 mr-3" />
                Archived items
              </Button>
            </div>

            {/* Divider */}
            <div className="border-t border-[#3c434a] mb-4"></div>

            {/* Board Actions Section */}
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <Eye className="h-4 w-4 mr-3" />
                Watch
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <Copy className="h-4 w-4 mr-3" />
                Copy board
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <Mail className="h-4 w-4 mr-3" />
                Email-to-board
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#3c434a] p-2 h-auto"
              >
                <X className="h-4 w-4 mr-3" />
                Close board
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <ShareBoardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
}
