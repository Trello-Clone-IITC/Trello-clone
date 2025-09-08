import { z } from "zod";

// Checklist item validation schemas based on Prisma schema and controller requirements

// Create checklist item validation schema
export const createChecklistItemSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
  }),
  body: z.object({
    text: z.string().min(1, "Item text is required").max(500, "Item text too long"),
    dueDate: z.string().datetime("Invalid due date format").optional(),
    position: z.number().min(0, "Position must be non-negative").optional().default(1000),
  }),
});

// Get checklist item by ID validation schema
export const getChecklistItemSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
    id: z.string().uuid("Invalid item ID"),
  }),
});

// Update checklist item validation schema
export const updateChecklistItemSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
    id: z.string().uuid("Invalid item ID"),
  }),
  body: z.object({
    text: z.string().min(1, "Item text is required").max(500, "Item text too long").optional(),
    isCompleted: z.boolean().optional(),
    dueDate: z.string().datetime("Invalid due date format").optional(),
    position: z.number().min(0, "Position must be non-negative").optional(),
  }),
});

// Delete checklist item validation schema
export const deleteChecklistItemSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
    id: z.string().uuid("Invalid item ID"),
  }),
});

// Toggle checklist item validation schema
export const toggleChecklistItemSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
    id: z.string().uuid("Invalid item ID"),
  }),
});

// Get checklist item assignees validation schema
export const getChecklistItemAssigneesSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
    id: z.string().uuid("Invalid item ID"),
  }),
});
