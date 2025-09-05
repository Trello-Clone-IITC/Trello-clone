// // cd packages/types
// // npm run build
// // npm version patch
// // npm publish --access=restricted

// export type ActivityAction =
//   | "created"
//   | "moved"
//   | "updated"
//   | "commented"
//   | "closed"
//   | "reopened"
//   | "assigned"
//   | "unassigned"
//   | "labeled"
//   | "unlabeled"
//   | "attached"
//   | "detached";

// export type BoardCreationRestrictions =
//   | "workspace_member"
//   | "workspace_admin"
//   | "nobody";

// export type BoardRole = "admin" | "member" | "observer";

// export type BoardSharing = "anybody" | "only_workspace_member";

// export type BoardVisibility = "private" | "workspace_members" | "public";

// export type CommentingRestrictions =
//   | "disabled"
//   | "board_members"
//   | "workspace_members";

// export type MemberManageRestrictions = "admins" | "members";

// export type MembershipRestrictions = "anybody" | "specific_domain";

// export type SlackSharing = "workspace_member" | "admins";

// export type Theme = "light" | "dark" | "system";

// export type WorkspaceRole = "admin" | "member" | "guest";

// export type WorkspaceType =
//   | "marketing"
//   | "sales_crm"
//   | "human_resources"
//   | "small_business"
//   | "engineering_it"
//   | "education"
//   | "operations"
//   | "other";

// export type WorkspaceVisibility = "private" | "public";

// export interface ActivityLogDto {
//   id: string;
//   boardId: string;
//   cardId?: string | null;
//   userId?: string | null;
//   action: ActivityAction;
//   payload?: unknown;
//   createdAt: string;
// }

// export interface AttachmentDto {
//   id: string;
//   cardId: string;
//   userId?: string | null;
//   url: string;
//   filename?: string | null;
//   bytes?: number | null;
//   meta?: unknown;
//   createdAt: string;
// }

// export interface BoardMemberDto {
//   boardId: string;
//   userId: string;
//   role: BoardRole;
//   joinedAt: string;
// }

// export interface BoardDto {
//   id: string;
//   workspaceId?: string | null;
//   name: string;
//   description?: string | null;
//   background: string;
//   createdBy?: string | null;
//   allowCovers: boolean;
//   showComplete: boolean;
//   createdAt: string;
//   updatedAt: string;
//   lastActivityAt?: string | null;
//   visibility: BoardVisibility;
//   memberManage: MemberManageRestrictions;
//   commenting: CommentingRestrictions;
// }

// export interface CardAssigneeDto {
//   cardId: string;
//   userId: string;
// }

// export interface CardLabelDto {
//   cardId: string;
//   labelId: string;
// }

// export interface CardWatcherDto {
//   cardId: string;
//   userId: string;
//   createdAt: string;
// }

// export interface CardDto {
//   id: string;
//   listId: string;
//   title: string;
//   description?: string | null;
//   dueDate?: string | null;
//   startDate?: string | null;
//   position: number;
//   isArchived: boolean;
//   createdBy?: string | null;
//   coverImageUrl?: string | null;
//   subscribed: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface ChecklistItemAssigneeDto {
//   itemId: string;
//   userId: string;
// }

// export interface ChecklistItemDto {
//   id: string;
//   checklistId: string;
//   text: string;
//   isCompleted: boolean;
//   dueDate?: string | null;
//   position: number;
// }

// export interface ChecklistDto {
//   id: string;
//   cardId: string;
//   title: string;
//   position: number;
// }

// export interface CommentDto {
//   id: string;
//   cardId: string;
//   userId: string;
//   text: string;
//   createdAt: string;
// }

// export interface LabelDto {
//   id: string;
//   boardId: string;
//   name: string;
//   color: string;
// }

// export interface ListWatcherDto {
//   listId: string;
//   userId: string;
//   createdAt: string;
// }

// export interface ListDto {
//   id: string;
//   boardId: string;
//   name: string;
//   position: number;
//   isArchived: boolean;
//   subscribed: boolean;
// }

// export interface UserDto {
//   id: string;
//   clerkId: string;
//   email: string;
//   username?: string | null;
//   fullName: string;
//   avatarUrl: string;
//   theme: Theme;
//   emailNotification: boolean;
//   pushNotification: boolean;
//   createdAt: string;
//   bio?: string | null;
// }

// export interface WorkspaceMemberDto {
//   workspaceId: string;
//   userId: string;
//   role: WorkspaceRole;
//   joinedAt: string;
// }

// export interface WorkspaceDto {
//   id: string;
//   name: string;
//   description?: string | null;
//   visibility: WorkspaceVisibility;
//   premium: boolean;
//   createdAt: string;
//   updatedAt: string;
//   type: WorkspaceType;
//   createdBy: string;
//   workspaceMembershipRestrictions: MembershipRestrictions;
//   publicBoardCreation: BoardCreationRestrictions;
//   workspaceBoardCreation: BoardCreationRestrictions;
//   privateBoardCreation: BoardCreationRestrictions;
//   publicBoardDeletion: BoardCreationRestrictions;
//   workspaceBoardDeletion: BoardCreationRestrictions;
//   privateBoardDeletion: BoardCreationRestrictions;
//   allowGuestSharing: BoardSharing;
//   allowSlackIntegration: SlackSharing;
// }

// // A small helper to embed arrays or objects in responses without committing to a single shape
// export type With<T, K extends string, V> = T & { [P in K]: V };
