import { z } from "zod";

export const addListWatcherSchema = z.object({
  params: z.object({
    listId: z.string().uuid("Invalid list ID"),
  }),
  body: z.object({
    userId: z.string().uuid("Invalid user ID"),
  }),
});

export const removeListWatcherSchema = z.object({
  params: z.object({
    listId: z.string().uuid("Invalid list ID"),
    userId: z.string().uuid("Invalid user ID"),
  }),
});
