import { Prisma, type WorkspaceMember, $Enums } from "@prisma/client";
import {
  WorkspaceMemberDtoSchema,
  type WorkspaceMemberDto,
} from "@ronmordo/types";

export function mapWorkspaceMemberToDto(
  m: WorkspaceMember
): WorkspaceMemberDto {
  const dto: WorkspaceMemberDto = {
    workspaceId: m.workspaceId,
    userId: m.userId,
    role: mapWorkspaceRole(m.role),
    joinedAt: m.joinedAt.toISOString(),
  };
  return WorkspaceMemberDtoSchema.parse(dto);
}

function mapWorkspaceRole(r: $Enums.WorkspaceRole): WorkspaceMemberDto["role"] {
  return r.toLowerCase() as WorkspaceMemberDto["role"];
}

export function mapWorkspaceMemberDtoToCreateInput(
  dto: WorkspaceMemberDto
): Prisma.WorkspaceMemberCreateInput {
  return {
    workspace: { connect: { id: dto.workspaceId } },
    user: { connect: { id: dto.userId } },
    role: mapWorkspaceRoleDto(dto.role),
    joinedAt: new Date(dto.joinedAt),
  };
}

function mapWorkspaceRoleDto(
  v: WorkspaceMemberDto["role"]
): $Enums.WorkspaceRole {
  switch (v) {
    case "admin":
      return "Admin";
    case "member":
      return "Member";
    case "guest":
      return "Guest";
  }
}
