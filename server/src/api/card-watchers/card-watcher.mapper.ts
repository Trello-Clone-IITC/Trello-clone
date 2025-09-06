import { Prisma, type CardWatcher } from "@prisma/client";
import { CardWatcherDtoSchema, type CardWatcherDto } from "@ronmordo/types";

export function mapCardWatcherToDto(w: CardWatcher): CardWatcherDto {
  return CardWatcherDtoSchema.parse({
    cardId: w.cardId,
    userId: w.userId,
    createdAt: w.createdAt.toISOString(),
  });
}

export function mapCardWatcherDtoToCreateInput(
  dto: CardWatcherDto
): Prisma.CardWatcherCreateInput {
  return {
    card: { connect: { id: dto.cardId } },
    user: { connect: { id: dto.userId } },
    createdAt: new Date(dto.createdAt),
  };
}
