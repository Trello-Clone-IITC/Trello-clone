import { Prisma, type ListWatcher } from "@prisma/client";
import { ListWatcherDtoSchema, type ListWatcherDto } from "@ronmordo/types";

export function mapListWatcherToDto(w: ListWatcher): ListWatcherDto {
  return ListWatcherDtoSchema.parse({
    listId: w.listId,
    userId: w.userId,
    createdAt: w.createdAt.toISOString(),
  });
}

export function mapListWatcherDtoToCreateInput(
  dto: ListWatcherDto
): Prisma.ListWatcherCreateInput {
  return {
    list: { connect: { id: dto.listId } },
    user: { connect: { id: dto.userId } },
    createdAt: new Date(dto.createdAt),
  };
}
