// cd packages/types
// npm run build
// npm version patch
// npm publish --access=restricted

export type ActivityAction =
  | "Created"
  | "Moved"
  | "Updated"
  | "Commented"
  | "Closed"
  | "Reopened"
  | "Assigned"
  | "Unassigned"
  | "Labeled"
  | "Unlabeled"
  | "Attached"
  | "Detached";

export type BoardCreationRestrictions =
  | "WorkspaceMember"
  | "WorkspaceAdmin"
  | "Nobody";

export type BoardRole = "Admin" | "Member" | "Observer";

export type BoardSharing = "Anybody" | "OnlyWorkspaceMember";

export type BoardVisibility = "Private" | "WorkspaceMembers" | "Public";

export type CommentingRestrictions =
  | "Disabled"
  | "BoardMembers"
  | "WorkspaceMembers";

export type MemberManageRestrictions = "Admins" | "Members";

export type MembershipRestrictions = "Anybody" | "SpecificDomain";

export type SlackSharing = "WorkspaceMember" | "Admins";

export type Theme = "Light" | "Dark" | "System";

export type WorkspaceRole = "Admin" | "Member" | "Guest";

export type WorkspaceType =
  | "Marketing"
  | "SalesCrm"
  | "HumenResources"
  | "SmallBusiness"
  | "EngineeringIt"
  | "Education"
  | "Operations"
  | "Other";

export type WorkspaceVisibility = "Private" | "Public";

export interface ActivityLogDto {
  id: string;
  boardId: string;
  cardId?: string | null;
  userId?: string | null;
  action: ActivityAction;
  payload?: unknown;
  createdAt: string;
}

export interface AttachmentDto {
  id: string;
  cardId: string;
  userId?: string | null;
  url: string;
  filename?: string | null;
  bytes?: number | null;
  meta?: unknown;
  createdAt: string;
}

export interface BoardMemberDto {
  boardId: string;
  userId: string;
  role: BoardRole;
  joinedAt: string;
}

export interface BoardDto {
  id: string;
  workspaceId?: string | null;
  name: string;
  description?: string | null;
  background: string;
  createdBy?: string | null;
  allowCovers: boolean;
  showComplete: boolean;
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string | null;
  visibility: BoardVisibility;
  memberManage: MemberManageRestrictions;
  commenting: CommentingRestrictions;
}

export interface CardAssigneeDto {
  cardId: string;
  userId: string;
}

export interface CardLabelDto {
  cardId: string;
  labelId: string;
}

export interface CardWatcherDto {
  cardId: string;
  userId: string;
  createdAt: string;
}

export interface CardDto {
  id: string;
  listId: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  startDate?: string | null;
  position: number;
  isArchived: boolean;
  createdBy?: string | null;
  coverImageUrl?: string | null;
  subscribed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItemAssigneeDto {
  itemId: string;
  userId: string;
}

export interface ChecklistItemDto {
  id: string;
  checklistId: string;
  text: string;
  isCompleted: boolean;
  dueDate?: string | null;
  position: number;
}

export interface ChecklistDto {
  id: string;
  cardId: string;
  title: string;
  position: number;
}

export interface CommentDto {
  id: string;
  cardId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface LabelDto {
  id: string;
  boardId: string;
  name: string;
  color: string;
}

export interface ListWatcherDto {
  listId: string;
  userId: string;
  createdAt: string;
}

export interface ListDto {
  id: string;
  boardId: string;
  name: string;
  position: number;
  isArchived: boolean;
  subscribed: boolean;
}

export interface UserDto {
  id: string;
  clerkId: string;
  email: string;
  username?: string | null;
  fullName: string;
  avatarUrl: string;
  theme: Theme;
  emailNotification: boolean;
  pushNotification: boolean;
  createdAt: string;
  bio?: string | null;
}

export interface WorkspaceMemberDto {
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  joinedAt: string;
}

export interface WorkspaceDto {
  id: string;
  name: string;
  description?: string | null;
  visibility: WorkspaceVisibility;
  premium: boolean;
  createdAt: string;
  updatedAt: string;
  type: WorkspaceType;
  createdBy: string;
  workspaceMembershipRestrictions: MembershipRestrictions;
  publicBoardCreation: BoardCreationRestrictions;
  workspaceBoardCreation: BoardCreationRestrictions;
  privateBoardCreation: BoardCreationRestrictions;
  publicBoardDeletion: BoardCreationRestrictions;
  workspaceBoardDeletion: BoardCreationRestrictions;
  privateBoardDeletion: BoardCreationRestrictions;
  allowGuestSharing: BoardSharing;
  allowSlackIntegration: SlackSharing;
}

/* =========================
   Relationship-friendly shapes (optional)
   - Useful when your API needs to return nested data
   - Compose base DTOs without hard-coding deep trees
   ========================= */

// A small helper to embed arrays or objects in responses without committing to a single shape
export type With<T, K extends string, V> = T & { [P in K]: V };

/* Examples:

// Board with its labels
export type BoardWithLabelsDto = With<BoardDto, "labels", LabelDto[]>;

// Card with its assignees (just IDs)
export type CardWithAssigneesDto = With<CardDto, "assignees", { userId: string }[]>;

// List with cards (shallow)
export type ListWithCardsDto = With<ListDto, "cards", CardDto[]>;

*/

/* =========================
   Pagination helpers (optional)
   ========================= */

export interface PageMetaDto {
  total: number;
  page: number;
  pageSize: number;
}

export interface PagedDto<T> {
  data: T[];
  meta: PageMetaDto;
}
