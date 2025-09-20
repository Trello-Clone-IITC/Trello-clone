import { useState } from "react";
import { ChevronUp } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ListDto } from "@ronmordo/contracts";
import type { ListFooterRef } from "./ListFooter";

interface ListActionsProps {
  list: ListDto;
  listFooterRef: React.RefObject<ListFooterRef | null>;
  children: React.ReactNode;
}

export default function ListActions({
  list,
  listFooterRef,
  children,
}: ListActionsProps) {
  const [isAutomationExpanded, setIsAutomationExpanded] = useState(false);

  const handleAddCard = () => {
    // Trigger the ListFooter's add card functionality
    if (listFooterRef.current) {
      listFooterRef.current.triggerAddCard();
    }
  };

  const handleCopyList = () => {
    // TODO: Implement copy list functionality
    console.log("Copy list:", list.id);
  };

  const handleMoveList = () => {
    // TODO: Implement move list functionality
    console.log("Move list:", list.id);
  };

  const handleMoveAllCards = () => {
    // TODO: Implement move all cards functionality
    console.log("Move all cards in list:", list.id);
  };

  const handleSortBy = () => {
    // TODO: Implement sort by functionality
    console.log("Sort list by:", list.id);
  };

  const handleWatch = () => {
    // TODO: Implement watch functionality
    console.log("Watch list:", list.id);
  };

  const handleArchiveList = () => {
    // TODO: Implement archive list functionality
    console.log("Archive list:", list.id);
  };

  const handleArchiveAllCards = () => {
    // TODO: Implement archive all cards functionality
    console.log("Archive all cards in list:", list.id);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 bg-[#242528] rounded-lg"
        align="start"
        side="right"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <h3 className="text-white font-medium text-sm">List actions</h3>
        </div>

        {/* Action Items - Top Group */}
        <div className="py-1">
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            onClick={handleAddCard}
          >
            Add card
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            onClick={handleCopyList}
          >
            Copy list
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            onClick={handleMoveList}
          >
            Move list
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            onClick={handleMoveAllCards}
          >
            Move all cards in this list
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            onClick={handleSortBy}
          >
            Sort by...
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            onClick={handleWatch}
          >
            Watch
          </Button>
        </div>

        <div className="px-3">
          <Separator className="bg-gray-600" />
        </div>

        {/* Automation Section */}
        <div className="py-1">
          <Button
            variant="ghost"
            className="w-full justify-between px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            onClick={() => setIsAutomationExpanded(!isAutomationExpanded)}
          >
            <span className="font-medium">Automation</span>
            <ChevronUp
              className={`w-4 h-4 transition-transform ${
                isAutomationExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>

          {isAutomationExpanded && (
            <div className="pl-3">
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
              >
                When a card is added to the list...
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
              >
                Every day, sort list by...
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
              >
                Every Monday, sort list by...
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
              >
                Create a rule
              </Button>
            </div>
          )}
        </div>

        <div className="px-3">
          <Separator className="bg-gray-600" />
        </div>

        {/* Archive Section */}
        <div className="py-1">
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            onClick={handleArchiveList}
          >
            Archive this list
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
            onClick={handleArchiveAllCards}
          >
            Archive all cards in this list
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
