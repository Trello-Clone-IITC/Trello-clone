import { z } from "zod";

// Color enum values from Prisma schema (snake_case for DTOs)
const ColorEnum = z.enum([
  "subtle_yellow",
  "subtle_orange",
  "subtle_red",
  "subtle_purple",
  "green",
  "yellow",
  "orange",
  "red",
  "purple",
  "bold_green",
  "bold_yellow",
  "bold_orange",
  "bold_red",
  "bold_purple",
  "subtle_blue",
  "subtle_sky",
  "subtle_lime",
  "subtle_pink",
  "subtle_black",
  "blue",
  "sky",
  "lime",
  "pink",
  "black",
  "bold_blue",
  "bold_sky",
  "bold_lime",
  "bold_pink",
  "bold_black",
  "default",
]);

// Create Label Request Schema
export const CreateLabelRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid board ID"),
  }),
  query: z.object({}),
  body: z.object({
    name: z
      .string()
      .min(1, "Label name is required")
      .max(100, "Label name too long")
      .optional(),
    color: ColorEnum,
  }),
});

// Update Label Request Schema
export const UpdateLabelRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid board ID"),
    labelId: z.string().uuid("Invalid label ID"),
  }),
  query: z.object({}),
  body: z.object({
    name: z
      .string()
      .min(1, "Label name is required")
      .max(100, "Label name too long")
      .optional(),
    color: ColorEnum.optional(),
  }),
});

// Get Label by ID Request Schema
export const GetLabelByIdRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid board ID"),
    labelId: z.string().uuid("Invalid label ID"),
  }),
  query: z.object({}),
  body: z.object({}).optional(),
});

// Delete Label Request Schema
export const DeleteLabelRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid board ID"),
    labelId: z.string().uuid("Invalid label ID"),
  }),
  query: z.object({}),
  body: z.object({}).optional(),
});
