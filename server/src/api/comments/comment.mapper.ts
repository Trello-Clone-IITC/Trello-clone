import { Prisma, type Comment } from "@prisma/client";
import { CommentDtoSchema, type CommentDto } from "@ronmordo/types";

export function mapCommentToDto(c: Comment): CommentDto {
  return CommentDtoSchema.parse({
    id: c.id,
    cardId: c.cardId,
    userId: c.userId,
    text: c.text,
    createdAt: c.createdAt.toISOString(),
  });
}

export function mapCommentDtoToCreateInput(
  dto: CommentDto
): Prisma.CommentCreateInput {
  return {
    id: dto.id,
    card: { connect: { id: dto.cardId } },
    user: { connect: { id: dto.userId } },
    text: dto.text,
    createdAt: new Date(dto.createdAt),
  };
}
