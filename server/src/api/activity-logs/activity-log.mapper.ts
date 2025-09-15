import type {
  Prisma,
  $Enums,
  ActivityLog,
  ActivityAction,
} from "@prisma/client";
import { type ActivityLogDto, ActivityLogDtoSchema } from "@ronmordo/contracts";

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

export function mapActivityLogDtoToCreateInput(
  dto: ActivityLogDto
): Prisma.ActivityLogCreateInput {
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

function mapActionDto(a: ActivityLogDto["action"]): $Enums.ActivityAction {
  return (a.charAt(0).toUpperCase() + a.slice(1)) as $Enums.ActivityAction;
}
