import type {
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
  return t.replace(/([A-Z])/g, "_$1").toLowerCase() as WorkspaceTypeDto;
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
