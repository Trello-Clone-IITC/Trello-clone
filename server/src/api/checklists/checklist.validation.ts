import { z } from "zod";

// Checklist validation schemas based on Prisma schema and controller requirements

// Create checklist validation schema
export const createChecklistSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
  }),
  body: z.object({
    title: z.string().min(1, "Checklist title is required").max(255, "Checklist title too long"),
    position: z.number().min(0, "Position must be non-negative").optional(),
  }),
});

// Get checklist by ID validation schema
export const getChecklistSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    id: z.string().uuid("Invalid checklist ID"),
  }),
});

// Update checklist validation schema
export const updateChecklistSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    id: z.string().uuid("Invalid checklist ID"),
  }),
  body: z.object({
    title: z.string().min(1, "Checklist title is required").max(255, "Checklist title too long").optional(),
    position: z.number().min(0, "Position must be non-negative").optional(),
  }),
});

// Delete checklist validation schema
export const deleteChecklistSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    id: z.string().uuid("Invalid checklist ID"),
  }),
});

// Get checklist items validation schema
export const getChecklistItemsSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    id: z.string().uuid("Invalid checklist ID"),
  }),
});

// Create checklist item validation schema
export const createChecklistItemSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
  }),
  body: z.object({
    text: z.string().min(1, "Item text is required").max(500, "Item text too long"),
    dueDate: z.string().datetime("Invalid due date format").optional(),
    position: z.number().min(0, "Position must be non-negative").optional(),
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

// Assign user to checklist item validation schema
export const assignUserToItemSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
  }),
  body: z.object({
    itemId: z.string().uuid("Invalid item ID"),
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
