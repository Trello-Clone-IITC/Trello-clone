import type { Request } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";

export type IdParams = {
  id: string;
};

export interface AuthenticatedRequest<
  Params = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: {
    id: string;
    email: string;
    clerk_id: string;
  };
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  data?: T;
  message?: string;
}

// Custom ENUM types matching the database schema
export type BoardRole = "admin" | "member" | "observer";
export type BoardVisibility = "private" | "workspace_members" | "public";
export type MemberManageRestrictions = "members" | "admins" | "owners";
export type CommentingRestrictions =
  | "board_members"
  | "workspace_members"
  | "anybody";
export type WorkspaceRole = "owner" | "admin" | "member";
export type WorkspaceVisibility = "private" | "team" | "public";
export type WorkspaceType =
  | "other"
  | "small_business"
  | "enterprise"
  | "team"
  | "marketing"
  | "product"
  | "engineering"
  | "sales"
  | "hr"
  | "operations";
export type MembershipRestrictions =
  | "anybody"
  | "workspace_member"
  | "admin_only";
export type BoardCreationRestrictions =
  | "workspace_member"
  | "admin_only"
  | "owner_only";
export type BoardSharing = "anybody" | "workspace_member" | "admin_only";
export type SlackSharing = "workspace_member" | "admin_only" | "owner_only";
export type Theme = "system" | "light" | "dark";

// Updated User interface matching new schema
export interface User {
  id: string;
  clerk_id: string;
  email: string;
  username: string | null;
  full_name: string;
  avatar_url: string;
  theme: Theme;
  email_notification: boolean;
  push_notification: boolean;
  created_at: Date;
  bio: string | null;
}

// Updated Workspace interface matching new schema
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  visibility: WorkspaceVisibility;
  premium: boolean;
  created_at: Date;
  updated_at: Date;
  type: WorkspaceType;
  created_by: string;
  workspace_membership_restrictions: MembershipRestrictions;
  public_board_creation: BoardCreationRestrictions;
  workspace_board_creation: BoardCreationRestrictions;
  private_board_creation: BoardCreationRestrictions;
  public_board_deletion: BoardCreationRestrictions;
  workspace_board_deletion: BoardCreationRestrictions;
  private_board_deletion: BoardCreationRestrictions;
  allow_guest_sharing: BoardSharing;
  allow_slack_integration: SlackSharing;
}

// New WorkspaceMember interface
export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: WorkspaceRole;
  joined_at: Date;
}

// Updated Board interface matching new schema
export interface Board {
  id: string;
  workspace_id?: string;
  name: string;
  description?: string;
  background: string;
  created_by?: string;
  allow_covers: boolean;
  show_complete: boolean;
  created_at: Date;
  updated_at: Date;
  last_activity_at?: Date;
  visibility: BoardVisibility;
  member_manage: MemberManageRestrictions;
  commenting: CommentingRestrictions;
}

// New BoardMember interface
export interface BoardMember {
  board_id: string;
  user_id: string;
  role: BoardRole;
  joined_at: Date;
}

// New List interface
export interface List {
  id: string;
  board_id: string;
  name: string;
  position: number;
  is_archived: boolean;
  subscribed: boolean;
}

// New ListWatcher interface
export interface ListWatcher {
  list_id: string;
  user_id: string;
  created_at: Date;
}

// Extended interfaces for API responses
export interface UserWithWorkspaces extends User {
  workspaces?: WorkspaceMember[];
}

export interface WorkspaceWithMembers extends Workspace {
  members?: WorkspaceMember[];
  boards?: Board[];
}

export interface BoardWithMembers extends Board {
  members?: BoardMember[];
  lists?: List[];
}

export interface ListWithWatchers extends List {
  watchers?: ListWatcher[];
}

/*
 * WHAT HAS BEEN IMPLEMENTED:
 *
 * Updated TypeScript interfaces and types for the Trello clone application:
 * - All types now match the comprehensive database schema exactly
 * - Added custom ENUM types for roles, permissions, and restrictions
 * - Updated User interface with Clerk integration, theme preferences, and notifications
 * - Updated Workspace interface with comprehensive permission controls
 * - Added new interfaces for WorkspaceMember, BoardMember, List, and ListWatcher
 * - Extended interfaces for API responses with related data
 * - Proper typing for all custom ENUM values
 *
 * These types ensure type safety across the entire application and provide
 * consistent data structures that match the database schema exactly.
 */
