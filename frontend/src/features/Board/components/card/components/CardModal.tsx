import {
  Calendar,
  CheckSquare,
  Ellipsis,
  FileText,
  List,
  MessageSquare,
  Paperclip,
  Plus,
  Tag,
  User,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DatesDropdown from "./DatesModal";
import * as React from "react";

type CardModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
};

export default function CardModal({
  open,
  onOpenChange,
  title = "Card title",
}: CardModalProps) {
  const [isAddDropdownOpen, setIsAddDropdownOpen] = React.useState(false);
  const [isDatesDropdownOpen, setIsDatesDropdownOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-5xl p-0 bg-[#22272b] border-[#22272b] text-white flex flex-col overflow-hidden gap-0 top-[30px] left-[50%] translate-x-[-50%] translate-y-0"
        showCloseButton={false}
      >
        {/* Cover div */}
        <div className="bg-[#216e4e] h-[116px] rounded-t-lg w-full overflow-hidden relative">
          {/* Header actions in cover */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {/* 3-dot menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <Ellipsis className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-[#22272b] border-gray-600 text-white"
              >
                <DropdownMenuItem className="hover:bg-gray-700">
                  Join
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700">
                  Move
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700">
                  Copy
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700">
                  Mirror
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700">
                  Make template
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700">
                  Watch
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-gray-700">
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-700">
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => onOpenChange?.(false)}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Bottom content container */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_460px] -mt-px overflow-hidden">
          {/* Left side - Title + Main content */}
          <div
            className="border border-[#2d363c] border-t-0 border-r-0 w-full overflow-y-auto"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gridTemplateRows: "0fr 1fr",
              flex: "1 1 auto",
            }}
          >
            {/* Title row */}
            <DialogHeader className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-4 rounded-full border-2 border-gray-400" />
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-xl font-semibold text-white leading-tight">
                    {title}
                  </DialogTitle>
                </div>
              </div>
            </DialogHeader>

            {/* Main content area */}
            <div className="px-6 pb-6 pt-4 overflow-hidden">
              <main className="space-y-6">
                {/* Actions row */}
                <div className="flex items-center gap-2 min-w-0">
                  <DropdownMenu
                    open={isAddDropdownOpen}
                    onOpenChange={setIsAddDropdownOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={`inline-flex items-center gap-2 rounded-sm border px-2.5 py-1.5 text-sm font-medium ${
                          isAddDropdownOpen
                            ? "border-white bg-white text-black"
                            : "border-gray-600 hover:bg-gray-700 text-white"
                        }`}
                      >
                        <Plus className="size-4" />
                        <span>Add</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-80 bg-[#22272b] border-gray-600 text-white"
                    >
                      <div className="flex items-center justify-between p-3 border-b border-gray-600">
                        <h3 className="font-semibold">Add to card</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setIsAddDropdownOpen(false)}
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                      <div className="p-1">
                        <DropdownMenuItem className="flex items-start gap-3 p-3">
                          <Tag className="size-5 mt-0.5" />
                          <div>
                            <div className="font-medium">Labels</div>
                            <div className="text-sm text-gray-400">
                              Organize, categorize, and prioritize
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-start gap-3 p-3">
                          <Calendar className="size-5 mt-0.5" />
                          <div>
                            <div className="font-medium">Dates</div>
                            <div className="text-sm text-gray-400">
                              Start dates, due dates, and reminders
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-start gap-3 p-3">
                          <CheckSquare className="size-5 mt-0.5" />
                          <div>
                            <div className="font-medium">Checklist</div>
                            <div className="text-sm text-gray-400">
                              Add subtasks
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-start gap-3 p-3">
                          <User className="size-5 mt-0.5" />
                          <div>
                            <div className="font-medium">Members</div>
                            <div className="text-sm text-gray-400">
                              Assign members
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-start gap-3 p-3">
                          <Paperclip className="size-5 mt-0.5" />
                          <div>
                            <div className="font-medium">Attachment</div>
                            <div className="text-sm text-gray-400">
                              Attach links, pages, work items, and more
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-start gap-3 p-3">
                          <FileText className="size-5 mt-0.5" />
                          <div>
                            <div className="font-medium">Custom Fields</div>
                            <div className="text-sm text-gray-400">
                              Create your own fields
                            </div>
                          </div>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DatesDropdown
                    open={isDatesDropdownOpen}
                    onOpenChange={setIsDatesDropdownOpen}
                  >
                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 rounded-sm border px-2.5 py-1.5 text-sm font-medium ${
                        isDatesDropdownOpen
                          ? "border-white bg-white text-black"
                          : "border-gray-600 hover:bg-gray-700 text-white"
                      }`}
                    >
                      <Calendar className="size-4" />
                      <span>Dates</span>
                    </button>
                  </DatesDropdown>
                  <InlineAction
                    icon={<CheckSquare className="size-4" />}
                    label="Checklist"
                  />
                  <InlineAction
                    icon={<User className="size-4" />}
                    label="Members"
                  />
                  <InlineAction
                    icon={<Paperclip className="size-4" />}
                    label="Attachment"
                  />
                </div>

                {/* Labels */}
                <section className="space-y-2">
                  <div className="text-sm font-medium text-gray-400">
                    Labels
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="h-8 rounded-[3px] bg-[#4bce97] hover:bg-[#7ee2b8] px-3 text-sm font-medium text-[#1d2125] cursor-pointer overflow-hidden max-w-full min-w-[48px] leading-8 text-left text-ellipsis">
                      Easy
                    </div>
                    <div className="h-8 rounded-[3px] bg-[#e774bb] hover:bg-[#f797d2] px-3 text-sm font-medium text-[#1d2125] cursor-pointer overflow-hidden max-w-full min-w-[48px] leading-8 text-left text-ellipsis">
                      Must Have
                    </div>
                    <button className="h-6 w-6 rounded-sm border border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-300">
                      <span className="text-sm">+</span>
                    </button>
                  </div>
                </section>

                {/* Description */}
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                    <List className="size-4" />
                    Description
                  </div>
                  <div className="rounded-md border border-gray-600 bg-[#22272b] p-3 text-sm text-gray-400">
                    Add a more detailed description...
                  </div>
                </section>
              </main>
            </div>
          </div>

          {/* Right column - Comments & Activity */}
          <aside className="border border-[#2d363c] border-t-0 border-l-0 h-full flex flex-col bg-[#161a1d] overflow-hidden">
            <div className="flex items-center justify-between mb-4 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                <MessageSquare className="size-4" />
                Comments and activity
              </div>
              <button className="text-sm font-medium text-[#b1bcca] bg-[#21272c] hover:bg-[#2d363c] px-3 py-1.5 rounded">
                Show details
              </button>
            </div>
            <div className="space-y-3 flex-1 px-4 pb-4 pt-2">
              <div className="flex gap-3">
                <div className="size-8 shrink-0 rounded-full bg-gray-600" />
                <div className="flex-1">
                  <div className="rounded-md border border-gray-600 bg-[#161a1d] p-2 text-sm text-gray-400">
                    Write a comment...
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="size-8 shrink-0 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                  NC
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white">
                    <span className="font-medium">niv caspi</span> added this
                    card to <span className="font-medium">Must Have!</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Aug 31, 2025, 9:53 PM
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InlineAction({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-sm border border-gray-600 px-2 py-1.5 text-sm font-medium hover:bg-gray-700 text-white whitespace-nowrap"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
