import { z } from "zod";

// Checklist item assignee validation schemas based on Prisma schema and controller requirements

// Assign user to checklist item validation schema
export const assignUserToItemSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
    itemId: z.string().uuid("Invalid item ID"),
  }),
  body: z.object({
    userId: z.string().uuid("Invalid user ID"),
  }),
});

// Remove user from checklist item validation schema
export const removeUserFromItemSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
    itemId: z.string().uuid("Invalid item ID"),
    userId: z.string().uuid("Invalid user ID"),
  }),
});
