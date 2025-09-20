import { Prisma } from "@prisma/client";
import { CardWatcherDtoSchema } from "@ronmordo/contracts";
export function mapCardWatcherToDto(w) {
    return CardWatcherDtoSchema.parse({
        cardId: w.cardId,
        userId: w.userId,
        createdAt: w.createdAt.toISOString(),
    });
}
export function mapCardWatcherDtoToCreateInput(dto) {
    return {
        card: { connect: { id: dto.cardId } },
        user: { connect: { id: dto.userId } },
        createdAt: new Date(dto.createdAt),
    };
}
