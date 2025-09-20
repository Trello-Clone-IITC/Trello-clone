import { prisma } from "../../lib/prismaClient.js";
import { AppError } from "../../utils/appError.js";
import { mapCardWatcherToDto } from "./card-watcher.mapper.js";
const isAccessableCard = async (cardId, userId) => {
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
const createCardWatcher = async (cardId, userId) => {
    await isAccessableCard(cardId, userId);
    const cardWatcher = await prisma.cardWatcher.create({
        data: {
            cardId,
            userId,
        },
    });
    return mapCardWatcherToDto(cardWatcher);
};
const deleteCardWatcher = async (cardId, userId) => {
    await isAccessableCard(cardId, userId);
    const deletedCardWatcher = await prisma.cardWatcher.delete({
        where: {
            cardId_userId: {
                cardId,
                userId,
            },
        },
    });
    return deletedCardWatcher;
};
export const cardWatcherService = {
    createCardWatcher,
    deleteCardWatcher,
};
