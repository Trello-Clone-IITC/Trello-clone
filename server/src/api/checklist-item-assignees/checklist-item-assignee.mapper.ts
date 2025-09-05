import { Prisma, type ChecklistItemAssignee } from "@prisma/client";
import {
  ChecklistItemAssigneeDtoSchema,
  type ChecklistItemAssigneeDto,
} from "@ronmordo/types";

export function mapChecklistItemAssigneeToDto(
  a: ChecklistItemAssignee
): ChecklistItemAssigneeDto {
  return ChecklistItemAssigneeDtoSchema.parse({
    itemId: a.itemId,
    userId: a.userId,
  });
}

export function mapChecklistItemAssigneeDtoToCreateInput(
  dto: ChecklistItemAssigneeDto
): Prisma.ChecklistItemAssigneeCreateInput {
  return {
    item: { connect: { id: dto.itemId } },
    user: { connect: { id: dto.userId } },
  };
}
