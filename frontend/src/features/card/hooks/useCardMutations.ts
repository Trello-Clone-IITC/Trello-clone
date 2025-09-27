import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "@/features/board/hooks";
import {
  updateCard,
  createChecklist,
  deleteChecklist,
  createChecklistItem,
  updateChecklistItem,
  createCardComment,
  addCardAssignee,
  removeCardAssignee,
  createAttachment,
  deleteAttachment,
  addCardLabel,
  removeCardLabel,
} from "../api";
import type {
  ChecklistDto,
  ChecklistItemDto,
  CommentDto,
} from "@ronmordo/contracts";

export const useUpdateCard = (
  boardId: string,
  listId: string,
  cardId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Parameters<typeof updateCard>[1]) =>
      updateCard(cardId, updates),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({
        queryKey: boardKeys.card(boardId, listId, cardId),
      });
      await queryClient.cancelQueries({
        queryKey: boardKeys.cards(boardId, listId),
      });

      const prevCard = queryClient.getQueryData<any>(
        boardKeys.card(boardId, listId, cardId)
      );
      const prevCards = queryClient.getQueryData<any[]>(
        boardKeys.cards(boardId, listId)
      );

      // optimistic
      queryClient.setQueryData<any>(
        boardKeys.card(boardId, listId, cardId),
        (c: any) => (c ? { ...c, ...updates } : c)
      );
      queryClient.setQueryData<any[] | undefined>(
        boardKeys.cards(boardId, listId),
        (cards: any[] | undefined) =>
          cards?.map((c) => (c.id === cardId ? { ...c, ...updates } : c))
      );

      return { prevCard, prevCards };
    },
    onError: (_err, _updates, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(
        boardKeys.card(boardId, listId, cardId),
        ctx.prevCard
      );
      queryClient.setQueryData(boardKeys.cards(boardId, listId), ctx.prevCards);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.card(boardId, listId, cardId),
      });
      queryClient.invalidateQueries({
        queryKey: boardKeys.cards(boardId, listId),
      });
    },
  });
};

export const useDeleteAttachment = (
  boardId: string,
  listId: string,
  cardId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attachmentId: string) =>
      deleteAttachment(cardId, attachmentId),
    onMutate: async (attachmentId) => {
      await queryClient.cancelQueries({
        queryKey: boardKeys.cardAttachments(boardId, listId, cardId),
      });
      const prev = queryClient.getQueryData<any[]>(
        boardKeys.cardAttachments(boardId, listId, cardId)
      );
      queryClient.setQueryData<any[]>(
        boardKeys.cardAttachments(boardId, listId, cardId),
        (atts) => atts?.filter((a) => a.id !== attachmentId) || []
      );
      queryClient.setQueryData<any>(
        boardKeys.card(boardId, listId, cardId),
        (c: any) =>
          c
            ? {
                ...c,
                attachmentsCount: Math.max(0, (c.attachmentsCount ?? 1) - 1),
              }
            : c
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(
        boardKeys.cardAttachments(boardId, listId, cardId),
        ctx.prev
      );
      queryClient.setQueryData<any>(
        boardKeys.card(boardId, listId, cardId),
        (c: any) =>
          c ? { ...c, attachmentsCount: (c.attachmentsCount ?? 0) + 1 } : c
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.cardAttachments(boardId, listId, cardId),
      });
      queryClient.invalidateQueries({
        queryKey: boardKeys.card(boardId, listId, cardId),
      });
    },
  });
};

export const useToggleCardLabel = (
  boardId: string,
  listId: string,
  cardId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ labelId, add }: { labelId: string; add: boolean }) => {
      if (add) return addCardLabel(cardId, labelId);
      return removeCardLabel(cardId, labelId);
    },
    onMutate: async ({ labelId, add }) => {
      await queryClient.cancelQueries({
        queryKey: boardKeys.cardLabels(boardId, listId, cardId),
      });
      const prev =
        queryClient.getQueryData<any[]>(
          boardKeys.cardLabels(boardId, listId, cardId)
        ) || [];
      queryClient.setQueryData<any[]>(
        boardKeys.cardLabels(boardId, listId, cardId),
        (labels) => {
          const list = labels || [];
          if (add) {
            if (list.some((l: any) => l.id === labelId)) return list;
            // optimistic minimal label: use color/name unknown
            return [...list, { id: labelId } as any];
          } else {
            return list.filter((l: any) => l.id !== labelId);
          }
        }
      );

      // Also update the card and cards caches so UI reflects immediately
      const boardLabels =
        queryClient.getQueryData<any[]>(boardKeys.boardLabels(boardId)) || [];
      const label = boardLabels.find((l: any) => l.id === labelId);
      const minimal = label ? { color: label.color, name: label.name } : null;

      // Update single card cache
      queryClient.setQueryData<any>(
        boardKeys.card(boardId, listId, cardId),
        (c: any) => {
          if (!c) return c;
          const existing: any[] = c.labels || [];
          if (add && minimal) {
            if (existing.some((x) => x.color === minimal.color)) return c;
            return { ...c, labels: [...existing, minimal] };
          }
          if (!add && minimal) {
            return {
              ...c,
              labels: existing.filter((x) => x.color !== minimal.color),
            };
          }
          return c;
        }
      );

      // Update cards list cache
      queryClient.setQueryData<any[] | undefined>(
        boardKeys.cards(boardId, listId),
        (cards) =>
          cards?.map((c: any) => {
            if (c.id !== cardId) return c;
            const existing: any[] = c.labels || [];
            if (add && minimal) {
              if (existing.some((x) => x.color === minimal.color)) return c;
              return { ...c, labels: [...existing, minimal] };
            }
            if (!add && minimal) {
              return {
                ...c,
                labels: existing.filter((x) => x.color !== minimal.color),
              };
            }
            return c;
          })
      );
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(
        boardKeys.cardLabels(boardId, listId, cardId),
        ctx.prev
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.cardLabels(boardId, listId, cardId),
      });
      queryClient.invalidateQueries({
        queryKey: boardKeys.card(boardId, listId, cardId),
      });
    },
  });
};

export const useCreateChecklist = (
  boardId: string,
  listId: string,
  cardId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ title, position }: { title: string; position: number }) =>
      createChecklist(cardId, title, position),
    onMutate: async ({ title, position }) => {
      await queryClient.cancelQueries({
        queryKey: boardKeys.cardChecklists(boardId, listId, cardId),
      });
      const prev =
        queryClient.getQueryData<ChecklistDto[]>(
          boardKeys.cardChecklists(boardId, listId, cardId)
        ) || [];
      const temp = {
        id: `temp-${Date.now()}`,
        cardId,
        title,
        position,
      } as any as ChecklistDto;
      queryClient.setQueryData<ChecklistDto[]>(
        boardKeys.cardChecklists(boardId, listId, cardId),
        (cl) => (cl ? [...cl, temp] : [temp])
      );
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(
        boardKeys.cardChecklists(boardId, listId, cardId),
        ctx.prev
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.cardChecklists(boardId, listId, cardId),
      });
    },
  });
};

export const useDeleteChecklist = (
  boardId: string,
  listId: string,
  cardId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (checklistId: string) => deleteChecklist(cardId, checklistId),
    onMutate: async (checklistId) => {
      await queryClient.cancelQueries({
        queryKey: boardKeys.cardChecklists(boardId, listId, cardId),
      });
      const prev =
        queryClient.getQueryData<ChecklistDto[]>(
          boardKeys.cardChecklists(boardId, listId, cardId)
        ) || [];
      queryClient.setQueryData<ChecklistDto[]>(
        boardKeys.cardChecklists(boardId, listId, cardId),
        (cl) => cl?.filter((c) => c.id !== checklistId) || []
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(
        boardKeys.cardChecklists(boardId, listId, cardId),
        ctx.prev
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.cardChecklists(boardId, listId, cardId),
      });
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
      await queryClient.cancelQueries({
        queryKey: boardKeys.checklistItems(
          boardId,
          listId,
          cardId,
          checklistId
        ),
      });
      const prev =
        queryClient.getQueryData<ChecklistItemDto[]>(
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
      queryClient.setQueryData(
        boardKeys.checklistItems(boardId, listId, cardId, checklistId),
        ctx.prev
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.checklistItems(
          boardId,
          listId,
          cardId,
          checklistId
        ),
      });
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
    mutationFn: ({
      itemId,
      isCompleted,
    }: {
      itemId: string;
      isCompleted: boolean;
    }) => updateChecklistItem(cardId, checklistId, itemId, { isCompleted }),
    onMutate: async ({ itemId, isCompleted }) => {
      await queryClient.cancelQueries({
        queryKey: boardKeys.checklistItems(
          boardId,
          listId,
          cardId,
          checklistId
        ),
      });
      const prev =
        queryClient.getQueryData<ChecklistItemDto[]>(
          boardKeys.checklistItems(boardId, listId, cardId, checklistId)
        ) || [];
      queryClient.setQueryData<ChecklistItemDto[]>(
        boardKeys.checklistItems(boardId, listId, cardId, checklistId),
        (items) =>
          items?.map((i) => (i.id === itemId ? { ...i, isCompleted } : i)) || []
      );
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(
        boardKeys.checklistItems(boardId, listId, cardId, checklistId),
        ctx.prev
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.checklistItems(
          boardId,
          listId,
          cardId,
          checklistId
        ),
      });
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
      await queryClient.cancelQueries({
        queryKey: boardKeys.cardComments(boardId, listId, cardId),
      });
      const prev =
        queryClient.getQueryData<CommentDto[]>(
          boardKeys.cardComments(boardId, listId, cardId)
        ) || [];
      const temp = {
        id: `temp-${Date.now()}`,
        cardId,
        userId: "temp-user" as any,
        text,
        createdAt: new Date().toISOString() as any,
      } as any as CommentDto;
      queryClient.setQueryData<CommentDto[]>(
        boardKeys.cardComments(boardId, listId, cardId),
        (cs) => [temp, ...(cs || [])]
      );
      return { prev };
    },
    onError: (_e, _text, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(
        boardKeys.cardComments(boardId, listId, cardId),
        ctx.prev
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.cardComments(boardId, listId, cardId),
      });
    },
  });
};

export const useCreateAttachment = (
  boardId: string,
  listId: string,
  cardId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { url: string; displayText?: string | null }) =>
      createAttachment(cardId, input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({
        queryKey: boardKeys.cardAttachments(boardId, listId, cardId),
      });
      const prev = queryClient.getQueryData<any[]>(
        boardKeys.cardAttachments(boardId, listId, cardId)
      );
      const temp = {
        id: `temp-${Date.now()}`,
        cardId,
        url: input.url,
        displayText: input.displayText ?? input.url,
        createdAt: new Date().toISOString(),
      } as any;
      queryClient.setQueryData<any[]>(
        boardKeys.cardAttachments(boardId, listId, cardId),
        (atts) => (atts ? [temp, ...atts] : [temp])
      );
      // bump counter on card for UI badges
      queryClient.setQueryData<any>(
        boardKeys.card(boardId, listId, cardId),
        (c: any) =>
          c ? { ...c, attachmentsCount: (c.attachmentsCount ?? 0) + 1 } : c
      );
      return { prev };
    },
    onError: (_e, _vars, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(
        boardKeys.cardAttachments(boardId, listId, cardId),
        ctx.prev
      );
      queryClient.setQueryData<any>(
        boardKeys.card(boardId, listId, cardId),
        (c: any) =>
          c
            ? {
                ...c,
                attachmentsCount: Math.max(0, (c.attachmentsCount ?? 1) - 1),
              }
            : c
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.cardAttachments(boardId, listId, cardId),
      });
      queryClient.invalidateQueries({
        queryKey: boardKeys.card(boardId, listId, cardId),
      });
    },
  });
};

export const useAssignCardMember = (
  boardId: string,
  listId: string,
  cardId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => addCardAssignee(cardId, userId),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({
        queryKey: boardKeys.card(boardId, listId, cardId),
      });
      const prev = queryClient.getQueryData<any>(
        boardKeys.card(boardId, listId, cardId)
      );
      queryClient.setQueryData<any>(
        boardKeys.card(boardId, listId, cardId),
        (c: any) =>
          c
            ? {
                ...c,
                cardAssignees: c.cardAssignees?.some(
                  (a: any) => a.id === userId
                )
                  ? c.cardAssignees
                  : [
                      ...((c.cardAssignees as any[]) || []),
                      {
                        id: userId,
                        fullName: "",
                        username: "",
                        avatarUrl: null,
                      },
                    ],
              }
            : c
      );
      return { prev };
    },
    onError: (_err, _userId, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(
        boardKeys.card(boardId, listId, cardId),
        ctx.prev
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.card(boardId, listId, cardId),
      });
      queryClient.invalidateQueries({
        queryKey: boardKeys.cards(boardId, listId),
      });
    },
  });
};

export const useRemoveCardMember = (
  boardId: string,
  listId: string,
  cardId: string
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => removeCardAssignee(cardId, userId),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({
        queryKey: boardKeys.card(boardId, listId, cardId),
      });
      const prev = queryClient.getQueryData<any>(
        boardKeys.card(boardId, listId, cardId)
      );
      queryClient.setQueryData<any>(
        boardKeys.card(boardId, listId, cardId),
        (c: any) =>
          c
            ? {
                ...c,
                cardAssignees: (c.cardAssignees as any[])?.filter(
                  (a: any) => a.id !== userId
                ),
              }
            : c
      );
      return { prev };
    },
    onError: (_err, _userId, ctx) => {
      if (!ctx) return;
      queryClient.setQueryData(
        boardKeys.card(boardId, listId, cardId),
        ctx.prev
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.card(boardId, listId, cardId),
      });
      queryClient.invalidateQueries({
        queryKey: boardKeys.cards(boardId, listId),
      });
    },
  });
};
