// Map Prisma ChecklistItem to DTO
export const mapChecklistItemToDto = (item) => {
    return {
        id: item.id,
        checklistId: item.checklistId,
        text: item.text,
        isCompleted: item.isCompleted,
        dueDate: item.dueDate?.toISOString() || null,
        position: item.position.toNumber(),
    };
};
