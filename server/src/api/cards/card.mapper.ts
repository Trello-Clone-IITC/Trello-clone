import type { Card } from "@prisma/client";
import { type CardDto, CardDtoSchema } from "@ronmordo/types";
import { Prisma } from "@prisma/client";

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

export function mapCardDtoToCreateInput(dto: CardDto): Prisma.CardCreateInput {
  return {
    id: dto.id,
    list: { connect: { id: dto.listId } },
    title: dto.title,
    description: dto.description ?? undefined,
    dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    startDate: dto.startDate ? new Date(dto.startDate) : undefined,
    position: new Prisma.Decimal(dto.position),
    isArchived: dto.isArchived,
    creator: dto.createdBy ? { connect: { id: dto.createdBy } } : undefined,
    coverImageUrl: dto.coverImageUrl ?? undefined,
    subscribed: dto.subscribed,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}
