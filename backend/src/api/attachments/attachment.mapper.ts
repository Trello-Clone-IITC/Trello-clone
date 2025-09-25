import { Prisma, type Attachment } from "@prisma/client";
import { AttachmentDtoSchema, type AttachmentDto } from "@ronmordo/contracts";

export function mapAttachmentToDto(att: Attachment): AttachmentDto {
  const dto: AttachmentDto = {
    id: att.id,
    cardId: att.cardId,
    userId: att.userId ?? null,
    url: att.url,
    filename: att.filename ?? null,
    bytes: att.bytes ? Number(att.bytes) : null,
    meta: att.meta as Prisma.InputJsonValue | null,
    createdAt: att.createdAt.toISOString(),
  };
  return AttachmentDtoSchema.parse(dto);
}

export function mapAttachmentDtoToCreateInput(
  dto: AttachmentDto
): Prisma.AttachmentCreateInput {
  return {
    id: dto.id,
    card: { connect: { id: dto.cardId } },
    user: { connect: { id: dto.userId } },
    url: dto.url,
    filename: dto.filename ?? undefined,
    bytes: dto.bytes ? BigInt(dto.bytes) : undefined,
    meta: dto.meta as Prisma.InputJsonValue | undefined,
    createdAt: new Date(dto.createdAt),
  };
}
