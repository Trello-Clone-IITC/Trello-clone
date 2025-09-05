import { Prisma, type Label } from "@prisma/client";
import { LabelDtoSchema, type LabelDto } from "@ronmordo/types";

export function mapLabelToDto(l: Label): LabelDto {
  return LabelDtoSchema.parse({
    id: l.id,
    boardId: l.boardId,
    name: l.name,
    color: l.color,
  });
}

export function mapLabelDtoToCreateInput(
  dto: LabelDto
): Prisma.LabelCreateInput {
  return {
    id: dto.id,
    board: { connect: { id: dto.boardId } },
    name: dto.name,
    color: dto.color,
  };
}
