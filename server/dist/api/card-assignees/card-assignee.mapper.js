import { Prisma } from "@prisma/client";
import { CardAssigneeDtoSchema, } from "@ronmordo/contracts";
export function mapCardAssigneeToDto(a) {
    return CardAssigneeDtoSchema.parse({
        cardId: a.cardId,
        userId: a.userId,
    });
}
export function mapCardAssigneeDtoToCreateInput(dto) {
    return {
        card: { connect: { id: dto.cardId } },
        user: { connect: { id: dto.userId } },
    };
}
