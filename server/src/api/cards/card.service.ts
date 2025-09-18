import { prisma } from "../../lib/prismaClient.js";
import { AppError } from "../../utils/appError.js";
import { Decimal } from "@prisma/client/runtime/library";
import { mapLabelToDto } from "../labels/label.mapper.js";
import type { CardDto, CreateCardInput } from "@ronmordo/contracts";
import { mapCardToDto } from "./card.mapper.js";
import type { Card } from "@prisma/client";

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

const getCardDto = async (card: Card, userId: string): Promise<CardDto> => {
  const cardWithNested = await prisma.card.findUnique({
    where: {
      id: card.id,
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
      watchers: true,
    },
  });

  if (!cardWithNested) {
    throw new AppError("Card not found", 404);
  }

  const additionalFields = {
    attachmentsCount: cardWithNested.attachments.length,
    cardAssignees: cardWithNested.assignees.map((a) => {
      const { avatarUrl, fullName, id, username, ...rest } = a.user;
      return { avatarUrl, fullName, id, username };
    }),
    isWatch: cardWithNested.watchers.some((w) => w.userId === userId),
    commentsCount: cardWithNested.comments.length,
    checklistItemsCount: cardWithNested.checklists.reduce((acc, curr) => {
      return acc + curr.items.length;
    }, 0),
    completedChecklistItemsCount: cardWithNested.checklists.reduce(
      (acc, curr) => {
        return acc + curr.items.filter((i) => i.isCompleted === true).length;
      },
      0
    ),
    labels: cardWithNested.cardLabels.map((l) => ({
      name: l.label.name,
      color: mapLabelToDto(l.label).color,
    })),
  };

  return mapCardToDto(cardWithNested, additionalFields);
};

// Create a new card
const createCard = async (
  data: CreateCardInput,
  listId: string,
  userId: string
): Promise<CardDto> => {
  // Verify list exists and user has access

  const list = await prisma.list.findFirst({
    where: {
      id: listId,
      board: {
        boardMembers: {
          some: {
            userId,
          },
        },
      },
    },
    include: {
      cards: {
        orderBy: { position: "asc" },
      },
      board: true,
    },
  });

  if (!list) {
    throw new AppError("List not found", 404);
  }

  // Get the highest position in the list and add 1000
  const lastCard = list.cards.pop();

  const newPosition = lastCard
    ? lastCard.position.toNumber() + 1000
    : data.position;

  const card = await prisma.card.create({
    data: {
      listId,
      title: data.title,
      position: new Decimal(newPosition),
      createdBy: userId,
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
      watchers: true,
    },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      boardId: list.board.id,
      cardId: card.id,
      userId,
      action: "Created",
      payload: { title: card.title },
    },
  });

  return getCardDto(card, userId);
};

// Get a single card by ID with all related data
const getCardById = async (cardId: string, userId: string) => {
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

  return getCardDto(card, userId);
};

// Update a card
const updateCard = async (
  cardId: string,
  updateData: UpdateCardData,
  userId: string
) => {
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

  return getCardDto(card, userId);
};

// Delete a card
const deleteCard = async (cardId: string, userId: string) => {
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
};

// Move card to different list/position
const moveCard = async (
  cardId: string,
  listId: string,
  position: number,
  userId: string
) => {
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
    return await updateCardPosition(cardId, position, userId);
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

  return getCardDto(updatedCard, userId);
};

// Update card position within the same list
const updateCardPosition = async (
  cardId: string,
  position: number,
  userId: string
) => {
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

  return getCardDto(card, userId);
};

// Archive/Unarchive a card
const toggleArchive = async (cardId: string, userId: string) => {
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

  return getCardDto(card, userId);
};

// Search cards using full-text search
const searchCards = async (
  query: string,
  filters: SearchFilters,
  userId: string
) => {
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
  return Promise.all(
    cards
      .filter((card) =>
        card.list.board.boardMembers.some((m) => m.userId === userId)
      )
      .map((c) => getCardDto(c, userId))
  );
};

// Get card activity
const getCardActivity = async (cardId: string, userId: string) => {
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
};

// Get card checklists
const getCardChecklists = async (cardId: string, userId: string) => {
  // Verify user has access to the card
  const card = await prisma.card.findFirst({
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
    include: {
      checklists: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!card) {
    throw new AppError("Card not found", 404);
  }

  return card.checklists;
};

// Get card comments
const getCardComments = async (cardId: string, userId: string) => {
  // Verify user has access to the card
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

    if (card.list.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const comments = await prisma.comment.findMany({
      where: { cardId },
      orderBy: { createdAt: "desc" },
    });

    return comments;
  } catch (error) {
    console.log("Failed to get card comments:---", error);
    throw new AppError("Failed to get card comments", 500);
  }
};

// Get card assignees
const getCardAssignees = async (cardId: string, userId: string) => {
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

  const assignees = await prisma.cardAssignee.findMany({
    where: { cardId },
    include: {
      user: true,
    },
  });

  return assignees;
};

// Get card labels
const getCardLabels = async (cardId: string, userId: string) => {
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

  const cardLabels = await prisma.cardLabel.findMany({
    where: { cardId },
    include: {
      label: true,
    },
  });

  return cardLabels.map((cl) => mapLabelToDto(cl.label));
};

// Get card watchers
const getCardWatchers = async (cardId: string, userId: string) => {
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

  const watchers = await prisma.cardWatcher.findMany({
    where: { cardId },
    include: {
      user: true,
    },
  });

  return watchers;
};

// Get card attachments
const getCardAttachments = async (cardId: string, userId: string) => {
  // Verify user has access to the card
  console.log(userId);

  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      list: {
        board: {
          boardMembers: {
            some: {
              userId,
            },
          },
        },
      },
    },
    include: {
      attachments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!card) {
    throw new AppError("Card not found", 404);
  }

  const attachments = card.attachments;

  return attachments;
};

export default {
  createCard,
  getCardById,
  updateCard,
  deleteCard,
  moveCard,
  updateCardPosition,
  toggleArchive,
  searchCards,
  getCardActivity,
  getCardChecklists,
  getCardComments,
  getCardAssignees,
  getCardLabels,
  getCardWatchers,
  getCardAttachments,
  getCardDto,
};
