import { api } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/shared/types/apiResponse";
import type { Card } from "../card/api";

// Re-export Card type for convenience
export type { Card } from "../card/api";

// List interfaces (matching the Redux slice types)
export interface List {
  id: string;
  title: string;
  boardId: string;
  position: number;
  cards: Card[];
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListData {
  title: string;
  boardId: string;
  position?: number;
}

export interface UpdateListData {
  title?: string;
  position?: number;
  isArchived?: boolean;
}

// Get a single list
export const getList = async (listId: string): Promise<List> => {
  const { data } = await api.get<ApiResponse<List>>(`/lists/${listId}`);
  return data.data;
};

// Create a new list
export const createList = async (listData: CreateListData): Promise<List> => {
  const { data } = await api.post<ApiResponse<List>>(
    `/lists/board/${listData.boardId}`,
    listData
  );
  return data.data;
};

// Update a list
export const updateList = async (
  listId: string,
  listData: UpdateListData
): Promise<List> => {
  const { data } = await api.patch<ApiResponse<List>>(
    `/lists/${listId}`,
    listData
  );
  return data.data;
};

// Delete a list
export const deleteList = async (listId: string): Promise<void> => {
  await api.delete(`/lists/${listId}`);
};

// Update list position
export const updateListPosition = async (
  listId: string,
  position: number
): Promise<List> => {
  const { data } = await api.patch<ApiResponse<List>>(
    `/lists/${listId}/position`,
    { position }
  );
  return data.data;
};

// Archive/unarchive a list
export const archiveList = async (listId: string): Promise<List> => {
  const { data } = await api.patch<ApiResponse<List>>(
    `/lists/${listId}/archive`
  );
  return data.data;
};

// Get cards by list
export const getCardsByList = async (listId: string): Promise<Card[]> => {
  const { data } = await api.get<ApiResponse<Card[]>>(`/lists/${listId}/cards`);
  return data.data;
};
