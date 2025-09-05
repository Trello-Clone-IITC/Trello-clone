import type { ActivityLog, ActivityAction } from "@prisma/client";
import { type ActivityLogDto, ActivityLogDtoSchema } from "@ronmordo/types";

export function mapActivityLogToDto(log: ActivityLog): ActivityLogDto {
  const dto: ActivityLogDto = {
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

function mapAction(a: ActivityAction): ActivityLogDto["action"] {
  return a.toLowerCase() as ActivityLogDto["action"];
}
