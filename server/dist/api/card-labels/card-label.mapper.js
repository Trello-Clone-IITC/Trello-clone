import { Prisma } from "@prisma/client";
import { CardLabelDtoSchema } from "@ronmordo/contracts";
export function mapCardLabelToDto(cl) {
    return CardLabelDtoSchema.parse({
        cardId: cl.cardId,
        labelId: cl.labelId,
    });
}
export function mapCardLabelDtoToCreateInput(dto) {
    return {
        card: { connect: { id: dto.cardId } },
        label: { connect: { id: dto.labelId } },
    };
}
