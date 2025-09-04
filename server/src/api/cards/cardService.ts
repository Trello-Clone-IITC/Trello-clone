import { prisma } from "../../lib/prismaClient.js";
import { AppError } from "../../utils/appError.js";
import { Decimal } from "@prisma/client/runtime/library";

interface CreateCardData {
  listId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  startDate?: Date;
  position: number;
  coverImageUrl?: string;
  createdBy: string;
}

interface UpdateCardData {
  title?: string;
  description?: string;
  dueDate?: Date;
  startDate?: Date;
  coverImageUrl?: string;
}

interface SearchFilters {
  boardId?: string;
  listId?: string;
}

export const cardService = {
  // Create a new card
  async createCard(data: CreateCardData) {
    // Verify list exists and user has access
    const list = await prisma.list.findFirst({
      where: { id: data.listId },
      include: {
        board: {
          include: {
            boardMembers: {
              where: { userId: data.createdBy },
            },
          },
        },
      },
    });

    if (!list) {
      throw new AppError("List not found", 404);
    }

    if (list.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Get the highest position in the list and add 1000
    const lastCard = await prisma.card.findFirst({
      where: { listId: data.listId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastCard
      ? lastCard.position.toNumber() + 1000
      : data.position;

    const card = await prisma.card.create({
      data: {
        listId: data.listId,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        startDate: data.startDate,
        position: new Decimal(newPosition),
        coverImageUrl: data.coverImageUrl,
        createdBy: data.createdBy,
      },
      include: {
        list: {
          include: {
            board: true,
          },
        },
        creator: true,
        assignees: {
          include: {
            user: true,
          },
        },

        cardLabels: {
          include: {
            label: true,
          },
        },
        checklists: {
          include: {
            items: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        },
        attachments: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: list.board.id,
        cardId: card.id,
        userId: data.createdBy,
        action: "Created",
        payload: { title: card.title },
      },
    });

    return card;
  },

  // Get a single card by ID with all related data
  async getCardById(cardId: string, userId: string) {
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
        creator: true,
        assignees: {
          include: {
            user: true,
          },
        },
        cardLabels: {
          include: {
            label: true,
          },
        },
        checklists: {
          include: {
            items: {
              include: {
                assignees: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
          orderBy: { position: "asc" },
        },
        comments: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        },
        attachments: true,
        watchers: {
          where: { userId: userId },
        },
      },
    });

    if (!card) {
      throw new AppError("Card not found", 404);
    }

    // Check if user has access to the board
    console.log("card.list.board.boardMembers", card.list.board.boardMembers);

    // Check if the user is a member of the board and can watch the card

    const userMember = card.list.board.boardMembers.find(
      (member: any) => member.userId === userId
    );
    if (!userMember) {
      throw new AppError("Access denied", 403);
    }

    return card;
  },

  // Get all cards for a list
  async getCardsByList(listId: string, userId: string) {
    // Verify user has access to the list
    const list = await prisma.list.findFirst({
      where: { id: listId },
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

    if (!list) {
      throw new AppError("List not found", 404);
    }

    if (list.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const cards = await prisma.card.findMany({
      where: {
        listId: listId,
        isArchived: false,
      },
      include: {
        assignees: {
          include: {
            user: true,
          },
        },
        cardLabels: {
          include: {
            label: true,
          },
        },
        checklists: {
          include: {
            items: {
              where: { isCompleted: true },
            },
          },
        },
        comments: true,
        attachments: true,
      },
      orderBy: { position: "asc" },
    });

    return cards;
  },

  // Update a card
  async updateCard(cardId: string, updateData: UpdateCardData, userId: string) {
    // Verify user has access to the card
    const existingCard = await prisma.card.findFirst({
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

    if (!existingCard) {
      throw new AppError("Card not found", 404);
    }

    if (existingCard.list.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        title: updateData.title,
        description: updateData.description,
        dueDate: updateData.dueDate,
        startDate: updateData.startDate,
        coverImageUrl: updateData.coverImageUrl,
        updatedAt: new Date(),
      },
      include: {
        list: {
          include: {
            board: true,
          },
        },
        creator: true,
        assignees: {
          include: {
            user: true,
          },
        },
        cardLabels: {
          include: {
            label: true,
          },
        },
        checklists: {
          include: {
            items: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        },
        attachments: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: existingCard.list.board.id,
        cardId: card.id,
        userId: userId,
        action: "Updated",
        payload: { ...updateData },
      },
    });

    return card;
  },

  // Delete a card
  async deleteCard(cardId: string, userId: string) {
    // Verify user has access to the card
    const existingCard = await prisma.card.findFirst({
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

    if (!existingCard) {
      throw new AppError("Card not found", 404);
    }

    if (existingCard.list.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Log activity before deletion
    await prisma.activityLog.create({
      data: {
        boardId: existingCard.list.board.id,
        cardId: cardId,
        userId: userId,
        action: "Closed",
        payload: { title: existingCard.title },
      },
    });

    // Delete the card (cascade will handle related data)
    await prisma.card.delete({
      where: { id: cardId },
    });
  },

  // Move card to different list/position
  async moveCard(
    cardId: string,
    listId: string,
    position: number,
    userId: string
  ) {
    // Verify user has access to both lists
    const [card, targetList] = await Promise.all([
      prisma.card.findFirst({
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
      }),
      prisma.list.findFirst({
        where: { id: listId },
        include: {
          board: {
            include: {
              boardMembers: {
                where: { userId: userId },
              },
            },
          },
        },
      }),
    ]);

    if (!card || !targetList) {
      throw new AppError("Card or list not found", 404);
    }

    if (
      card.list.board.boardMembers.length === 0 ||
      targetList.board.boardMembers.length === 0
    ) {
      throw new AppError("Access denied", 403);
    }

    // If moving to same list, just update position
    if (card.listId === listId) {
      return await this.updateCardPosition(cardId, position, userId);
    }

    // If moving to different list, update list and position
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        listId: listId,
        position: new Decimal(position),
        updatedAt: new Date(),
      },
      include: {
        list: {
          include: {
            board: true,
          },
        },
        creator: true,
        assignees: {
          include: {
            user: true,
          },
        },
        cardLabels: {
          include: {
            label: true,
          },
        },
        checklists: {
          include: {
            items: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        },
        attachments: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: targetList.board.id,
        cardId: updatedCard.id,
        userId: userId,
        action: "Moved",
        payload: {
          fromList: updatedCard.list.board.name,
          toList: targetList.name,
          position,
        },
      },
    });

    return updatedCard;
  },

  // Update card position within the same list
  async updateCardPosition(cardId: string, position: number, userId: string) {
    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        position: new Decimal(position),
        updatedAt: new Date(),
      },
      include: {
        list: {
          include: {
            board: true,
          },
        },
        creator: true,
        assignees: {
          include: {
            user: true,
          },
        },
        cardLabels: {
          include: {
            label: true,
          },
        },
        checklists: {
          include: {
            items: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        },
        attachments: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: card.list.board.id,
        cardId: card.id,
        userId: userId,
        action: "Moved",
        payload: { position },
      },
    });

    return card;
  },

  // Archive/Unarchive a card
  async toggleArchive(cardId: string, userId: string) {
    const existingCard = await prisma.card.findFirst({
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

    if (!existingCard) {
      throw new AppError("Card not found", 404);
    }

    if (existingCard.list.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const newArchiveStatus = !existingCard.isArchived;

    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        isArchived: newArchiveStatus,
        updatedAt: new Date(),
      },
      include: {
        list: {
          include: {
            board: true,
          },
        },
        creator: true,
        assignees: {
          include: {
            user: true,
          },
        },
        cardLabels: {
          include: {
            label: true,
          },
        },
        checklists: {
          include: {
            items: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        },
        attachments: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: existingCard.list.board.id,
        cardId: card.id,
        userId: userId,
        action: newArchiveStatus ? "Closed" : "Reopened",
        payload: { title: card.title },
      },
    });

    return card;
  },

  // Search cards using full-text search
  async searchCards(query: string, filters: SearchFilters, userId: string) {
    const whereClause: any = {
      searchDoc: {
        search: query,
      },
    };

    if (filters.boardId) {
      whereClause.list = {
        boardId: filters.boardId,
      };
    }

    if (filters.listId) {
      whereClause.listId = filters.listId;
    }

    const cards = await prisma.card.findMany({
      where: whereClause,
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
        assignees: {
          include: {
            user: true,
          },
        },
        cardLabels: {
          include: {
            label: true,
          },
        },
        checklists: {
          include: {
            items: {
              where: { isCompleted: true },
            },
          },
        },
        comments: true,
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Filter out cards user doesn't have access to
    return cards.filter((card) => card.list?.board?.boardMembers?.length > 0);
  },

  // Get card activity
  async getCardActivity(cardId: string, userId: string) {
    // Verify user has access to the card
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

    const activities = await prisma.activityLog.findMany({
      where: { cardId: cardId },
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return activities;
  },

  // Subscribe/Unsubscribe to card
  async toggleSubscription(cardId: string, userId: string) {
    // Verify user has access to the card
    const existingCard = await prisma.card.findFirst({
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

    if (!existingCard) {
      throw new AppError("Card not found", 404);
    }

    if (existingCard.list.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const newSubscriptionStatus = !existingCard.subscribed;

    const card = await prisma.card.update({
      where: { id: cardId },
      data: {
        subscribed: newSubscriptionStatus,
        updatedAt: new Date(),
      },
      include: {
        list: {
          include: {
            board: true,
          },
        },
        creator: true,
        assignees: {
          include: {
            user: true,
          },
        },
        cardLabels: {
          include: {
            label: true,
          },
        },
        checklists: {
          include: {
            items: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        },
        attachments: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: existingCard.list.board.id,
        cardId: card.id,
        userId: userId,
        action: "Updated",
        payload: {
          subscribed: newSubscriptionStatus,
          action: newSubscriptionStatus ? "subscribed" : "unsubscribed",
        },
      },
    });

    return card;
  },
};
