import { prisma } from "../../lib/prismaClient.js";
import { AppError } from "../../utils/appError.js";
import { Decimal } from "@prisma/client/runtime/library";

interface CreateChecklistData {
  cardId: string;
  title: string;
  position: number;
  createdBy: string;
}

interface UpdateChecklistData {
  title?: string;
  position?: number;
}

interface CreateChecklistItemData {
  checklistId: string;
  text: string;
  dueDate?: Date;
  position: number;
  createdBy: string;
}

interface UpdateChecklistItemData {
  text?: string;
  isCompleted?: boolean;
  dueDate?: Date;
  position?: number;
}

export const checklistService = {
  // Create a new checklist
  async createChecklist(data: CreateChecklistData) {
    // Verify card exists and user has access
    const card = await prisma.cards.findFirst({
      where: { id: data.cardId },
      include: {
        lists: {
          include: {
            boards: {
              include: {
                board_members: {
                  where: { user_id: data.createdBy },
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

    if (card.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Get the highest position in the card and add 1000
    const lastChecklist = await prisma.checklists.findFirst({
      where: { card_id: data.cardId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastChecklist
      ? lastChecklist.position.toNumber() + 1000
      : data.position;

    const checklist = await prisma.checklists.create({
      data: {
        card_id: data.cardId,
        title: data.title,
        position: new Decimal(newPosition),
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
        checklist_items: {
          orderBy: { position: "asc" },
        },
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: card.lists.boards.id,
        card_id: data.cardId,
        user_id: data.createdBy,
        action: "updated",
        payload: {
          action: "checklist_created",
          checklistTitle: checklist.title,
        },
      },
    });

    return checklist;
  },

  // Get checklist by ID
  async getChecklistById(checklistId: string, userId: string) {
    const checklist = await prisma.checklists.findFirst({
      where: { id: checklistId },
      include: {
        cards: {
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
        },
        checklist_items: {
          include: {
            checklist_item_assignees: {
              include: {
                users: true,
              },
            },
          },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!checklist) {
      throw new AppError("Checklist not found", 404);
    }

    // Check if user has access to the board
    if (checklist.cards.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    return checklist;
  },

  // Update checklist
  async updateChecklist(
    checklistId: string,
    updateData: UpdateChecklistData,
    userId: string
  ) {
    // Verify user has access to the checklist
    const existingChecklist = await prisma.checklists.findFirst({
      where: { id: checklistId },
      include: {
        cards: {
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
        },
      },
    });

    if (!existingChecklist) {
      throw new AppError("Checklist not found", 404);
    }

    if (existingChecklist.cards.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const checklist = await prisma.checklists.update({
      where: { id: checklistId },
      data: {
        title: updateData.title,
        position: updateData.position
          ? new Decimal(updateData.position)
          : undefined,
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
        checklist_items: {
          orderBy: { position: "asc" },
        },
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: existingChecklist.cards.lists.boards.id,
        card_id: existingChecklist.cards.id,
        user_id: userId,
        action: "updated",
        payload: {
          action: "checklist_updated",
          checklistTitle: checklist.title,
        },
      },
    });

    return checklist;
  },

  // Delete checklist
  async deleteChecklist(checklistId: string, userId: string) {
    // Verify user has access to the checklist
    const existingChecklist = await prisma.checklists.findFirst({
      where: { id: checklistId },
      include: {
        cards: {
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
        },
      },
    });

    if (!existingChecklist) {
      throw new AppError("Checklist not found", 404);
    }

    if (existingChecklist.cards.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Log activity before deletion
    await prisma.activity_log.create({
      data: {
        board_id: existingChecklist.cards.lists.boards.id,
        card_id: existingChecklist.cards.id,
        user_id: userId,
        action: "updated",
        payload: {
          action: "checklist_deleted",
          checklistTitle: existingChecklist.title,
        },
      },
    });

    // Delete the checklist (cascade will handle checklist items)
    await prisma.checklists.delete({
      where: { id: checklistId },
    });
  },

  // Create checklist item
  async createChecklistItem(data: CreateChecklistItemData) {
    // Verify checklist exists and user has access
    const checklist = await prisma.checklists.findFirst({
      where: { id: data.checklistId },
      include: {
        cards: {
          include: {
            lists: {
              include: {
                boards: {
                  include: {
                    board_members: {
                      where: { user_id: data.createdBy },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!checklist) {
      throw new AppError("Checklist not found", 404);
    }

    if (checklist.cards.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Get the highest position in the checklist and add 1000
    const lastItem = await prisma.checklist_items.findFirst({
      where: { checklist_id: data.checklistId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastItem
      ? lastItem.position.toNumber() + 1000
      : data.position;

    const item = await prisma.checklist_items.create({
      data: {
        checklist_id: data.checklistId,
        text: data.text,
        due_date: data.dueDate,
        position: new Decimal(newPosition),
      },
      include: {
        checklists: {
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
          },
        },
        checklist_item_assignees: {
          include: {
            users: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: checklist.cards.lists.boards.id,
        card_id: checklist.cards.id,
        user_id: data.createdBy,
        action: "updated",
        payload: {
          action: "checklist_item_created",
          checklistTitle: checklist.title,
          itemText: item.text,
        },
      },
    });

    return item;
  },

  // Update checklist item
  async updateChecklistItem(
    itemId: string,
    updateData: UpdateChecklistItemData,
    userId: string
  ) {
    // Verify user has access to the checklist item
    const existingItem = await prisma.checklist_items.findFirst({
      where: { id: itemId },
      include: {
        checklists: {
          include: {
            cards: {
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
            },
          },
        },
      },
    });

    if (!existingItem) {
      throw new AppError("Checklist item not found", 404);
    }

    if (existingItem.checklists.cards.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const item = await prisma.checklist_items.update({
      where: { id: itemId },
      data: {
        text: updateData.text,
        is_completed: updateData.isCompleted,
        due_date: updateData.dueDate,
        position: updateData.position
          ? new Decimal(updateData.position)
          : undefined,
      },
      include: {
        checklists: {
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
          },
        },
        checklist_item_assignees: {
          include: {
            users: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: existingItem.checklists.cards.lists.boards.id,
        card_id: existingItem.checklists.cards.id,
        user_id: userId,
        action: "updated",
        payload: {
          action: "checklist_item_updated",
          checklistTitle: existingItem.checklists.title,
          itemText: item.text,
        },
      },
    });

    return item;
  },

  // Delete checklist item
  async deleteChecklistItem(itemId: string, userId: string) {
    // Verify user has access to the checklist item
    const existingItem = await prisma.checklist_items.findFirst({
      where: { id: itemId },
      include: {
        checklists: {
          include: {
            cards: {
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
            },
          },
        },
      },
    });

    if (!existingItem) {
      throw new AppError("Checklist item not found", 404);
    }

    if (existingItem.checklists.cards.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Log activity before deletion
    await prisma.activity_log.create({
      data: {
        board_id: existingItem.checklists.cards.lists.boards.id,
        card_id: existingItem.checklists.cards.id,
        user_id: userId,
        action: "updated",
        payload: {
          action: "checklist_item_deleted",
          checklistTitle: existingItem.checklists.title,
          itemText: existingItem.text,
        },
      },
    });

    // Delete the checklist item
    await prisma.checklist_items.delete({
      where: { id: itemId },
    });
  },

  // Toggle checklist item completion
  async toggleChecklistItem(itemId: string, userId: string) {
    // Verify user has access to the checklist item
    const existingItem = await prisma.checklist_items.findFirst({
      where: { id: itemId },
      include: {
        checklists: {
          include: {
            cards: {
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
            },
          },
        },
      },
    });

    if (!existingItem) {
      throw new AppError("Checklist item not found", 404);
    }

    if (existingItem.checklists.cards.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const newCompletionStatus = !existingItem.is_completed;

    const item = await prisma.checklist_items.update({
      where: { id: itemId },
      data: {
        is_completed: newCompletionStatus,
      },
      include: {
        checklists: {
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
          },
        },
        checklist_item_assignees: {
          include: {
            users: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: existingItem.checklists.cards.lists.boards.id,
        card_id: existingItem.checklists.cards.id,
        user_id: userId,
        action: "updated",
        payload: {
          action: "checklist_item_toggled",
          checklistTitle: existingItem.checklists.title,
          itemText: item.text,
          completed: newCompletionStatus,
        },
      },
    });

    return item;
  },

  // Assign user to checklist item
  async assignUserToItem(itemId: string, assigneeId: string, userId: string) {
    // Verify user has access to the checklist item
    const existingItem = await prisma.checklist_items.findFirst({
      where: { id: itemId },
      include: {
        checklists: {
          include: {
            cards: {
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
            },
          },
        },
      },
    });

    if (!existingItem) {
      throw new AppError("Checklist item not found", 404);
    }

    if (existingItem.checklists.cards.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.checklist_item_assignees.findFirst({
      where: {
        item_id: itemId,
        user_id: assigneeId,
      },
    });

    if (existingAssignment) {
      throw new AppError("User already assigned to this item", 400);
    }

    const assignment = await prisma.checklist_item_assignees.create({
      data: {
        item_id: itemId,
        user_id: assigneeId,
      },
      include: {
        users: true,
        checklist_items: {
          include: {
            checklists: {
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
              },
            },
          },
        },
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: existingItem.checklists.cards.lists.boards.id,
        card_id: existingItem.checklists.cards.id,
        user_id: userId,
        action: "assigned",
        payload: {
          action: "checklist_item_assigned",
          checklistTitle: existingItem.checklists.title,
          itemText: existingItem.text,
          assigneeName: assignment.users.full_name,
        },
      },
    });

    return assignment;
  },

  // Remove user assignment from checklist item
  async removeUserFromItem(itemId: string, assigneeId: string, userId: string) {
    // Verify user has access to the checklist item
    const existingItem = await prisma.checklist_items.findFirst({
      where: { id: itemId },
      include: {
        checklists: {
          include: {
            cards: {
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
            },
          },
        },
      },
    });

    if (!existingItem) {
      throw new AppError("Checklist item not found", 404);
    }

    if (existingItem.checklists.cards.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Check if assignment exists
    const existingAssignment = await prisma.checklist_item_assignees.findFirst({
      where: {
        item_id: itemId,
        user_id: assigneeId,
      },
      include: {
        users: true,
      },
    });

    if (!existingAssignment) {
      throw new AppError("Assignment not found", 404);
    }

    // Log activity before removal
    await prisma.activity_log.create({
      data: {
        board_id: existingItem.checklists.cards.lists.boards.id,
        card_id: existingItem.checklists.cards.id,
        user_id: userId,
        action: "unassigned",
        payload: {
          action: "checklist_item_unassigned",
          checklistTitle: existingItem.checklists.title,
          itemText: existingItem.text,
          assigneeName: existingAssignment.users.full_name,
        },
      },
    });

    // Remove the assignment
    await prisma.checklist_item_assignees.delete({
      where: {
        item_id: itemId,
        user_id: assigneeId,
      },
    });
  },
};
