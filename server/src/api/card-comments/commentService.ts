import { prisma } from "../../lib/prismaClient.js";
import { AppError } from "../../utils/appError.js";

interface CreateCommentData {
  cardId: string;
  text: string;
  userId: string;
}

interface UpdateCommentData {
  text: string;
}

export const commentService = {
  // Create a new comment
  async createComment(data: CreateCommentData) {
    // Verify card exists and user has access
    const card = await prisma.card.findFirst({
      where: { id: data.cardId },
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
    });

    if (!card) {
      throw new AppError("Card not found", 404);
    }

    if (card.list.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const comment = await prisma.comment.create({
      data: {
        cardId: data.cardId,
        userId: data.userId,
        text: data.text,
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
        user: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: card.list.board.id,
        cardId: data.cardId,
        userId: data.userId,
        action: "Commented",
        payload: {
          commentText: comment.text.substring(0, 100), // Truncate for log
        },
      },
    });

    return comment;
  },

  // Get comment by ID
  async getCommentById(commentId: string, userId: string) {
    const comment = await prisma.comment.findFirst({
      where: { id: commentId },
      include: {
        card: {
          include: {
            list: {
              include: {
                board: {
                  include: {
                    boardMembers: {
                      where: { userId },
                    },
                  },
                },
              },
            },
          },
        },
        user: true,
      },
    });

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    // Check if user has access to the board
    if (comment.card.list.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    return comment;
  },

  // Get all comments for a card
  async getCommentsByCard(cardId: string, userId: string) {
    // Verify user has access to the card
    const card = await prisma.card.findFirst({
      where: { id: cardId },
      include: {
        list: {
          include: {
            board: {
              include: {
                boardMembers: {
                  where: { userId },
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
      where: { cardId: cardId },
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return comments;
  },

  // Update comment
  async updateComment(
    commentId: string,
    updateData: UpdateCommentData,
    userId: string
  ) {
    // Verify user has access to the comment
    const existingComment = await prisma.comment.findFirst({
      where: { id: commentId },
      include: {
        card: {
          include: {
            list: {
              include: {
                board: {
                  include: {
                    boardMembers: {
                      where: { userId },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!existingComment) {
      throw new AppError("Comment not found", 404);
    }

    if (existingComment.card.list.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Only the comment author can edit their comment
    if (existingComment.userId !== userId) {
      throw new AppError("You can only edit your own comments", 403);
    }

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        text: updateData.text,
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
        user: true,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: existingComment.card.list.board.id,
        cardId: existingComment.card.id,
        userId: userId,
        action: "Updated",
        payload: {
          action: "comment_updated",
          commentText: comment.text.substring(0, 100), // Truncate for log
        },
      },
    });

    return comment;
  },

  // Delete comment
  async deleteComment(commentId: string, userId: string) {
    // Verify user has access to the comment
    const existingComment = await prisma.comment.findFirst({
      where: { id: commentId },
      include: {
        card: {
          include: {
            list: {
              include: {
                board: {
                  include: {
                    boardMembers: {
                      where: { userId },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!existingComment) {
      throw new AppError("Comment not found", 404);
    }

    if (existingComment.card.list.board.boardMembers.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Only the comment author or board admin can delete comments
    const isAuthor = existingComment.userId === userId;
    const isAdmin = existingComment.card.list.board.boardMembers.some(
      (member) => member.role === "Admin"
    );

    if (!isAuthor && !isAdmin) {
      throw new AppError(
        "You can only delete your own comments or must be an admin",
        403
      );
    }

    // Log activity before deletion
    await prisma.activityLog.create({
      data: {
        boardId: existingComment.card.list.board.id,
        cardId: existingComment.card.id,
        userId: userId,
        action: "Updated",
        payload: {
          action: "comment_deleted",
          commentText: existingComment.text.substring(0, 100), // Truncate for log
          deletedBy: isAuthor ? "author" : "admin",
        },
      },
    });

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId },
    });
  },
};
