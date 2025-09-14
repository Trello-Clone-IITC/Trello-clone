import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCard,
  createCard,
  updateCard,
  deleteCard,
  moveCard,
  toggleArchiveCard,
  getCardsByList,
  searchCards,
  type Card,
  type CreateCardData,
  type UpdateCardData,
  type MoveCardData,
} from "../api";

// Query keys for card-related queries
export const cardKeys = {
  all: ["cards"] as const,
  lists: () => [...cardKeys.all, "list"] as const,
  list: (listId: string) => [...cardKeys.lists(), listId] as const,
  details: () => [...cardKeys.all, "detail"] as const,
  detail: (id: string) => [...cardKeys.details(), id] as const,
  search: (query: string) => [...cardKeys.all, "search", query] as const,
};

// Hook to get a single card
export const useCard = (cardId: string, enabled: boolean = true) => {
  return useQuery<Card>({
    queryKey: cardKeys.detail(cardId),
    queryFn: () => getCard(cardId),
    enabled: enabled && !!cardId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get cards by list
export const useCardsByList = (listId: string, enabled: boolean = true) => {
  return useQuery<Card[]>({
    queryKey: cardKeys.list(listId),
    queryFn: () => getCardsByList(listId),
    enabled: enabled && !!listId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
  });
};

// Hook to search cards
export const useSearchCards = (
  searchTerm: string,
  limit?: number,
  enabled: boolean = true
) => {
  return useQuery<Card[]>({
    queryKey: cardKeys.search(searchTerm),
    queryFn: () => searchCards(searchTerm, limit),
    enabled: enabled && searchTerm.length > 0,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to create a new card
export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCard,
    onSuccess: (newCard) => {
      // Add the new card to the cache
      queryClient.setQueryData(cardKeys.detail(newCard.id), newCard);

      // Invalidate cards list for the specific list
      queryClient.invalidateQueries({
        queryKey: cardKeys.list(newCard.listId),
      });

      // Invalidate full board data to refetch with new card
      queryClient.invalidateQueries({
        queryKey: ["boards", "detail", newCard.listId, "full"],
      });

      console.log("Card created successfully!");
    },
    onError: (error: any) => {
      console.error("Error creating card:", error);
      console.error(error?.response?.data?.message || "Failed to create card");
    },
  });
};

// Hook to update a card
export const useUpdateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cardId,
      cardData,
    }: {
      cardId: string;
      cardData: UpdateCardData;
    }) => updateCard(cardId, cardData),
    onSuccess: (updatedCard) => {
      // Update the card in cache
      queryClient.setQueryData(cardKeys.detail(updatedCard.id), updatedCard);

      // Invalidate cards list for both old and new lists if listId changed
      queryClient.invalidateQueries({
        queryKey: cardKeys.list(updatedCard.listId),
      });

      // Invalidate full board data to refetch with updated info
      queryClient.invalidateQueries({
        queryKey: ["boards", "detail", updatedCard.listId, "full"],
      });

      console.log("Card updated successfully!");
    },
    onError: (error: any) => {
      console.error("Error updating card:", error);
      console.error(error?.response?.data?.message || "Failed to update card");
    },
  });
};

// Hook to delete a card
export const useDeleteCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCard,
    onSuccess: (_, cardId) => {
      // Remove the card from cache
      queryClient.removeQueries({ queryKey: cardKeys.detail(cardId) });

      // Invalidate all card lists to refetch without the deleted card
      queryClient.invalidateQueries({ queryKey: cardKeys.lists() });

      // Invalidate full board data
      queryClient.invalidateQueries({ queryKey: ["boards", "detail"] });

      console.log("Card deleted successfully!");
    },
    onError: (error: any) => {
      console.error("Error deleting card:", error);
      console.error(error?.response?.data?.message || "Failed to delete card");
    },
  });
};

// Hook to move a card
export const useMoveCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cardId,
      moveData,
    }: {
      cardId: string;
      moveData: MoveCardData;
    }) => moveCard(cardId, moveData),
    onSuccess: (movedCard) => {
      // Update the card in cache
      queryClient.setQueryData(cardKeys.detail(movedCard.id), movedCard);

      // Invalidate cards lists for both old and new lists
      queryClient.invalidateQueries({ queryKey: cardKeys.lists() });

      // Invalidate full board data
      queryClient.invalidateQueries({ queryKey: ["boards", "detail"] });

      console.log("Card moved successfully!");
    },
    onError: (error: any) => {
      console.error("Error moving card:", error);
      console.error(error?.response?.data?.message || "Failed to move card");
    },
  });
};

// Hook to archive/unarchive a card
export const useToggleArchiveCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleArchiveCard,
    onSuccess: (archivedCard) => {
      // Update the card in cache
      queryClient.setQueryData(cardKeys.detail(archivedCard.id), archivedCard);

      // Invalidate cards list for the card's list
      queryClient.invalidateQueries({
        queryKey: cardKeys.list(archivedCard.listId),
      });

      // Invalidate full board data
      queryClient.invalidateQueries({ queryKey: ["boards", "detail"] });

      console.log("Card archive status toggled successfully!");
    },
    onError: (error: any) => {
      console.error("Error toggling card archive status:", error);
      console.error(
        error?.response?.data?.message || "Failed to toggle card archive status"
      );
    },
  });
};
