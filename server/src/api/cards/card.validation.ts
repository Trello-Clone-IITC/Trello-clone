import { z } from "zod";

// Card validation schemas based on Prisma schema and controller requirements

// Create card validation schema
export const createCardSchema = z.object({
  body: z.object({
    listId: z.string().uuid("Invalid list ID"),
    title: z
      .string()
      .min(1, "Card title is required")
      .max(255, "Card title too long"),
    description: z.string().max(1000, "Description too long").optional(),
    dueDate: z.string().datetime("Invalid due date format").optional(),
    startDate: z.string().datetime("Invalid start date format").optional(),
    position: z.number().min(0, "Position must be non-negative"),
    coverImageUrl: z.string().url("Invalid cover image URL").optional(),
    userId: z.string().uuid("Invalid user ID").optional(),
  }),
});

// Update card validation schema
export const updateCardSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, "Card title is required")
      .max(255, "Card title too long")
      .optional(),
    description: z.string().max(1000, "Description too long").optional(),
    dueDate: z.string().datetime("Invalid due date format").optional(),
    startDate: z.string().datetime("Invalid start date format").optional(),
    coverImageUrl: z.string().url("Invalid cover image URL").optional(),
    userId: z.string().uuid("Invalid user ID").optional(),
  }),
});

// Get card by ID validation schema
export const getCardSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),

});


// Delete card validation schema
export const deleteCardSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),

});

// Move card validation schema
export const moveCardSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
  body: z.object({
    listId: z.string().uuid("Invalid list ID"),
    position: z.number().min(0, "Position must be non-negative"),
  }),
});

// Toggle archive validation schema
export const toggleArchiveSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
});

// Toggle subscription validation schema
export const toggleSubscriptionSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
});

// Search cards validation schema
export const searchCardsSchema = z.object({
  query: z.object({
    query: z.string().min(1, "Search query is required"),
    boardId: z.string().uuid("Invalid board ID").optional(),
    listId: z.string().uuid("Invalid list ID").optional(),
  }),
});

// Get card activity validation schema
export const getCardActivitySchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
});

// Card assignee validation schemas
export const addCardAssigneeSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
  body: z.object({
    userId: z.string().uuid("Invalid user ID").optional(),
  }),
});

export const removeCardAssigneeSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
    userId: z.string().uuid("Invalid user ID").optional(),
  }),
});

// Card label validation schemas
export const addCardLabelSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
  body: z.object({
    labelId: z.string().uuid("Invalid label ID"),
  }),
});

export const removeCardLabelSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
    labelId: z.string().uuid("Invalid label ID"),
  }),
});

// Card watcher validation schemas
export const addCardWatcherSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
  body: z.object({
    userId: z.string().uuid("Invalid user ID").optional(),
  }),
});

export const removeCardWatcherSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
    userId: z.string().uuid("Invalid user ID").optional(),
  }),
});

// Card comment validation schemas
export const addCardCommentSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
  body: z.object({
    content: z
      .string()
      .min(1, "Comment content is required")
      .max(2000, "Comment too long"),
    userId: z.string().uuid("Invalid user ID").optional(),
  }),
});

export const updateCardCommentSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
    commentId: z.string().uuid("Invalid comment ID"),
  }),
  body: z.object({
    content: z
      .string()
      .min(1, "Comment content is required")
      .max(2000, "Comment too long"),
  }),
});

export const deleteCardCommentSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
    commentId: z.string().uuid("Invalid comment ID"),
  }),
});

// Card attachment validation schemas
export const addCardAttachmentSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
  body: z.object({
    name: z
      .string()
      .min(1, "Attachment name is required")
      .max(255, "Attachment name too long"),
    url: z.string().url("Invalid attachment URL"),
    mimeType: z.string().optional(),
    size: z.number().min(0, "File size must be non-negative").optional(),
  }),
});

export const removeCardAttachmentSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
    attachmentId: z.string().uuid("Invalid attachment ID"),
  }),
});

// Card checklist validation schemas
export const addCardChecklistSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, "Checklist title is required")
      .max(255, "Checklist title too long"),
    position: z.number().min(0, "Position must be non-negative").optional(),
  }),
});

export const updateCardChecklistSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, "Checklist title is required")
      .max(255, "Checklist title too long")
      .optional(),
    position: z.number().min(0, "Position must be non-negative").optional(),
  }),
});

export const deleteCardChecklistSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
  }),
});

// Card checklist item validation schemas
export const addChecklistItemSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, "Item title is required")
      .max(255, "Item title too long"),
    position: z.number().min(0, "Position must be non-negative").optional(),
    dueDate: z.string().datetime("Invalid due date format").optional(),
  }),
});

export const updateChecklistItemSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
    itemId: z.string().uuid("Invalid item ID"),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, "Item title is required")
      .max(255, "Item title too long")
      .optional(),
    isCompleted: z.boolean().optional(),
    position: z.number().min(0, "Position must be non-negative").optional(),
    dueDate: z.string().datetime("Invalid due date format").optional(),
  }),
});

export const deleteChecklistItemSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
    itemId: z.string().uuid("Invalid item ID"),
  }),
});

// Checklist item assignee validation schemas
export const addChecklistItemAssigneeSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
    itemId: z.string().uuid("Invalid item ID"),
  }),
  body: z.object({
    userId: z.string().uuid("Invalid user ID").optional(),
  }),
});

export const removeChecklistItemAssigneeSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
    checklistId: z.string().uuid("Invalid checklist ID"),
    itemId: z.string().uuid("Invalid item ID"),
    userId: z.string().uuid("Invalid user ID").optional(),
  }),
});

// Card nested resources validation schemas
export const getCardChecklistsSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
});

export const getCardCommentsSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
});

export const getCardAssigneesSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
});

export const getCardLabelsSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
});

export const getCardWatchersSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
});

export const getCardAttachmentsSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid card ID"),
  }),
});
