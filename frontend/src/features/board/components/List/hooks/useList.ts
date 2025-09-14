import { useState, useCallback } from "react";
import {
  useList as useListQuery,
  useUpdateList,
  useDeleteList,
} from "./useListQueries";
import { useCreateCard } from "../../card/hooks/useCardQueries";

export const useList = (listId: string) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingListId, setEditingListId] = useState<string | null>(null);

  // React Query hooks
  const { data: list, isLoading, error } = useListQuery(listId);
  const updateListMutation = useUpdateList();
  const deleteListMutation = useDeleteList();
  const createCardMutation = useCreateCard();

  const startEditing = useCallback(() => {
    setIsEditing(true);
    setEditingListId(listId);
  }, [listId]);

  const stopEditing = useCallback(() => {
    setIsEditing(false);
    setEditingListId(null);
  }, []);

  const updateTitle = useCallback(
    (newTitle: string) => {
      updateListMutation.mutate({
        listId,
        listData: { title: newTitle },
      });
    },
    [updateListMutation, listId]
  );

  const deleteListAction = useCallback(() => {
    deleteListMutation.mutate(listId);
  }, [deleteListMutation, listId]);

  const addCard = useCallback(
    (cardData: { title: string; description?: string }) => {
      createCardMutation.mutate({
        title: cardData.title,
        description: cardData.description,
        listId,
        position: list?.cards?.length || 0,
      });
    },
    [createCardMutation, listId, list?.cards?.length]
  );

  return {
    list,
    isLoading,
    error,
    isEditing,
    startEditing,
    stopEditing,
    updateTitle,
    deleteList: deleteListAction,
    addCard,
    isCurrentlyEditing: editingListId === listId,
    // Mutation states for loading indicators
    isUpdating: updateListMutation.isPending,
    isDeleting: deleteListMutation.isPending,
    isCreatingCard: createCardMutation.isPending,
  };
};
