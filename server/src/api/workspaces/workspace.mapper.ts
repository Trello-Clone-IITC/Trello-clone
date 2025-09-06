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
import { type WorkspaceDto, WorkspaceDtoSchema } from "@ronmordo/types";

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
  dto: WorkspaceDto
): Prisma.WorkspaceCreateInput {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? undefined,
    visibility: mapWorkspaceVisibilityDto(dto.visibility),
    premium: dto.premium,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    type: mapWorkspaceTypeDto(dto.type),
    creator: { connect: { id: dto.createdBy } },
    workspaceMembershipRestrictions: mapMembershipDto(
      dto.workspaceMembershipRestrictions
    ),
    publicBoardCreation: mapBoardCreationDto(dto.publicBoardCreation),
    workspaceBoardCreation: mapBoardCreationDto(dto.workspaceBoardCreation),
    privateBoardCreation: mapBoardCreationDto(dto.privateBoardCreation),
    publicBoardDeletion: mapBoardCreationDto(dto.publicBoardDeletion),
    workspaceBoardDeletion: mapBoardCreationDto(dto.workspaceBoardDeletion),
    privateBoardDeletion: mapBoardCreationDto(dto.privateBoardDeletion),
    allowGuestSharing: mapBoardSharingDto(dto.allowGuestSharing),
    allowSlackIntegration: mapSlackDto(dto.allowSlackIntegration),
  };
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
