import { Prisma } from "@prisma/client";
import { ListWatcherDtoSchema } from "@ronmordo/contracts";
export function mapListWatcherToDto(w) {
    return ListWatcherDtoSchema.parse({
        listId: w.listId,
        userId: w.userId,
        createdAt: w.createdAt.toISOString(),
    });
}
export function mapListWatcherDtoToCreateInput(dto) {
    return {
        list: { connect: { id: dto.listId } },
        user: { connect: { id: dto.userId } },
        createdAt: new Date(dto.createdAt),
    };
}
