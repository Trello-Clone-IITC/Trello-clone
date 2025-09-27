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

// Create a new comment
const createComment = async (data: CreateCommentData) => {
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

  if (card.list && card.list.board.boardMembers.length === 0) {
    throw new AppError("Access denied", 403);
  }

  const comment = await prisma.comment.create({
    data: {
      cardId: data.cardId,
      text: data.text,
      userId: data.userId,
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
  if (card.list) {
    await prisma.activityLog.create({
      data: {
        boardId: card.list.board.id,
        cardId: card.id,
        userId: data.userId,
        action: "Commented",
        payload: {
          commentId: comment.id,
          text: comment.text.substring(0, 100), // Truncate for activity log
        },
      },
    });
  }

  return comment;
};

// Get a single comment by ID
const getCommentById = async (commentId: string, userId: string) => {
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
                    where: { userId: userId },
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

  // Check if user has access to the card
  if (comment.card.list && comment.card.list.board.boardMembers.length === 0) {
    throw new AppError("Access denied", 403);
  }

  return comment;
};

// Update a comment
const updateComment = async (
  commentId: string,
  updateData: UpdateCommentData,
  userId: string
) => {
  // Verify user has access to the comment and is the author
  const existingComment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      userId: userId, // Only allow author to update
    },
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

  if (!existingComment) {
    throw new AppError("Comment not found or access denied", 404);
  }

  if (
    existingComment.card.list &&
    existingComment.card.list.board.boardMembers.length === 0
  ) {
    throw new AppError("Access denied", 403);
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
  if (existingComment.card.list) {
    await prisma.activityLog.create({
      data: {
        boardId: existingComment.card.list.board.id,
        cardId: existingComment.card.id,
        userId: userId,
        action: "Updated",
        payload: {
          commentId: comment.id,
          text: comment.text.substring(0, 100), // Truncate for activity log
        },
      },
    });
  }

  return comment;
};

// Delete a comment
const deleteComment = async (commentId: string, userId: string) => {
  // Verify user has access to the comment and is the author
  const existingComment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      userId: userId, // Only allow author to delete
    },
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

  if (!existingComment) {
    throw new AppError("Comment not found or access denied", 404);
  }

  if (
    existingComment.card.list &&
    existingComment.card.list.board.boardMembers.length === 0
  ) {
    throw new AppError("Access denied", 403);
  }

  // Log activity before deletion
  if (existingComment.card.list) {
    await prisma.activityLog.create({
      data: {
        boardId: existingComment.card.list.board.id,
        cardId: existingComment.card.id,
        userId: userId,
        action: "Updated", // Using "Updated" since there's no "Deleted" action for comments
        payload: {
          commentId: existingComment.id,
          action: "deleted",
          text: existingComment.text.substring(0, 100), // Truncate for activity log
        },
      },
    });
  }

  // Delete the comment
  await prisma.comment.delete({
    where: { id: commentId },
  });
};

export default {
  createComment,
  getCommentById,
  updateComment,
  deleteComment,
};
