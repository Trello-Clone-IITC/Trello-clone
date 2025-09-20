import { ActivityLogDtoSchema } from "@ronmordo/contracts";
export function mapActivityLogToDto(log) {
    const dto = {
        id: log.id,
        boardId: log.boardId,
        cardId: log.cardId,
        userId: log.userId,
        action: mapAction(log.action),
        payload: log.payload,
        createdAt: log.createdAt.toISOString(),
    };
    return ActivityLogDtoSchema.parse(dto);
}
function mapAction(a) {
    return a.toLowerCase();
}
export function mapActivityLogDtoToCreateInput(dto) {
    return {
        id: dto.id,
        board: { connect: { id: dto.boardId } },
        card: dto.cardId ? { connect: { id: dto.cardId } } : undefined,
        user: dto.userId ? { connect: { id: dto.userId } } : undefined,
        action: mapActionDto(dto.action),
        payload: dto.payload ?? undefined,
        createdAt: new Date(dto.createdAt),
    };
}
function mapActionDto(a) {
    return (a.charAt(0).toUpperCase() + a.slice(1));
}
