import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axiosInstance";
import type { CardDto } from "@ronmordo/contracts";

const INBOX_QUERY_KEY = ["inbox-cards"];

export function useInbox() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch inbox cards from backend
  const {
    data: cards = [],
    isLoading: queryLoading,
    error,
  } = useQuery({
    queryKey: INBOX_QUERY_KEY,
    queryFn: async (): Promise<CardDto[]> => {
      try {
        const response = await api.get<{ success: boolean; data: CardDto[] }>(
          "/inbox"
        );
        return response.data.data;
      } catch (error: unknown) {
        // Handle 404 or other errors gracefully - return empty array instead of throwing
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { status?: number } };
          if (
            axiosError.response?.status === 404 ||
            axiosError.response?.status === 500
          ) {
            console.log("Inbox endpoint not available, showing empty state");
            return [];
          }
        }
        console.error("Error fetching inbox cards:", error);
        throw error;
      }
    },
    staleTime: 60_000, // 1 minute
    retry: false, // Don't retry on error to avoid infinite loading
  });

  // Create card mutation
  const createCardMutation = useMutation({
    mutationFn: async ({
      title,
      description,
    }: {
      title: string;
      description?: string;
    }) => {
      const response = await api.post<{ success: boolean; data: CardDto }>(
        "/cards",
        {
          title,
          description,
          inboxUserId: "current-user", // This will be handled by backend auth
        }
      );
      return response.data.data;
    },
    onSuccess: (newCard) => {
      queryClient.setQueryData<CardDto[]>(INBOX_QUERY_KEY, (prev) => {
        return prev ? [...prev, newCard] : [newCard];
      });
    },
  });

  // Update card mutation
  const updateCardMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CardDto>;
    }) => {
      const response = await api.patch<{ success: boolean; data: CardDto }>(
        `/cards/${id}`,
        {
          title: updates.title,
          description: updates.description,
        }
      );
      return response.data.data;
    },
    onSuccess: (updatedCard) => {
      queryClient.setQueryData<CardDto[]>(INBOX_QUERY_KEY, (prev) => {
        if (!prev) return [];
        return prev.map((card) =>
          card.id === updatedCard.id ? updatedCard : card
        );
      });
    },
  });

  // Delete card mutation
  const deleteCardMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/cards/${id}`);
    },
    onSuccess: (_, cardId) => {
      queryClient.setQueryData<CardDto[]>(INBOX_QUERY_KEY, (prev) => {
        if (!prev) return [];
        return prev.filter((card) => card.id !== cardId);
      });
    },
  });

  // Move card to list mutation
  const moveCardToListMutation = useMutation({
    mutationFn: async ({
      cardId,
      listId,
      position,
    }: {
      cardId: string;
      listId: string;
      position: number;
    }) => {
      const response = await api.patch<{ success: boolean; data: CardDto }>(
        `/cards/${cardId}`,
        {
          listId,
          position,
          inboxUserId: null, // Remove from inbox
        }
      );
      return response.data.data;
    },
    onSuccess: (_, { cardId }) => {
      // Remove from inbox
      queryClient.setQueryData<CardDto[]>(INBOX_QUERY_KEY, (prev) => {
        if (!prev) return [];
        return prev.filter((card) => card.id !== cardId);
      });
    },
  });

  // Move card from list to inbox mutation
  const moveCardToInboxMutation = useMutation({
    mutationFn: async ({
      cardId,
      position,
    }: {
      cardId: string;
      position: number;
    }) => {
      const response = await api.patch<{ success: boolean; data: CardDto }>(
        `/cards/${cardId}`,
        {
          listId: null,
          inboxUserId: "current-user", // This will be handled by backend auth
          position,
        }
      );
      return response.data.data;
    },
    onSuccess: (newCard) => {
      // Add to inbox
      queryClient.setQueryData<CardDto[]>(INBOX_QUERY_KEY, (prev) => {
        return prev ? [...prev, newCard] : [newCard];
      });
    },
  });

  useEffect(() => {
    setIsLoading(queryLoading);
  }, [queryLoading]);

  const addCard = useCallback(
    (title: string, description?: string) => {
      createCardMutation.mutate({ title, description });
    },
    [createCardMutation]
  );

  const updateCard = useCallback(
    (id: string, updates: Partial<CardDto>) => {
      updateCardMutation.mutate({ id, updates });
    },
    [updateCardMutation]
  );

  const deleteCard = useCallback(
    (id: string) => {
      deleteCardMutation.mutate(id);
    },
    [deleteCardMutation]
  );

  const reorderCards = useCallback(
    (cardIds: string[]) => {
      // Update local state immediately for better UX
      queryClient.setQueryData<CardDto[]>(INBOX_QUERY_KEY, (prev) => {
        if (!prev) return [];
        const cardMap = new Map(prev.map((card) => [card.id, card]));
        const reorderedCards = cardIds
          .map((id, index) => {
            const card = cardMap.get(id);
            return card ? { ...card, position: (index + 1) * 1000 } : null;
          })
          .filter((card): card is CardDto => card !== null);

        return reorderedCards;
      });

      // TODO: Send reorder request to backend
      // This would require a batch update endpoint
    },
    [queryClient]
  );

  const toggleCardCompletion = useCallback(
    (id: string) => {
      // Inbox cards don't have completion status, but we can keep this for consistency
      queryClient.setQueryData<CardDto[]>(INBOX_QUERY_KEY, (prev) => {
        if (!prev) return [];
        return prev.map((card) =>
          card.id === id
            ? { ...card, updatedAt: new Date().toISOString() }
            : card
        );
      });
    },
    [queryClient]
  );

  const moveCardToList = useCallback(
    (cardId: string, listId: string, position: number) => {
      moveCardToListMutation.mutate({ cardId, listId, position });
    },
    [moveCardToListMutation]
  );

  const moveCardToInbox = useCallback(
    (cardId: string, position: number) => {
      moveCardToInboxMutation.mutate({ cardId, position });
    },
    [moveCardToInboxMutation]
  );

  return useMemo(
    () => ({
      cards,
      addCard,
      updateCard,
      deleteCard,
      reorderCards,
      toggleCardCompletion,
      moveCardToList,
      moveCardToInbox,
      isLoading:
        isLoading ||
        createCardMutation.isPending ||
        updateCardMutation.isPending ||
        deleteCardMutation.isPending,
      error:
        error ||
        createCardMutation.error ||
        updateCardMutation.error ||
        deleteCardMutation.error,
    }),
    [
      cards,
      addCard,
      updateCard,
      deleteCard,
      reorderCards,
      toggleCardCompletion,
      moveCardToList,
      moveCardToInbox,
      isLoading,
      createCardMutation.isPending,
      updateCardMutation.isPending,
      deleteCardMutation.isPending,
      error,
      createCardMutation.error,
      updateCardMutation.error,
      deleteCardMutation.error,
    ]
  );
}
