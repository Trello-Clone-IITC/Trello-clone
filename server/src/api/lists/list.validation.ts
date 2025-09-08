import { z } from "zod";

// List validation schemas based on Prisma schema
export const createListSchema = z.object({
  params: z.object({
    boardId: z.string().uuid("Invalid board ID"),
  }),
  body: z.object({
    name: z
      .string()
      .min(1, "List name is required")
      .max(255, "List name too long"),
    position: z.number().min(0).optional(),
    isArchived: z.boolean().optional(),
    subscribed: z.boolean().optional(),
  }),
});

export const updateListSchema = z.object({
  params: z.object({
    listId: z.string().uuid("Invalid list ID"),
  }),
  body: z.object({
    name: z
      .string()
      .min(1, "List name is required")
      .max(255, "List name too long")
      .optional(),
    position: z.number().min(0).optional(),
    isArchived: z.boolean().optional(),
    subscribed: z.boolean().optional(),
  }),
});

export const listIdSchema = z.object({
  params: z.object({
    listId: z.string().uuid("Invalid list ID"),
  }),
});


export const updateListPositionSchema = z.object({
  params: z.object({
    listId: z.string().uuid("Invalid list ID"),
  }),
  body: z.object({
    position: z.number().min(0, "Position must be non-negative"),
  }),
});

export const archiveListSchema = z.object({
  params: z.object({
    listId: z.string().uuid("Invalid list ID"),
  }),
  body: z.object({
    isArchived: z.boolean(),
  }),
});

export const subscribeToListSchema = z.object({
  params: z.object({
    listId: z.string().uuid("Invalid list ID"),
  }),
  body: z.object({
    subscribed: z.boolean(),
  }),
});


export const getListWatchersSchema = z.object({
  params: z.object({
    listId: z.string().uuid("Invalid list ID"),
  }),
});

