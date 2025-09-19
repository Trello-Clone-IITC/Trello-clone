import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BoardDto, BoardFullDto } from "@ronmordo/contracts";
import {
  getFullBoard,
  getBoard,
  getAllBoards,
  getBoardsByUser,
  createBoard,
  updateBoard,
  deleteBoard,
  searchBoards,
} from "../api";

// Query keys for board-related queries
export const boardKeys = {
  all: ["boards"] as const,
  lists: () => [...boardKeys.all, "list"] as const,
  list: (filters: string) => [...boardKeys.lists(), { filters }] as const,
  details: () => [...boardKeys.all, "detail"] as const,
  detail: (id: string) => [...boardKeys.details(), id] as const,
  full: (id: string) => [...boardKeys.detail(id), "full"] as const,
  user: (userId: string) => [...boardKeys.all, "user", userId] as const,
  search: (query: string) => [...boardKeys.all, "search", query] as const,
};

// Hook to get full board data with all nested information
export const useFullBoard = (boardId: string, enabled: boolean = true) => {
  return useQuery<BoardFullDto>({
    queryKey: boardKeys.full(boardId),
    queryFn: () => getFullBoard(boardId),
    enabled: enabled && !!boardId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get basic board data
export const useBoard = (boardId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: boardKeys.detail(boardId),
    queryFn: () => getBoard(boardId),
    enabled: enabled && !!boardId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get all boards for the current user
export const useAllBoards = () => {
  return useQuery({
    queryKey: boardKeys.lists(),
    queryFn: getAllBoards,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get boards by specific user
export const useBoardsByUser = (userId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: boardKeys.user(userId),
    queryFn: () => getBoardsByUser(userId),
    enabled: enabled && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to search boards
export const useSearchBoards = (
  searchTerm: string,
  limit?: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: boardKeys.search(searchTerm),
    queryFn: () => searchBoards(searchTerm, limit),
    enabled: enabled && searchTerm.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to create a new board
export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard,
    onSuccess: (newBoard) => {
      // Invalidate and refetch boards list
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() });

      // Add the new board to the cache
      queryClient.setQueryData(boardKeys.detail(newBoard.id), newBoard);

      console.log("Board created successfully!");
    },
    onError: (error: any) => {
      console.error("Error creating board:", error);
      console.error(error?.response?.data?.message || "Failed to create board");
    },
  });
};

// Hook to update a board
export const useUpdateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      boardId,
      boardData,
    }: {
      boardId: string;
      boardData: Partial<BoardDto>;
    }) => updateBoard(boardId, boardData),
    onSuccess: (updatedBoard) => {
      // Update the board in cache
      queryClient.setQueryData(boardKeys.detail(updatedBoard.id), updatedBoard);

      // Invalidate full board data to refetch with updated info
      queryClient.invalidateQueries({
        queryKey: boardKeys.full(updatedBoard.id),
      });

      // Invalidate boards list to reflect changes
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() });

      console.log("Board updated successfully!");
    },
    onError: (error: any) => {
      console.error("Error updating board:", error);
      console.error(error?.response?.data?.message || "Failed to update board");
    },
  });
};

// Hook to delete a board
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: (_, boardId) => {
      // Remove the board from cache
      queryClient.removeQueries({ queryKey: boardKeys.detail(boardId) });
      queryClient.removeQueries({ queryKey: boardKeys.full(boardId) });

      // Invalidate boards list to refetch without the deleted board
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() });

      console.log("Board deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Error deleting board:", error);
      console.error(error?.response?.data?.message || "Failed to delete board");
    },
  });
};

// Utility hook to get board data (tries full board first, falls back to basic)
export const useBoardData = (boardId: string, preferFull: boolean = true) => {
  const fullBoardQuery = useFullBoard(boardId, preferFull);
  const basicBoardQuery = useBoard(boardId, !preferFull);

  if (preferFull) {
    return {
      ...fullBoardQuery,
      data: fullBoardQuery.data || basicBoardQuery.data,
      isLoading: fullBoardQuery.isLoading || basicBoardQuery.isLoading,
      error: fullBoardQuery.error || basicBoardQuery.error,
    };
  }

  return basicBoardQuery;
};
