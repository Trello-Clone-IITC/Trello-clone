import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, X } from "lucide-react";
import { useState } from "react";

interface VisibilityPopoverProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export default function VisibilityPopover({
  children,
  onOpenChange,
}: VisibilityPopoverProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger className="p-0" asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-[384px] rounded-[8px] bg-[#2b2c2f] text-[#a9abaf] overflow-hidden text-sm shadow-lg">
        <div className="">
          {/* Header */}
          <div className="grid grid-cols-[32px_1fr_32px] p-2 text-center items-center relative">
            <h3 className="relative col-start-1 col-span-3 row-start-1 h-10 m-0 py-0 px-8 overflow-hidden text-sm font-semibold leading-10 text-ellipsis whitespace-nowrap">
              Change visibility
            </h3>
            <Button className="w-8 h-8 col-start-3 row-start-1 flex items-center justify-center rounded-[8px] cursor-pointer hover:bg-[#424346] bg-transparent p-0 m-0 text-[#a9abaf] z-2">
              <X />
            </Button>
          </div>

          <div className="p-3 overflow-x-hidden overflow-y-auto max-h-[817px] pt-0">
            <div className="mx-[-12px]">
              {/* Private Option */}
              <ul className="m-0 p-0 list-none">
                <li>
                  <div className="w-full h-full m-0 py-1.5 px-3 rounded-none text-left text-[#a9abaf] hover:bg-[#36373a] cursor-pointer">
                    <div className="flex m-0 items-center justify-start gap-x-1 text-sm font-normal leading-5 text-left">
                      <img
                        src="/src/assets/lock-icon.svg"
                        alt="Private"
                        className="w-4 h-4"
                        style={{
                          filter:
                            "brightness(0) saturate(100%) invert(25%) sepia(60%) saturate(2000%) hue-rotate(340deg) brightness(90%) contrast(85%)",
                          WebkitFilter:
                            "brightness(0) saturate(100%) invert(25%) sepia(60%) saturate(2000%) hue-rotate(340deg) brightness(90%) contrast(85%)",
                        }}
                      />
                      <span className="flex items-center  text-gray-300">
                        Private
                      </span>
                    </div>
                    <div className="mt-1 p-0 text-xs font-normal leading-4">
                      <p className="text-left">
                        Only board members can see this board. Workspace admins
                        can close the board or remove members.
                      </p>
                    </div>
                  </div>
                </li>
                {/* Workspace Option (Selected) */}
                <li>
                  <div className="w-full h-full m-0 py-1.5 px-3 rounded-none text-left text-[#a9abaf] hover:bg-[#36373a] cursor-pointer">
                    <div className="flex m-0 items-center justify-start gap-x-1 text-sm font-normal leading-5 text-left">
                      <img
                        src="/src/assets/people-icon.svg"
                        alt="Workspace"
                        className="w-4 h-4 "
                        style={{
                          filter:
                            "brightness(0) saturate(100%) invert(78%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(85%) contrast(85%)",
                          WebkitFilter:
                            "brightness(0) saturate(100%) invert(78%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(85%) contrast(85%)",
                        }}
                      />
                      <span className="flex items-center  text-gray-300">
                        Workspace
                      </span>
                      <Check className="w-3.5 h-3.5 text-gray-300" />
                    </div>
                    <div className="mt-1 p-0 text-xs font-normal leading-4">
                      <p className="text-left">
                        All members of the Trello Workspace can see and edit
                        this board.
                      </p>
                    </div>
                  </div>
                </li>
                {/* Organization Option */}
                <li>
                  <div className="w-full h-full m-0 py-1.5 px-3 rounded-none text-left text-[#434445] cursor-none pointer-events-none ">
                    <div className="flex m-0 items-center justify-start gap-x-1 text-sm font-normal leading-5 text-left">
                      <img
                        src="/src/assets/upgrade-icon-dark.svg"
                        alt="Organization"
                        className="w-4 h-4"
                        style={{
                          filter:
                            "brightness(0) saturate(100%) invert(35%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(85%) contrast(85%)",
                          WebkitFilter:
                            "brightness(0) saturate(100%) invert(35%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(85%) contrast(85%)",
                        }}
                      />
                      <span className="flex items-center text-[#434445]">
                        Organization
                      </span>
                    </div>
                    <div className="mt-1 p-0 text-xs font-normal leading-4">
                      <p className="text-left text-[#434445]">
                        All members of the organization can see this board. The
                        board must be added to an enterprise Workspace to enable
                        this.
                      </p>
                    </div>
                  </div>
                </li>
                {/* Public Option */}
                <li>
                  <div className="w-full h-full m-0 py-1.5 px-3 rounded-none text-left text-[#a9abaf] hover:bg-[#36373a] cursor-pointer">
                    <div className="flex m-0 items-center justify-start gap-x-1 text-sm font-normal leading-5 text-left">
                      <img
                        src="/src/assets/globe-icon.svg"
                        alt="Public"
                        className="w-4 h-4"
                        style={{
                          filter:
                            "brightness(0) saturate(100%) invert(60%) sepia(80%) saturate(2000%) hue-rotate(120deg) brightness(90%) contrast(85%)",
                          WebkitFilter:
                            "brightness(0) saturate(100%) invert(60%) sepia(80%) saturate(2000%) hue-rotate(120deg) brightness(90%) contrast(85%)",
                        }}
                      />
                      <span className="flex items-center  text-gray-300">
                        Public
                      </span>
                    </div>
                    <div className="mt-1 p-0 text-xs font-normal leading-4">
                      <p className="text-left">
                        Anyone on the internet can see this board. Only board
                        members can edit.
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
