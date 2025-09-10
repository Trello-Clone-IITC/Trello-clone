import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/appError.js";
import type { CreateLabelInput, UpdateLabelInput } from "@ronmordo/types";

const prisma = new PrismaClient();

interface CreateLabelData extends CreateLabelInput {
  boardId: string;
  userId: string;
}

interface UpdateLabelData extends Partial<UpdateLabelInput> {
  userId: string;
}

const createLabel = async (data: CreateLabelData) => {
  try {
    // Verify user has access to the board
    const board = await prisma.board.findFirst({
      where: { id: data.boardId },
      include: {
        boardMembers: {
          where: { userId: data.userId },
        },
      },
    });

    if (!board) {
      throw new AppError("Board not found", 404);
    }

    if (board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Check if label with same name already exists on this board
    if (data.name) {
      const existingLabel = await prisma.label.findFirst({
        where: {
          boardId: data.boardId,
          name: data.name,
        },
      });

      if (existingLabel) {
        throw new AppError(
          "Label with this name already exists on this board",
          409
        );
      }
    }

    const label = await prisma.label.create({
      data: {
        boardId: data.boardId,
        name: data.name,
        color: data.color,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: data.boardId,
        userId: data.userId,
        action: "created",
        payload: {
          type: "label",
          labelId: label.id,
          labelName: label.name,
          labelColor: label.color,
        },
      },
    });

    return label;
  } catch (error) {
    console.error("Failed to create label:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create label", 500);
  }
};

const getLabelById = async (boardId: string, labelId: string) => {
  try {
    const label = await prisma.label.findFirst({
      where: { id: labelId, boardId: boardId },
      include: {
        board: {
          include: {
            boardMembers: true,
          },
        },
      },
    });

    if (!label) {
      throw new AppError("Label not found", 404);
    }

    if (label.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    return label;
  } catch (error) {
    console.error("Failed to get label:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to get label", 500);
  }
};

const updateLabel = async (
  labelId: string,
  updateData: UpdateLabelData,
  userId: string
) => {
  try {
    // Verify user has access to the label's board
    const label = await prisma.label.findFirst({
      where: { id: labelId },
      include: {
        board: {
          include: {
            boardMembers: {
              where: { userId: userId },
            },
          },
        },
      },
    });

    if (!label) {
      throw new AppError("Label not found", 404);
    }

    if (label.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Check if new name conflicts with existing labels on the same board
    if (updateData.name && updateData.name !== label.name) {
      const existingLabel = await prisma.label.findFirst({
        where: {
          boardId: label.boardId,
          name: updateData.name,
          id: { not: labelId },
        },
      });

      if (existingLabel) {
        throw new AppError(
          "Label with this name already exists on this board",
          409
        );
      }
    }

    const updatedLabel = await prisma.label.update({
      where: { id: labelId },
      data: {
        name: updateData.name,
        color: updateData.color,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: label.boardId,
        userId: userId,
        action: "updated",
        payload: {
          type: "label",
          labelId: labelId,
          changes: {
            name: updateData.name
              ? { from: label.name, to: updateData.name }
              : undefined,
            color: updateData.color
              ? { from: label.color, to: updateData.color }
              : undefined,
          },
        },
      },
    });

    return updatedLabel;
  } catch (error) {
    console.error("Failed to update label:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to update label", 500);
  }
};

const deleteLabel = async (labelId: string, userId: string) => {
  try {
    // Verify user has access to the label's board
    const label = await prisma.label.findFirst({
      where: { id: labelId },
      include: {
        board: {
          include: {
            boardMembers: {
              where: { userId: userId },
            },
          },
        },
      },
    });

    if (!label) {
      throw new AppError("Label not found", 404);
    }

    if (label.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Delete the label (this will cascade delete all card labels)
    await prisma.label.delete({
      where: { id: labelId },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: label.boardId,
        userId: userId,
        action: "deleted",
        payload: {
          type: "label",
          labelId: labelId,
          labelName: label.name,
          labelColor: label.color,
        },
      },
    });
  } catch (error) {
    console.error("Failed to delete label:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to delete label", 500);
  }
};

const addLabelToCard = async (
  cardId: string,
  labelId: string,
  userId: string
) => {
  try {
    // Verify user has access to the card's board
    const card = await prisma.card.findFirst({
      where: { id: cardId },
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
    });

    if (!card) {
      throw new AppError("Card not found", 404);
    }

    if (card.list.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Verify label exists and belongs to the same board
    const label = await prisma.label.findFirst({
      where: { id: labelId },
    });

    if (!label) {
      throw new AppError("Label not found", 404);
    }

    if (label.boardId !== card.list.boardId) {
      throw new AppError(
        "Label does not belong to the same board as the card",
        400
      );
    }

    // Check if label is already assigned to the card
    const existingCardLabel = await prisma.cardLabel.findFirst({
      where: {
        cardId: cardId,
        labelId: labelId,
      },
    });

    if (existingCardLabel) {
      throw new AppError("Label is already assigned to this card", 409);
    }

    const cardLabel = await prisma.cardLabel.create({
      data: {
        cardId: cardId,
        labelId: labelId,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: card.list.boardId,
        cardId: cardId,
        userId: userId,
        action: "labeled",
        payload: {
          type: "card_label",
          labelId: labelId,
          labelName: label.name,
          labelColor: label.color,
        },
      },
    });

    return cardLabel;
  } catch (error) {
    console.error("Failed to add label to card:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to add label to card", 500);
  }
};

const removeLabelFromCard = async (
  cardId: string,
  labelId: string,
  userId: string
) => {
  try {
    // Verify user has access to the card's board
    const card = await prisma.card.findFirst({
      where: { id: cardId },
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
    });

    if (!card) {
      throw new AppError("Card not found", 404);
    }

    if (card.list.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Verify label exists
    const label = await prisma.label.findFirst({
      where: { id: labelId },
    });

    if (!label) {
      throw new AppError("Label not found", 404);
    }

    // Check if label is assigned to the card
    const cardLabel = await prisma.cardLabel.findFirst({
      where: {
        cardId: cardId,
        labelId: labelId,
      },
    });

    if (!cardLabel) {
      throw new AppError("Label is not assigned to this card", 404);
    }

    // Remove the label from the card
    await prisma.cardLabel.delete({
      where: {
        cardId_labelId: {
          cardId: cardId,
          labelId: labelId,
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: card.list.boardId,
        cardId: cardId,
        userId: userId,
        action: "unlabeled",
        payload: {
          type: "card_label",
          labelId: labelId,
          labelName: label.name,
          labelColor: label.color,
        },
      },
    });
  } catch (error) {
    console.error("Failed to remove label from card:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to remove label from card", 500);
  }
};

export default {
  createLabel,
  getLabelById,
  updateLabel,
  deleteLabel,
  addLabelToCard,
  removeLabelFromCard,
};
