import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { BoardDto, ListDto, CardDto } from "@ronmordo/contracts";
import { fetchBoard, fetchBoardLists, fetchListCards } from "../api";
import { useAimansBoardSocket } from "../socket";

// Query keys for this feature
export const aimanKeys = {
  board: (boardId: string) => ["aiman-board", boardId] as const,
};

// INTERFACE: Aggregated board shape for this page
export interface AimansBoardAggregated {
  board: BoardDto;
  lists: Array<{
    list: ListDto;
    cards: CardDto[];
  }>;
}

export const useAimansBoard = (boardId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<AimansBoardAggregated>({
    queryKey: aimanKeys.board(boardId),
    queryFn: async () => {
      const [board, lists] = await Promise.all([
        fetchBoard(boardId),
        fetchBoardLists(boardId),
      ]);

      const listsWithCards = await Promise.all(
        lists.map(async (list) => {
          try {
            const cards = await fetchListCards(boardId, list.id);
            return { list, cards };
          } catch (err) {
            console.warn("Cards fetch failed for list", list.id, (err as Error)?.message);
            return { list, cards: [] as CardDto[] };
          }
        })
      );

      return { board, lists: listsWithCards };
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });

  // Wire socket updates to keep cache fresh
  useAimansBoardSocket(boardId, {
    onListCreated: (list) => {
      queryClient.setQueryData<AimansBoardAggregated>(
        aimanKeys.board(boardId),
        (prev) => {
          if (!prev) return prev;
          if (prev.lists.some((l) => l.list.id === list.id)) return prev;
          return { ...prev, lists: [...prev.lists, { list, cards: [] }] };
        }
      );
    },
    onListUpdated: (list) => {
      queryClient.setQueryData<AimansBoardAggregated>(
        aimanKeys.board(boardId),
        (prev) =>
          prev && {
            ...prev,
            lists: prev.lists.map((l) =>
              l.list.id === list.id ? { ...l, list } : l
            ),
          }
      );
    },
    onListDeleted: (listId) => {
      queryClient.setQueryData<AimansBoardAggregated>(
        aimanKeys.board(boardId),
        (prev) =>
          prev && {
            ...prev,
            lists: prev.lists.filter((l) => l.list.id !== listId),
          }
      );
    },
    onCardCreated: (card) => {
      queryClient.setQueryData<AimansBoardAggregated>(
        aimanKeys.board(boardId),
        (prev) =>
          prev && {
            ...prev,
            lists: prev.lists.map((l) =>
              l.list.id === card.listId
                ? { ...l, cards: [...l.cards, card] }
                : l
            ),
          }
      );
    },
    onCardUpdated: (card) => {
      queryClient.setQueryData<AimansBoardAggregated>(
        aimanKeys.board(boardId),
        (prev) =>
          prev && {
            ...prev,
            lists: prev.lists.map((l) =>
              l.list.id === card.listId
                ? {
                    ...l,
                    cards: l.cards.map((c) => (c.id === card.id ? card : c)),
                  }
                : l
            ),
          }
      );
    },
    onCardDeleted: (cardId, listId) => {
      queryClient.setQueryData<AimansBoardAggregated>(
        aimanKeys.board(boardId),
        (prev) =>
          prev && {
            ...prev,
            lists: prev.lists.map((l) =>
              l.list.id === listId
                ? { ...l, cards: l.cards.filter((c) => c.id !== cardId) }
                : l
            ),
          }
      );
    },
    onCardMoved: (card, fromListId) => {
      queryClient.setQueryData<AimansBoardAggregated>(
        aimanKeys.board(boardId),
        (prev) => {
          if (!prev) return prev;
          const removed = prev.lists.map((l) =>
            l.list.id === (fromListId ?? card.listId)
              ? { ...l, cards: l.cards.filter((c) => c.id !== card.id) }
              : l
          );
          const added = removed.map((l) =>
            l.list.id === card.listId
              ? { ...l, cards: [...l.cards, card] }
              : l
          );
          return { ...prev, lists: added };
        }
      );
    },
  });

  return query;
};
