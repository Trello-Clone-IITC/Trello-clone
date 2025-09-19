import { useQuery } from "@tanstack/react-query";
import type { ListDto, CardDto } from "@ronmordo/contracts";
import { fetchBoardLists, fetchListCards } from "../api";
import { boardKeys } from "@/features/final-aiman/board/hooks";

export const useLists = (boardId: string) =>
  useQuery<ListDto[]>({
    queryKey: boardKeys.lists(boardId),
    queryFn: () => fetchBoardLists(boardId),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

export const useCards = (boardId: string, listId: string) =>
  useQuery<CardDto[]>({
    queryKey: boardKeys.cards(boardId, listId),
    queryFn: () => fetchListCards(boardId, listId),
    enabled: !!boardId && !!listId,
    staleTime: 15_000,
    gcTime: 5 * 60_000,
  });

