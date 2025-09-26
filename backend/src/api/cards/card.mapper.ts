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
    list: dto.listId ? { connect: { id: dto.listId } } : undefined,
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

// Maps an Update DTO (matching UpdateCardSchema) to Prisma.CardUpdateInput
// Dates: string ISO -> Date; nullable fields: null is preserved, undefined means no-op
export function mapUpdateDtoToUpdateInput(dto: {
  id?: string;
  listId?: string | null;
  inboxUserId?: string | null;
  title?: string;
  description?: string | null | undefined;
  dueDate?: string | null | undefined;
  startDate?: string | null | undefined;
  position?: number;
  isWatch?: boolean; // not persisted on card entity directly
  coverImageUrl?: string | null | undefined;
  isArchived?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}): Prisma.CardUpdateInput {
  return {
    // Connect to another list if listId provided
    list:
      dto.listId === undefined
        ? undefined
        : dto.listId === null
        ? { disconnect: true }
        : { connect: { id: dto.listId } },
    inbox:
      dto.inboxUserId === undefined
        ? undefined
        : dto.inboxUserId === null
        ? { disconnect: true }
        : { connect: { userId: dto.inboxUserId } },
    title: dto.title,
    description: dto.description === undefined ? undefined : dto.description, // allow null to clear
    dueDate:
      dto.dueDate === undefined
        ? undefined
        : dto.dueDate === null
        ? null
        : new Date(dto.dueDate),
    startDate:
      dto.startDate === undefined
        ? undefined
        : dto.startDate === null
        ? null
        : new Date(dto.startDate),
    coverImageUrl:
      dto.coverImageUrl === undefined ? undefined : dto.coverImageUrl, // allow null to clear
    position:
      dto.position === undefined ? undefined : new Prisma.Decimal(dto.position),
    isArchived: dto.isArchived,
    // Always bump updatedAt on updates unless explicitly managed elsewhere
    updatedAt: new Date(),
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
