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
} from "../api";
import { useAimansBoardSocket } from "../socket";

// Query keys for this feature (separated)
export const aimanKeys = {
  board: (boardId: string) => ["aiman", "board", boardId] as const,
  lists: (boardId: string) => ["aiman", "lists", boardId] as const,
  cards: (boardId: string, listId: string) =>
    ["aiman", "cards", boardId, listId] as const,
  card: (boardId: string, listId: string, cardId: string) =>
    ["aiman", "card", boardId, listId, cardId] as const,
  cardComments: (boardId: string, listId: string, cardId: string) =>
    ["aiman", "card", "comments", boardId, listId, cardId] as const,
  cardChecklists: (boardId: string, listId: string, cardId: string) =>
    ["aiman", "card", "checklists", boardId, listId, cardId] as const,
  cardLabels: (boardId: string, listId: string, cardId: string) =>
    ["aiman", "card", "labels", boardId, listId, cardId] as const,
  cardAttachments: (boardId: string, listId: string, cardId: string) =>
    ["aiman", "card", "attachments", boardId, listId, cardId] as const,
  boardLabels: (boardId: string) => ["aiman", "board", "labels", boardId] as const,
};

// Individual queries
export const useAimanBoard = (boardId: string) =>
  useQuery<BoardDto>({
    queryKey: aimanKeys.board(boardId),
    queryFn: () => fetchBoard(boardId),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

export const useAimanLists = (boardId: string) =>
  useQuery<ListDto[]>({
    queryKey: aimanKeys.lists(boardId),
    queryFn: () => fetchBoardLists(boardId),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

export const useAimanCards = (boardId: string, listId: string) =>
  useQuery<CardDto[]>({
    queryKey: aimanKeys.cards(boardId, listId),
    queryFn: () => fetchListCards(boardId, listId),
    enabled: !!boardId && !!listId,
    staleTime: 15_000,
    gcTime: 5 * 60_000,
  });

export const useAimanCard = (
  boardId: string,
  listId: string,
  cardId: string,
  enabled?: boolean
) =>
  useQuery<CardDto>({
    queryKey: aimanKeys.card(boardId, listId, cardId),
    queryFn: () => fetchCard(boardId, listId, cardId),
    enabled: !!boardId && !!listId && !!cardId && enabled !== false,
    staleTime: 15_000,
  });

export const useAimanBoardLabels = (boardId: string) =>
  useQuery({
    queryKey: aimanKeys.boardLabels(boardId),
    queryFn: () => fetchBoardLabels(boardId),
    enabled: !!boardId,
    staleTime: 60_000,
  });

export const useAimanCardComments = (
  boardId: string,
  listId: string,
  cardId: string,
  enabled?: boolean
) =>
  useQuery({
    queryKey: aimanKeys.cardComments(boardId, listId, cardId),
    queryFn: () => fetchCardComments(boardId, listId, cardId),
    enabled: !!boardId && !!listId && !!cardId && enabled === true,
  });

export const useAimanCardChecklists = (
  boardId: string,
  listId: string,
  cardId: string,
  enabled?: boolean
) =>
  useQuery({
    queryKey: aimanKeys.cardChecklists(boardId, listId, cardId),
    queryFn: () => fetchCardChecklists(boardId, listId, cardId),
    enabled: !!boardId && !!listId && !!cardId && enabled === true,
  });

export const useAimanCardLabels = (
  boardId: string,
  listId: string,
  cardId: string,
  enabled?: boolean
) =>
  useQuery({
    queryKey: aimanKeys.cardLabels(boardId, listId, cardId),
    queryFn: () => fetchCardLabels(boardId, listId, cardId),
    enabled: !!boardId && !!listId && !!cardId && enabled === true,
  });

export const useAimanCardAttachments = (
  boardId: string,
  listId: string,
  cardId: string,
  enabled?: boolean
) =>
  useQuery({
    queryKey: aimanKeys.cardAttachments(boardId, listId, cardId),
    queryFn: () => fetchCardAttachments(boardId, listId, cardId),
    enabled: !!boardId && !!listId && !!cardId && enabled === true,
  });

// Real-time wiring to keep caches in sync
export const useAimansBoardRealtime = (boardId: string) => {
  const queryClient = useQueryClient();

  useAimansBoardSocket(boardId, {
    // Lists
    onListCreated: (list) => {
      queryClient.setQueryData<ListDto[] | undefined>(
        aimanKeys.lists(boardId),
        (prev) => {
          if (!prev) return [list];
          if (prev.some((l) => l.id === list.id)) return prev;
          return [...prev, list];
        }
      );
    },
    onListUpdated: (list) => {
      queryClient.setQueryData<ListDto[] | undefined>(
        aimanKeys.lists(boardId),
        (prev) => prev?.map((l) => (l.id === list.id ? list : l))
      );
    },
    onListDeleted: (listId) => {
      queryClient.setQueryData<ListDto[] | undefined>(
        aimanKeys.lists(boardId),
        (prev) => prev?.filter((l) => l.id !== listId)
      );
      // Remove cached cards for that list
      queryClient.removeQueries({ queryKey: ["aiman", "cards", boardId, listId] });
    },

    // Cards
    onCardCreated: (card) => {
      queryClient.setQueryData<CardDto[] | undefined>(
        aimanKeys.cards(boardId, card.listId),
        (prev) => {
          if (!prev || prev.length === 0) return [card];
          if (prev.some((c) => c.id === card.id)) return prev;
          return [...prev, card];
        }
      );
    },
    onCardUpdated: (card) => {
      queryClient.setQueryData<CardDto[] | undefined>(
        aimanKeys.cards(boardId, card.listId),
        (prev) => prev?.map((c) => (c.id === card.id ? card : c))
      );
    },
    onCardDeleted: (cardId, listId) => {
      queryClient.setQueryData<CardDto[] | undefined>(
        aimanKeys.cards(boardId, listId),
        (prev) => prev?.filter((c) => c.id !== cardId)
      );
    },
    onCardMoved: (card, fromListId) => {
      // Remove from previous list
      const sourceListId = fromListId ?? card.listId;
      if (sourceListId) {
        queryClient.setQueryData<CardDto[] | undefined>(
          aimanKeys.cards(boardId, sourceListId),
          (prev) => prev?.filter((c) => c.id !== card.id)
        );
      }
      // Add to new list (card.listId is the target)
      queryClient.setQueryData<CardDto[] | undefined>(
        aimanKeys.cards(boardId, card.listId),
        (prev) => (prev ? [...prev, card] : [card])
      );
    },
  });
};

// Backwards-compat named export (if anything imports it elsewhere)
export type AimansBoardAggregated = never;
export const useAimansBoard = undefined as unknown as (boardId: string) => void;
