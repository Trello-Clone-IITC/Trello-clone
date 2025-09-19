import React, { useMemo, useState } from "react";
import type { ChecklistDto, ChecklistItemDto } from "@ronmordo/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createChecklistItem,
  deleteChecklistItem,
  updateChecklistItem,
} from "../../api";
import { useAimanChecklistItems, aimanKeys } from "../../hooks/useAimansBoard";

type Props = {
  boardId: string;
  listId: string;
  cardId: string;
  checklist: ChecklistDto;
  onDeleteChecklist?: (id: string) => void;
  enabled?: boolean;
};

export function ChecklistSection({
  boardId,
  listId,
  cardId,
  checklist,
  onDeleteChecklist,
  enabled = true,
}: Props) {
  const queryClient = useQueryClient();

  const { data: items } = useAimanChecklistItems(
    boardId,
    listId,
    cardId,
    checklist.id,
    enabled
  );

  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");

  const addItemMut = useMutation({
    mutationFn: (payload: { text: string }) =>
      createChecklistItem(cardId, checklist.id, payload.text),
    onSuccess: () => {
      setText("");
      setAdding(false);
      queryClient.invalidateQueries({
        queryKey: aimanKeys.checklistItems(boardId, listId, cardId, checklist.id),
      });
    },
  });

  const toggleItemMut = useMutation({
    mutationFn: (item: ChecklistItemDto) =>
      updateChecklistItem(cardId, checklist.id, item.id, {
        isCompleted: !item.isCompleted,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: aimanKeys.checklistItems(boardId, listId, cardId, checklist.id),
      });
    },
  });

  const deleteItemMut = useMutation({
    mutationFn: (itemId: string) =>
      deleteChecklistItem(cardId, checklist.id, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: aimanKeys.checklistItems(boardId, listId, cardId, checklist.id),
      });
    },
  });

  const progress = useMemo(() => {
    const total = items?.length ?? 0;
    const done = items?.filter((i) => i.isCompleted).length ?? 0;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pct };
  }, [items]);

  return (
    <div className="flex flex-col gap-2 border border-[#2d363c] rounded p-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Checklist</div>
        {onDeleteChecklist && (
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400"
            onClick={() => onDeleteChecklist(checklist.id)}
          >
            Delete
          </Button>
        )}
      </div>

      <div className="text-xs text-[#b6c2cf]">{progress.pct}%</div>
      <div className="h-1 bg-[#2d363c] rounded">
        <div
          className="h-1 bg-blue-500 rounded"
          style={{ width: `${progress.pct}%` }}
        />
      </div>

      <div className="flex flex-col gap-2 mt-2">
        {items?.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-[#b6c2cf]">
              <input
                type="checkbox"
                checked={item.isCompleted}
                onChange={() => toggleItemMut.mutate(item)}
                className="accent-blue-500 w-4 h-4"
              />
              <span className={item.isCompleted ? "line-through" : ""}>{item.text}</span>
            </label>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-400"
              onClick={() => deleteItemMut.mutate(item.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      {!adding ? (
        <Button variant="secondary" size="sm" className="w-fit" onClick={() => setAdding(true)}>
          Add an item
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add an item"
          />
          <div className="flex items-center gap-2">
            <Button
              onClick={() => text.trim() && addItemMut.mutate({ text: text.trim() })}
              disabled={addItemMut.isPending || !text.trim()}
            >
              Add
            </Button>
            <Button variant="ghost" onClick={() => { setAdding(false); setText(""); }}>
              Cancel
            </Button>
            <div className="text-xs text-[#b6c2cf] flex items-center gap-4 ml-2">
              <span>Assign</span>
              <span>Due date</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChecklistSection;

