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
import {
  CheckSquare,
  Paperclip,
  Tag,
  User,
  Plus,
  X,
  Ellipsis,
} from "lucide-react";
import DatesDropdown from "./DatesModal";
import {
  getLabelColorClass,
  getLabelHoverColorClass,
} from "@/shared/constants";
import { clockIconLight, clockIconDark } from "@/assets";
import { useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "@/features/final-final/board/hooks";
import {
  useCreateChecklist,
  useUpdateCard,
  useAssignCardMember,
  useRemoveCardMember,
  useCreateAttachment,
  useDeleteAttachment,
  useToggleCardLabel,
} from "../hooks/useCardMutations";
import { ChecklistSection } from "./ChecklistSection";
import UserModal from "./UserModal";
import { MembersPopover } from "./MembersPopover";
import {
  useBoardMembers,
  useBoardLabels,
} from "@/features/final-final/board/hooks";
import { AttachmentPopover } from "./AttachmentPopover";
import { DateSection } from "./DateSection";
import { useCardAttachments, useCardLabels } from "../hooks/useCardQueries";
import { LabelsPopover } from "./LabelsPopover";
import { addMembersIconDark, addMembersIconLight } from "@/assets";
import { useTheme } from "@/hooks/useTheme";
import type { LabelDto, ColorType } from "@ronmordo/contracts";
import { useCard } from "../hooks/useCardQueries";

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
  const assignMemberMut = useAssignCardMember(boardId, listId, cardId);
  const removeMemberMut = useRemoveCardMember(boardId, listId, cardId);
  const createAttachmentMut = useCreateAttachment(boardId, listId, cardId);
  const deleteAttachmentMut = useDeleteAttachment(boardId, listId, cardId);
  const { data: attachments } = useCardAttachments(
    boardId,
    listId,
    cardId,
    true
  );
  const { data: cardLabels } = useCardLabels(boardId, listId, cardId, true);
  console.log(attachments);
  const { data: boardMembers } = useBoardMembers(boardId);
  const { data: boardLabels } = useBoardLabels(boardId);
  const { data: card } = useCard(boardId, listId, cardId);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const userById = new Map((boardMembers ?? []).map((m) => [m.userId, m.user]));
  const toggleLabelMut = useToggleCardLabel(boardId, listId, cardId);

  // Label handling functions
  const handleLabelToggle = (labelId: string, isSelected: boolean) => {
    toggleLabelMut.mutate({ labelId, add: !isSelected });
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
              availableLabels={boardLabels || []}
              selectedLabelIds={(cardLabels || []).map((l) => l.id as string)}
              onToggle={handleLabelToggle}
              onCreateLabel={handleCreateLabel}
              onEditLabel={() => {}}
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
          {card?.cardAssignees && card.cardAssignees.length === 0 && (
            <MembersPopover
              members={(boardMembers ?? []).map((m) => ({
                id: m.userId,
                fullName: m.user.fullName || "Member",
                username: m.user.username || "",
                avatarUrl: m.user.avatarUrl,
              }))}
              selectedIds={[]}
              onSelect={(member) => {
                assignMemberMut.mutate(member.id);
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
                <span>Members</span>
              </button>
            </MembersPopover>
          )}
          <AttachmentPopover
            onInsert={({ url, displayText }) =>
              createAttachmentMut.mutate({ url, displayText })
            }
          >
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-sm border border-[#3c3d40] px-2 py-1.5 text-sm font-medium hover:bg-[#303134] text-[#a9abaf] whitespace-nowrap"
            >
              <Paperclip className="size-4 text-[#a9abaf]" />
              <span>Attachment</span>
            </button>
          </AttachmentPopover>
        </div>

        {card?.cardAssignees && card.cardAssignees.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-400 mb-2">
              Members
            </div>
            <div className="flex items-center gap-2">
              {(card?.cardAssignees ?? []).map((a) => {
                return (
                  <UserModal
                    key={a.id}
                    trigger={
                      <div className="w-9 h-9 rounded-full overflow-hidden">
                        <img
                          src={a.avatarUrl}
                          alt={a.fullName || ""}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      </div>
                    }
                    user={{
                      fullName: a.fullName,
                      username: a.username,
                      avatarUrl: a.avatarUrl,
                    }}
                    onRemove={() => removeMemberMut.mutate(a.id)}
                  >
                    <button
                      onClick={() => removeMemberMut.mutate(a.id)}
                      className="w-full text-left px-4 py-3 text-sm text-[#bfc1c4] hover:bg-[#32373c]"
                    >
                      Remove from card
                    </button>
                  </UserModal>
                );
              })}
              <MembersPopover
                members={(boardMembers ?? []).map((m) => ({
                  id: m.userId,
                  fullName: m.user.fullName || "Member",
                  username: m.user.username || "",
                  avatarUrl: m.user.avatarUrl,
                }))}
                selectedIds={(card?.cardAssignees ?? []).map((m) => m.id)}
                onSelect={(member) => {
                  assignMemberMut.mutate(member.id);
                }}
              >
                <button
                  type="button"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[#393b3e] text-[#a9abaf] text-lg font-bold border-none hover:bg-[#44474a] transition-colors"
                  aria-label="Add member"
                >
                  +
                </button>
              </MembersPopover>
            </div>
          </div>
        )}

        {true && (
          <div className="flex items-start gap-6">
            <section className="space-y-2">
              <div className="text-sm font-medium text-gray-400">Labels</div>
              <div className="flex items-center gap-2 flex-wrap">
                {labels.map((label, idx) => (
                  <span
                    key={label.name || idx}
                    className={`h-8 rounded-[3px] px-3 text-sm font-normal cursor-pointer overflow-hidden max-w-full min-w-[48px] leading-8 text-left text-ellipsis transition-opacity ${getLabelClassName(
                      label.color
                    )} text-black text-opacity-100 mix-blend-normal`}
                    title={label.name || ""}
                  >
                    {label.name || ""}
                  </span>
                ))}
                <LabelsPopover
                  availableLabels={boardLabels || []}
                  selectedLabelIds={(cardLabels || []).map(
                    (l) => l.id as string
                  )}
                  onToggle={handleLabelToggle}
                  onCreateLabel={handleCreateLabel}
                  onEditLabel={() => {}}
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
        )}

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

        {/* Attachments */}
        <section className="space-y-2 mt-3">
          {attachments && attachments.length > 0 && (
            <div className="text-sm font-medium text-gray-400">Attachments</div>
          )}
          <div className="space-y-2">
            {(attachments ?? []).map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between bg-[#1e2022] rounded px-3 py-2"
              >
                <a
                  href={att.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#85b8ff] text-sm truncate max-w-[75%]"
                  title={att.url}
                >
                  {(att as any).displayText || att.filename || att.url}
                </a>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="w-7 h-7 rounded bg-[#2b2c2f] hover:bg-[#32373c] flex items-center justify-center"
                      aria-label="Attachment actions"
                    >
                      <Ellipsis className="w-4 h-4 text-[#bfc1c4]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-40 bg-[#2b2c2f] border-[#3c3d40] text-white"
                  >
                    <div className="p-1">
                      <AttachmentPopover
                        initialUrl={att.url}
                        initialDisplayText={
                          (att as any).displayText || att.filename
                        }
                        onInsert={({ url, displayText }) => {
                          deleteAttachmentMut.mutate(att.id as any);
                          createAttachmentMut.mutate({ url, displayText });
                        }}
                        onClose={() => {}}
                      >
                        <button className="w-full text-left px-2 py-1 text-sm hover:bg-[#3a3f45] rounded">
                          Edit
                        </button>
                      </AttachmentPopover>
                      <button
                        className="w-full text-left px-2 py-1 text-sm hover:bg-[#3a3f45] rounded"
                        onClick={() => {
                          const text =
                            (att as any).displayText || att.filename || att.url;
                          window.dispatchEvent(
                            new CustomEvent("card:addCommentPrefill", {
                              detail: text,
                            })
                          );
                        }}
                      >
                        Comment
                      </button>
                      <button
                        className="w-full text-left px-2 py-1 text-sm text-red-400 hover:bg-[#3a3f45] rounded"
                        onClick={() =>
                          deleteAttachmentMut.mutate(att.id as any)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </section>

        {/* Checklists */}
        <ChecklistSection boardId={boardId} listId={listId} cardId={cardId} />
      </main>
    </div>
  );
};
