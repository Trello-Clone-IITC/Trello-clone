import { api } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/shared/types/apiResponse";
import type { ListDto, CardDto } from "@ronmordo/contracts";

export const fetchBoardLists = async (boardId: string): Promise<ListDto[]> => {
  const { data } = await api.get<ApiResponse<ListDto[]>>(
    `/boards/${boardId}/lists`
  );
  return data.data;
};

export const fetchListCards = async (
  _boardId: string,
  listId: string
): Promise<CardDto[]> => {
  const { data } = await api.get<ApiResponse<CardDto[]>>(
    `/lists/${listId}/cards`
  );
  return data.data;
};
