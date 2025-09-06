import { z } from "zod";

// Validation schemas for attachment operations
export const createAttachmentSchema = z.object({
  body: z.object({
    cardId: z.string().uuid(),
    url: z.string().url(),
    filename: z.string().max(255).optional(),
    bytes: z.number().positive().optional(),
    meta: z.any().optional(),
  }),
});

export const updateAttachmentSchema = z.object({
  body: z.object({
    filename: z.string().max(255).optional(),
    meta: z.any().optional(),
  }),
});
