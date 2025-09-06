import { Prisma, type ListWatcher } from "@prisma/client";
import type { ListWatcherDto } from "@ronmordo/types";

export function mapListWatcherToDto(watcher: ListWatcher & { user: any }): ListWatcherDto {
  return {
    listId: watcher.listId,
    userId: watcher.userId,
    createdAt: watcher.createdAt.toISOString(),
    user: {
      id: watcher.user.id,
      fullName: watcher.user.fullName,
      email: watcher.user.email,
      avatarUrl: watcher.user.avatarUrl,
    },
  };
}

export function mapListWatcherDtoToCreateInput(
  dto: Omit<ListWatcherDto, "createdAt" | "user">
): Prisma.ListWatcherCreateInput {
  return {
    list: { connect: { id: dto.listId } },
    user: { connect: { id: dto.userId } },
  };
}


