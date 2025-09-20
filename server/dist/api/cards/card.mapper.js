import { CardDtoSchema, } from "@ronmordo/contracts";
import { Prisma } from "@prisma/client";
export function mapCardToDto(card, additionalFields) {
    const dto = {
        id: card.id,
        listId: card.listId,
        title: card.title,
        description: card.description,
        dueDate: card.dueDate?.toISOString() ?? null,
        startDate: card.startDate?.toISOString() ?? null,
        position: Number(card.position),
        ...additionalFields,
        isArchived: card.isArchived,
        createdBy: card.createdBy,
        coverImageUrl: card.coverImageUrl ?? null,
        createdAt: card.createdAt.toISOString(),
        updatedAt: card.updatedAt.toISOString(),
    };
    return CardDtoSchema.parse(dto);
}
export function mapCardDtoToCreateInput(dto) {
    return {
        id: dto.id,
        list: { connect: { id: dto.listId } },
        title: dto.title,
        description: dto.description ?? undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        position: new Prisma.Decimal(dto.position),
        isArchived: dto.isArchived,
        creator: { connect: { id: dto.createdBy } },
        coverImageUrl: dto.coverImageUrl ?? undefined,
        createdAt: new Date(dto.createdAt),
        updatedAt: new Date(dto.updatedAt),
    };
}
export function mapChecklistToDto(checklist) {
    return {
        id: checklist.id,
        cardId: checklist.cardId,
        title: checklist.title,
        position: Number(checklist.position),
    };
}
export function mapCommentToDto(comment) {
    return {
        id: comment.id,
        cardId: comment.cardId,
        userId: comment.userId,
        text: comment.text,
        createdAt: comment.createdAt.toISOString(),
    };
}
export function mapCardAssigneeToDto(assignee) {
    return {
        cardId: assignee.cardId,
        userId: assignee.userId,
    };
}
export function mapCardWatcherToDto(watcher) {
    return {
        cardId: watcher.cardId,
        userId: watcher.userId,
        createdAt: watcher.createdAt.toISOString(),
    };
}
export function mapAttachmentToDto(attachment) {
    return {
        id: attachment.id,
        cardId: attachment.cardId,
        url: attachment.url,
        createdAt: attachment.createdAt.toISOString(),
        userId: attachment.userId,
        filename: attachment.filename,
        bytes: attachment.bytes ? Number(attachment.bytes) : null,
        meta: attachment.meta,
    };
}
