import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { openCardModal, closeCardModal } from "../redux/cardSlice";

export const useCardModal = () => {
  const dispatch = useDispatch();
  const modalState = useSelector((state: RootState) => state.card.modal);

  const openModal = useCallback(
    (cardId: string, cardTitle: string) => {
      dispatch(openCardModal({ cardId, cardTitle }));
    },
    [dispatch]
  );

  const closeModal = useCallback(() => {
    dispatch(closeCardModal());
  }, [dispatch]);

  return {
    isOpen: modalState.isOpen,
    cardId: modalState.cardId,
    cardTitle: modalState.cardTitle,
    openModal,
    closeModal,
  };
};
