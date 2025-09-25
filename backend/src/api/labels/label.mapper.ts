import { Color, Prisma, type Label } from "@prisma/client";
import { LabelDtoSchema, type LabelDto } from "@ronmordo/contracts";

export function mapLabelToDto(l: Label): LabelDto {
  return LabelDtoSchema.parse({
    id: l.id,
    boardId: l.boardId,
    name: l.name,
    color: l.color.replace(/([A-Z])/g, (_, p1, offset) =>
      offset > 0 ? "_" + p1.toLowerCase() : p1.toLowerCase()
    ),
  });
}

export function mapLabelDtoToCreateInput(
  dto: Omit<LabelDto, "id"> & { id?: string }
): Prisma.LabelCreateInput {
  return {
    ...(dto.id && { id: dto.id }),
    board: { connect: { id: dto.boardId } },
    name: dto.name,
    color: dto.color
      .split("_")
      .map((s, i) =>
        i === 0
          ? s.charAt(0).toUpperCase() + s.slice(1)
          : s.charAt(0).toUpperCase() + s.slice(1)
      )
      .join("") as Color,
  };
}
