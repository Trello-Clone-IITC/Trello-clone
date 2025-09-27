import React, { useMemo, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Search, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { LabelDto, ColorType } from "@ronmordo/contracts";
import { LABEL_COLORS, getLabelColorClass } from "@/shared/constants";

type ViewMode = "list" | "create";

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
  availableLabels: LabelDto[];
  selectedLabelIds: string[];
  onToggle: (labelId: string, isSelected: boolean) => void;
  onCreateLabel: () => void;
  onEditLabel: (labelId: string) => void;
  onSubmitCreate?: (payload: { name: string | null; color: ColorType }) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const LabelsPopover = ({
  children,
  availableLabels,
  selectedLabelIds,
  onToggle,
  onCreateLabel,
  onEditLabel,
  onSubmitCreate,
  open,
  onOpenChange,
}: LabelsPopoverProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalOpen, setInternalOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("list");
  const [draftName, setDraftName] = useState("");
  const [selectedColor, setSelectedColor] = useState<ColorType>(
    "green" as ColorType
  );
  const isOpen = open ?? internalOpen;
  const setIsOpen = (v: boolean) => {
    setInternalOpen(v);
    onOpenChange?.(v);
  };

  // Filter labels based on search term
  const filteredLabels = (availableLabels || []).filter(
    (l) =>
      (l.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.color || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if a label is selected
  const isLabelSelected = (labelId: string) =>
    selectedLabelIds.includes(labelId);

  const handleLabelToggle = (label: LabelDto) => {
    onToggle(label.id as string, isLabelSelected(label.id as string));
  };

  const handleEditLabel = (e: React.MouseEvent, labelId: string) => {
    e.stopPropagation();
    onEditLabel(labelId);
  };

  const colorRows = useMemo(() => {
    const r1 = [
      "subtle_green",
      "subtle_yellow",
      "subtle_orange",
      "subtle_red",
      "subtle_purple",
    ];
    const r2 = ["green", "yellow", "orange", "red", "purple"];
    const r3 = [
      "bold_green",
      "bold_yellow",
      "bold_orange",
      "bold_red",
      "bold_purple",
    ];
    const r4 = [
      "subtle_blue",
      "subtle_sky",
      "subtle_lime",
      "subtle_pink",
      "subtle_black",
    ];
    const r5 = ["blue", "sky", "lime", "pink", "black"];
    const r6 = [
      "bold_blue",
      "bold_sky",
      "bold_lime",
      "bold_pink",
      "bold_black",
    ];
    return [r1, r2, r3, r4, r5, r6] as string[][];
  }, []);

  const resetCreate = () => {
    setDraftName("");
    setSelectedColor("green" as ColorType);
  };

  const closePopover = () => {
    setIsOpen(false);
    setTimeout(() => setView("list"), 0);
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
            {view === "create" ? (
              <button
                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700 flex items-center justify-center rounded-[8px]"
                onClick={() => setView("list")}
                aria-label="Back"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            ) : (
              <span />
            )}
            <h3 className="text-sm font-semibold text-[#a9abaf] px-2 col-start-2 col-span-1 h-10 m-0 leading-10 overflow-ellipsis whitespace-nowrap row-start-1">
              {view === "create" ? "Create label" : "Labels"}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700 col-start-3 col-end-3 flex items-center justify-center rounded-[8px] row-start-1 "
              onClick={closePopover}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {view === "list" ? (
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
                      key={label.id}
                      className="flex items-center gap-3 rounded cursor-pointer pb-1 pl-1"
                      onClick={() => handleLabelToggle(label)}
                    >
                      <Checkbox
                        checked={isLabelSelected(label.id as string)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <div
                        className={`h-8 rounded flex-1 ${getLabelColorClass(
                          label.color as any
                        )} px-3`}
                      />
                      <button
                        className="p-1 hover:bg-[#3d4449] rounded"
                        onClick={(e) => handleEditLabel(e, label.id as string)}
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
                  onClick={() => {
                    resetCreate();
                    setView("create");
                    onCreateLabel?.();
                  }}
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
          ) : (
            <div className="max-h-[817px] pb-3 px-3 pt-0 overflow-x-hidden overflow-y-auto">
              {/* Preview */}
              <div className="bg-[#1d2125] rounded-sm p-3 mb-3">
                <div
                  className={`h-10 rounded-sm ${getLabelColorClass(
                    selectedColor
                  )}`}
                />
              </div>
              {/* Title */}
              <label className="text-sm mb-1 block">Title</label>
              <Input
                placeholder="Enter label name"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="bg-[#161a1d] border-[#2d363c] text-white placeholder-gray-400 focus:border-blue-500 mb-4"
              />
              {/* Color grid built from labelColors.ts (ordered subtle -> regular -> bold) */}
              <div className="mb-2">
                <h4 className="text-xs font-semibold leading-4 mb-2">
                  Select a color
                </h4>
                <div className="space-y-2">
                  {colorRows.map((row, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-2">
                      {row.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c as any)}
                          className={`h-8 rounded-sm ${getLabelColorClass(
                            c
                          )} outline-none border-2 ${
                            selectedColor === (c as any)
                              ? "border-white/70"
                              : "border-transparent"
                          }`}
                          title={c}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <Button
                  onClick={() => setSelectedColor("default" as ColorType)}
                  className="w-full bg-[#2d363c] hover:bg-[#3d4449] text-white border-0 flex items-center gap-2"
                >
                  <X className="h-4 w-4" /> Remove color
                </Button>
              </div>
              <Separator className="my-3" />
              <div>
                <Button
                  onClick={() => {
                    onSubmitCreate?.({
                      name: draftName.trim() ? draftName.trim() : null,
                      color: selectedColor,
                    });
                    closePopover();
                  }}
                  className="w-full bg-[#579dff] hover:bg-[#6aa8ff] text-black border-0"
                >
                  Create
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
