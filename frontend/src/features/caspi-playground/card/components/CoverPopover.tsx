import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CoverPopoverProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  boardId: string;
  listId: string;
  cardId: string;
  value?: string | null;
}

import { useCardCover, isHexColor } from "../hooks/useCardCover";

export const CoverPopover = ({
  children,
  onOpenChange,
  boardId,
  listId,
  cardId,
  value,
}: CoverPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    value: selected,
    setColor,
    setImage,
    clear,
  } = useCardCover(boardId, listId, cardId, value);

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
        className="w-[304px] p-0 max-h-[675px] overflow-hidden bg-[#2b2c2f] border-[#222324] text-[#939599]"
        align="end"
        sideOffset={4}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold ">Cover</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-white/20"
              onClick={handleClose}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4l8 8M12 4l-8 8"
                />
              </svg>
            </Button>
          </div>

          {/* Size Section */}
          <div className="">
            <h4 className="text-sm font-medium  mb-3">Size</h4>
            <div className="grid grid-cols-2 gap-2 p-1 mx-[-9px] overflow-x-hidden">
              <div className="h-[62px] m-0 w-[134px] cursor-pointer p-0 outline-2 outline-[#669df1] outline-offset-2 rounded-[3px] shadow-[0px_0px_0px_4px_#18191a]">
                {/* Card skeleton - partial cover style */}
                <div
                  className="w-full h-full rounded-[3px] inline-flex items-center justify-center overflow-hidden bg-center bg-cover"
                  style={
                    selected
                      ? isHexColor(String(selected))
                        ? { backgroundColor: String(selected) }
                        : { backgroundImage: `url("${String(selected)}")` }
                      : undefined
                  }
                >
                  {/* Green cover section at top */}

                  {/* Content section below */}
                  <div className="bg-[#242528] rounded-b-[3px] p-1.5 self-end">
                    {/* Two bars - longer and shorter */}

                    <div className="bg-[#63666b] h-1 rounded w-[122px]"></div>
                    <div className="bg-[#63666b] h-1 rounded w-[98px] mt-1"></div>

                    {/* Bottom section */}
                    <div className="flex items-center justify-between rounded-[3px] self-end w-full mt-1.5 ">
                      {/* Bottom left - two smaller divs */}
                      <div className="flex gap-1 ">
                        <div className="bg-[#63666b] h-1.5 w-4 rounded"></div>
                        <div className="bg-[#63666b] h-1.5 w-4 rounded"></div>
                      </div>

                      {/* Bottom right - avatar skeleton */}
                      <div className="bg-[#63666b] h-2.5 w-2.5 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="h-[62px] m-0 w-[134px] relative cursor-pointer p-0 rounded-[3px] bg-center bg-cover"
                style={
                  selected
                    ? isHexColor(String(selected))
                      ? { backgroundColor: String(selected) }
                      : { backgroundImage: `url("${String(selected)}")` }
                    : undefined
                }
              >
                <div className="absolute bottom-1 p-1.5">
                  <div className="bg-[#9cd8bf] h-1 w-[116px] rounded-[2px]"></div>
                  <div className="bg-[#9cd8bf] h-1 w-[92px] rounded-[2px] mt-1 "></div>
                </div>
              </div>
            </div>
            <Button
              className="w-full inline-flex items-center justify-center py-1.5 px-3 rounded cursor-pointer font-medium text-[#bfc1c4] text-sm bg-[#37383b] hover:bg-[#424346] mt-1"
              onClick={clear}
            >
              Remove cover
            </Button>
          </div>

          {/* Colors Section */}
          <h4 className="text-xs font-semibold leading-4  mb-1 mt-4 ">
            Colors
          </h4>
          <ul className="grid grid-cols-5 gap-1 mb-4 mt-2 -mx-1 list-none p-0 m-0">
            {[
              "#216e4e",
              "#7f5f01",
              "#9e4c00",
              "#ae2e24",
              "#803fa5",
              "#1558bc",
              "#206a83",
              "#6b5b95",
              "#e91e63",
              "#9e9e9e",
            ].map((color, index) => (
              <li
                key={index}
                className={`list-none w-[50px] h-8 border-2 rounded ${
                  selected === color
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-500"
                }`}
              >
                <button
                  className="w-full h-full relative rounded cursor-pointer"
                  onClick={() => setColor(color)}
                  style={{ backgroundColor: color }}
                >
                  {selected === color && (
                    <div className="absolute inset-0 border-2 border-black rounded pointer-events-none"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <Button className="w-full text-sm cursor-pointer font-medium text-[#bfc1c4]   inline-flex items-center justify-center py-1.5 px-3 rounded  my-1 bg-[#37383b] hover:bg-[#424346] p-2 h-auto">
            Enable colorblind friendly mode
          </Button>

          <Separator className="bg-[#424346] my-2 h-[1px] w-full p-0" />

          {/* Attachments Section */}
          <h4 className="text-xs font-semibold leading-4  mb-1 mt-4 ">
            Attachments
          </h4>
          <div className="mt-2">
            <Button className="w-full m-0 bg-[#37383b] rounded-none text-[#bfc1c4]  py-1.5 px-3 font-medium text-sm">
              Upload a cover image
            </Button>
            <p className="text-xs leading-4 mt-3 text-[#888a8d]">
              Tip: Drag an image on to the card to upload it.
            </p>
          </div>

          {/* Photos from Unsplash Section */}
          <h4 className="text-xs leading-4 font-semibold mb-1 mt-4">
            Photos from Unsplash
          </h4>
          <ul className="grid grid-cols-3 gap-2 -mx-1 overflow-x-hidden p-1 list-none">
            {[
              "/images/background-1-preview.webp",
              "/images/background-2-preview.webp",
              "/images/background-3-preview.webp",
            ].map((image, index) => (
              <li key={index} className="list-none relative">
                <button
                  className="w-22 h-12 rounded cursor-pointer overflow-hidden hover:opacity-80 transition-opacity"
                  onClick={() => setImage(image)}
                >
                  <img
                    src={image}
                    alt={`Background ${index + 1}`}
                    className="w-full h-full object-cover bg-cover bg-no-repeat bg-center"
                  />
                </button>
              </li>
            ))}
          </ul>
          <Button className="w-full mt-1 inline-flex justify-center items-center py-1.5 px-3 rounded cursor-pointer font-medium text-[#bfc1c4] bg-[#37383b]">
            Search for photos
          </Button>

          {/* Footer */}
          <div className="pt-3">
            <div className="text-xs leading-4 text-left text-[#a9abaf] ">
              By using images from Unsplash, you agree to their{" "}
              <a
                href="#"
                className="text-blue-400 underline hover:text-blue-300"
              >
                license
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-blue-400 underline hover:text-blue-300"
              >
                Terms of Service
              </a>
              .
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
