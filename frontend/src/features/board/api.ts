import { api } from "@/lib/axiosInstance";
import type { BoardDto, BoardFullDto } from "@ronmordo/contracts";
import type { ApiResponse } from "@/shared/types/apiResponse";

// Get full board data with all nested information
export const getFullBoard = async (boardId: string): Promise<BoardFullDto> => {
  const { data } = await api.get<ApiResponse<BoardFullDto>>(
    `/boards/${boardId}/full`
  );
  return data.data;
};

// Get basic board data
export const getBoard = async (boardId: string): Promise<BoardDto> => {
  const { data } = await api.get<ApiResponse<BoardDto>>(`/boards/${boardId}`);
  return data.data;
};

// Get all boards for the current user
export const getAllBoards = async (): Promise<BoardDto[]> => {
  const { data } = await api.get<ApiResponse<BoardDto[]>>("/boards");
  return data.data;
};

// Get boards by user
export const getBoardsByUser = async (userId: string): Promise<BoardDto[]> => {
  const { data } = await api.get<ApiResponse<BoardDto[]>>(
    `/boards/user/${userId}`
  );
  return data.data;
};

// Create a new board
export const createBoard = async (
  boardData: Partial<BoardDto>
): Promise<BoardDto> => {
  const { data } = await api.post<ApiResponse<BoardDto>>("/boards", boardData);
  return data.data;
};

// Update board
export const updateBoard = async (
  boardId: string,
  boardData: Partial<BoardDto>
): Promise<BoardDto> => {
  const { data } = await api.patch<ApiResponse<BoardDto>>(
    `/boards/${boardId}`,
    boardData
  );
  return data.data;
};

// Delete board
export const deleteBoard = async (boardId: string): Promise<void> => {
  await api.delete(`/boards/${boardId}`);
};

// Search boards
export const searchBoards = async (
  searchTerm: string,
  limit?: number
): Promise<BoardDto[]> => {
  const { data } = await api.get<ApiResponse<BoardDto[]>>(
    `/boards/search?q=${encodeURIComponent(searchTerm)}${
      limit ? `&limit=${limit}` : ""
    }`
  );
  return data.data;
};
