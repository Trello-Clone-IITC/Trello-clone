import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckSquare, Paperclip, Tag, User, Plus, X } from "lucide-react";
import DatesDropdown from "./DatesModal";
import {
  getLabelColorClass,
  getLabelHoverColorClass,
} from "@/shared/constants";
import { clockIconLight, clockIconDark } from "@/assets";
import { useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "@/features/final-final/board/hooks";
import { useCreateChecklist, useUpdateCard } from "../hooks/useCardMutations";
import { ChecklistSection } from "./ChecklistSection";
import { MembersPopover } from "./MembersPopover";
import { AttachmentPopover } from "./AttachmentPopover";
import { DateSection } from "./DateSection";
import { LabelsPopover } from "./LabelsPopover";
import { addMembersIconDark, addMembersIconLight } from "@/assets";
import { useTheme } from "@/hooks/useTheme";
import type { LabelDto, ColorType } from "@ronmordo/contracts";

export const MainContent = ({
  labels,
  description,
  boardId,
  listId,
  cardId,
  startDate,
  dueDate,
  isCompleted = false,
}: {
  labels: LabelDto[];
  description?: string | null;
  boardId: string;
  listId: string;
  cardId: string;
  startDate?: string | null;
  dueDate?: string | null;
  isCompleted?: boolean;
}) => {
  const getLabelClassName = (color: string) => {
    const bgClass = getLabelColorClass(color);
    const hoverClass = getLabelHoverColorClass(color);
    return `${bgClass} ${hoverClass} text-[#b2ebd3]`;
  };

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descDraft, setDescDraft] = useState(description || "");
  const [addingChecklist, setAddingChecklist] = useState(false);
  const [checklistTitle, setChecklistTitle] = useState("Checklist");
  const queryClient = useQueryClient();
  const updateCardMut = useUpdateCard(boardId, listId, cardId);
  const createChecklistMut = useCreateChecklist(boardId, listId, cardId);
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Label handling functions
  const handleLabelToggle = (color: ColorType) => {
    // TODO: Implement label toggle logic
    // This should add/remove a label with the specified color to/from the card
  };

  const handleCreateLabel = () => {
    // TODO: Implement create label logic
  };

  const handleEditLabel = (color: ColorType) => {
    // TODO: Implement edit label logic
    // This should open an edit dialog for the label with the specified color
  };

  const startEdit = () => {
    setDescDraft(description || "");
    setIsEditingDesc(true);
  };

  const addChecklist = async () => {
    const name = checklistTitle.trim() || "Checklist";
    const prev =
      queryClient.getQueryData<{ position?: number }[]>(
        boardKeys.cardChecklists(boardId, listId, cardId)
      ) || [];
    const nextPos =
      (prev?.reduce((m, c) => Math.max(m, c.position ?? 0), 0) ?? 0) + 1000;
    setAddingChecklist(false);
    setChecklistTitle("Checklist");
    await createChecklistMut.mutateAsync({ title: name, position: nextPos });
  };

  const cancelEdit = () => {
    setDescDraft(description || "");
    setIsEditingDesc(false);
  };

  const saveDesc = async () => {
    const next = descDraft.trim();
    const prev = description || "";
    if (next === prev) {
      setIsEditingDesc(false);
      return;
    }
    // Optimistic handled in hook
    setIsEditingDesc(false);
    await updateCardMut.mutateAsync({ description: next });
  };

  return (
    <div className="px-6 pb-6 pt-4 overflow-hidden">
      <main className="space-y-6">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <DropdownMenu>
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
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start gap-3 p-3">
                  <CheckSquare className="size-5 mt-0.5" />
                  <div>
                    <div className="font-medium">Checklist</div>
                    <div className="text-sm text-gray-400">Add subtasks</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start gap-3 p-3">
                  <User className="size-5 mt-0.5" />
                  <div>
                    <div className="font-medium">Members</div>
                    <div className="text-sm text-gray-400">Assign members</div>
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
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {labels.length === 0 && (
            <LabelsPopover
              selectedLabels={labels}
              onLabelToggle={handleLabelToggle}
              onCreateLabel={handleCreateLabel}
              onEditLabel={handleEditLabel}
            >
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-sm border border-[#3c3d40] hover:bg-[#303134] text-[#a9abaf] px-2.5 py-1.5 text-sm font-medium"
              >
                <Tag className="size-4 text-[#a9abaf]" />
                <span>Labels</span>
              </button>
            </LabelsPopover>
          )}
          {!startDate && !dueDate && (
            <DatesDropdown
              initialStartDate={startDate}
              initialDueDate={dueDate}
              onSave={async ({ startDate: s, dueDate: d }) => {
                await updateCardMut.mutateAsync({
                  startDate: s ?? null,
                  dueDate: d ?? null,
                });
              }}
              onClear={async () => {
                await updateCardMut.mutateAsync({
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
                  <img src={clockIconLight} alt="Clock" className="size-4" />
                ) : (
                  <img src={clockIconDark} alt="Clock" className="size-4" />
                )}
                <span>Dates</span>
              </button>
            </DatesDropdown>
          )}
          <Popover open={addingChecklist} onOpenChange={setAddingChecklist}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-sm border border-[#3c3d40] px-2 py-1.5 text-sm font-medium hover:bg-[#303134] text-[#a9abaf] whitespace-nowrap"
              >
                <CheckSquare className="size-4 text-[#a9abaf]" />
                <span>Checklist</span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 bg-[#2b2c2f] border-0 rounded-lg"
              align="start"
              side="bottom"
            >
              {/* Header */}
              <div className="flex items-center justify-center p-4 relative">
                <h3 className="text-[#a9abaf] font-medium text-sm">
                  Add checklist
                </h3>
                <button
                  onClick={() => setAddingChecklist(false)}
                  className="absolute right-4 w-6 h-6 flex items-center justify-center hover:bg-gray-600 transition-colors rounded"
                >
                  <X className="w-4 h-4 text-[#a9abaf]" />
                </button>
              </div>

              {/* Content */}
              <div className="pt-0 px-3 pb-3">
                {/* Title Input */}
                <div className="font-bold mt-3 mb-1 text-xs leading-4 flex flex-col">
                  <label className="block text-sm font-medium text-[#a9abaf] mb-2">
                    Title
                  </label>
                  <input
                    value={checklistTitle}
                    onChange={(e) => setChecklistTitle(e.target.value)}
                    className="w-full h-[41px] py-1 px-3 rounded-[3px] border-1 border-[#3c3d40] bg-[#242528] placeholder:text-[#96999e] text-[#bfc1c4] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-[#85b8ff] focus-visible:border-1"
                    placeholder="Checklist"
                    autoFocus
                  />
                </div>

                {/* Copy Items Dropdown */}
                <div>
                  <label className="block text-sm font-bold text-[#bfc1c4] mb-0.5 mt-3">
                    Copy items from...
                  </label>
                  <select className="w-full h-[48px] py-1 px-[6px] rounded-[3px] border-1 border-[#3c3d40] bg-[#242528] placeholder:text-[#bfc1c4] text-[#bfc1c4] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-[#85b8ff] focus-visible:border-1">
                    <option value="">(none)</option>
                  </select>
                </div>

                {/* Add Button */}
                <div className="flex justify-start">
                  <button
                    onClick={addChecklist}
                    className="bg-[#669df1] hover:bg-[#8fb8f6] text-[#a9abaf] rounded text-sm font-medium  mt-3.5 px-6 py-1.5"
                  >
                    Add
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <MembersPopover members={[]}>
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
              <span>Members</span>
            </button>
          </MembersPopover>
          <AttachmentPopover>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#3c3d40] px-2 py-1.5 text-sm font-medium hover:bg-[#303134] text-[#a9abaf] whitespace-nowrap"
            >
              <Paperclip className="size-4 text-[#a9abaf]" />
              <span>Attachment</span>
            </button>
          </AttachmentPopover>
        </div>

        <div className="flex items-start gap-6">
          <section className="space-y-2">
            <div className="text-sm font-medium text-gray-400">Labels</div>
            <div className="flex items-center gap-2 flex-wrap">
              {labels.map((label, idx) => (
                <span
                  key={label.name || idx}
                  className={`h-8 rounded-[3px] px-3 text-sm font-medium cursor-pointer overflow-hidden max-w-full min-w-[48px] leading-8 text-left text-ellipsis transition-opacity ${getLabelClassName(
                    label.color
                  )}`}
                  title={label.name || ""}
                >
                  {label.name || ""}
                </span>
              ))}
              <LabelsPopover
                selectedLabels={labels}
                onLabelToggle={handleLabelToggle}
                onCreateLabel={handleCreateLabel}
                onEditLabel={handleEditLabel}
              >
                <button className="h-8 w-8 rounded-sm flex items-center justify-center text-gray-400 hover:text-gray-300 bg-[#2c3339] p-1.5">
                  <span className="font-medium">
                    <svg
                      width="16"
                      height="16"
                      role="presentation"
                      focusable="false"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 3C11.4477 3 11 3.44772 11 4V11L4 11C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H11V20C11 20.5523 11.4477 21 12 21C12.5523 21 13 20.5523 13 20V13H20C20.5523 13 21 12.5523 21 12C21 11.4477 20.5523 11 20 11L13 11V4C13 3.44772 12.5523 3 12 3Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                </button>
              </LabelsPopover>
            </div>
          </section>

          {(startDate || dueDate) && (
            <DateSection
              startDate={startDate}
              dueDate={dueDate}
              isCompleted={isCompleted}
              onSave={async ({ startDate: s, dueDate: d }) => {
                await updateCardMut.mutateAsync({
                  startDate: s ?? null,
                  dueDate: d ?? null,
                });
              }}
              onClear={async () => {
                await updateCardMut.mutateAsync({
                  startDate: null,
                  dueDate: null,
                });
              }}
            />
          )}
        </div>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#bfc1c4]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM4 9C3.44772 9 3 9.44772 3 10C3 10.5523 3.44772 11 4 11H20C20.5523 11 21 10.5523 21 10C21 9.44772 20.5523 9 20 9H4ZM3 14C3 13.4477 3.44772 13 4 13H12C12.5523 13 13 13.4477 13 14C13 14.5523 12.5523 15 12 15H4C3.44772 15 3 14.5523 3 14Z"
                clipRule="evenodd"
              />
            </svg>
            Description
          </div>
          {isEditingDesc ? (
            <div>
              <textarea
                value={descDraft}
                onChange={(e) => setDescDraft(e.target.value)}
                className="w-full rounded-md bg-transparent p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                rows={6}
                autoFocus
              />
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={saveDesc}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-[#b1bcca] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ml-auto text-xs text-gray-400 bg-[#2c3339] px-2 py-1 rounded"
                >
                  Formatting help
                </button>
              </div>
            </div>
          ) : (
            <div
              className="rounded-md bg-transparent p-3 text-sm text-[#bfc1c4] cursor-text"
              onClick={startEdit}
            >
              {description || "Add a more detailed description..."}
            </div>
          )}
        </section>

        {/* Checklists */}
        <ChecklistSection boardId={boardId} listId={listId} cardId={cardId} />
      </main>
    </div>
  );
};
