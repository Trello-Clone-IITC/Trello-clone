import { useCallback, useState } from "react";
import {
  useCard as useCardQuery,
  useUpdateCard,
  useDeleteCard,
  useMoveCard,
  useToggleArchiveCard,
} from "./useCardQueries";
import type { Label } from "../api";

// Modal state interface
interface ModalState {
  isOpen: boolean;
  cardId: string | null;
  cardTitle: string | null;
}

export const useCard = (cardId: string) => {
  // Local modal state (replacing Redux modal state)
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    cardId: null,
    cardTitle: null,
  });

  // React Query hooks
  const { data: card, isLoading, error } = useCardQuery(cardId);
  const updateCardMutation = useUpdateCard();
  const deleteCardMutation = useDeleteCard();
  const moveCardMutation = useMoveCard();
  const toggleArchiveMutation = useToggleArchiveCard();

  const updateCardData = useCallback(
    (updates: any) => {
      updateCardMutation.mutate({ cardId, cardData: updates });
    },
    [updateCardMutation, cardId]
  );

  const deleteCardAction = useCallback(() => {
    deleteCardMutation.mutate(cardId);
  }, [deleteCardMutation, cardId]);

  const openModal = useCallback(() => {
    if (card) {
      setModalState({
        isOpen: true,
        cardId,
        cardTitle: card.title,
      });
    }
  }, [cardId, card]);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      cardId: null,
      cardTitle: null,
    });
  }, []);

  const updateTitle = useCallback(
    (newTitle: string) => {
      updateCardData({ title: newTitle });
    },
    [updateCardData]
  );

  const updateDescription = useCallback(
    (newDescription: string) => {
      updateCardData({ description: newDescription });
    },
    [updateCardData]
  );

  const addLabel = useCallback(
    (label: Label) => {
      if (card && card.labels) {
        const updatedLabels = [...card.labels, label];
        updateCardData({ labels: updatedLabels });
      } else {
        updateCardData({ labels: [label] });
      }
    },
    [card, updateCardData]
  );

  const removeLabel = useCallback(
    (labelId: string) => {
      if (card && card.labels) {
        const updatedLabels = card.labels.filter(
          (l: Label) => l.id !== labelId
        );
        updateCardData({ labels: updatedLabels });
      }
    },
    [card, updateCardData]
  );

  const moveCardAction = useCallback(
    (newListId: string, newPosition: number) => {
      moveCardMutation.mutate({
        cardId,
        moveData: {
          listId: newListId,
          position: newPosition,
        },
      });
    },
    [moveCardMutation, cardId]
  );

  const archiveCard = useCallback(() => {
    toggleArchiveMutation.mutate(cardId);
  }, [toggleArchiveMutation, cardId]);

  const unarchiveCard = useCallback(() => {
    toggleArchiveMutation.mutate(cardId);
  }, [toggleArchiveMutation, cardId]);

  return {
    card,
    isLoading,
    error,
    isModalOpen: modalState.isOpen && modalState.cardId === cardId,
    modalCardId: modalState.cardId,
    modalCardTitle: modalState.cardTitle,
    updateCard: updateCardData,
    deleteCard: deleteCardAction,
    openModal,
    closeModal,
    updateTitle,
    updateDescription,
    addLabel,
    removeLabel,
    moveCard: moveCardAction,
    archiveCard,
    unarchiveCard,
    // Mutation states for loading indicators
    isUpdating: updateCardMutation.isPending,
    isDeleting: deleteCardMutation.isPending,
    isMoving: moveCardMutation.isPending,
    isTogglingArchive: toggleArchiveMutation.isPending,
  };
};
