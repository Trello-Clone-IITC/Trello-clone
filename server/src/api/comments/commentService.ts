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
    const card = await prisma.cards.findFirst({
      where: { id: data.cardId },
      include: {
        lists: {
          include: {
            boards: {
              include: {
                board_members: {
                  where: { user_id: data.userId },
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

    const comment = await prisma.comments.create({
      data: {
        card_id: data.cardId,
        user_id: data.userId,
        text: data.text,
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
        users: true,
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: card.lists.boards.id,
        card_id: data.cardId,
        user_id: data.userId,
        action: "commented",
        payload: {
          commentText: comment.text.substring(0, 100), // Truncate for log
        },
      },
    });

    return comment;
  },

  // Get comment by ID
  async getCommentById(commentId: string, userId: string) {
    const comment = await prisma.comments.findFirst({
      where: { id: commentId },
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
        users: true,
      },
    });

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    // Check if user has access to the board
    if (comment.cards.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    return comment;
  },

  // Get all comments for a card
  async getCommentsByCard(cardId: string, userId: string) {
    // Verify user has access to the card
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
      },
    });

    if (!card) {
      throw new AppError("Card not found", 404);
    }

    if (card.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    const comments = await prisma.comments.findMany({
      where: { card_id: cardId },
      include: {
        users: true,
      },
      orderBy: { created_at: "desc" },
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
    const existingComment = await prisma.comments.findFirst({
      where: { id: commentId },
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

    if (!existingComment) {
      throw new AppError("Comment not found", 404);
    }

    if (existingComment.cards.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Only the comment author can edit their comment
    if (existingComment.user_id !== userId) {
      throw new AppError("You can only edit your own comments", 403);
    }

    const comment = await prisma.comments.update({
      where: { id: commentId },
      data: {
        text: updateData.text,
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
        users: true,
      },
    });

    // Log activity
    await prisma.activity_log.create({
      data: {
        board_id: existingComment.cards.lists.boards.id,
        card_id: existingComment.cards.id,
        user_id: userId,
        action: "updated",
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
    const existingComment = await prisma.comments.findFirst({
      where: { id: commentId },
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

    if (!existingComment) {
      throw new AppError("Comment not found", 404);
    }

    if (existingComment.cards.lists.boards.board_members.length === 0) {
      throw new AppError("Access denied", 403);
    }

    // Only the comment author or board admin can delete comments
    const isAuthor = existingComment.user_id === userId;
    const isAdmin = existingComment.cards.lists.boards.board_members.some(
      (member) => member.role === "admin"
    );

    if (!isAuthor && !isAdmin) {
      throw new AppError(
        "You can only delete your own comments or must be an admin",
        403
      );
    }

    // Log activity before deletion
    await prisma.activity_log.create({
      data: {
        board_id: existingComment.cards.lists.boards.id,
        card_id: existingComment.cards.id,
        user_id: userId,
        action: "updated",
        payload: {
          action: "comment_deleted",
          commentText: existingComment.text.substring(0, 100), // Truncate for log
          deletedBy: isAuthor ? "author" : "admin",
        },
      },
    });

    // Delete the comment
    await prisma.comments.delete({
      where: { id: commentId },
    });
  },
};
