import { api } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/shared/types/apiResponse";

// Card interfaces (matching the Redux slice types)
export interface Label {
  id: string;
  title: string;
  color: string;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  listId: string;
  position: number;
  labels?: Label[];
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardData {
  title: string;
  description?: string;
  listId: string;
  position?: number;
}

export interface UpdateCardData {
  title?: string;
  description?: string;
  listId?: string;
  position?: number;
  isArchived?: boolean;
}

export interface MoveCardData {
  listId: string;
  position: number;
}

// Get a single card
export const getCard = async (cardId: string): Promise<Card> => {
  const { data } = await api.get<ApiResponse<Card>>(`/cards/${cardId}`);
  return data.data;
};

// Create a new card
export const createCard = async (cardData: CreateCardData): Promise<Card> => {
  const { data } = await api.post<ApiResponse<Card>>("/cards", cardData);
  return data.data;
};

// Update a card
export const updateCard = async (
  cardId: string,
  cardData: UpdateCardData
): Promise<Card> => {
  const { data } = await api.patch<ApiResponse<Card>>(
    `/cards/${cardId}`,
    cardData
  );
  return data.data;
};

// Delete a card
export const deleteCard = async (cardId: string): Promise<void> => {
  await api.delete(`/cards/${cardId}`);
};

// Move a card to a different list/position
export const moveCard = async (
  cardId: string,
  moveData: MoveCardData
): Promise<Card> => {
  const { data } = await api.patch<ApiResponse<Card>>(
    `/cards/${cardId}/move`,
    moveData
  );
  return data.data;
};

// Archive/unarchive a card
export const toggleArchiveCard = async (cardId: string): Promise<Card> => {
  const { data } = await api.patch<ApiResponse<Card>>(
    `/cards/${cardId}/archive`
  );
  return data.data;
};

// Get cards by list
export const getCardsByList = async (listId: string): Promise<Card[]> => {
  const { data } = await api.get<ApiResponse<Card[]>>(`/lists/${listId}/cards`);
  return data.data;
};

// Search cards
export const searchCards = async (
  searchTerm: string,
  limit?: number
): Promise<Card[]> => {
  const { data } = await api.get<ApiResponse<Card[]>>(
    `/cards/search?q=${encodeURIComponent(searchTerm)}${
      limit ? `&limit=${limit}` : ""
    }`
  );
  return data.data;
};
