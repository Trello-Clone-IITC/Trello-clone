import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, CheckSquare, Paperclip, Tag, User, Plus, List as ListIcon } from "lucide-react";
import DatesDropdown from "./DatesModal";
import { InlineAction } from "./InlineAction";
import { getLabelColorClass, getLabelHoverColorClass } from "@/shared/constants";
import { useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "@/features/final-aiman/board/hooks";
import { updateCard } from "../api";
import { useCreateChecklist, useUpdateCard } from "../hooks/useCardMutations";
import { ChecklistSection } from "./ChecklistSection";

type Label = { color: string; name?: string | null };

export const MainContent = ({
  labels,
  description,
  boardId,
  listId,
  cardId,
  startDate,
  dueDate,
}: {
  labels: Label[];
  description?: string | null;
  boardId: string;
  listId: string;
  cardId: string;
  startDate?: string | null;
  dueDate?: string | null;
}) => {
  const getLabelClassName = (color: string) => {
    const bgClass = getLabelColorClass(color);
    const hoverClass = getLabelHoverColorClass(color);
    return `${bgClass} ${hoverClass} text-[#1d2125]`;
  };

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descDraft, setDescDraft] = useState(description || "");
  const [addingChecklist, setAddingChecklist] = useState(false);
  const [checklistTitle, setChecklistTitle] = useState("Checklist");
  const queryClient = useQueryClient();
  const updateCardMut = useUpdateCard(boardId, listId, cardId);
  const createChecklistMut = useCreateChecklist(boardId, listId, cardId);

  const startEdit = () => {
    setDescDraft(description || "");
    setIsEditingDesc(true);
  };

  const addChecklist = async () => {
    const name = checklistTitle.trim() || "Checklist";
    const prev = queryClient.getQueryData<any[]>(boardKeys.cardChecklists(boardId, listId, cardId)) || [];
    const nextPos = (prev?.reduce((m, c: any) => Math.max(m, c.position ?? 0), 0) ?? 0) + 1000;
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
        <div className="flex items-center gap-2 min-w-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-sm border border-gray-600 hover:bg-gray-700 text-white px-2.5 py-1.5 text-sm font-medium"
              >
                <Plus className="size-4" />
                <span>Add</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 bg-[#22272b] border-gray-600 text-white">
              <div className="flex items-center justify-between p-3 border-b border-gray-600">
                <h3 className="font-semibold">Add to card</h3>
              </div>
              <div className="p-1">
                <DropdownMenuItem className="flex items-start gap-3 p-3">
                  <Tag className="size-5 mt-0.5" />
                  <div>
                    <div className="font-medium">Labels</div>
                    <div className="text-sm text-gray-400">Organize, categorize, and prioritize</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start gap-3 p-3">
                  <Calendar className="size-5 mt-0.5" />
                  <div>
                    <div className="font-medium">Dates</div>
                    <div className="text-sm text-gray-400">Start dates, due dates, and reminders</div>
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
                    <div className="text-sm text-gray-400">Attach links, pages, work items, and more</div>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <DatesDropdown
            initialStartDate={startDate}
            initialDueDate={dueDate}
            onSave={async ({ startDate: s, dueDate: d }) => {
              await updateCardMut.mutateAsync({ startDate: s ?? null, dueDate: d ?? null });
            }}
            onClear={async () => {
              await updateCardMut.mutateAsync({ startDate: null, dueDate: null });
            }}
          >
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-sm border border-gray-600 hover:bg-gray-700 text-white px-2.5 py-1.5 text-sm font-medium"
            >
              <Calendar className="size-4" />
              <span>Dates</span>
            </button>
          </DatesDropdown>
          <button
            type="button"
            onClick={() => setAddingChecklist((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-sm border border-gray-600 px-2 py-1.5 text-sm font-medium hover:bg-gray-700 text-white whitespace-nowrap"
          >
            <CheckSquare className="size-4" />
            <span>Checklist</span>
          </button>
          <InlineAction icon={<User className="size-4" />} label="Members" />
          <InlineAction icon={<Paperclip className="size-4" />} label="Attachment" />
        </div>

        {addingChecklist && (
          <div className="rounded-md border border-gray-600 bg-[#22272b] p-3 text-sm text-white w-full max-w-sm">
            <div className="font-medium mb-2">Add checklist</div>
            <input
              value={checklistTitle}
              onChange={(e) => setChecklistTitle(e.target.value)}
              className="w-full rounded-sm border border-gray-600 bg-[#161a1d] px-2 py-1 text-sm mb-2"
            />
            <div className="flex items-center gap-2">
              <button onClick={addChecklist} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded">
                Add
              </button>
              <button onClick={() => setAddingChecklist(false)} className="text-[#b1bcca] hover:text-white">
                Cancel
              </button>
            </div>
          </div>
        )}

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
            <button className="h-8 w-8 rounded-sm flex items-center justify-center text-gray-400 hover:text-gray-300 bg-[#2c3339] p-1.5">
              <span className="font-medium">
                <svg width="16" height="16" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3C11.4477 3 11 3.44772 11 4V11L4 11C3.44772 11 3 11.4477 3 12C3 12.5523 3.44772 13 4 13H11V20C11 20.5523 11.4477 21 12 21C12.5523 21 13 20.5523 13 20V13H20C20.5523 13 21 12.5523 21 12C21 11.4477 20.5523 11 20 11L13 11V4C13 3.44772 12.5523 3 12 3Z" fill="currentColor"></path>
                </svg>
              </span>
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
            <ListIcon className="size-4" />
            Description
          </div>
          {isEditingDesc ? (
            <div>
              <textarea
                value={descDraft}
                onChange={(e) => setDescDraft(e.target.value)}
                className="w-full rounded-md border border-gray-600 bg-[#22272b] p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                <button type="button" className="ml-auto text-xs text-gray-400 bg-[#2c3339] px-2 py-1 rounded">
                  Formatting help
                </button>
              </div>
            </div>
          ) : (
            <div
              className="rounded-md border border-gray-600 bg-[#22272b] p-3 text-sm text-gray-400 cursor-text"
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
