import { prisma } from "../../lib/prismaClient.js";
import { AppError } from "../../utils/appError.js";
import { Decimal } from "@prisma/client/runtime/library";
// Create checklist item
const createChecklistItem = async (data, checklistId, userId) => {
    // Verify checklist exists and user has access
    const checklist = await prisma.checklist.findFirst({
        where: {
            id: checklistId,
            card: {
                list: {
                    board: {
                        boardMembers: {
                            some: { userId },
                        },
                    },
                },
            },
        },
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
            items: {
                orderBy: { position: "asc" },
            },
        },
    });
    if (!checklist) {
        throw new AppError("Checklist not found", 404);
    }
    // Get the highest position in the checklist and add 1000
    const lastItem = checklist.items.pop();
    const newPosition = lastItem
        ? lastItem.position.toNumber() + 1000
        : data.position;
    const item = await prisma.checklistItem.create({
        data: {
            checklistId,
            text: data.text,
            position: new Decimal(newPosition),
        },
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
            assignees: {
                include: {
                    user: true,
                },
            },
        },
    });
    // Log activity
    await prisma.activityLog.create({
        data: {
            boardId: checklist.card.list.board.id,
            cardId: checklist.card.id,
            userId,
            action: "Updated",
            payload: {
                action: "checklist_item_created",
                checklistTitle: checklist.title,
                itemText: item.text,
            },
        },
    });
    return item;
};
// Get checklist item by ID
const getChecklistItemById = async (itemId, userId) => {
    const item = await prisma.checklistItem.findFirst({
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
            assignees: {
                include: {
                    user: true,
                },
            },
        },
    });
    if (!item) {
        throw new AppError("Checklist item not found", 404);
    }
    // Check if user has access to the board
    if (item.checklist.card.list.board.boardMembers.length === 0) {
        throw new AppError("Access denied", 403);
    }
    return item;
};
// Update checklist item
const updateChecklistItem = async (itemId, updateData, userId) => {
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
    if (existingItem.checklist.card.list.board.boardMembers.length === 0) {
        console.log("existingItem", existingItem);
        console.log("checxklist", existingItem.checklist);
        console.log("card", existingItem.checklist.card);
        console.log("list", existingItem.checklist.card.list);
        console.log("board", existingItem.checklist.card.list.board);
        console.log("boardMembers", existingItem.checklist.card.list.board.boardMembers);
        throw new AppError("Access denied", 403);
    }
    const item = await prisma.checklistItem.update({
        where: { id: itemId },
        data: {
            text: updateData.text,
            isCompleted: updateData.isCompleted,
            dueDate: updateData.dueDate,
            position: updateData.position
                ? new Decimal(updateData.position)
                : undefined,
        },
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
            assignees: {
                include: {
                    user: true,
                },
            },
        },
    });
    // Log activity
    await prisma.activityLog.create({
        data: {
            boardId: existingItem.checklist.card.list.board.id,
            cardId: existingItem.checklist.card.id,
            userId: userId,
            action: "Updated",
            payload: {
                action: "checklist_item_updated",
                checklistTitle: existingItem.checklist.title,
                itemText: item.text,
            },
        },
    });
    return item;
};
// Delete checklist item
const deleteChecklistItem = async (itemId, userId) => {
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
    if (existingItem.checklist.card.list.board.boardMembers.length === 0) {
        throw new AppError("Access denied", 403);
    }
    // Log activity before deletion
    await prisma.activityLog.create({
        data: {
            boardId: existingItem.checklist.card.list.board.id,
            cardId: existingItem.checklist.card.id,
            userId: userId,
            action: "Updated",
            payload: {
                action: "checklist_item_deleted",
                checklistTitle: existingItem.checklist.title,
                itemText: existingItem.text,
            },
        },
    });
    // Delete the checklist item
    await prisma.checklistItem.delete({
        where: { id: itemId },
    });
};
// Toggle checklist item completion
const toggleChecklistItem = async (itemId, userId) => {
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
    if (existingItem.checklist.card.list.board.boardMembers.length === 0) {
        throw new AppError("Access denied", 403);
    }
    const newCompletionStatus = !existingItem.isCompleted;
    const item = await prisma.checklistItem.update({
        where: { id: itemId },
        data: {
            isCompleted: newCompletionStatus,
        },
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
            assignees: {
                include: {
                    user: true,
                },
            },
        },
    });
    // Log activity
    await prisma.activityLog.create({
        data: {
            boardId: existingItem.checklist.card.list.board.id,
            cardId: existingItem.checklist.card.id,
            userId: userId,
            action: "Updated",
            payload: {
                action: "checklist_item_toggled",
                checklistTitle: existingItem.checklist.title,
                itemText: item.text,
                completed: newCompletionStatus,
            },
        },
    });
    return item;
};
// Get checklist item assignees
const getChecklistItemAssignees = async (itemId, userId) => {
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
    if (existingItem.checklist.card.list.board.boardMembers.length === 0) {
        throw new AppError("Access denied", 403);
    }
    const assignees = await prisma.checklistItemAssignee.findMany({
        where: { itemId },
        include: {
            user: true,
        },
    });
    return assignees;
};
export default {
    createChecklistItem,
    getChecklistItemById,
    updateChecklistItem,
    deleteChecklistItem,
    toggleChecklistItem,
    getChecklistItemAssignees,
};
