import type {
  Prisma,
  $Enums,
  Workspace,
  WorkspaceVisibility,
  WorkspaceType,
  MembershipRestrictions,
  BoardCreationRestrictions,
  BoardSharing,
  SlackSharing,
} from "@prisma/client";
import {
  type CreateWorkspaceInput,
  type WorkspaceDto,
  WorkspaceDtoSchema,
} from "@ronmordo/types";

export function mapWorkspaceToDto(ws: Workspace): WorkspaceDto {
  const dto: WorkspaceDto = {
    id: ws.id,
    name: ws.name,
    description: ws.description,
    visibility: mapVisibility(ws.visibility),
    premium: ws.premium,
    createdAt: ws.createdAt.toISOString(),
    updatedAt: ws.updatedAt.toISOString(),
    type: mapType(ws.type),
    createdBy: ws.createdBy,
    workspaceMembershipRestrictions: mapMembership(
      ws.workspaceMembershipRestrictions
    ),
    publicBoardCreation: mapBoardCreation(ws.publicBoardCreation),
    workspaceBoardCreation: mapBoardCreation(ws.workspaceBoardCreation),
    privateBoardCreation: mapBoardCreation(ws.privateBoardCreation),
    publicBoardDeletion: mapBoardCreation(ws.publicBoardDeletion),
    workspaceBoardDeletion: mapBoardCreation(ws.workspaceBoardDeletion),
    privateBoardDeletion: mapBoardCreation(ws.privateBoardDeletion),
    allowGuestSharing: mapBoardSharing(ws.allowGuestSharing),
    allowSlackIntegration: mapSlack(ws.allowSlackIntegration),
  };
  return WorkspaceDtoSchema.parse(dto);
}

// --- ENUM HELPERS ---
function mapVisibility(v: WorkspaceVisibility): "private" | "public" {
  return v.toLowerCase() as "private" | "public";
}

function mapType(t: WorkspaceType): WorkspaceTypeDto {
  return t.replace(/([A-Z])/g, (_, p1, offset) =>
    offset > 0 ? "_" + p1.toLowerCase() : p1.toLowerCase()
  ) as WorkspaceTypeDto;
}

function mapMembership(
  m: MembershipRestrictions
): "anybody" | "specific_domain" {
  return m === "Anybody" ? "anybody" : "specific_domain";
}

function mapBoardCreation(
  b: BoardCreationRestrictions
): "workspace_member" | "workspace_admin" | "nobody" {
  switch (b) {
    case "WorkspaceMember":
      return "workspace_member";
    case "WorkspaceAdmin":
      return "workspace_admin";
    case "Nobody":
      return "nobody";
  }
}

function mapBoardSharing(b: BoardSharing): "anybody" | "only_workspace_member" {
  return b === "Anybody" ? "anybody" : "only_workspace_member";
}

function mapSlack(s: SlackSharing): "workspace_member" | "admins" {
  return s === "WorkspaceMember" ? "workspace_member" : "admins";
}

type WorkspaceTypeDto =
  | "marketing"
  | "sales_crm"
  | "human_resources"
  | "small_business"
  | "engineering_it"
  | "education"
  | "operations"
  | "other";

// ----------From dto to prisma-------------
export function mapWorkspaceDtoToCreateInput(
  dto: CreateWorkspaceInput
): Omit<Prisma.WorkspaceCreateInput, "creator"> {
  return {
    name: dto.name,
    description: dto.description,
    type: mapWorkspaceTypeDto(dto.type),
  };
}

export function mapWorkspaceDtoToUpdateInput(
  dto: Partial<WorkspaceDto>
): Prisma.WorkspaceUpdateInput {
  const updateData: Prisma.WorkspaceUpdateInput = {};

  if (dto.name !== undefined) updateData.name = dto.name;
  if (dto.description !== undefined) updateData.description = dto.description;
  if (dto.type !== undefined) updateData.type = mapWorkspaceTypeDto(dto.type);
  if (dto.visibility !== undefined)
    updateData.visibility = mapWorkspaceVisibilityDto(dto.visibility);
  if (dto.workspaceMembershipRestrictions !== undefined) {
    updateData.workspaceMembershipRestrictions = mapMembershipDto(
      dto.workspaceMembershipRestrictions
    );
  }
  if (dto.publicBoardCreation !== undefined) {
    updateData.publicBoardCreation = mapBoardCreationDto(
      dto.publicBoardCreation
    );
  }
  if (dto.workspaceBoardCreation !== undefined) {
    updateData.workspaceBoardCreation = mapBoardCreationDto(
      dto.workspaceBoardCreation
    );
  }
  if (dto.privateBoardCreation !== undefined) {
    updateData.privateBoardCreation = mapBoardCreationDto(
      dto.privateBoardCreation
    );
  }
  if (dto.publicBoardDeletion !== undefined) {
    updateData.publicBoardDeletion = mapBoardCreationDto(
      dto.publicBoardDeletion
    );
  }
  if (dto.workspaceBoardDeletion !== undefined) {
    updateData.workspaceBoardDeletion = mapBoardCreationDto(
      dto.workspaceBoardDeletion
    );
  }
  if (dto.privateBoardDeletion !== undefined) {
    updateData.privateBoardDeletion = mapBoardCreationDto(
      dto.privateBoardDeletion
    );
  }
  if (dto.allowGuestSharing !== undefined) {
    updateData.allowGuestSharing = mapBoardSharingDto(dto.allowGuestSharing);
  }
  if (dto.allowSlackIntegration !== undefined) {
    updateData.allowSlackIntegration = mapSlackDto(dto.allowSlackIntegration);
  }
  if (dto.premium !== undefined) updateData.premium = dto.premium;

  return updateData;
}

// ---- enum helpers ----
function mapWorkspaceVisibilityDto(
  v: WorkspaceDto["visibility"]
): $Enums.WorkspaceVisibility {
  return v === "private" ? "Private" : "Public";
}

function mapWorkspaceTypeDto(t: WorkspaceDto["type"]): $Enums.WorkspaceType {
  return t
    .split("_")
    .map((s, i) =>
      i === 0
        ? s.charAt(0).toUpperCase() + s.slice(1)
        : s.charAt(0).toUpperCase() + s.slice(1)
    )
    .join("") as $Enums.WorkspaceType;
}

function mapMembershipDto(
  m: WorkspaceDto["workspaceMembershipRestrictions"]
): $Enums.MembershipRestrictions {
  return m === "anybody" ? "Anybody" : "SpecificDomain";
}

function mapBoardCreationDto(
  b: WorkspaceDto["publicBoardCreation"]
): $Enums.BoardCreationRestrictions {
  switch (b) {
    case "workspace_member":
      return "WorkspaceMember";
    case "workspace_admin":
      return "WorkspaceAdmin";
    case "nobody":
      return "Nobody";
  }
}

function mapBoardSharingDto(
  s: WorkspaceDto["allowGuestSharing"]
): $Enums.BoardSharing {
  return s === "anybody" ? "Anybody" : "OnlyWorkspaceMember";
}

function mapSlackDto(
  s: WorkspaceDto["allowSlackIntegration"]
): $Enums.SlackSharing {
  return s === "workspace_member" ? "WorkspaceMember" : "Admins";
}
