import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "@/features/final-aiman/board/hooks";
import {
  updateCard,
  createChecklist,
  deleteChecklist,
  createChecklistItem,
  updateChecklistItem,
  createCardComment,
} from "../api";
import type { ChecklistDto, ChecklistItemDto, CommentDto } from "@ronmordo/contracts";

export const useUpdateCard = (boardId: string, listId: string, cardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Parameters<typeof updateCard>[1]) => updateCard(cardId, updates),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: boardKeys.card(boardId, listId, cardId) });
      await queryClient.cancelQueries({ queryKey: boardKeys.cards(boardId, listId) });

      const prevCard = queryClient.getQueryData<any>(boardKeys.card(boardId, listId, cardId));
      const prevCards = queryClient.getQueryData<any[]>(boardKeys.cards(boardId, listId));

      // optimistic
      queryClient.setQueryData<any>(boardKeys.card(boardId, listId, cardId), (c) => (c ? { ...c, ...updates } : c));
      queryClient.setQueryData<any[]>(boardKeys.cards(boardId, listId), (cards) =>
        cards ? cards.map((c) => (c.id === cardId ? { ...c, ...updates } : c)) : cards
      );

      return { prevCard, prevCards };
    },
    onError: (_err, _updates, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(boardKeys.card(boardId, listId, cardId), ctx.prevCard);
      queryClient.setQueryData(boardKeys.cards(boardId, listId), ctx.prevCards);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.card(boardId, listId, cardId) });
      queryClient.invalidateQueries({ queryKey: boardKeys.cards(boardId, listId) });
    },
  });
};

export const useCreateChecklist = (boardId: string, listId: string, cardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, position }: { title: string; position: number }) => createChecklist(cardId, title, position),
    onMutate: async ({ title, position }) => {
      await queryClient.cancelQueries({ queryKey: boardKeys.cardChecklists(boardId, listId, cardId) });
      const prev = queryClient.getQueryData<ChecklistDto[]>(boardKeys.cardChecklists(boardId, listId, cardId)) || [];
      const temp = { id: `temp-${Date.now()}`, cardId, title, position } as any as ChecklistDto;
      queryClient.setQueryData<ChecklistDto[]>(boardKeys.cardChecklists(boardId, listId, cardId), (cl) =>
        cl ? [...cl, temp] : [temp]
      );
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(boardKeys.cardChecklists(boardId, listId, cardId), ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.cardChecklists(boardId, listId, cardId) });
    },
  });
};

export const useDeleteChecklist = (boardId: string, listId: string, cardId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (checklistId: string) => deleteChecklist(cardId, checklistId),
    onMutate: async (checklistId) => {
      await queryClient.cancelQueries({ queryKey: boardKeys.cardChecklists(boardId, listId, cardId) });
      const prev = queryClient.getQueryData<ChecklistDto[]>(boardKeys.cardChecklists(boardId, listId, cardId)) || [];
      queryClient.setQueryData<ChecklistDto[]>(boardKeys.cardChecklists(boardId, listId, cardId), (cl) =>
        cl?.filter((c) => c.id !== checklistId) || []
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(boardKeys.cardChecklists(boardId, listId, cardId), ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.cardChecklists(boardId, listId, cardId) });
    },
  });
};

export const useCreateChecklistItem = (
  boardId: string,
  listId: string,
  cardId: string,
  checklistId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ text, position }: { text: string; position: number }) =>
      createChecklistItem(cardId, checklistId, text, position),
    onMutate: async ({ text, position }) => {
      await queryClient.cancelQueries({ queryKey: boardKeys.checklistItems(boardId, listId, cardId, checklistId) });
      const prev = queryClient.getQueryData<ChecklistItemDto[]>(
        boardKeys.checklistItems(boardId, listId, cardId, checklistId)
      ) || [];
      const temp = {
        id: `temp-${Date.now()}`,
        checklistId,
        text,
        isCompleted: false,
        dueDate: null as any,
        position,
      } as any as ChecklistItemDto;
      queryClient.setQueryData<ChecklistItemDto[]>(
        boardKeys.checklistItems(boardId, listId, cardId, checklistId),
        (items) => (items ? [...items, temp] : [temp])
      );
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(boardKeys.checklistItems(boardId, listId, cardId, checklistId), ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.checklistItems(boardId, listId, cardId, checklistId) });
    },
  });
};

export const useToggleChecklistItem = (
  boardId: string,
  listId: string,
  cardId: string,
  checklistId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, isCompleted }: { itemId: string; isCompleted: boolean }) =>
      updateChecklistItem(cardId, checklistId, itemId, { isCompleted }),
    onMutate: async ({ itemId, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: boardKeys.checklistItems(boardId, listId, cardId, checklistId) });
      const prev = queryClient.getQueryData<ChecklistItemDto[]>(
        boardKeys.checklistItems(boardId, listId, cardId, checklistId)
      ) || [];
      queryClient.setQueryData<ChecklistItemDto[]>(
        boardKeys.checklistItems(boardId, listId, cardId, checklistId),
        (items) => items?.map((i) => (i.id === itemId ? { ...i, isCompleted } : i)) || []
      );
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(boardKeys.checklistItems(boardId, listId, cardId, checklistId), ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.checklistItems(boardId, listId, cardId, checklistId) });
    },
  });
};

export const useCreateCardComment = (
  boardId: string,
  listId: string,
  cardId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => createCardComment(cardId, text),
    onMutate: async (text: string) => {
      await queryClient.cancelQueries({ queryKey: boardKeys.cardComments(boardId, listId, cardId) });
      const prev = queryClient.getQueryData<CommentDto[]>(boardKeys.cardComments(boardId, listId, cardId)) || [];
      const temp = {
        id: `temp-${Date.now()}`,
        cardId,
        userId: "temp-user" as any,
        text,
        createdAt: new Date().toISOString() as any,
      } as any as CommentDto;
      queryClient.setQueryData<CommentDto[]>(boardKeys.cardComments(boardId, listId, cardId), (cs) => [temp, ...(cs || [])]);
      return { prev };
    },
    onError: (_e, _text, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(boardKeys.cardComments(boardId, listId, cardId), ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.cardComments(boardId, listId, cardId) });
    },
  });
};

