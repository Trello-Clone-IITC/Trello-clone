import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { updateListTitle, setEditingListId } from "../redux/listSlice";

export const useList = (listId: string) => {
  const dispatch = useDispatch();
  const editingListId = useSelector(
    (state: RootState) => state.list.editingListId
  );
  const isEditing = editingListId === listId;

  const startEditing = useCallback(() => {
    dispatch(setEditingListId(listId));
  }, [dispatch, listId]);

  const stopEditing = useCallback(() => {
    dispatch(setEditingListId(null));
  }, [dispatch]);

  const updateTitle = useCallback(
    (newTitle: string) => {
      dispatch(updateListTitle({ listId, title: newTitle }));
    },
    [dispatch, listId]
  );

  return {
    isEditing,
    startEditing,
    stopEditing,
    updateTitle,
  };
};
