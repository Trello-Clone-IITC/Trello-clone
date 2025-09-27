import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ListDto } from "@ronmordo/contracts";
import { boardKeys } from "@/features/board/hooks";
import { emitUpdateList } from "@/features/board/socket";

export const useList = (listId: string, boardId: string) => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const startEditing = useCallback(() => setIsEditing(true), []);
  const stopEditing = useCallback(() => setIsEditing(false), []);

  const updateTitle = useCallback(
    (newTitle: string) => {
      const name = newTitle.trim();
      if (!name) {
        setIsEditing(false);
        return;
      }

      // Optimistic update of the list name in the lists cache
      queryClient.setQueryData<ListDto[] | undefined>(
        boardKeys.lists(boardId),
        (prev) => prev?.map((l) => (l.id === listId ? { ...l, name } : l))
      );

      // Emit socket update; realtime will reconcile
      emitUpdateList(boardId, listId, { name });

      setIsEditing(false);
    },
    [boardId, listId, queryClient]
  );

  return {
    isEditing,
    startEditing,
    stopEditing,
    updateTitle,
  };
};
