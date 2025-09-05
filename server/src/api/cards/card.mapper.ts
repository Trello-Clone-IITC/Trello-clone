import type { Card } from "@prisma/client";
import { type CardDto, CardDtoSchema } from "@ronmordo/types";

export function mapCardToDto(card: Card): CardDto {
  const dto: CardDto = {
    id: card.id,
    listId: card.listId,
    title: card.title,
    description: card.description,
    dueDate: card.dueDate?.toISOString() ?? null,
    startDate: card.startDate?.toISOString() ?? null,
    position: Number(card.position),
    isArchived: card.isArchived,
    createdBy: card.createdBy,
    coverImageUrl: card.coverImageUrl ?? null,
    subscribed: card.subscribed,
    createdAt: card.createdAt.toISOString(),
    updatedAt: card.updatedAt.toISOString(),
  };
  return CardDtoSchema.parse(dto);
}
