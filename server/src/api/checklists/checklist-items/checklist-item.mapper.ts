import { Prisma, type ChecklistItem } from "@prisma/client";
import { ChecklistItemDtoSchema, type ChecklistItemDto } from "@ronmordo/types";

export function mapChecklistItemToDto(item: ChecklistItem): ChecklistItemDto {
  return ChecklistItemDtoSchema.parse({
    id: item.id,
    checklistId: item.checklistId,
    text: item.text,
    isCompleted: item.isCompleted,
    dueDate: item.dueDate?.toISOString() ?? null,
    position: Number(item.position),
  });
}

export function mapChecklistItemDtoToCreateInput(
  dto: ChecklistItemDto
): Prisma.ChecklistItemCreateInput {
  return {
    id: dto.id,
    checklist: { connect: { id: dto.checklistId } },
    text: dto.text,
    isCompleted: dto.isCompleted,
    dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
    position: new Prisma.Decimal(dto.position),
  };
}
