import { api } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/shared/types/apiResponse";
import type {
  CardDto,
  ChecklistDto,
  CommentDto,
  LabelDto,
  AttachmentDto,
  ChecklistItemDto,
} from "@ronmordo/contracts";

export const fetchCard = async (
  _boardId: string,
  _listId: string,
  cardId: string
): Promise<CardDto> => {
  const { data } = await api.get<ApiResponse<CardDto>>(`/cards/${cardId}`);
  return data.data;
};

export const createCard = async (
  listId: string,
  input: Pick<CardDto, "title"> & { position?: number }
): Promise<CardDto> => {
  const { data } = await api.post<ApiResponse<CardDto>>(
    `/lists/${listId}/cards`,
    { title: input.title, position: input.position ?? 1000 }
  );
  return data.data;
};

export const updateCard = async (
  cardId: string,
  updates: Partial<
    Pick<
      CardDto,
      "title" | "description" | "dueDate" | "startDate" | "coverImageUrl"
    >
  >
): Promise<CardDto> => {
  const { data } = await api.patch<ApiResponse<CardDto>>(
    `/cards/${cardId}`,
    updates
  );
  return data.data;
};

export const fetchCardComments = async (
  _boardId: string,
  _listId: string,
  cardId: string
): Promise<CommentDto[]> => {
  const { data } = await api.get<ApiResponse<CommentDto[]>>(
    `/cards/${cardId}/comments`
  );
  return data.data;
};

export const fetchCardChecklists = async (
  _boardId: string,
  _listId: string,
  cardId: string
): Promise<ChecklistDto[]> => {
  const { data } = await api.get<ApiResponse<ChecklistDto[]>>(
    `/cards/${cardId}/checklists`
  );
  return data.data;
};

export const fetchCardLabels = async (
  _boardId: string,
  _listId: string,
  cardId: string
): Promise<LabelDto[]> => {
  const { data } = await api.get<ApiResponse<LabelDto[]>>(
    `/cards/${cardId}/labels`
  );
  return data.data;
};

export const fetchCardAttachments = async (
  _boardId: string,
  _listId: string,
  cardId: string
): Promise<AttachmentDto[]> => {
  const { data } = await api.get<ApiResponse<AttachmentDto[]>>(
    `/cards/${cardId}/attachments`
  );
  return data.data;
};

export const createCardComment = async (
  cardId: string,
  text: string
) => {
  const { data } = await api.post<ApiResponse<CommentDto>>(
    `/cards/${cardId}/comments`,
    { text }
  );
  return data.data;
};

export const deleteCardComment = async (
  cardId: string,
  commentId: string
) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/cards/${cardId}/comments/${commentId}`
  );
  return data.data;
};

export const createChecklist = async (
  cardId: string,
  title: string,
  position = 0
) => {
  const { data } = await api.post<ApiResponse<ChecklistDto>>(
    `/cards/${cardId}/checklists`,
    { title, position }
  );
  return data.data;
};

export const updateChecklist = async (
  cardId: string,
  checklistId: string,
  updates: Partial<ChecklistDto>
) => {
  const { data } = await api.patch<ApiResponse<ChecklistDto>>(
    `/cards/${cardId}/checklists/${checklistId}`,
    updates
  );
  return data.data;
};

export const deleteChecklist = async (
  cardId: string,
  checklistId: string
) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/cards/${cardId}/checklists/${checklistId}`
  );
  return data.data;
};

export const fetchChecklistItems = async (
  _boardId: string,
  _listId: string,
  cardId: string,
  checklistId: string
): Promise<ChecklistItemDto[]> => {
  const { data } = await api.get<ApiResponse<ChecklistItemDto[]>>(
    `/cards/${cardId}/checklists/${checklistId}/checklistItems`
  );
  return data.data;
};

export const createChecklistItem = async (
  cardId: string,
  checklistId: string,
  text: string,
  position = 0
): Promise<ChecklistItemDto> => {
  const { data } = await api.post<ApiResponse<ChecklistItemDto>>(
    `/cards/${cardId}/checklists/${checklistId}/checklistItems`,
    { text, position }
  );
  return data.data;
};

export const updateChecklistItem = async (
  cardId: string,
  checklistId: string,
  itemId: string,
  updates: Partial<ChecklistItemDto>
): Promise<ChecklistItemDto> => {
  const { data } = await api.patch<ApiResponse<ChecklistItemDto>>(
    `/cards/${cardId}/checklists/${checklistId}/checklistItems/${itemId}`,
    updates
  );
  return data.data;
};
