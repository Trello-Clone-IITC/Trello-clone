import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { BoardDto, ListDto, CardDto } from "@ronmordo/contracts";
import {
  fetchBoard,
  fetchBoardLists,
  fetchListCards,
  fetchCard,
  fetchCardAttachments,
  fetchCardChecklists,
  fetchCardComments,
  fetchCardLabels,
  fetchBoardLabels,
  fetchChecklistItems,
} from "../api";
import { useBoardSocket } from "../socket";

// Query keys for this feature
export const boardKeys = {
  board: (boardId: string) => ["board", "board", boardId] as const,
  lists: (boardId: string) => ["board", "lists", boardId] as const,
  cards: (boardId: string, listId: string) =>
    ["board", "cards", boardId, listId] as const,
  card: (boardId: string, listId: string, cardId: string) =>
    ["board", "card", boardId, listId, cardId] as const,
  cardComments: (boardId: string, listId: string, cardId: string) =>
    ["board", "card", "comments", boardId, listId, cardId] as const,
  cardChecklists: (boardId: string, listId: string, cardId: string) =>
    ["board", "card", "checklists", boardId, listId, cardId] as const,
  cardLabels: (boardId: string, listId: string, cardId: string) =>
    ["board", "card", "labels", boardId, listId, cardId] as const,
  cardAttachments: (boardId: string, listId: string, cardId: string) =>
    ["board", "card", "attachments", boardId, listId, cardId] as const,
  boardLabels: (boardId: string) => ["board", "board", "labels", boardId] as const,
  checklistItems: (
    boardId: string,
    listId: string,
    cardId: string,
    checklistId: string
  ) => ["board", "card", "checklists", "items", boardId, listId, cardId, checklistId] as const,
};

// Individual queries
export const useBoard = (boardId: string) =>
  useQuery<BoardDto>({
    queryKey: boardKeys.board(boardId),
    queryFn: () => fetchBoard(boardId),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

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

export const useCard = (
  boardId: string,
  listId: string,
  cardId: string,
  enabled?: boolean
) =>
  useQuery<CardDto>({
    queryKey: boardKeys.card(boardId, listId, cardId),
    queryFn: () => fetchCard(boardId, listId, cardId),
    enabled: !!boardId && !!listId && !!cardId && enabled !== false,
    staleTime: 15_000,
  });

export const useBoardLabels = (boardId: string) =>
  useQuery({
    queryKey: boardKeys.boardLabels(boardId),
    queryFn: () => fetchBoardLabels(boardId),
    enabled: !!boardId,
    staleTime: 60_000,
  });

export const useCardComments = (
  boardId: string,
  listId: string,
  cardId: string,
  enabled?: boolean
) =>
  useQuery({
    queryKey: boardKeys.cardComments(boardId, listId, cardId),
    queryFn: () => fetchCardComments(boardId, listId, cardId),
    enabled: !!boardId && !!listId && !!cardId && enabled === true,
  });

export const useCardChecklists = (
  boardId: string,
  listId: string,
  cardId: string,
  enabled?: boolean
) =>
  useQuery({
    queryKey: boardKeys.cardChecklists(boardId, listId, cardId),
    queryFn: () => fetchCardChecklists(boardId, listId, cardId),
    enabled: !!boardId && !!listId && !!cardId && enabled === true,
  });

export const useCardLabels = (
  boardId: string,
  listId: string,
  cardId: string,
  enabled?: boolean
) =>
  useQuery({
    queryKey: boardKeys.cardLabels(boardId, listId, cardId),
    queryFn: () => fetchCardLabels(boardId, listId, cardId),
    enabled: !!boardId && !!listId && !!cardId && enabled === true,
  });

export const useCardAttachments = (
  boardId: string,
  listId: string,
  cardId: string,
  enabled?: boolean
) =>
  useQuery({
    queryKey: boardKeys.cardAttachments(boardId, listId, cardId),
    queryFn: () => fetchCardAttachments(boardId, listId, cardId),
    enabled: !!boardId && !!listId && !!cardId && enabled === true,
  });

export const useChecklistItems = (
  boardId: string,
  listId: string,
  cardId: string,
  checklistId: string,
  enabled?: boolean
) =>
  useQuery({
    queryKey: boardKeys.checklistItems(boardId, listId, cardId, checklistId),
    queryFn: () => fetchChecklistItems(boardId, listId, cardId, checklistId),
    enabled:
      !!boardId && !!listId && !!cardId && !!checklistId && enabled === true,
  });

// Real-time wiring to keep caches in sync
export const useBoardRealtime = (boardId: string) => {
  const queryClient = useQueryClient();

  useBoardSocket(boardId, {
    // Lists
    onListCreated: (list) => {
      queryClient.setQueryData<ListDto[] | undefined>(
        boardKeys.lists(boardId),
        (prev) => {
          if (!prev) return [list];
          if (prev.some((l) => l.id === list.id)) return prev;
          return [...prev, list];
        }
      );
    },
    onListUpdated: (list) => {
      queryClient.setQueryData<ListDto[] | undefined>(
        boardKeys.lists(boardId),
        (prev) => prev?.map((l) => (l.id === list.id ? list : l))
      );
    },
    onListDeleted: (listId) => {
      queryClient.setQueryData<ListDto[] | undefined>(
        boardKeys.lists(boardId),
        (prev) => prev?.filter((l) => l.id !== listId)
      );
      // Remove cached cards for that list
      queryClient.removeQueries({ queryKey: boardKeys.cards(boardId, listId) });
    },

    // Cards
    onCardCreated: (card) => {
      queryClient.setQueryData<CardDto[] | undefined>(
        boardKeys.cards(boardId, card.listId),
        (prev) => {
          if (!prev || prev.length === 0) return [card];
          if (prev.some((c) => c.id === card.id)) return prev;
          return [...prev, card];
        }
      );
    },
    onCardUpdated: (card) => {
      queryClient.setQueryData<CardDto[] | undefined>(
        boardKeys.cards(boardId, card.listId),
        (prev) => prev?.map((c) => (c.id === card.id ? card : c))
      );
    },
    onCardDeleted: (cardId, listId) => {
      queryClient.setQueryData<CardDto[] | undefined>(
        boardKeys.cards(boardId, listId),
        (prev) => prev?.filter((c) => c.id !== cardId)
      );
    },
    onCardMoved: (card, fromListId) => {
      // Remove from previous list
      const sourceListId = fromListId ?? card.listId;
      if (sourceListId) {
        queryClient.setQueryData<CardDto[] | undefined>(
          boardKeys.cards(boardId, sourceListId),
          (prev) => prev?.filter((c) => c.id !== card.id)
        );
      }
      // Add to new list (card.listId is the target)
      queryClient.setQueryData<CardDto[] | undefined>(
        boardKeys.cards(boardId, card.listId),
        (prev) => (prev ? [...prev, card] : [card])
      );
    },
  });
};
