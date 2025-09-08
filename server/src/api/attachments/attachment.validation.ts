import { z } from "zod";

// Attachment validation schemas based on Prisma schema and controller requirements

// Create attachment validation schema
export const createAttachmentSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
  }),
  body: z.object({
    url: z.string().url("Invalid URL format"),
    filename: z.string().max(255, "Filename too long").optional(),
    bytes: z.number().min(0, "File size must be non-negative").optional(),
    meta: z.record(z.string(), z.unknown()).optional(), // JSON metadata
  }),
});

// Get attachment by ID validation schema
export const getAttachmentSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    id: z.string().uuid("Invalid attachment ID"),
  }),
});

// Update attachment validation schema
export const updateAttachmentSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    id: z.string().uuid("Invalid attachment ID"),
  }),
  body: z.object({
    url: z.string().url("Invalid URL format").optional(),
    filename: z.string().max(255, "Filename too long").optional(),
    bytes: z.number().min(0, "File size must be non-negative").optional(),
    meta: z.record(z.string(), z.unknown()).optional(), // JSON metadata
  }),
});

// Delete attachment validation schema
export const deleteAttachmentSchema = z.object({
  params: z.object({
    cardId: z.string().uuid("Invalid card ID"),
    id: z.string().uuid("Invalid attachment ID"),
  }),
});