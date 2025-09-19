import type { Prisma, $Enums, ActivityAction } from "@prisma/client";
import {
  type ActivityLogDto,
  type ActivityLogFullDto,
  ActivityLogFullSchema,
} from "@ronmordo/contracts";
import type { ActivityLogWithRelations } from "./activity-log.types.js";
import { mapUserToDto } from "../users/user.mapper.js";
import { mapBoardToDto } from "../boards/board.mapper.js";
import { getCardDto } from "../cards/card.service.js";

export async function mapActivityLogToDto(
  log: ActivityLogWithRelations
): Promise<ActivityLogFullDto> {
  const cardDto =
    log.card && log.userId ? await getCardDto(log.card, log.userId) : null;

  const dto: ActivityLogFullDto = {
    id: log.id,
    boardId: log.boardId,
    cardId: log.cardId,
    userId: log.userId,
    action: mapAction(log.action),
    payload: log.payload,
    createdAt: log.createdAt.toISOString(),
    user: log.user ? mapUserToDto(log.user) : null,
    board: mapBoardToDto(log.board),
    card: cardDto,
  };
  return ActivityLogFullSchema.parse(dto);
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
