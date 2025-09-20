import React, { useMemo, useState } from "react";
import { useCardChecklists, useChecklistItems } from "@/features/final-aiman/card/hooks/useCardQueries";
import type { ChecklistDto } from "@ronmordo/contracts";
import { CheckSquare } from "lucide-react";
import { useCreateChecklistItem, useDeleteChecklist, useToggleChecklistItem } from "../hooks/useCardMutations";
import { Checkbox } from "@/components/ui/checkbox";

type Props = { boardId: string; listId: string; cardId: string };

export const ChecklistSection: React.FC<Props> = ({ boardId, listId, cardId }) => {
  const { data: checklists } = useCardChecklists(boardId, listId, cardId, true);
  return (
    <section className="space-y-4">
      {checklists?.map((cl) => (
        <SingleChecklist key={cl.id} boardId={boardId} listId={listId} cardId={cardId} checklist={cl} />
      ))}
    </section>
  );
};

const SingleChecklist = ({
  boardId,
  listId,
  cardId,
  checklist,
}: {
  boardId: string;
  listId: string;
  cardId: string;
  checklist: ChecklistDto;
}) => {
  const addItemMut = useCreateChecklistItem(boardId, listId, cardId, checklist.id);
  const toggleItemMut = useToggleChecklistItem(boardId, listId, cardId, checklist.id);
  const deleteChecklistMut = useDeleteChecklist(boardId, listId, cardId);
  const { data: items } = useChecklistItems(boardId, listId, cardId, checklist.id, true);
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);

  const addItem = async () => {
    const t = text.trim();
    if (!t) return;
    const position = (items?.reduce((m, i) => Math.max(m, i.position), 0) ?? 0) + 1000;
    // handled optimistically in hook
    setText("");
    setAdding(false);
    await addItemMut.mutateAsync({ text: t, position });
  };

  const removeChecklist = async () => {
    await deleteChecklistMut.mutateAsync(checklist.id);
  };

  const { progress, displayedItems } = useMemo(() => {
    const total = items?.length ?? 0;
    const done = items?.filter((i) => i.isCompleted).length ?? 0;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    const visible = hideCompleted ? items?.filter((i) => !i.isCompleted) ?? [] : items ?? [];
    return { progress: pct, displayedItems: visible };
  }, [items, hideCompleted]);


  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <CheckSquare className="size-4" />
          <div className="text-sm font-medium">{checklist.title}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHideCompleted((v) => !v)}
            className="text-xs text-gray-300 bg-[#2c3339] hover:bg-[#3a4249] px-3 py-1 rounded"
          >
            {hideCompleted ? "Show checked items" : "Hide checked items"}
          </button>
          <button
            onClick={removeChecklist}
            className="text-xs text-gray-300 bg-[#2c3339] hover:bg-[#3a4249] px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="text-xs text-gray-400">{progress}%</div>
      <div className="h-1 bg-[#303134] rounded overflow-hidden">
        <div className="h-1 bg-[#94c748]" style={{ width: `${progress}%` }} />
      </div>
      <div className="space-y-2">
        {displayedItems?.map((it) => (
          <div
            key={it.id}
            className="flex items-start gap-2 text-sm text-white"
          >
            <Checkbox
              checked={it.isCompleted}
              onCheckedChange={async (checked) => {
                const next = checked as boolean;
                await toggleItemMut.mutateAsync({
                  itemId: it.id,
                  isCompleted: next,
                });
              }}
              className="data-[state=checked]:bg-[#8fb8f6] data-[state=checked]:border-[#8fb8f6] hover:bg-[#8fb8f6] transition ease-in-out w-3.5 h-3.5 border-1 border-[#8590a2] rounded mt-0.5 [&>span>svg]:text-[#242528] [&>span]:bg-transparent"
            />
            <span
              className={
                it.isCompleted ? "line-through text-gray-400" : undefined
              }
            >
              {it.text}
            </span>
          </div>
        ))}
      </div>
      {adding ? (
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-gray-600 bg-[#22272b] p-2 text-sm text-white"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={addItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm"
            >
              Add
            </button>
            <button
              onClick={() => setAdding(false)}
              className="text-[#b1bcca] hover:text-white text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="bg-[#2c3339] hover:bg-[#3a4249] text-gray-200 px-3 py-1.5 rounded text-sm"
        >
          Add an item
        </button>
      )}
    </div>
  );
};
