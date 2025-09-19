import { useState, useCallback } from "react";

export const useList = (listId: string) => {
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = useCallback(() => setIsEditing(true), []);
  const stopEditing = useCallback(() => setIsEditing(false), []);
  const updateTitle = useCallback((_: string) => {}, []);

  return {
    isEditing,
    startEditing,
    stopEditing,
    updateTitle,
  };
};

