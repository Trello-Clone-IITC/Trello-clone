import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type CardModalState = {
  isOpen: boolean;
  cardId: string | null;
  cardTitle: string | null;
  openModal: (id: string, title?: string | null) => void;
  closeModal: () => void;
};

const CardModalContext = createContext<CardModalState | undefined>(undefined);

export function CardModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cardId, setCardId] = useState<string | null>(null);
  const [cardTitle, setCardTitle] = useState<string | null>(null);

  const openModal = useCallback((id: string, title?: string | null) => {
    setCardId(id);
    setCardTitle(title ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ isOpen, cardId, cardTitle, openModal, closeModal }),
    [isOpen, cardId, cardTitle, openModal, closeModal]
  );

  return (
    <CardModalContext.Provider value={value}>{children}</CardModalContext.Provider>
  );
}

export function useCardModal() {
  const ctx = useContext(CardModalContext);
  if (!ctx) throw new Error("useCardModal must be used within CardModalProvider");
  return ctx;
}

