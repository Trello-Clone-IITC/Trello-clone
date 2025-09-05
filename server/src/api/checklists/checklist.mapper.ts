import { Prisma, type Checklist } from "@prisma/client";
import { ChecklistDtoSchema, type ChecklistDto } from "@ronmordo/types";

export function mapChecklistToDto(cl: Checklist): ChecklistDto {
  return ChecklistDtoSchema.parse({
    id: cl.id,
    cardId: cl.cardId,
    title: cl.title,
    position: Number(cl.position),
  });
}

export function mapChecklistDtoToCreateInput(
  dto: ChecklistDto
): Prisma.ChecklistCreateInput {
  return {
    id: dto.id,
    card: { connect: { id: dto.cardId } },
    title: dto.title,
    position: new Prisma.Decimal(dto.position),
  };
}
