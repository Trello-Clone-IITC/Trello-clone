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
    const list = await prisma.lists.findFirst({
      where: { id: data.listId },
      include: {
        boards: {
          include: {

            board_members: {
              where: { user_id: data.createdBy },
            },
          },
        },
      },
    });

    if (!list) {
      throw new AppError("List not found", 404);
    }

    if (list.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Get the highest position in the list and add 1000
    const lastCard = await prisma.cards.findFirst({
      where: { list_id: data.listId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastCard
      ? lastCard.position.toNumber() + 1000
      : data.position;

    const card = await prisma.cards.create({
      data: {
        list_id: data.listId,
        title: data.title,
        description: data.description,
        due_date: data.dueDate,
        start_date: data.startDate,
        position: new Decimal(newPosition),
        cover_image_url: data.coverImageUrl,
        created_by: data.createdBy,
      },
      include: {
        lists: {
          include: {
            boards: true,
          },
        },
        users: true,
        card_assignees: {
          include: {
            users: true,
          },
        },
        card_labels: {
          include: {
            labels: true,
          },
        },
        checklists: {
          include: {
            checklist_items: true,
          },
        },
        comments: {
          include: {
            users: true,
          },
          orderBy: { created_at: "desc" },
        },
        attachments: true,
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: list.boards.id,
        card_id: card.id,
        user_id: data.createdBy,
        action: "created",
        payload: { title: card.title },
      },
    });

    return card;
  },

  // Get a single card by ID with all related data
  async getCardById(cardId: string, userId: string) {
    const card = await prisma.cards.findFirst({
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
        users: true,
        card_assignees: {
          include: {
            users: true,
          },
        },
        card_labels: {
          include: {
            labels: true,
          },
        },
        checklists: {
          include: {
            checklist_items: {
              include: {
                checklist_item_assignees: {
                  include: {
                    users: true,
                  },
                },
              },
            },
          },
          orderBy: { position: "asc" },
        },
        comments: {
          include: {
            users: true,
          },
          orderBy: { created_at: "desc" },
        },
        attachments: true,
        card_watchers: {
          where: { user_id: userId },
        },
      },
    });

    if (!card) {
      throw new AppError("Card not found", 404);
    }

    // Check if user has access to the board
    console.log("card.lists.boards.board_members", card.lists.boards.board_members);
    
    // Check if the user is a member of the board and can watch the card
    const userMember = card.lists.boards.board_members.find(
      (member: any) => member.user_id === userId
    );
    if (!userMember) {
      throw new AppError("Access denied", 403);
    }

    return card;
  },

  // Get all cards for a list
  async getCardsByList(listId: string, userId: string) {
    // Verify user has access to the list
    const list = await prisma.lists.findFirst({
      where: { id: listId },
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

    if (!list) {
      throw new AppError("List not found", 404);
    }

    if (list.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const cards = await prisma.cards.findMany({
      where: {
        list_id: listId,
        is_archived: false,
      },
      include: {
        card_assignees: {
          include: {
            users: true,
          },
        },
        card_labels: {
          include: {
            labels: true,
          },
        },
        checklists: {
          include: {
            checklist_items: {
              where: { is_completed: true },
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
    const existingCard = await prisma.cards.findFirst({
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
    });

    if (!existingCard) {
      throw new AppError("Card not found", 404);
    }

    if (existingCard.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const card = await prisma.cards.update({
      where: { id: cardId },
      data: {
        title: updateData.title,
        description: updateData.description,
        due_date: updateData.dueDate,
        start_date: updateData.startDate,
        cover_image_url: updateData.coverImageUrl,
        updated_at: new Date(),
      },
      include: {
        lists: {
          include: {
            boards: true,
          },
        },
        users: true,
        card_assignees: {
          include: {
            users: true,
          },
        },
        card_labels: {
          include: {
            labels: true,
          },
        },
        checklists: {
          include: {
            checklist_items: true,
          },
        },
        comments: {
          include: {
            users: true,
          },
          orderBy: { created_at: "desc" },
        },
        attachments: true,
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: existingCard.lists.boards.id,
        card_id: card.id,
        user_id: userId,
        action: "updated",
        payload: { ...updateData },
      },
    });

    return card;
  },

  // Delete a card
  async deleteCard(cardId: string, userId: string) {
    // Verify user has access to the card
    const existingCard = await prisma.cards.findFirst({
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
    });

    if (!existingCard) {
      throw new AppError("Card not found", 404);
    }

    if (existingCard.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Log activity before deletion
    await prisma.activity_log.create({
      data: {
        board_id: existingCard.lists.boards.id,
        card_id: cardId,
        user_id: userId,
        action: "closed",
        payload: { title: existingCard.title },
      },
    });

    // Delete the card (cascade will handle related data)
    await prisma.cards.delete({
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
      prisma.lists.findFirst({
        where: { id: listId },
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

    if (!card || !targetList) {
      throw new AppError("Card or list not found", 404);
    }

    if (
      card.lists.boards.board_members.length === 0 ||
      targetList.boards.board_members.length === 0
    ) {
      throw new AppError("Access denied", 403);
    }

    // If moving to same list, just update position
    if (card.list_id === listId) {
      return await this.updateCardPosition(cardId, position, userId);
    }

    // If moving to different list, update list and position
    const updatedCard = await prisma.cards.update({
      where: { id: cardId },
      data: {
        list_id: listId,
        position: new Decimal(position),
        updated_at: new Date(),
      },
      include: {
        lists: {
          include: {
            board: true,
          },
        },
        users: true,
        card_assignees: {
          include: {
            users: true,
          },
        },
        card_labels: {
          include: {
            labels: true,
          },
        },
        checklists: {
          include: {
            checklist_items: true,
          },
        },
        comments: {
          include: {
            users: true,
          },
          orderBy: { created_at: "desc" },
        },
        attachments: true,
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: targetList.board.id,
        card_id: updatedCard.id,
        user_id: userId,
        action: "moved",
        payload: {
          fromList: updatedCard.lists.board.name,
          toList: targetList.name,
          position,
        },
      },
    });

    return updatedCard;
  },

  // Update card position within the same list
  async updateCardPosition(cardId: string, position: number, userId: string) {
    const card = await prisma.cards.update({
      where: { id: cardId },
      data: {
        position: new Decimal(position),
        updated_at: new Date(),
      },
      include: {
        lists: {
          include: {
            board: true,
          },
        },
        users: true,
        card_assignees: {
          include: {
            users: true,
          },
        },
        card_labels: {
          include: {
            labels: true,
          },
        },
        checklists: {
          include: {
            checklist_items: true,
          },
        },
        comments: {
          include: {
            users: true,
          },
          orderBy: { created_at: "desc" },
        },
        attachments: true,
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: card.lists.board.id,
        card_id: card.id,
        user_id: userId,
        action: "moved",
        payload: { position },
      },
    });

    return card;
  },

  // Archive/Unarchive a card
  async toggleArchive(cardId: string, userId: string) {
    const existingCard = await prisma.cards.findFirst({
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

    if (!existingCard) {
      throw new AppError("Card not found", 404);
    }

    if (existingCard.lists.board.members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const newArchiveStatus = !existingCard.is_archived;

    const card = await prisma.cards.update({
      where: { id: cardId },
      data: {
        is_archived: newArchiveStatus,
        updated_at: new Date(),
      },
      include: {
        lists: {
          include: {
            board: true,
          },
        },
        users: true,
        card_assignees: {
          include: {
            users: true,
          },
        },
        card_labels: {
          include: {
            labels: true,
          },
        },
        checklists: {
          include: {
            checklist_items: true,
          },
        },
        comments: {
          include: {
            users: true,
          },
          orderBy: { created_at: "desc" },
        },
        attachments: true,
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: existingCard.lists.board.id,
        card_id: card.id,
        user_id: userId,
        action: newArchiveStatus ? "closed" : "reopened",
        payload: { title: card.title },
      },
    });

    return card;
  },

  // Search cards using full-text search
  async searchCards(query: string, filters: SearchFilters, userId: string) {
    const whereClause: any = {
      search_doc: {
        search: query,
      },
    };

    if (filters.boardId) {
      whereClause.lists = {
        board_id: filters.boardId,
      };
    }

    if (filters.listId) {
      whereClause.list_id = filters.listId;
    }

    const cards = await prisma.cards.findMany({
      where: whereClause,
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
        card_assignees: {
          include: {
            users: true,
          },
        },
        card_labels: {
          include: {
            labels: true,
          },
        },
        checklists: {
          include: {
            checklist_items: {
              where: { is_completed: true },
            },
          },
        },
        comments: true,
        attachments: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Filter out cards user doesn't have access to
    return cards.filter((card) => card.lists?.board?.members?.length > 0);
  },

  // Get card activity
  async getCardActivity(cardId: string, userId: string) {
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

    const activities = await prisma.activity_log.findMany({
      where: { card_id: cardId },
      include: {
        users: true,
      },
      orderBy: { created_at: "desc" },
    });

    return activities;
  },

  // Subscribe/Unsubscribe to card
  async toggleSubscription(cardId: string, userId: string) {
    // Verify user has access to the card
    const existingCard = await prisma.cards.findFirst({
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

    if (!existingCard) {
      throw new AppError("Card not found", 404);
    }

    if (existingCard.lists.board.members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const newSubscriptionStatus = !existingCard.subscribed;

    const card = await prisma.cards.update({
      where: { id: cardId },
      data: {
        subscribed: newSubscriptionStatus,
        updated_at: new Date(),
      },
      include: {
        lists: {
          include: {
            board: true,
          },
        },
        users: true,
        card_assignees: {
          include: {
            users: true,
          },
        },
        card_labels: {
          include: {
            labels: true,
          },
        },
        checklists: {
          include: {
            checklist_items: true,
          },
        },
        comments: {
          include: {
            users: true,
          },
          orderBy: { created_at: "desc" },
        },
        attachments: true,
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: existingCard.lists.board.id,
        card_id: card.id,
        user_id: userId,
        action: "updated",
        payload: {
          subscribed: newSubscriptionStatus,
          action: newSubscriptionStatus ? "subscribed" : "unsubscribed",
        },
      },
    });

    return card;
  },
};
