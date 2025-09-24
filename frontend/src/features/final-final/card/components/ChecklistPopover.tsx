import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AddChecklistForm from "./AddChecklistForm";

type ChecklistPopoverProps = {
  open: boolean;
  title: string;
  onTitleChange: (v: string) => void;
  onAdd: () => Promise<void> | void;
  onOpenChange: (v: boolean) => void;
};

export const ChecklistPopover: React.FC<ChecklistPopoverProps> = ({
  open,
  title,
  onTitleChange,
  onAdd,
  onOpenChange,
}) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <span />
      </PopoverTrigger>
      <PopoverContent
        className="border-0 p-0 bg-transparent"
        align="start"
        side="bottom"
      >
        <AddChecklistForm
          title={title}
          onTitleChange={onTitleChange}
          onAdd={onAdd}
          onClose={() => onOpenChange(false)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ChecklistPopover;
