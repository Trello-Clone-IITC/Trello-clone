import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getList,
  createList,
  updateList,
  deleteList,
  updateListPosition,
  archiveList,
  type List,
  type CreateListData,
  type UpdateListData,
} from "../api";

// Query keys for list-related queries
export const listKeys = {
  all: ["lists"] as const,
  details: () => [...listKeys.all, "detail"] as const,
  detail: (id: string) => [...listKeys.details(), id] as const,
  board: (boardId: string) => [...listKeys.all, "board", boardId] as const,
};

// Hook to get a single list
export const useList = (listId: string, enabled: boolean = true) => {
  return useQuery<List>({
    queryKey: listKeys.detail(listId),
    queryFn: () => getList(listId),
    enabled: enabled && !!listId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create a new list
export const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createList,
    onSuccess: (newList) => {
      // Add the new list to the cache
      queryClient.setQueryData(listKeys.detail(newList.id), newList);

      // Invalidate board lists to refetch with new list
      queryClient.invalidateQueries({
        queryKey: listKeys.board(newList.boardId),
      });

      // Invalidate full board data to refetch with new list
      queryClient.invalidateQueries({
        queryKey: ["boards", "detail", newList.boardId, "full"],
      });

      console.log("List created successfully!");
    },
    onError: (error: any) => {
      console.error("Error creating list:", error);
      console.error(error?.response?.data?.message || "Failed to create list");
    },
  });
};

// Hook to update a list
export const useUpdateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      listId,
      listData,
    }: {
      listId: string;
      listData: UpdateListData;
    }) => updateList(listId, listData),
    onSuccess: (updatedList) => {
      // Update the list in cache
      queryClient.setQueryData(listKeys.detail(updatedList.id), updatedList);

      // Invalidate board lists to refetch with updated info
      queryClient.invalidateQueries({
        queryKey: listKeys.board(updatedList.boardId),
      });

      // Invalidate full board data to refetch with updated info
      queryClient.invalidateQueries({
        queryKey: ["boards", "detail", updatedList.boardId, "full"],
      });

      console.log("List updated successfully!");
    },
    onError: (error: any) => {
      console.error("Error updating list:", error);
      console.error(error?.response?.data?.message || "Failed to update list");
    },
  });
};

// Hook to delete a list
export const useDeleteList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteList,
    onSuccess: (_, listId) => {
      // Remove the list from cache
      queryClient.removeQueries({ queryKey: listKeys.detail(listId) });

      // Invalidate all board lists to refetch without the deleted list
      queryClient.invalidateQueries({ queryKey: listKeys.all });

      // Invalidate full board data
      queryClient.invalidateQueries({ queryKey: ["boards", "detail"] });

      console.log("List deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Error deleting list:", error);
      console.error(error?.response?.data?.message || "Failed to delete list");
    },
  });
};

// Hook to update list position
export const useUpdateListPosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, position }: { listId: string; position: number }) =>
      updateListPosition(listId, position),
    onSuccess: (updatedList) => {
      // Update the list in cache
      queryClient.setQueryData(listKeys.detail(updatedList.id), updatedList);

      // Invalidate board lists to refetch with updated positions
      queryClient.invalidateQueries({
        queryKey: listKeys.board(updatedList.boardId),
      });

      // Invalidate full board data
      queryClient.invalidateQueries({
        queryKey: ["boards", "detail", updatedList.boardId, "full"],
      });

      console.log("List position updated successfully!");
    },
    onError: (error: any) => {
      console.error("Error updating list position:", error);
      console.error(
        error?.response?.data?.message || "Failed to update list position"
      );
    },
  });
};

// Hook to archive/unarchive a list
export const useArchiveList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveList,
    onSuccess: (archivedList) => {
      // Update the list in cache
      queryClient.setQueryData(listKeys.detail(archivedList.id), archivedList);

      // Invalidate board lists to refetch with updated archive status
      queryClient.invalidateQueries({
        queryKey: listKeys.board(archivedList.boardId),
      });

      // Invalidate full board data
      queryClient.invalidateQueries({
        queryKey: ["boards", "detail", archivedList.boardId, "full"],
      });

      console.log("List archive status toggled successfully!");
    },
    onError: (error: any) => {
      console.error("Error toggling list archive status:", error);
      console.error(
        error?.response?.data?.message || "Failed to toggle list archive status"
      );
    },
  });
};
