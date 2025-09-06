import { Prisma, type CardAssignee } from "@prisma/client";
import { CardAssigneeDtoSchema, type CardAssigneeDto } from "@ronmordo/types";

export function mapCardAssigneeToDto(a: CardAssignee): CardAssigneeDto {
  return CardAssigneeDtoSchema.parse({
    cardId: a.cardId,
    userId: a.userId,
  });
}

export function mapCardAssigneeDtoToCreateInput(
  dto: CardAssigneeDto
): Prisma.CardAssigneeCreateInput {
  return {
    card: { connect: { id: dto.cardId } },
    user: { connect: { id: dto.userId } },
  };
}
