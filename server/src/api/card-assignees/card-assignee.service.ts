import { prisma } from "../../lib/prismaClient.js";
import { AppError } from "../../utils/appError.js";
import { mapCardAssigneeToDto } from "./card-assignee.mapper.js";

const isAccessableCard = async (cardId: string, userId: string) => {
  const card = await prisma.card.findUnique({
    where: {
      id: cardId,
      list: {
        board: {
          boardMembers: {
            some: { userId },
          },
        },
      },
    },
  });

  if (!card) {
    throw new AppError("UnAutherized card access", 403);
  }
};

const createCardAssignee = async (cardId: string, userId: string) => {
  await isAccessableCard(cardId, userId);

  const cardAssignee = await prisma.cardAssignee.create({
    data: {
      cardId,
      userId,
    },
  });

  return mapCardAssigneeToDto(cardAssignee);
};

const deleteCardAssignee = async (cardId: string, userId: string) => {
  await isAccessableCard(cardId, userId);

  const deletedCardAssignee = await prisma.cardWatcher.delete({
    where: {
      cardId_userId: {
        cardId,
        userId,
      },
    },
  });

  return deletedCardAssignee;
};

export const cardAssgineeService = {
  createCardAssignee,
  deleteCardAssignee,
};
