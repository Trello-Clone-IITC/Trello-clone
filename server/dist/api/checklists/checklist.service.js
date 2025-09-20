import { prisma } from "../../lib/prismaClient.js";
import { AppError } from "../../utils/appError.js";
import { Decimal } from "@prisma/client/runtime/library";
// Create a new checklist
const createChecklist = async (data, cardId, userId) => {
    // Verify card exists and user has access
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
            checklists: {
                orderBy: { position: "asc" },
            },
            list: {
                include: {
                    board: true,
                },
            },
        },
    });
    if (!card) {
        throw new AppError("Card not found", 404);
    }
    // Get the highest position in the card and add 1000
    const lastChecklist = card.checklists.pop();
    const newPosition = lastChecklist
        ? lastChecklist.position.toNumber() + 1000
        : data.position;
    const checklist = await prisma.checklist.create({
        data: {
            cardId,
            title: data.title,
            position: new Decimal(newPosition),
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
    // Log activity
    await prisma.activityLog.create({
        data: {
            boardId: card.list.board.id,
            cardId,
            userId,
            action: "Updated",
            payload: {
                action: "checklist_created",
                checklistTitle: checklist.title,
            },
        },
    });
    return checklist;
};
// Get checklist by ID
const getChecklistById = async (checklistId, userId) => {
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
            items: {
                include: {
                    assignees: {
                        include: {
                            user: true,
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
    return checklist;
};
// Update checklist
const updateChecklist = async (checklistId, updateData, userId) => {
    // Verify user has access to the checklist
    const existingChecklist = await prisma.checklist.findFirst({
        where: { id: checklistId },
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
    });
    if (!existingChecklist) {
        throw new AppError("Checklist not found", 404);
    }
    if (existingChecklist.card.list.board.boardMembers.length === 0) {
        throw new AppError("Access denied", 403);
    }
    const checklist = await prisma.checklist.update({
        where: { id: checklistId },
        data: {
            title: updateData.title,
            position: updateData.position
                ? new Decimal(updateData.position)
                : undefined,
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
    // Log activity
    await prisma.activityLog.create({
        data: {
            boardId: existingChecklist.card.list.board.id,
            cardId: existingChecklist.card.id,
            userId: userId,
            action: "Updated",
            payload: {
                action: "checklist_updated",
                checklistTitle: checklist.title,
            },
        },
    });
    return checklist;
};
// Delete checklist
const deleteChecklist = async (checklistId, userId) => {
    // Verify user has access to the checklist
    const existingChecklist = await prisma.checklist.findFirst({
        where: { id: checklistId },
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
    });
    if (!existingChecklist) {
        throw new AppError("Checklist not found", 404);
    }
    if (existingChecklist.card.list.board.boardMembers.length === 0) {
        throw new AppError("Access denied", 403);
    }
    // Log activity before deletion
    await prisma.activityLog.create({
        data: {
            boardId: existingChecklist.card.list.board.id,
            cardId: existingChecklist.card.id,
            userId: userId,
            action: "Updated",
            payload: {
                action: "checklist_deleted",
                checklistTitle: existingChecklist.title,
            },
        },
    });
    // Delete the checklist (cascade will handle checklist items)
    await prisma.checklist.delete({
        where: { id: checklistId },
    });
};
// Create checklist item
const createChecklistItem = async (data) => {
    // Verify checklist exists and user has access
    const checklist = await prisma.checklist.findFirst({
        where: { id: data.checklistId },
        include: {
            card: {
                include: {
                    list: {
                        include: {
                            board: {
                                include: {
                                    boardMembers: {
                                        where: { userId: data.userId },
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
    // if (checklist.card.list.board.boardMembers.length === 0) {
    //   throw new AppError("Access denied", 403);
    // }
    // Get the highest position in the checklist and add 1000
    const lastItem = await prisma.checklistItem.findFirst({
        where: { checklistId: data.checklistId },
        orderBy: { position: "desc" },
    });
    const newPosition = lastItem
        ? lastItem.position.toNumber() + 1000
        : data.position;
    const item = await prisma.checklistItem.create({
        data: {
            checklistId: data.checklistId,
            text: data.text,
            dueDate: data.dueDate,
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
            userId: data.userId,
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
// Assign user to checklist item
const assignUserToItem = async (itemId, assigneeId, userId) => {
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
    return assignment;
};
// Remove user assignment from checklist item
const removeUserFromItem = async (itemId, assigneeId, userId) => {
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
// Get checklist items
const getChecklistItems = async (checklistId, userId) => {
    // Verify user has access to the checklist
    const checklist = await prisma.checklist.findFirst({
        where: { id: checklistId },
        // include: {
        //   card: {
        //     include: {
        //       list: {
        //         include: {
        //           board: {
        //             include: {
        //               boardMembers: {
        //                 where: { userId: userId },
        //               },
        //             },
        //           },
        //         },
        //       },
        //     },
        //   },
        // },
    });
    if (!checklist) {
        throw new AppError("Checklist not found", 404);
    }
    // if (checklist.card.list.board.boardMembers.length === 0) {
    //   throw new AppError("Access denied", 403);
    // }
    const items = await prisma.checklistItem.findMany({
        where: { checklistId: checklist.id },
        include: {
            assignees: {
                include: {
                    user: true,
                },
            },
        },
        orderBy: { position: "asc" },
    });
    return items;
};
export default {
    createChecklist,
    getChecklistById,
    updateChecklist,
    deleteChecklist,
    getChecklistItems,
    createChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    toggleChecklistItem,
    assignUserToItem,
    removeUserFromItem,
};
