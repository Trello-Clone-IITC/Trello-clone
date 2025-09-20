import { Color, Prisma } from "@prisma/client";
import { LabelDtoSchema } from "@ronmordo/contracts";
export function mapLabelToDto(l) {
    return LabelDtoSchema.parse({
        id: l.id,
        boardId: l.boardId,
        name: l.name,
        color: l.color.replace(/([A-Z])/g, (_, p1, offset) => offset > 0 ? "_" + p1.toLowerCase() : p1.toLowerCase()),
    });
}
export function mapLabelDtoToCreateInput(dto) {
    return {
        ...(dto.id && { id: dto.id }),
        board: { connect: { id: dto.boardId } },
        name: dto.name,
        color: dto.color
            .split("_")
            .map((s, i) => i === 0
            ? s.charAt(0).toUpperCase() + s.slice(1)
            : s.charAt(0).toUpperCase() + s.slice(1))
            .join(""),
    };
}
