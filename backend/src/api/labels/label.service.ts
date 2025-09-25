import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/appError.js";
import type {
  CreateLabelInput,
  LabelDto,
  UpdateLabelInput,
} from "@ronmordo/contracts";
import { mapLabelDtoToCreateInput, mapLabelToDto } from "./label.mapper.js";

const prisma = new PrismaClient();

// interface CreateLabelData extends CreateLabelInput {
//   boardId: string;
//   userId: string;
// }

// interface UpdateLabelData extends Partial<UpdateLabelInput> {
//   userId: string;
// }

const createLabel = async (
  data: CreateLabelInput,
  boardId: string,
  userId: string
) => {
  try {
    // Verify user has access to the board
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        boardMembers: {
          some: { userId },
        },
      },
    });

    if (!board) {
      throw new AppError("Board not found", 404);
    }

    // Check if label with same name already exists on this board
    if (data.name) {
      const existingLabel = await prisma.label.findFirst({
        where: {
          boardId,
          name: data.name,
        },
      });

      if (existingLabel) {
        throw new AppError(
          "Label with this name already exists on this board",
          409
        );
      }
    }

    const label = await prisma.label.create({
      data: mapLabelDtoToCreateInput({
        boardId,
        name: data.name,
        color: data.color,
      }),
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId,
        userId,
        action: "Created",
        payload: {
          type: "label",
          labelId: label.id,
          labelName: label.name,
          labelColor: label.color,
        },
      },
    });

    return label;
  } catch (error) {
    console.error("Failed to create label:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create label", 500);
  }
};

const getLabelById = async (
  boardId: string,
  labelId: string,
  userId: string
) => {
  const label = await prisma.label.findFirst({
    where: {
      id: labelId,
      boardId: boardId,
      board: { boardMembers: { some: { userId } } },
    },
  });

  if (!label) {
    throw new AppError("Label not found", 404);
  }

  const labelDto = mapLabelToDto(label);

  return labelDto;
};

const updateLabel = async (
  updateData: UpdateLabelInput,
  labelId: string,
  userId: string
) => {
  try {
    // Verify user has access to the label's board
    const label = await prisma.label.findFirst({
      where: {
        id: labelId,
        board: {
          boardMembers: {
            some: { userId },
          },
        },
      },
    });

    if (!label) {
      throw new AppError("Label not found", 404);
    }

    // Check if new name conflicts with existing labels on the same board
    if (updateData.name && updateData.name !== label.name) {
      const existingLabel = await prisma.label.findFirst({
        where: {
          boardId: label.boardId,
          name: updateData.name,
          id: { not: labelId },
        },
      });

      if (existingLabel) {
        throw new AppError(
          "Label with this name already exists on this board",
          409
        );
      }
    }

    const updatedLabel = await prisma.label.update({
      where: { id: labelId },
      data: {
        name: updateData.name,
        color: updateData.color
          ? mapLabelDtoToCreateInput({
              id: "",
              boardId: "",
              name: "",
              color: updateData.color,
            }).color
          : undefined,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: label.boardId,
        userId: userId,
        action: "Updated",
        payload: {
          type: "label",
          labelId: labelId,
          changes: {
            name: updateData.name
              ? { from: label.name, to: updateData.name }
              : undefined,
            color: updateData.color
              ? { from: label.color, to: updateData.color }
              : undefined,
          },
        },
      },
    });

    return updatedLabel;
  } catch (error) {
    console.error("Failed to update label:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to update label", 500);
  }
};

const deleteLabel = async (labelId: string, userId: string) => {
  try {
    // Verify user has access to the label's board
    const label = await prisma.label.findFirst({
      where: {
        id: labelId,
        board: {
          boardMembers: {
            some: { userId },
          },
        },
      },
    });

    if (!label) {
      throw new AppError("Label not found", 404);
    }

    // Delete the label (this will cascade delete all card labels)
    await prisma.label.delete({
      where: { id: labelId },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        boardId: label.boardId,
        userId: userId,
        action: "Closed",
        payload: {
          type: "label",
          labelId: labelId,
          labelName: label.name,
          labelColor: label.color,
        },
      },
    });
  } catch (error) {
    console.error("Failed to delete label:", error);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to delete label", 500);
  }
};

export default {
  createLabel,
  getLabelById,
  updateLabel,
  deleteLabel,
};
