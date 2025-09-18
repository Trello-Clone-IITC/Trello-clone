import { api } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/shared/types/apiResponse";
import type {
  BoardDto,
  ListDto,
  CardDto,
  ChecklistDto,
  CommentDto,
  LabelDto,
  AttachmentDto,
} from "@ronmordo/contracts";

// Fetch board (without nested data)
export const fetchBoard = async (boardId: string): Promise<BoardDto> => {
  const { data } = await api.get<ApiResponse<BoardDto>>(`/boards/${boardId}`);
  return data.data;
};

// Fetch lists for a board
export const fetchBoardLists = async (boardId: string): Promise<ListDto[]> => {
  const { data } = await api.get<ApiResponse<ListDto[]>>(`/boards/${boardId}/lists`);
  return data.data;
};

// Fetch board labels
export const fetchBoardLabels = async (boardId: string): Promise<LabelDto[]> => {
  const { data } = await api.get<ApiResponse<LabelDto[]>>(
    `/boards/${boardId}/labels`
  );
  return data.data;
};

// Fetch cards for a list
export const fetchListCards = async (
  _boardId: string,
  listId: string
): Promise<CardDto[]> => {
  // Cards by list are available at top-level under /lists/:listId/cards
  const { data } = await api.get<ApiResponse<CardDto[]>>(`/lists/${listId}/cards`);
  return data.data;
};

// Fetch single card
export const fetchCard = async (
  _boardId: string,
  _listId: string,
  cardId: string
): Promise<CardDto> => {
  // Cards are addressable directly under /cards/:id
  const { data } = await api.get<ApiResponse<CardDto>>(`/cards/${cardId}`);
  return data.data;
};

// Create a card in a list
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

// Update a card
export const updateCard = async (
  cardId: string,
  updates: Partial<Pick<CardDto, "title" | "description" | "dueDate" | "startDate" | "coverImageUrl">>
): Promise<CardDto> => {
  const { data } = await api.patch<ApiResponse<CardDto>>(
    `/cards/${cardId}`,
    updates
  );
  return data.data;
};

// Nested resources
export const fetchCardComments = async (
  _boardId: string,
  _listId: string,
  cardId: string
): Promise<CommentDto[]> => {
  // Comments under top-level cards router
  const { data } = await api.get<ApiResponse<CommentDto[]>>(`/cards/${cardId}/comments`);
  return data.data;
};

export const fetchCardChecklists = async (
  _boardId: string,
  _listId: string,
  cardId: string
): Promise<ChecklistDto[]> => {
  const { data } = await api.get<ApiResponse<ChecklistDto[]>>(`/cards/${cardId}/checklists`);
  return data.data;
};

export const fetchCardLabels = async (
  _boardId: string,
  _listId: string,
  cardId: string
): Promise<LabelDto[]> => {
  const { data } = await api.get<ApiResponse<LabelDto[]>>(`/cards/${cardId}/labels`);
  return data.data;
};

export const fetchCardAttachments = async (
  _boardId: string,
  _listId: string,
  cardId: string
): Promise<AttachmentDto[]> => {
  const { data } = await api.get<ApiResponse<AttachmentDto[]>>(`/cards/${cardId}/attachments`);
  return data.data;
};

// Mutations: Comments
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

// Mutations: Checklists
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

// Mutations: Labels on card
export const addLabelToCard = async (cardId: string, labelId: string) => {
  const { data } = await api.post<ApiResponse<{ cardId: string; labelId: string }>>(
    `/cards/${cardId}/labels`,
    { labelId }
  );
  return data.data;
};

export const removeLabelFromCard = async (cardId: string, labelId: string) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/cards/${cardId}/labels/${labelId}`
  );
  return data.data;
};

// Mutations: Attachments
export const createAttachment = async (
  cardId: string,
  input: { url: string; filename: string; bytes?: number | null; meta?: unknown }
) => {
  const { data } = await api.post<ApiResponse<AttachmentDto>>(
    `/cards/${cardId}/attachments`,
    input
  );
  return data.data;
};

export const deleteAttachment = async (cardId: string, attachmentId: string) => {
  const { data } = await api.delete<ApiResponse<null>>(
    `/cards/${cardId}/attachments/${attachmentId}`
  );
  return data.data;
};
