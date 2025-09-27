import { PrismaClient, ActivityAction } from "@prisma/client";
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
    const card = await verifyCardAccess(cardId, userId);

    // Verify label exists and belongs to the same board
    const label = await verifyLabelExists(labelId);

    if (card.list && label.boardId !== card.list.boardId) {
      throw new AppError(
        "Label does not belong to the same board as the card",
        400
      );
    }

    // Check if label is already assigned to the card
    const existingCardLabel = await checkLabelAssignedToCard(cardId, labelId);

    if (existingCardLabel) {
      throw new AppError("Label is already assigned to this card", 409);
    }

    // Create the card label
    const cardLabel = await createCardLabel(cardId, labelId);

    // Log activity
    if (card.list) {
      await logActivity(
        card.list.boardId,
        cardId,
        userId,
        ActivityAction.Labeled,
        {
          type: "card_label",
          labelId: labelId,
          labelName: label.name,
          labelColor: label.color,
        }
      );
    }

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
  // Verify user has access to the card's board
  const card = await verifyCardAccess(cardId, userId);

  // Check if label is assigned to the card first
  const cardLabel = await checkLabelAssignedToCard(cardId, labelId);

  if (!cardLabel) {
    throw new AppError("Label is not assigned to this card", 404);
  }

  // Get label details for activity logging (optional)
  const label = await verifyLabelExists(labelId);

  // Remove the label from the card
  await deleteCardLabel(cardId, labelId);

  // Log activity
  if (card.list) {
    await logActivity(
      card.list.boardId,
      cardId,
      userId,
      ActivityAction.Unlabeled,
      {
        type: "card_label",
        labelId: labelId,
        labelName: label.name,
        labelColor: label.color,
      }
    );
  }
};

//-----------------------------------helper functions-----------------------------------
// Helper function to verify user has access to card's board
const verifyCardAccess = async (cardId: string, userId: string) => {
  try {
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

    if (card.list && card.list.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    return card;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to verify card access", 500);
  }
};

// Helper function to verify label exists
const verifyLabelExists = async (labelId: string) => {
  try {
    const label = await prisma.label.findFirst({
      where: { id: labelId },
    });

    if (!label) {
      throw new AppError("Label not found", 404);
    }

    return label;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to verify label", 500);
  }
};

// Helper function to check if label is assigned to card
const checkLabelAssignedToCard = async (cardId: string, labelId: string) => {
  try {
    const cardLabel = await prisma.cardLabel.findFirst({
      where: {
        cardId: cardId,
        labelId: labelId,
      },
    });

    return cardLabel;
  } catch (error) {
    throw new AppError("Failed to check label assignment", 500);
  }
};

// Helper function to create card label
const createCardLabel = async (cardId: string, labelId: string) => {
  try {
    const cardLabel = await prisma.cardLabel.create({
      data: mapCardLabelDtoToCreateInput({
        cardId: cardId,
        labelId: labelId,
      }),
    });

    return cardLabel;
  } catch (error) {
    throw new AppError("Failed to create card label", 500);
  }
};

// Helper function to delete card label
const deleteCardLabel = async (cardId: string, labelId: string) => {
  await prisma.cardLabel.delete({
    where: {
      cardId_labelId: {
        cardId: cardId,
        labelId: labelId,
      },
    },
  });
};

// Helper function to log activity
const logActivity = async (
  boardId: string,
  cardId: string,
  userId: string,
  action: ActivityAction,
  payload: any
) => {
  try {
    await prisma.activityLog.create({
      data: {
        boardId: boardId,
        cardId: cardId,
        userId: userId,
        action: action,
        payload: payload,
      },
    });
  } catch (error) {
    // Don't throw error for logging failures, just log it
    console.error("Failed to log activity:", error);
  }
};

export default {
  addLabelToCard,
  removeLabelFromCard,
};
