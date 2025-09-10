import { z } from "zod";

// Add Label to Card Request Schema
export const AddLabelToCardRequestSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
  }),
  query: z.object({}),
  body: z.object({
    labelId: z.string().uuid("Invalid label ID"),
  }),
});

// Remove Label from Card Request Schema
export const RemoveLabelFromCardRequestSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    labelId: z.string().uuid("Invalid label ID"),
  }),
  query: z.object({}),
  body: z.object({}).optional(),
});
