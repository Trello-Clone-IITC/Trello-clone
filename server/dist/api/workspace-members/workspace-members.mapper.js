import { Prisma, $Enums } from "@prisma/client";
import { WorkspaceMemberDtoSchema, } from "@ronmordo/contracts";
export function mapWorkspaceMemberToDto(m) {
    const dto = {
        workspaceId: m.workspaceId,
        userId: m.userId,
        role: mapWorkspaceRole(m.role),
        joinedAt: m.joinedAt.toISOString(),
    };
    return WorkspaceMemberDtoSchema.parse(dto);
}
export function mapWorkspaceRole(r) {
    return r.toLowerCase();
}
export function mapWorkspaceMemberDtoToCreateInput(dto) {
    return {
        workspace: { connect: { id: dto.workspaceId } },
        user: { connect: { id: dto.userId } },
        role: mapWorkspaceRoleDto(dto.role),
        joinedAt: new Date(dto.joinedAt),
    };
}
export function mapWorkspaceRoleDto(v) {
    switch (v) {
        case "admin":
            return "Admin";
        case "member":
            return "Member";
        case "guest":
            return "Guest";
    }
}
