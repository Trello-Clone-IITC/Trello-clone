import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { LabelDto, ColorType } from "@ronmordo/contracts";

// Define the 7 colors as specified using proper ColorType values
const LABEL_COLORS: Array<{ color: ColorType; value: string; class: string }> =
  [
    { color: "green", value: "#216e4e", class: "bg-label-green" },
    { color: "yellow", value: "#7f5f01", class: "bg-label-yellow" },
    { color: "orange", value: "#9e4c00", class: "bg-label-orange" },
    { color: "red", value: "#ae2e24", class: "bg-label-red" },
    { color: "purple", value: "#803fa5", class: "bg-label-purple" },
    { color: "blue", value: "#1558bc", class: "bg-label-blue" },
    { color: "sky", value: "#206a83", class: "bg-label-sky" },
  ];

// Edit icon SVG component
const EditIcon = () => (
  <svg
    width="16"
    height="16"
    role="presentation"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="text-[#bfc1c4]"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.82034 14.4893L9.94134 16.6103L18.4303 8.12131L16.3093 6.00031H16.3073L7.82034 14.4893ZM17.7233 4.58531L19.8443 6.70731C20.6253 7.48831 20.6253 8.7543 19.8443 9.53531L10.0873 19.2933L5.13734 14.3433L14.8943 4.58531C15.2853 4.19531 15.7973 4.00031 16.3093 4.00031C16.8203 4.00031 17.3323 4.19531 17.7233 4.58531ZM5.20094 20.4097C4.49794 20.5537 3.87694 19.9327 4.02094 19.2297L4.80094 15.4207L9.00994 19.6297L5.20094 20.4097Z"
      fill="currentColor"
    />
  </svg>
);

interface LabelsPopoverProps {
  children: React.ReactNode;
  selectedLabels: LabelDto[];
  onLabelToggle: (color: ColorType) => void;
  onCreateLabel: () => void;
  onEditLabel: (color: ColorType) => void;
}

export const LabelsPopover = ({
  children,
  selectedLabels,
  onLabelToggle,
  onCreateLabel,
  onEditLabel,
}: LabelsPopoverProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Filter labels based on search term
  const filteredLabels = LABEL_COLORS.filter((label) =>
    label.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if a label is selected
  const isLabelSelected = (labelColor: ColorType) => {
    return selectedLabels.some((label) => label.color === labelColor);
  };

  const handleLabelToggle = (labelColor: ColorType) => {
    onLabelToggle(labelColor);
  };

  const handleEditLabel = (e: React.MouseEvent, labelColor: ColorType) => {
    e.stopPropagation();
    onEditLabel(labelColor);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-[304px] p-0 bg-[#2b2c2f] border-[#2d363c] text-[#a9abaf]"
        align="start"
      >
        <div className="">
          {/* Header */}
          <div className="grid grid-cols-[32px_1fr_32px]  px-2 py-1 text-center items-center">
            <h3 className="text-sm font-semibold text-[#a9abaf] px-8 col-start-1 col-span-3 h-10 m-0 leading-10 overflow-ellipsis whitespace-nowrap row-start-1">
              Labels
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700 col-start-3 col-end-3 flex items-center justify-center rounded-[8px] row-start-1 "
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="max-h-[817px] pb-3 px-3 pt-0 overflow-x-hidden overflow-y-auto">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search labels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#161a1d] border-[#2d363c] text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>
            {/* Labels List */}
            <div className="">
              <h4 className="text-xs font-semibold leading-4  mb-2 mt-3">
                Labels
              </h4>
              <div className="overflow-y-auto pb-2 pt-1">
                {filteredLabels.map((label) => (
                  <div
                    key={label.color}
                    className="flex items-center gap-3 rounded cursor-pointer pb-1 pl-1"
                    onClick={() => handleLabelToggle(label.color)}
                  >
                    <Checkbox
                      checked={isLabelSelected(label.color)}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <div className={`h-8 rounded flex-1 ${label.class} px-3`} />
                    <button
                      className="p-1 hover:bg-[#3d4449] rounded"
                      onClick={(e) => handleEditLabel(e, label.color)}
                    >
                      <EditIcon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={onCreateLabel}
                className="w-full bg-[#2d363c] hover:bg-[#3d4449] text-white border-0"
              >
                Create a new label
              </Button>
              <Separator />
              <Button
                onClick={() => {
                  // TODO: Implement colorblind friendly mode
                }}
                className="w-full bg-[#2d363c] hover:bg-[#3d4449] text-white border-0"
              >
                Enable colorblind friendly mode
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
