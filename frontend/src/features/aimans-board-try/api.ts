import { api } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/shared/types/apiResponse";
import type { BoardDto, ListDto, CardDto } from "@ronmordo/contracts";

// Fetch board (without nested data)
export const fetchBoard = async (boardId: string): Promise<BoardDto> => {
  const { data } = await api.get<ApiResponse<BoardDto>>(`/boards/${boardId}`);
  return data.data;
};

// Fetch lists for a board
export const fetchBoardLists = async (boardId: string): Promise<ListDto[]> => {
  const { data } = await api.get<ApiResponse<ListDto[]>>(
    `/boards/${boardId}/lists`
  );
  return data.data;
};

// Fetch cards for a list
export const fetchListCards = async (
  boardId: string,
  listId: string
): Promise<CardDto[]> => {
  const { data } = await api.get<ApiResponse<CardDto[]>>(
    `/boards/${boardId}/lists/${listId}/cards`
  );
  return data.data;
};

