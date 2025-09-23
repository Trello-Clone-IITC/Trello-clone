import { useQuery } from "@tanstack/react-query";
import type {
  CardDto,
  ChecklistDto,
  CommentDto,
  LabelDto,
  AttachmentDto,
  ChecklistItemDto,
} from "@ronmordo/contracts";
import {
  fetchCard,
  fetchCardAttachments,
  fetchCardChecklists,
  fetchCardComments,
  fetchCardLabels,
  fetchChecklistItems,
} from "../api";
import { boardKeys } from "@/features/final-final/board/hooks";

export const useCard = (
  boardId: string,
  listId: string,
  cardId: string,
  enabled?: boolean
) =>
  useQuery<CardDto>({
    queryKey: boardKeys.card(boardId, listId, cardId),
    queryFn: () => fetchCard(boardId, listId, cardId),
    enabled: !!boardId && !!listId && !!cardId && enabled !== false,
    staleTime: 15_000,
  });

export const useCardComments = (
  boardId: string,
  listId: string,
  cardId: string,
  enabled?: boolean
) =>
  useQuery<CommentDto[]>({
    queryKey: boardKeys.cardComments(boardId, listId, cardId),
    queryFn: () => fetchCardComments(boardId, listId, cardId),
    enabled: !!boardId && !!listId && !!cardId && enabled === true,
  });

export const useCardChecklists = (
  boardId: string,
  listId: string,
  cardId: string,
  enabled?: boolean
) =>
  useQuery<ChecklistDto[]>({
    queryKey: boardKeys.cardChecklists(boardId, listId, cardId),
    queryFn: () => fetchCardChecklists(boardId, listId, cardId),
    enabled: !!boardId && !!listId && !!cardId && enabled === true,
  });

export const useCardLabels = (
  boardId: string,
  listId: string,
  cardId: string,
  enabled?: boolean
) =>
  useQuery<LabelDto[]>({
    queryKey: boardKeys.cardLabels(boardId, listId, cardId),
    queryFn: () => fetchCardLabels(boardId, listId, cardId),
    enabled: !!boardId && !!listId && !!cardId && enabled === true,
  });

export const useCardAttachments = (
  boardId: string,
  listId: string,
  cardId: string,
  enabled?: boolean
) =>
  useQuery<AttachmentDto[]>({
    queryKey: boardKeys.cardAttachments(boardId, listId, cardId),
    queryFn: () => fetchCardAttachments(boardId, listId, cardId),
    enabled: !!boardId && !!listId && !!cardId && enabled === true,
  });

export const useChecklistItems = (
  boardId: string,
  listId: string,
  cardId: string,
  checklistId: string,
  enabled?: boolean
) =>
  useQuery<ChecklistItemDto[]>({
    queryKey: boardKeys.checklistItems(boardId, listId, cardId, checklistId),
    queryFn: () => fetchChecklistItems(boardId, listId, cardId, checklistId),
    enabled:
      !!boardId && !!listId && !!cardId && !!checklistId && enabled === true,
  });
