import { Prisma, type CardLabel } from "@prisma/client";
import { CardLabelDtoSchema, type CardLabelDto } from "@ronmordo/types";

export function mapCardLabelToDto(cl: CardLabel): CardLabelDto {
  return CardLabelDtoSchema.parse({
    cardId: cl.cardId,
    labelId: cl.labelId,
  });
}

export function mapCardLabelDtoToCreateInput(
  dto: CardLabelDto
): Prisma.CardLabelCreateInput {
  return {
    card: { connect: { id: dto.cardId } },
    label: { connect: { id: dto.labelId } },
  };
}
