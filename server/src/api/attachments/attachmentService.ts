import { prisma } from "../../lib/prismaClient.js";
import { AppError } from "../../utils/appError.js";

interface CreateAttachmentData {
  cardId: string;
  url: string;
  filename?: string;
  bytes?: bigint;
  meta?: any;
  userId: string;
}

interface UpdateAttachmentData {
  filename?: string;
  meta?: any;
}

export const attachmentService = {
  // Create a new attachment
  async createAttachment(data: CreateAttachmentData) {
    // Verify card exists and user has access
    const card = await prisma.cards.findFirst({
      where: { id: data.cardId },
      include: {
        lists: {
          include: {
            board: {
              include: {
                members: {
                  where: {
                    userId: data.userId,
                  },
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

    if (card.lists.board.members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const attachment = await prisma.attachments.create({
      data: {
        card_id: data.cardId,
        user_id: data.userId,
        url: data.url,
        filename: data.filename,
        bytes: data.bytes,
        meta: data.meta,
      },
      include: {
        cards: {
          include: {
            lists: {
              include: {
                board: true,
              },
            },
          },
        },
        users: true,
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: card.lists.board.id,
        card_id: data.cardId,
        user_id: data.userId,
        action: "attached",
        payload: {
          filename: attachment.filename || "Unknown file",
          url: attachment.url,
        },
      },
    });

    return attachment;
  },

  // Get attachment by ID
  async getAttachmentById(attachmentId: string, userId: string) {
    const attachment = await prisma.attachments.findFirst({
      where: { id: attachmentId },
      include: {
        cards: {
          include: {
            lists: {
              include: {
                board: {
                  include: {
                    members: {
                      where: { userId: userId },
                    },
                  },
                },
              },
            },
          },
        },
        users: true,
      },
    });

    if (!attachment) {
      throw new AppError("Attachment not found", 404);
    }

    // Check if user has access to the board
    if (attachment.cards.lists.board.members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    return attachment;
  },

  // Get all attachments for a card
  async getAttachmentsByCard(cardId: string, userId: string) {
    // Verify user has access to the card
    const card = await prisma.cards.findFirst({
      where: { id: cardId },
      include: {
        lists: {
          include: {
            board: {
              include: {
                members: {
                  where: { userId: userId },
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

    if (card.lists.board.members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const attachments = await prisma.attachments.findMany({
      where: { card_id: cardId },
      include: {
        users: true,
      },
      orderBy: { created_at: "desc" },
    });

    return attachments;
  },

  // Update attachment
  async updateAttachment(
    attachmentId: string,
    updateData: UpdateAttachmentData,
    userId: string
  ) {
    // Verify user has access to the attachment
    const existingAttachment = await prisma.attachments.findFirst({
      where: { id: attachmentId },
      include: {
        cards: {
          include: {
            lists: {
              include: {
                board: {
                  include: {
                    members: {
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

    if (existingAttachment.cards.lists.board.members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Only the attachment creator or board admin can edit attachments
    const isCreator = existingAttachment.user_id === userId;
    const isAdmin = existingAttachment.cards.lists.board.members.some(
      (member) => member.role === "admin"
    );

    if (!isCreator && !isAdmin) {
      throw new AppError(
        "You can only edit your own attachments or must be an admin",
        403
      );
    }

    const attachment = await prisma.attachments.update({
      where: { id: attachmentId },
      data: {
        filename: updateData.filename,
        meta: updateData.meta,
      },
      include: {
        cards: {
          include: {
            lists: {
              include: {
                board: true,
              },
            },
          },
        },
        users: true,
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: existingAttachment.cards.lists.board.id,
        card_id: existingAttachment.cards.id,
        user_id: userId,
        action: "updated",
        payload: {
          action: "attachment_updated",
          filename: attachment.filename || "Unknown file",
        },
      },
    });

    return attachment;
  },

  // Delete attachment
  async deleteAttachment(attachmentId: string, userId: string) {
    // Verify user has access to the attachment
    const existingAttachment = await prisma.attachments.findFirst({
      where: { id: attachmentId },
      include: {
        cards: {
          include: {
            lists: {
              include: {
                board: {
                  include: {
                    members: {
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

    if (existingAttachment.cards.lists.board.members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Only the attachment creator or board admin can delete attachments
    const isCreator = existingAttachment.user_id === userId;
    const isAdmin = existingAttachment.cards.lists.board.members.some(
      (member) => member.role === "admin"
    );

    if (!isCreator && !isAdmin) {
      throw new AppError(
        "You can only delete your own attachments or must be an admin",
        403
      );
    }

    // Log activity before deletion
    await prisma.activity_log.create({
      data: {
        board_id: existingAttachment.cards.lists.board.id,
        card_id: existingAttachment.cards.id,
        user_id: userId,
        action: "detached",
        payload: {
          filename: existingAttachment.filename || "Unknown file",
          url: existingAttachment.url,
        },
      },
    });

    // Delete the attachment
    await prisma.attachments.delete({
      where: { id: attachmentId },
    });
  },
};
