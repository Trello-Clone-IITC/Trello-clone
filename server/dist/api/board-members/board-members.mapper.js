import { Prisma, $Enums } from "@prisma/client";
import { BoardMemberDtoSchema, } from "@ronmordo/contracts";
export function mapBoardMemberToDto(member) {
    const dto = {
        boardId: member.boardId,
        userId: member.userId,
        role: mapBoardRole(member.role),
        joinedAt: member.joinedAt.toISOString(),
    };
    return BoardMemberDtoSchema.parse(dto);
}
function mapBoardRole(r) {
    return r.toLowerCase();
}
export function mapBoardMemberDtoToCreateInput(dto, boardId) {
    return {
        board: { connect: { id: boardId } },
        user: { connect: { id: dto.userId } },
        role: mapBoardRoleDto(dto.role),
    };
}
export function mapBoardRoleDto(v) {
    switch (v) {
        case "admin":
            return "Admin";
        case "member":
            return "Member";
        case "observer":
            return "Observer";
    }
}
