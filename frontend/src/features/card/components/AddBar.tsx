import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tag, CheckSquare, User, Paperclip, Plus } from "lucide-react";
import type { ColorType } from "@ronmordo/contracts";
import { LabelsPopover } from "./LabelsPopover";
import DatesDropdown from "./DatesModal";
import { MembersPopover } from "./MembersPopover";
import { AttachmentPopover } from "./AttachmentPopover";
import {
  clockIconLight,
  clockIconDark,
  addMembersIconDark,
  addMembersIconLight,
} from "@/assets";

type AddBarProps = {
  boardId: string;
  listId: string;
  cardId: string;
  startDate?: string | null;
  dueDate?: string | null;
  cardLabels: { id: string }[] | undefined;
  boardLabels:
    | { id: string; boardId: string; name: string; color: ColorType }[]
    | undefined;
  boardMembers:
    | {
        userId: string;
        user: { fullName?: string; username?: string; avatarUrl?: string };
      }[]
    | undefined;
  isLight: boolean;
  onToggleLabel: (labelId: string, isSelected: boolean) => void;
  onSaveDates: {
    mutateAsync: (payload: {
      startDate: string | null;
      dueDate: string | null;
    }) => Promise<unknown>;
  };
  onClearDates: {
    mutateAsync: (payload: {
      startDate: string | null;
      dueDate: string | null;
    }) => Promise<unknown>;
  };
  onAssignMember: { mutate: (userId: string) => void };
  onCreateAttachment: {
    mutate: (payload: { url: string; displayText?: string }) => void;
  };
  onAddChecklist: () => void;
};

export const AddBar: React.FC<AddBarProps> = ({
  startDate,
  dueDate,
  cardLabels,
  boardLabels,
  boardMembers,
  isLight,
  onToggleLabel,
  onSaveDates,
  onClearDates,
  onAssignMember,
  onCreateAttachment,
  onAddChecklist,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <div className="flex items-center gap-2 min-w-0 flex-wrap">
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-sm border-1 border-[#3c3d40] hover:bg-[#303134] text-[#a9abaf] px-2.5 py-1.5 text-sm font-medium"
          >
            <Plus className="size-4" />
            <span>Add</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[304px] bg-[#2b2c2f] border-0 text-[#bfc1c4] rounded-[8px] shadow-lg"
          style={{
            boxShadow: "0px 8px 12px #0104045C, 0px 0px 1px #01040480",
            borderRadius: "8px",
            outline: "0",
            backgroundColor: "#2b2c2f",
            position: "fixed",
            maxHeight: "817px",
          }}
        >
          <div className="flex items-center justify-between p-4 border-b border-[#3c3d40]">
            <h3 className="font-semibold text-[#bfc1c4] text-lg">
              Add to card
            </h3>
            <button
              className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded"
              onClick={() => setMenuOpen(false)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
          </div>
          <div className="p-0">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-start gap-3 p-3 hover:bg-[#3d3f43] transition-colors">
                <div className="w-6 h-6 flex items-center justify-center mt-0.5">
                  <Tag className="size-5 text-[#7e8188]" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-[#bfc1c4] text-sm">
                    Labels
                  </div>
                  <div className="text-xs text-[#96999e] mt-0.5">
                    Organize, categorize, and prioritize
                  </div>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                className="p-2 bg-[#2b2c2f] border-0 text-[#bfc1c4] rounded-[8px] shadow-lg"
                sideOffset={4}
                style={{
                  boxShadow: "0px 8px 12px #0104045C, 0px 0px 1px #01040480",
                  borderRadius: "8px",
                  outline: "0",
                  backgroundColor: "#2b2c2f",
                }}
              >
                <LabelsPopover
                  availableLabels={boardLabels || []}
                  selectedLabelIds={(cardLabels || []).map((l) => l.id)}
                  onToggle={onToggleLabel}
                  onCreateLabel={() => {}}
                  onEditLabel={() => {}}
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-sm border border-[#3c3d40] hover:bg-[#303134] text-[#a9abaf] px-2.5 py-1.5 text-sm font-medium"
                  >
                    <Tag className="size-4 text-[#a9abaf]" />
                    <span>Open labels</span>
                  </button>
                </LabelsPopover>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-start gap-3 p-3 hover:bg-[#3d3f43] transition-colors">
                <div className="w-6 h-6 flex items-center justify-center mt-0.5">
                  {isLight ? (
                    <img src={clockIconLight} alt="Clock" className="size-5" />
                  ) : (
                    <img src={clockIconDark} alt="Clock" className="size-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-[#bfc1c4] text-sm">
                    Dates
                  </div>
                  <div className="text-xs text-[#96999e] mt-0.5">
                    Start dates, due dates, and reminders
                  </div>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                className="p-2 bg-[#2b2c2f] border-0 text-[#bfc1c4] rounded-[8px] shadow-lg"
                sideOffset={4}
                style={{
                  boxShadow: "0px 8px 12px #0104045C, 0px 0px 1px #01040480",
                  borderRadius: "8px",
                  outline: "0",
                  backgroundColor: "#2b2c2f",
                }}
              >
                <DatesDropdown
                  initialStartDate={startDate}
                  initialDueDate={dueDate}
                  onSave={async ({ startDate: s, dueDate: d }) => {
                    await onSaveDates.mutateAsync({
                      startDate: s ?? null,
                      dueDate: d ?? null,
                    });
                  }}
                  onClear={async () => {
                    await onClearDates.mutateAsync({
                      startDate: null,
                      dueDate: null,
                    });
                  }}
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-sm border border-[#3c3d40] hover:bg-[#303134] text-[#a9abaf] px-2.5 py-1.5 text-sm font-medium"
                  >
                    {isLight ? (
                      <img
                        src={clockIconLight}
                        alt="Clock"
                        className="size-4"
                      />
                    ) : (
                      <img src={clockIconDark} alt="Clock" className="size-4" />
                    )}
                    <span>Open dates</span>
                  </button>
                </DatesDropdown>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-start gap-3 p-3 hover:bg-[#3d3f43] transition-colors">
                <div className="w-6 h-6 flex items-center justify-center mt-0.5">
                  <CheckSquare className="size-5 text-[#7e8188]" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-[#bfc1c4] text-sm">
                    Checklist
                  </div>
                  <div className="text-xs text-[#96999e] mt-0.5">
                    Add subtasks
                  </div>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                className="p-2 bg-[#2b2c2f] border-0 text-[#bfc1c4] rounded-[8px] shadow-lg"
                sideOffset={4}
                style={{
                  boxShadow: "0px 8px 12px #0104045C, 0px 0px 1px #01040480",
                  borderRadius: "8px",
                  outline: "0",
                  backgroundColor: "#2b2c2f",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    onAddChecklist();
                    setMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-sm border border-[#3c3d40] hover:bg-[#303134] text-[#a9abaf] px-2.5 py-1.5 text-sm font-medium"
                >
                  <CheckSquare className="size-4 text-[#a9abaf]" />
                  <span>Open checklist</span>
                </button>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-start gap-3 p-3 hover:bg-[#3d3f43] transition-colors">
                <div className="w-6 h-6 flex items-center justify-center mt-0.5">
                  <User className="size-5 text-[#7e8188]" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-[#bfc1c4] text-sm">
                    Members
                  </div>
                  <div className="text-xs text-[#96999e] mt-0.5">
                    Assign members
                  </div>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                className="p-2 bg-[#2b2c2f] border-0 text-[#bfc1c4] rounded-[8px] shadow-lg"
                sideOffset={4}
                style={{
                  boxShadow: "0px 8px 12px #0104045C, 0px 0px 1px #01040480",
                  borderRadius: "8px",
                  outline: "0",
                  backgroundColor: "#2b2c2f",
                }}
              >
                <MembersPopover
                  members={(boardMembers ?? []).map((m) => ({
                    id: m.userId,
                    fullName: m.user.fullName || "Member",
                    username: m.user.username || "",
                    avatarUrl: m.user.avatarUrl,
                  }))}
                  selectedIds={[]}
                  onSelect={(member) => {
                    onAssignMember.mutate(member.id);
                  }}
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-sm border border-[#3c3d40] px-2 py-1.5 text-sm font-medium hover:bg-[#303134] text-[#a9abaf] whitespace-nowrap"
                  >
                    {isLight ? (
                      <img
                        src={addMembersIconLight}
                        alt="Members"
                        className="w-4 h-4"
                      />
                    ) : (
                      <img
                        src={addMembersIconDark}
                        alt="Members"
                        className="w-4 h-4"
                      />
                    )}
                    <span>Open members</span>
                  </button>
                </MembersPopover>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-start gap-3 p-3 hover:bg-[#3d3f43] transition-colors">
                <div className="w-6 h-6 flex items-center justify-center mt-0.5">
                  <Paperclip className="size-5 text-[#7e8188]" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-[#bfc1c4] text-sm">
                    Attachment
                  </div>
                  <div className="text-xs text-[#96999e] mt-0.5">
                    Attach links, pages, work items, and more
                  </div>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                className="p-2 bg-[#2b2c2f] border-0 text-[#bfc1c4] rounded-[8px] shadow-lg"
                sideOffset={4}
                style={{
                  boxShadow: "0px 8px 12px #0104045C, 0px 0px 1px #01040480",
                  borderRadius: "8px",
                  outline: "0",
                  backgroundColor: "#2b2c2f",
                }}
              >
                <AttachmentPopover onInsert={onCreateAttachment.mutate}>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-sm border border-[#3c3d40] px-2 py-1.5 text-sm font-medium hover:bg-[#303134] text-[#a9abaf] whitespace-nowrap"
                  >
                    <span>Open attachment</span>
                  </button>
                </AttachmentPopover>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AddBar;
