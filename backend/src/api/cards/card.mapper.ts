import type {
  Card,
  Checklist,
  Comment,
  CardAssignee,
  CardWatcher,
  Attachment,
  User,
} from "@prisma/client";
import {
  type CardDto,
  CardDtoSchema,
  type ChecklistDto,
  type CommentDto,
  type CardAssigneeDto,
  type CardWatcherDto,
  type AttachmentDto,
  type CommentWithUserDto,
} from "@ronmordo/contracts";
import { Prisma } from "@prisma/client";
import { mapUserToDto } from "../users/user.mapper.js";

export function mapCardToDto(
  card: Card,
  additionalFields: Pick<
    CardDto,
    | "attachmentsCount"
    | "cardAssignees"
    | "checklistItemsCount"
    | "completedChecklistItemsCount"
    | "commentsCount"
    | "isWatch"
    | "labels"
    | "location"
  >
): CardDto {
  const dto: CardDto = {
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

export function mapCardDtoToCreateInput(dto: CardDto): Prisma.CardCreateInput {
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

export function mapChecklistToDto(checklist: Checklist): ChecklistDto {
  return {
    id: checklist.id,
    cardId: checklist.cardId,
    title: checklist.title,
    position: Number(checklist.position),
  };
}

export function mapCommentToDto(
  comment: Comment & { user: User }
): CommentWithUserDto {
  return {
    id: comment.id,
    cardId: comment.cardId,
    userId: comment.userId,
    text: comment.text,
    createdAt: comment.createdAt.toISOString(),
    user: mapUserToDto(comment.user),
  };
}

export function mapCardAssigneeToDto(
  assignee: CardAssignee & { user?: any }
): CardAssigneeDto {
  return {
    cardId: assignee.cardId,
    userId: assignee.userId,
  };
}

export function mapCardWatcherToDto(
  watcher: CardWatcher & { user?: any }
): CardWatcherDto {
  return {
    cardId: watcher.cardId,
    userId: watcher.userId,
    createdAt: watcher.createdAt.toISOString(),
  };
}

export function mapAttachmentToDto(attachment: Attachment): AttachmentDto {
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
