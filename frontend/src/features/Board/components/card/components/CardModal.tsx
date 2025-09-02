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
        className="sm:max-w-5xl p-6 bg-[#22272b] border-[#22272b] text-white top-[215px]"
        showCloseButton={false}
      >
        {/* Title row */}
        <DialogHeader className="mb-6">
          <div className="flex items-center gap-3">
            <div className="size-4 rounded-full border-2 border-gray-400" />
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-2xl font-bold leading-tight break-words">
                {title}
              </DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Card actions"
                    className="h-9 w-9"
                  >
                    <Ellipsis className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem>Join</DropdownMenuItem>
                  <DropdownMenuItem>Move</DropdownMenuItem>
                  <DropdownMenuItem>Copy</DropdownMenuItem>
                  <DropdownMenuItem>Mirror</DropdownMenuItem>
                  <DropdownMenuItem>Make template</DropdownMenuItem>
                  <DropdownMenuItem>Watch</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                aria-label="Close"
                className="h-9 w-9"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Main content area */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[1fr_380px]">
          {/* Left column */}
          <main className="space-y-6">
            {/* Actions row */}
            <div className="flex flex-wrap items-center gap-2">
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
              <div className="text-sm font-medium text-gray-400">Labels</div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-6 rounded-sm bg-green-500 px-2 text-xs font-medium text-white flex items-center">
                  Easy
                </div>
                <div className="h-6 rounded-sm bg-pink-500 px-2 text-xs font-medium text-white flex items-center">
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

          {/* Right column */}
          <aside className="space-y-6">
            {/* Comments & Activity */}
            <section className="space-y-3 bg-[#161a1d] p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                  <MessageSquare className="size-4" />
                  Comments and activity
                </div>
                <button className="text-sm text-gray-400 hover:text-white">
                  Show details
                </button>
              </div>
              <div className="space-y-3">
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
            </section>
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
      className="inline-flex items-center gap-2 rounded-sm border border-gray-600 px-2.5 py-1.5 text-sm font-medium hover:bg-gray-700 text-white"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
