import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
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
import AddChecklistForm from "./AddChecklistForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddBar from "./AddBar";
import AssignedMembers from "./AssignedMembers";
import LabelsRow from "./LabelsRow";
import DescriptionSection from "./DescriptionSection";
import AttachmentsSection from "./AttachmentsSection";

export const MainContent = ({
  labels,
  description,
  boardId,
  listId,
  cardId,
  startDate,
  dueDate,
  isCompleted = false,
  isInbox = false,
}: {
  labels: LabelDto[];
  description?: string | null;
  boardId: string;
  listId: string;
  cardId: string;
  startDate?: string | null;
  dueDate?: string | null;
  isCompleted?: boolean;
  isInbox?: boolean;
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
  const [checklistMenuOpen, setChecklistMenuOpen] = useState(false);
  const [addChecklistDialogOpen, setAddChecklistDialogOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
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
          <AddBar
            boardId={boardId}
            listId={listId}
            cardId={cardId}
            startDate={startDate}
            dueDate={dueDate}
            cardLabels={(cardLabels || []).map((l) => ({ id: l.id as string }))}
            boardLabels={boardLabels}
            boardMembers={boardMembers}
            isLight={isLight}
            onToggleLabel={handleLabelToggle}
            onSaveDates={updateCardMut}
            onClearDates={updateCardMut}
            onAssignMember={assignMemberMut}
            onCreateAttachment={createAttachmentMut}
            onAddChecklist={() => setAddingChecklist(true)}
          />

          {/* Quick action buttons */}
          {!isInbox && labels.length === 0 && (
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
              className="border-0 p-0 bg-transparent"
              align="start"
              side="bottom"
            >
              <AddChecklistForm
                title={checklistTitle}
                onTitleChange={setChecklistTitle}
                onAdd={addChecklist}
                onClose={() => setAddingChecklist(false)}
              />
            </PopoverContent>
          </Popover>

          {!isInbox &&
            card?.cardAssignees &&
            card.cardAssignees.length === 0 && (
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

        <AssignedMembers
          assignees={(card?.cardAssignees ?? []) as any}
          boardMembers={boardMembers}
          onAssign={assignMemberMut}
          onRemove={removeMemberMut}
        />

        <div className="flex items-start gap-6">
          <LabelsRow
            labels={labels as any}
            boardLabels={boardLabels as any}
            selectedLabelIds={(cardLabels || []).map((l) => l.id as string)}
            getLabelClassName={getLabelClassName}
            onToggle={handleLabelToggle}
          />
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

        <DescriptionSection
          description={description}
          isEditing={isEditingDesc}
          draft={descDraft}
          onStartEdit={startEdit}
          onChangeDraft={setDescDraft}
          onSave={saveDesc}
          onCancel={cancelEdit}
        />

        {/* Attachments */}
        <AttachmentsSection
          attachments={attachments as any}
          onEdit={(oldAtt, payload) => {
            deleteAttachmentMut.mutate(oldAtt.id as any);
            createAttachmentMut.mutate(payload);
          }}
          onCommentPrefill={(text) =>
            window.dispatchEvent(
              new CustomEvent("card:addCommentPrefill", { detail: text })
            )
          }
          onRemove={(id) => deleteAttachmentMut.mutate(id as any)}
        />

        {/* Checklists */}
        <ChecklistSection boardId={boardId} listId={listId} cardId={cardId} />
      </main>
      <Dialog
        open={addChecklistDialogOpen}
        onOpenChange={setAddChecklistDialogOpen}
      >
        <DialogContent className="p-0 bg-transparent border-0 shadow-none">
          <AddChecklistForm
            title={checklistTitle}
            onTitleChange={setChecklistTitle}
            onAdd={async () => {
              await addChecklist();
              setAddChecklistDialogOpen(false);
            }}
            onClose={() => setAddChecklistDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
