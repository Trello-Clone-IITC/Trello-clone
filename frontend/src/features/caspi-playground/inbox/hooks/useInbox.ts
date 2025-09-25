import { useCallback, useEffect, useMemo, useState } from "react";
import type { InboxCard } from "../types";

const INBOX_STORAGE_KEY = "trello-clone-inbox-cards";

export function useInbox() {
  const [cards, setCards] = useState<InboxCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cards from localStorage on mount
  useEffect(() => {
    try {
      const storedCards = localStorage.getItem(INBOX_STORAGE_KEY);
      if (storedCards) {
        const parsedCards = JSON.parse(storedCards).map(
          (card: {
            id: string;
            title: string;
            description?: string;
            position: number;
            createdAt: string;
            updatedAt: string;
            isCompleted?: boolean;
          }) => ({
            ...card,
            createdAt: new Date(card.createdAt),
            updatedAt: new Date(card.updatedAt),
          })
        );
        setCards(parsedCards);
      }
    } catch (error) {
      console.error("Failed to load inbox cards from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save cards to localStorage whenever cards change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(cards));
      } catch (error) {
        console.error("Failed to save inbox cards to localStorage:", error);
      }
    }
  }, [cards, isLoading]);

  const addCard = useCallback(
    (title: string, description?: string) => {
      const newCard: InboxCard = {
        id: `inbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        description: description?.trim(),
        position:
          (cards.length > 0 ? Math.max(...cards.map((c) => c.position)) : 0) +
          1000,
        createdAt: new Date(),
        updatedAt: new Date(),
        isCompleted: false,
      };

      setCards((prev) =>
        [...prev, newCard].sort((a, b) => a.position - b.position)
      );
    },
    [cards]
  );

  const updateCard = useCallback((id: string, updates: Partial<InboxCard>) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, ...updates, updatedAt: new Date() } : card
      )
    );
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const reorderCards = useCallback((cardIds: string[]) => {
    setCards((prev) => {
      const cardMap = new Map(prev.map((card) => [card.id, card]));
      const reorderedCards = cardIds
        .map((id, index) => {
          const card = cardMap.get(id);
          return card ? { ...card, position: (index + 1) * 1000 } : null;
        })
        .filter((card): card is InboxCard => card !== null);

      return reorderedCards;
    });
  }, []);

  const toggleCardCompletion = useCallback((id: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id
          ? { ...card, isCompleted: !card.isCompleted, updatedAt: new Date() }
          : card
      )
    );
  }, []);

  return useMemo(
    () => ({
      cards,
      addCard,
      updateCard,
      deleteCard,
      reorderCards,
      toggleCardCompletion,
      isLoading,
    }),
    [
      cards,
      addCard,
      updateCard,
      deleteCard,
      reorderCards,
      toggleCardCompletion,
      isLoading,
    ]
  );
}
