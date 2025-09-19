import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreateBoardForm } from "./CreateBoardForm";

interface CreateBoardPopoverProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export const CreateBoardPopover = ({
  children,
  onOpenChange,
}: CreateBoardPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-[304px] p-0 max-h-[675px] overflow-hidden"
        align="start"
        sideOffset={4}
      >
        <CreateBoardForm onClose={handleClose} />
      </PopoverContent>
    </Popover>
  );
};
