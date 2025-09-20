import { api } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/shared/types/apiResponse";
import type { BoardDto, LabelDto } from "@ronmordo/contracts";

export const fetchBoard = async (boardId: string): Promise<BoardDto> => {
  const { data } = await api.get<ApiResponse<BoardDto>>(`/boards/${boardId}`);
  return data.data;
};

export const fetchBoardLabels = async (
  boardId: string
): Promise<LabelDto[]> => {
  const { data } = await api.get<ApiResponse<LabelDto[]>>(
    `/boards/${boardId}/labels`
  );
  return data.data;
};
