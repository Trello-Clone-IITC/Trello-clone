import type {
  CreateAttachmentInput,
  UpdateAttachmentInput,
} from "@ronmordo/contracts";
import { prisma } from "../../lib/prismaClient.js";
import { AppError } from "../../utils/appError.js";
import { Prisma } from "@prisma/client";

// interface CreateAttachmentData {
//   cardId: string;
//   url: string;
//   filename?: string;
//   bytes?: bigint;
//   meta?: Prisma.InputJsonValue;
//   userId: string;
// }

// interface UpdateAttachmentData {
//   url?: string;
//   filename?: string;
//   bytes?: bigint;
//   meta?: Prisma.InputJsonValue;
// }

// Create a new attachment
const createAttachment = async (
  data: CreateAttachmentInput,
  cardId: string,
  userId: string
) => {
  // Verify card exists and user has access
  const card = await prisma.card.findFirst({
    where: { id: cardId },
    include: {
      list: {
        include: {
          board: {
            include: {
              boardMembers: {
                where: { userId },
              },
            },
          },
        },
      },
    },
  });

  if (!card) {
    throw new AppError("Card not found", 404);
  }

  if (card.list && card.list.board.boardMembers.length === 0) {
    throw new AppError("Access denied", 403);
  }

  const attachment = await prisma.attachment.create({
    data: {
      cardId,
      url: data.url,
      filename: data.filename,
      bytes: data.bytes,
      meta: data.meta as Prisma.InputJsonValue,
      userId,
    },
    include: {
      card: {
        include: {
          list: {
            include: {
              board: true,
            },
          },
        },
      },
      user: true,
    },
  });

  // Log activity
  if (card.list)
    await prisma.activityLog.create({
      data: {
        boardId: card.list.board.id,
        cardId: card.id,
        userId,
        action: "Attached",
        payload: {
          filename: attachment.filename || "attachment",
          url: attachment.url,
        },
      },
    });

  return attachment;
};

// Get a single attachment by ID
const getAttachmentById = async (attachmentId: string, userId: string) => {
  const attachment = await prisma.attachment.findFirst({
    where: { id: attachmentId },
    include: {
      card: {
        include: {
          list: {
            include: {
              board: {
                include: {
                  boardMembers: {
                    where: { userId: userId },
                  },
                },
              },
            },
          },
        },
      },
      user: true,
    },
  });

  if (!attachment) {
    throw new AppError("Attachment not found", 404);
  }

  // Check if user has access to the card
  if (
    attachment.card.list &&
    attachment.card.list.board.boardMembers.length === 0
  ) {
    throw new AppError("Access denied", 403);
  }

  return attachment;
};

// Update an attachment
const updateAttachment = async (
  attachmentId: string,
  updateData: UpdateAttachmentInput,
  userId: string
) => {
  // Verify user has access to the attachment
  const existingAttachment = await prisma.attachment.findFirst({
    where: { id: attachmentId },
    include: {
      card: {
        include: {
          list: {
            include: {
              board: {
                include: {
                  boardMembers: {
                    where: { userId: userId },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!existingAttachment) {
    throw new AppError("Attachment not found", 404);
  }

  if (
    existingAttachment.card.list &&
    existingAttachment.card.list.board.boardMembers.length === 0
  ) {
    throw new AppError("Access denied", 403);
  }

  const attachment = await prisma.attachment.update({
    where: { id: attachmentId },
    data: {
      filename: updateData.filename,
    },
    include: {
      card: {
        include: {
          list: {
            include: {
              board: true,
            },
          },
        },
      },
      user: true,
    },
  });

  // Log activity
  if (existingAttachment.card.list)
    await prisma.activityLog.create({
      data: {
        boardId: existingAttachment.card.list.board.id,
        cardId: existingAttachment.card.id,
        userId: userId,
        action: "Updated",
        payload: {
          attachmentId: attachment.id,
          filename: attachment.filename,
          changes: updateData as Prisma.InputJsonValue,
        },
      },
    });

  return attachment;
};

// Delete an attachment
const deleteAttachment = async (attachmentId: string, userId: string) => {
  // Verify user has access to the attachment
  const existingAttachment = await prisma.attachment.findFirst({
    where: { id: attachmentId },
    include: {
      card: {
        include: {
          list: {
            include: {
              board: {
                include: {
                  boardMembers: {
                    where: { userId: userId },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!existingAttachment) {
    throw new AppError("Attachment not found", 404);
  }

  if (
    existingAttachment.card.list &&
    existingAttachment.card.list.board.boardMembers.length === 0
  ) {
    throw new AppError("Access denied", 403);
  }

  // Log activity before deletion
  if (existingAttachment.card.list) {
    await prisma.activityLog.create({
      data: {
        boardId: existingAttachment.card.list.board.id,
        cardId: existingAttachment.card.id,
        userId: userId,
        action: "Detached",
        payload: {
          filename: existingAttachment.filename || "attachment",
          url: existingAttachment.url,
        },
      },
    });
  }

  // Delete the attachment
  await prisma.attachment.delete({
    where: { id: attachmentId },
  });
};

export default {
  createAttachment,
  getAttachmentById,
  updateAttachment,
  deleteAttachment,
};
