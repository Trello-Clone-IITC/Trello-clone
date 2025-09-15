import type { ChecklistItemDto } from "@ronmordo/contracts";
import type { ChecklistItem } from "@prisma/client";

// Map Prisma ChecklistItem to DTO
export const mapChecklistItemToDto = (
  item: ChecklistItem
): ChecklistItemDto => {
  return {
    id: item.id,
    checklistId: item.checklistId,
    text: item.text,
    isCompleted: item.isCompleted,
    dueDate: item.dueDate?.toISOString() || null,
    position: item.position.toNumber(),
  };
};
