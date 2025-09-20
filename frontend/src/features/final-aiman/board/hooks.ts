import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { BoardDto, ListDto, CardDto, LabelDto, BoardMemberDto } from "@ronmordo/contracts";
import { fetchBoard, fetchBoardLabels, fetchBoardMembers } from "./api";
import { useBoardSocket } from "./socket";

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
  boardMembers: (boardId: string) => ["board", "board", "members", boardId] as const,
  checklistItems: (
    boardId: string,
    listId: string,
    cardId: string,
    checklistId: string
  ) => [
    "board",
    "card",
    "checklists",
    "items",
    boardId,
    listId,
    cardId,
    checklistId,
  ] as const,
};

export const useBoard = (boardId: string) =>
  useQuery<BoardDto>({
    queryKey: boardKeys.board(boardId),
    queryFn: () => fetchBoard(boardId),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

export const useBoardLabels = (boardId: string) =>
  useQuery<LabelDto[]>({
    queryKey: boardKeys.boardLabels(boardId),
    queryFn: () => fetchBoardLabels(boardId),
    enabled: !!boardId,
    staleTime: 60_000,
  });

export const useBoardMembers = (boardId: string) =>
  useQuery<BoardMemberDto[]>({
    queryKey: boardKeys.boardMembers(boardId),
    queryFn: () => fetchBoardMembers(boardId),
    enabled: !!boardId,
    staleTime: 60_000,
  });

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
          // Try to replace a matching temp card (same title + position)
          const idx = prev.findIndex(
            (c) =>
              typeof c.id === "string" &&
              c.id.startsWith("temp-") &&
              c.title === card.title &&
              (c as any).position === (card as any).position
          );
          if (idx !== -1) {
            const next = prev.slice();
            next[idx] = card;
            return next;
          }
          // Avoid duplicate real entry
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
