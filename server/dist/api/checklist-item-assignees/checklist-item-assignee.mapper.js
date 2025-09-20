import { Prisma } from "@prisma/client";
import { ChecklistItemAssigneeDtoSchema, } from "@ronmordo/contracts";
export function mapChecklistItemAssigneeToDto(a) {
    return ChecklistItemAssigneeDtoSchema.parse({
        itemId: a.itemId,
        userId: a.userId,
    });
}
export function mapChecklistItemAssigneeDtoToCreateInput(dto) {
    return {
        item: { connect: { id: dto.itemId } },
        user: { connect: { id: dto.userId } },
    };
}
