import {} from "@prisma/client";
import { CommentDtoSchema } from "@ronmordo/contracts";
export function mapCommentToDto(comment) {
    const dto = {
        id: comment.id,
        cardId: comment.cardId,
        userId: comment.userId,
        text: comment.text,
        createdAt: comment.createdAt.toISOString(),
    };
    return CommentDtoSchema.parse(dto);
}
export function mapCommentDtoToCreateInput(dto) {
    return {
        id: dto.id,
        card: { connect: { id: dto.cardId } },
        user: { connect: { id: dto.userId } },
        text: dto.text,
        createdAt: new Date(dto.createdAt),
    };
}
