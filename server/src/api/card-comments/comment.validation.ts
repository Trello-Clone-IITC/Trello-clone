import { z } from "zod";

// Comment validation schemas based on Prisma schema and controller requirements

// Create comment validation schema
export const createCommentSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
  }),
  body: z.object({
    text: z.string().min(1, "Comment text is required").max(2000, "Comment text too long"),
  }),
});

// Get comment by ID validation schema
export const getCommentSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    id: z.string().uuid("Invalid comment ID"),
  }),
});


// Update comment validation schema
export const updateCommentSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    id: z.string().uuid("Invalid comment ID"),
  }),
  body: z.object({
    text: z.string().min(1, "Comment text is required").max(2000, "Comment text too long"),
  }),
});

// Delete comment validation schema
export const deleteCommentSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    id: z.string().uuid("Invalid comment ID"),
  }),
});
