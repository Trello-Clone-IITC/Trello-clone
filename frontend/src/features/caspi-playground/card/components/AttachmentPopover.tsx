import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Info, Upload } from "lucide-react";

interface AttachmentPopoverProps {
  children: React.ReactNode;
}

export const AttachmentPopover: React.FC<AttachmentPopoverProps> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [activeTab, setActiveTab] = useState<"trello" | "confluence">("trello");

  const handleFileUpload = () => {
    console.log("File upload clicked");
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkText(e.target.value);
    console.log("Link text changed:", e.target.value);
  };

  const handleDisplayTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayText(e.target.value);
    console.log("Display text changed:", e.target.value);
  };

  const handleTabChange = (tab: "trello" | "confluence") => {
    setActiveTab(tab);
    console.log("Tab changed to:", tab);
  };

  const handleCancel = () => {
    console.log("Cancel clicked");
    setOpen(false);
  };

  const handleInsert = () => {
    console.log("Insert clicked with link:", linkText, "display:", displayText);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 bg-[#2b2c2f] border-0 rounded-lg"
        align="start"
        side="top"
        sideOffset={-200}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#46474b]">
          <div className="flex items-center gap-2">
            <h3 className="text-[#a9abaf] font-medium text-sm">Attach</h3>
            <Info className="w-4 h-4 text-[#96999e]" />
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-600 transition-colors rounded-full"
          >
            <X className="w-4 h-4 text-[#a9abaf]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Attach a file from your computer */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[#bfc1c4]">
              Attach a file from your computer
            </h4>
            <p className="text-xs text-[#96999e]">
              You can also drag and drop files to upload them.
            </p>
            <button
              onClick={handleFileUpload}
              className="w-full h-[41px] bg-[#242528] border border-[#7e8188] rounded-[3px] text-[#bfc1c4] text-sm font-medium hover:bg-[#2a2d30] transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Choose a file
            </button>
          </div>

          {/* Search or paste a link */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[#bfc1c4]">
              Search or paste a link
            </h4>
            <input
              type="text"
              value={linkText}
              onChange={handleLinkChange}
              placeholder="Find recent links or paste a new link"
              className="w-full h-[41px] py-1 px-3 rounded-[3px] border-1 border-[#7e8188] bg-[#242528] placeholder:text-[#96999e] text-[#bfc1c4] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-[#85b8ff] focus-visible:border-1"
            />
          </div>

          {/* Display text (optional) */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[#bfc1c4]">
              Display text (optional)
            </h4>
            <input
              type="text"
              value={displayText}
              onChange={handleDisplayTextChange}
              placeholder="Text to display"
              className="w-full h-[41px] py-1 px-3 rounded-[3px] border-1 border-[#7e8188] bg-[#242528] placeholder:text-[#96999e] text-[#bfc1c4] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-[#85b8ff] focus-visible:border-1"
            />
            <p className="text-xs text-[#96999e]">
              Give this link a title or description.
            </p>
          </div>

          {/* Integration Tabs */}
          <div className="space-y-3">
            <div className="flex border-b border-[#46474b]">
              <button
                onClick={() => handleTabChange("trello")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "trello"
                    ? "border-[#85b8ff] text-[#85b8ff]"
                    : "border-transparent text-[#96999e] hover:text-[#bfc1c4]"
                }`}
              >
                Trello
              </button>
              <button
                onClick={() => handleTabChange("confluence")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "confluence"
                    ? "border-[#85b8ff] text-[#85b8ff]"
                    : "border-transparent text-[#96999e] hover:text-[#bfc1c4]"
                }`}
              >
                Confluence
              </button>
            </div>

            {/* Recently Viewed Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#bfc1c4]">
                Recently Viewed
              </h4>
              <div className="space-y-2">
                {/* Empty state for now */}
                <div className="text-xs text-[#96999e] text-center py-4">
                  No recent items
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#46474b]">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-[#bfc1c4] bg-[#242528] border border-[#7e8188] rounded-[3px] hover:bg-[#2a2d30] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="px-4 py-2 text-sm font-medium text-white bg-[#85b8ff] rounded-[3px] hover:bg-[#7aa3f0] transition-colors"
          >
            Insert
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
