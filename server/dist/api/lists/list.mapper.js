import { Prisma } from "@prisma/client";
import { ListDtoSchema } from "@ronmordo/contracts";
export function mapListToDto(list) {
    return ListDtoSchema.parse({
        id: list.id,
        boardId: list.boardId,
        name: list.name,
        position: Number(list.position),
        isArchived: list.isArchived,
        subscribed: list.subscribed,
    });
}
export function mapListDtoToCreateInput(dto) {
    return {
        id: dto.id,
        board: { connect: { id: dto.boardId } },
        name: dto.name,
        position: new Prisma.Decimal(dto.position),
        isArchived: dto.isArchived,
        subscribed: dto.subscribed,
    };
}
