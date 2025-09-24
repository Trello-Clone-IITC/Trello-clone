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
  boardLabels: any[] | undefined;
  boardMembers: any[] | undefined;
  isLight: boolean;
  onToggleLabel: (labelId: string, isSelected: boolean) => void;
  onSaveDates: { mutateAsync: (payload: any) => Promise<any> };
  onClearDates: { mutateAsync: (payload: any) => Promise<any> };
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
          className="w-80 bg-[#22272b] border-gray-600 text-white"
        >
          <div className="flex items-center justify-between p-3 border-b border-gray-600">
            <h3 className="font-semibold">Add to card</h3>
          </div>
          <div className="p-1">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-start gap-3 p-3">
                <Tag className="size-5 mt-0.5" />
                <div>
                  <div className="font-medium">Labels</div>
                  <div className="text-sm text-gray-400">
                    Organize, categorize, and prioritize
                  </div>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                className="p-2 bg-[#22272b] border-gray-600 text-white"
                side="right"
                align="start"
              >
                <LabelsPopover
                  availableLabels={boardLabels || []}
                  selectedLabelIds={(cardLabels || []).map((l: any) => l.id)}
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
              <DropdownMenuSubTrigger className="flex items-start gap-3 p-3">
                {isLight ? (
                  <img
                    src={clockIconLight}
                    alt="Clock"
                    className="size-5 mt-0.5"
                  />
                ) : (
                  <img
                    src={clockIconDark}
                    alt="Clock"
                    className="size-5 mt-0.5"
                  />
                )}
                <div>
                  <div className="font-medium">Dates</div>
                  <div className="text-sm text-gray-400">
                    Start dates, due dates, and reminders
                  </div>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                className="p-2 bg-[#22272b] border-gray-600 text-white"
                side="right"
                align="start"
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
              <DropdownMenuSubTrigger className="flex items-start gap-3 p-3">
                <CheckSquare className="size-5 mt-0.5" />
                <div>
                  <div className="font-medium">Checklist</div>
                  <div className="text-sm text-gray-400">Add subtasks</div>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                className="p-2 bg-[#22272b] border-gray-600 text-white"
                side="right"
                align="start"
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
              <DropdownMenuSubTrigger className="flex items-start gap-3 p-3">
                <User className="size-5 mt-0.5" />
                <div>
                  <div className="font-medium">Members</div>
                  <div className="text-sm text-gray-400">Assign members</div>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                className="p-2 bg-[#22272b] border-gray-600 text-white"
                side="right"
                align="start"
              >
                <MembersPopover
                  members={(boardMembers ?? []).map((m: any) => ({
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
              <DropdownMenuSubTrigger className="flex items-start gap-3 p-3">
                <Paperclip className="size-5 mt-0.5" />
                <div>
                  <div className="font-medium">Attachment</div>
                  <div className="text-sm text-gray-400">
                    Attach links, pages, work items, and more
                  </div>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                className="p-2 bg-[#22272b] border-gray-600 text-white"
                side="right"
                align="start"
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
