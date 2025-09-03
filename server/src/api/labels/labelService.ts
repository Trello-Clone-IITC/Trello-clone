import { prisma } from "../../lib/prismaClient.js";
import { AppError } from "../../utils/appError.js";

interface CreateLabelData {
  boardId: string;
  name: string;
  color: string;
  createdBy: string;
}

interface UpdateLabelData {
  name?: string;
  color?: string;
}

export const labelService = {
  // Create a new label
  async createLabel(data: CreateLabelData) {
    // Verify board exists and user has access
    const board = await prisma.boards.findFirst({
      where: { id: data.boardId },
      include: {
        board_members: {
          where: { user_id: data.createdBy },
        },
      },
    });

    if (!board) {
      throw new AppError("Board not found", 404);
    }

    if (board.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Check if label name already exists on this board
    const existingLabel = await prisma.labels.findFirst({
      where: {
        board_id: data.boardId,
        name: data.name,
      },
    });

    if (existingLabel) {
      throw new AppError(
        "Label with this name already exists on this board",
        400
      );
    }

    const label = await prisma.labels.create({
      data: {
        board_id: data.boardId,
        name: data.name,
        color: data.color,
      },
      include: {
        boards: true,
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: data.boardId,
        user_id: data.createdBy,
        action: "updated",
        payload: {
          action: "label_created",
          labelName: label.name,
          labelColor: label.color,
        },
      },
    });

    return label;
  },

  // Get label by ID
  async getLabelById(labelId: string, userId: string) {
    const label = await prisma.labels.findFirst({
      where: { id: labelId },
      include: {
        boards: {
          include: {
            board_members: {
              where: { user_id: userId },
            },
          },
        },
      },
    });

    if (!label) {
      throw new AppError("Label not found", 404);
    }

    // Check if user has access to the board
    if (label.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    return label;
  },

  // Get all labels for a board
  async getLabelsByBoard(boardId: string, userId: string) {
    // Verify user has access to the board
    const board = await prisma.boards.findFirst({
      where: { id: boardId },
      include: {
        board_members: {
          where: { user_id: userId },
        },
      },
    });

    if (!board) {
      throw new AppError("Board not found", 404);
    }

    if (board.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const labels = await prisma.labels.findMany({
      where: { board_id: boardId },
      include: {
        card_labels: {
          include: {
            cards: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return labels;
  },

  // Update label
  async updateLabel(
    labelId: string,
    updateData: UpdateLabelData,
    userId: string
  ) {
    // Verify user has access to the label
    const existingLabel = await prisma.labels.findFirst({
      where: { id: labelId },
      include: {
        boards: {
          include: {
            board_members: {
              where: { user_id: userId },
            },
          },
        },
      },
    });

    if (!existingLabel) {
      throw new AppError("Label not found", 404);
    }

    if (existingLabel.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Check if new name already exists on this board (if name is being updated)
    if (updateData.name && updateData.name !== existingLabel.name) {
      const duplicateLabel = await prisma.labels.findFirst({
        where: {
          board_id: existingLabel.boards.id,
          name: updateData.name,
          id: { not: labelId },
        },
      });

      if (duplicateLabel) {
        throw new AppError(
          "Label with this name already exists on this board",
          400
        );
      }
    }

    const label = await prisma.labels.update({
      where: { id: labelId },
      data: {
        name: updateData.name,
        color: updateData.color,
      },
      include: {
        boards: true,
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: existingLabel.boards.id,
        user_id: userId,
        action: "updated",
        payload: {
          action: "label_updated",
          labelName: label.name,
          labelColor: label.color,
        },
      },
    });

    return label;
  },

  // Delete label
  async deleteLabel(labelId: string, userId: string) {
    // Verify user has access to the label
    const existingLabel = await prisma.labels.findFirst({
      where: { id: labelId },
      include: {
        boards: {
          include: {
            board_members: {
              where: { user_id: userId },
            },
          },
        },
      },
    });

    if (!existingLabel) {
      throw new AppError("Label not found", 404);
    }

    if (existingLabel.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Log activity before deletion
    await prisma.activity_log.create({
      data: {
        board_id: existingLabel.boards.id,
        user_id: userId,
        action: "updated",
        payload: {
          action: "label_deleted",
          labelName: existingLabel.name,
          labelColor: existingLabel.color,
        },
      },
    });

    // Delete the label (cascade will handle card_labels)
    await prisma.labels.delete({
      where: { id: labelId },
    });
  },

  // Add label to card
  async addLabelToCard(cardId: string, labelId: string, userId: string) {
    // Verify both card and label exist and user has access
    const [card, label] = await Promise.all([
      prisma.cards.findFirst({
        where: { id: cardId },
        include: {
          lists: {
            include: {
              boards: {
                include: {
                  board_members: {
                    where: { user_id: userId },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.labels.findFirst({
        where: { id: labelId },
        include: {
          boards: {
            include: {
              board_members: {
                where: { user_id: userId },
              },
            },
          },
        },
      }),
    ]);

    if (!card || !label) {
      throw new AppError("Card or label not found", 404);
    }

    if (
      card.lists.boards.board_members.length === 0 ||
      label.boards.board_members.length === 0
    ) {
      throw new AppError("Access denied", 403);
    }

    // Check if label is already on the card
    const existingCardLabel = await prisma.card_labels.findFirst({
      where: {
        card_id: cardId,
        label_id: labelId,
      },
    });

    if (existingCardLabel) {
      throw new AppError("Label is already on this card", 400);
    }

    const cardLabel = await prisma.card_labels.create({
      data: {
        card_id: cardId,
        label_id: labelId,
      },
      include: {
        cards: {
          include: {
            lists: {
              include: {
                boards: true,
              },
            },
          },
        },
        labels: true,
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: card.lists.boards.id,
        card_id: cardId,
        user_id: userId,
        action: "labeled",
        payload: {
          labelName: label.name,
          labelColor: label.color,
        },
      },
    });

    return cardLabel;
  },

  // Remove label from card
  async removeLabelFromCard(cardId: string, labelId: string, userId: string) {
    // Verify both card and label exist and user has access
    const [card, label] = await Promise.all([
      prisma.cards.findFirst({
        where: { id: cardId },
        include: {
          lists: {
            include: {
              boards: {
                include: {
                  board_members: {
                    where: { user_id: userId },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.labels.findFirst({
        where: { id: labelId },
        include: {
          boards: {
            include: {
              board_members: {
                where: { user_id: userId },
              },
            },
          },
        },
      }),
    ]);

    if (!card || !label) {
      throw new AppError("Card or label not found", 404);
    }

    if (
      card.lists.boards.board_members.length === 0 ||
      label.boards.board_members.length === 0
    ) {
      throw new AppError("Access denied", 403);
    }

    // Check if label is on the card
    const existingCardLabel = await prisma.card_labels.findFirst({
      where: {
        card_id: cardId,
        label_id: labelId,
      },
    });

    if (!existingCardLabel) {
      throw new AppError("Label is not on this card", 400);
    }

    // Log activity before removal
    await prisma.activity_log.create({
      data: {
        board_id: card.lists.boards.id,
        card_id: cardId,
        user_id: userId,
        action: "unlabeled",
        payload: {
          labelName: label.name,
          labelColor: label.color,
        },
      },
    });

    // Remove the label from the card
    await prisma.card_labels.delete({
      where: {
        card_id: cardId,
        label_id: labelId,
      },
    });
  },
};
