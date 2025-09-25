import { type Comment } from "@prisma/client";
import { CommentDtoSchema, type CommentDto } from "@ronmordo/contracts";

export function mapCommentToDto(comment: Comment): CommentDto {
  const dto: CommentDto = {
    id: comment.id,
    cardId: comment.cardId,
    userId: comment.userId,
    text: comment.text,
    createdAt: comment.createdAt.toISOString(),
  };
  return CommentDtoSchema.parse(dto);
}

export function mapCommentDtoToCreateInput(dto: CommentDto): any {
  return {
    id: dto.id,
    card: { connect: { id: dto.cardId } },
    user: { connect: { id: dto.userId } },
    text: dto.text,
    createdAt: new Date(dto.createdAt),
  };
}
