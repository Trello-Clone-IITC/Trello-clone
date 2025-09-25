import { Prisma, type List } from "@prisma/client";
import {
  ListDtoSchema,
  ListWithCardsAndWatchersSchema,
  type ListDto,
  type ListWithCardsAndWatchersDto,
} from "@ronmordo/contracts";
import type { FullList } from "./list.types.js";
import { getCardDto } from "../cards/card.service.js";
import { mapUserToDto } from "../users/user.mapper.js";
import { mapListWatcherToDto } from "../list-watchers/list-watcher.mapper.js";

export function mapListToDto(list: List): ListDto {
  return ListDtoSchema.parse({
    id: list.id,
    boardId: list.boardId,
    name: list.name,
    position: Number(list.position),
    isArchived: list.isArchived,
    subscribed: list.subscribed,
  });
}

export async function mapFullListToDto(
  list: FullList,
  userId: string
): Promise<ListWithCardsAndWatchersDto> {
  const cardsDto = await Promise.all(
    list.cards.map((c) => getCardDto(c, userId))
  );
  const watchersDto = await Promise.all(
    list.watchers.map((w) => mapListWatcherToDto(w))
  );

  return ListWithCardsAndWatchersSchema.parse({
    ...list,
    cards: cardsDto,
    watchers: watchersDto,
  });
}

export function mapListDtoToCreateInput(dto: ListDto): Prisma.ListCreateInput {
  return {
    id: dto.id,
    board: { connect: { id: dto.boardId } },
    name: dto.name,
    position: new Prisma.Decimal(dto.position),
    isArchived: dto.isArchived,
    subscribed: dto.subscribed,
  };
}
