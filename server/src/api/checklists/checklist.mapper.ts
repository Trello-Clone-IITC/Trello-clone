import { Prisma, type Checklist, type ChecklistItem } from "@prisma/client";
import {
  ChecklistDtoSchema,
  type ChecklistDto,
  type ChecklistItemDto,
} from "@ronmordo/contracts";

export function mapChecklistToDto(cl: Checklist): ChecklistDto {
  return ChecklistDtoSchema.parse({
    id: cl.id,
    cardId: cl.cardId,
    title: cl.title,
    position: Number(cl.position),
  });
}

export function mapChecklistItemToDto(item: ChecklistItem): ChecklistItemDto {
  return {
    id: item.id,
    checklistId: item.checklistId,
    text: item.text,
    isCompleted: item.isCompleted,
    dueDate: item.dueDate?.toISOString() ?? null,
    position: Number(item.position),
  };
}

export function mapChecklistDtoToCreateInput(
  dto: ChecklistDto
): Prisma.ChecklistCreateInput {
  return {
    id: dto.id,
    card: { connect: { id: dto.cardId } },
    title: dto.title,
    position: new Prisma.Decimal(dto.position),
  };
}
