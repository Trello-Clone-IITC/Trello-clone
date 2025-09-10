import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/appError.js";
import { mapCardLabelDtoToCreateInput } from "./card-label.mapper.js";

const prisma = new PrismaClient();

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
      data: mapCardLabelDtoToCreateInput({
        cardId: cardId,
        labelId: labelId,
      }),
    });
    console.log("cardLabel from service", cardLabel);

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: card.list.boardId,
        cardId: cardId,
        userId: userId,
        action: "Labeled",
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
        action: "Unlabeled",
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
  addLabelToCard,
  removeLabelFromCard,
};
