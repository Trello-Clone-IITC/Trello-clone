import { prisma } from "../../lib/prismaClient.js";
import { AppError } from "../../utils/appError.js";

// Assign user to checklist item
const assignUserToItem = async (
  itemId: string,
  assigneeId: string,
  userId: string
) => {
  // Verify user has access to the checklist item
  const existingItem = await prisma.checklistItem.findFirst({
    where: { id: itemId },
    include: {
      checklist: {
        include: {
          card: {
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
          },
        },
      },
    },
  });

  if (!existingItem) {
    throw new AppError("Checklist item not found", 404);
  }

  if (
    existingItem.checklist.card.list &&
    existingItem.checklist.card.list.board.boardMembers.length === 0
  ) {
    throw new AppError("Access denied", 403);
  }

  // Check if assignment already exists
  const existingAssignment = await prisma.checklistItemAssignee.findFirst({
    where: {
      itemId: itemId,
      userId: assigneeId,
    },
  });

  if (existingAssignment) {
    throw new AppError("User already assigned to this item", 400);
  }

  const assignment = await prisma.checklistItemAssignee.create({
    data: {
      itemId: itemId,
      userId: assigneeId,
    },
    include: {
      user: true,
      item: {
        include: {
          checklist: {
            include: {
              card: {
                include: {
                  list: {
                    include: {
                      board: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // Log activity
  if (existingItem.checklist.card.list) {
    await prisma.activityLog.create({
      data: {
        boardId: existingItem.checklist.card.list.board.id,
        cardId: existingItem.checklist.card.id,
        userId: userId,
        action: "Assigned",
        payload: {
          action: "checklist_item_assigned",
          checklistTitle: existingItem.checklist.title,
          itemText: existingItem.text,
          assigneeName: assignment.user.fullName,
        },
      },
    });
  }

  return assignment;
};

// Remove user assignment from checklist item
const removeUserFromItem = async (
  itemId: string,
  assigneeId: string,
  userId: string
) => {
  // Verify user has access to the checklist item
  const existingItem = await prisma.checklistItem.findFirst({
    where: { id: itemId },
    include: {
      checklist: {
        include: {
          card: {
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
          },
        },
      },
    },
  });

  if (!existingItem) {
    throw new AppError("Checklist item not found", 404);
  }

  if (
    existingItem.checklist.card.list &&
    existingItem.checklist.card.list.board.boardMembers.length === 0
  ) {
    throw new AppError("Access denied", 403);
  }

  // Check if assignment exists
  const existingAssignment = await prisma.checklistItemAssignee.findFirst({
    where: {
      itemId: itemId,
      userId: assigneeId,
    },
    include: {
      user: true,
    },
  });

  if (!existingAssignment) {
    throw new AppError("Assignment not found", 404);
  }

  // Log activity before removal
  if (existingItem.checklist.card.list) {
    await prisma.activityLog.create({
      data: {
        boardId: existingItem.checklist.card.list.board.id,
        cardId: existingItem.checklist.card.id,
        userId: userId,
        action: "Unassigned",
        payload: {
          action: "checklist_item_unassigned",
          checklistTitle: existingItem.checklist.title,
          itemText: existingItem.text,
          assigneeName: existingAssignment.user.fullName,
        },
      },
    });
  }

  // Remove the assignment
  await prisma.checklistItemAssignee.delete({
    where: {
      itemId_userId: {
        itemId: itemId,
        userId: assigneeId,
      },
    },
  });
};

export default {
  assignUserToItem,
  removeUserFromItem,
};
