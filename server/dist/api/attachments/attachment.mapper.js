import { Prisma } from "@prisma/client";
import { AttachmentDtoSchema } from "@ronmordo/contracts";
export function mapAttachmentToDto(att) {
    const dto = {
        id: att.id,
        cardId: att.cardId,
        userId: att.userId ?? null,
        url: att.url,
        filename: att.filename ?? null,
        bytes: att.bytes ? Number(att.bytes) : null,
        meta: att.meta,
        createdAt: att.createdAt.toISOString(),
    };
    return AttachmentDtoSchema.parse(dto);
}
export function mapAttachmentDtoToCreateInput(dto) {
    return {
        id: dto.id,
        card: { connect: { id: dto.cardId } },
        user: { connect: { id: dto.userId } },
        url: dto.url,
        filename: dto.filename ?? undefined,
        bytes: dto.bytes ? BigInt(dto.bytes) : undefined,
        meta: dto.meta,
        createdAt: new Date(dto.createdAt),
    };
}
