/* =========================
   Enum DTOs (wire format, snake_case)
   ========================= */

export type ActivityAction =
  | "created"
  | "moved"
  | "updated"
  | "commented"
  | "closed"
  | "reopened"
  | "assigned"
  | "unassigned"
  | "labeled"
  | "unlabeled"
  | "attached"
  | "detached";

export type BoardCreationRestrictions =
  | "workspace_member"
  | "workspace_admin"
  | "nobody";

export type BoardRole = "admin" | "member" | "observer";

export type BoardSharing = "anybody" | "only_workspace_member";

export type BoardVisibility = "private" | "workspace_members" | "public";

export type CommentingRestrictions =
  | "disabled"
  | "board_members"
  | "workspace_members";

export type MemberManageRestrictions = "admins" | "members";

export type MembershipRestrictions = "anybody" | "specific_domain";

export type SlackSharing = "workspace_member" | "admins";

export type Theme = "light" | "dark" | "system";

export type WorkspaceRole = "admin" | "member" | "guest";

export type WorkspaceType =
  | "marketing"
  | "sales_crm"
  | "humen_resources" // keeping DB value as-is
  | "small_business"
  | "engineering_it"
  | "education"
  | "operations"
  | "other";

export type WorkspaceVisibility = "private" | "public";

/* =========================
   Core DTOs (flat shapes, no nested relations)
   - Use these as the default API payloads
   ========================= */

export interface ActivityLogDto {
  id: string;
  boardId: string;
  cardId?: string | null;
  userId?: string | null;
  action: ActivityAction;
  payload?: unknown; // JSON
  createdAt: string; // ISO date
}

export interface AttachmentDto {
  id: string;
  cardId: string;
  userId?: string | null;
  url: string;
  filename?: string | null;
  bytes?: number | null; // BigInt in DB
  meta?: unknown; // JSON
  createdAt: string; // ISO date
}

export interface BoardMemberDto {
  boardId: string;
  userId: string;
  role: BoardRole;
  joinedAt: string; // ISO date
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
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  lastActivityAt?: string | null; // ISO date
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
  createdAt: string; // ISO date
}

export interface CardDto {
  id: string;
  listId: string;
  title: string;
  description?: string | null;
  dueDate?: string | null; // ISO date
  startDate?: string | null; // ISO date
  position: number; // DECIMAL(16,6)
  isArchived: boolean;
  createdBy?: string | null;
  coverImageUrl?: string | null;
  subscribed: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  // searchDoc is a tsvector; typically not sent over the wire
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
  dueDate?: string | null; // ISO date
  position: number; // DECIMAL(16,6)
}

export interface ChecklistDto {
  id: string;
  cardId: string;
  title: string;
  position: number; // DECIMAL(16,6)
}

export interface CommentDto {
  id: string;
  cardId: string;
  userId: string;
  text: string;
  createdAt: string; // ISO date
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
  createdAt: string; // ISO date
}

export interface ListDto {
  id: string;
  boardId: string;
  name: string;
  position: number; // DECIMAL(16,6)
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
  createdAt: string; // ISO date
  bio?: string | null;
}

export interface WorkspaceMemberDto {
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  joinedAt: string; // ISO date
}

export interface WorkspaceDto {
  id: string;
  name: string;
  description?: string | null;
  visibility: WorkspaceVisibility;
  premium: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
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

/* =========================
   Notes / Conventions
   - All dates are strings (ISO) to be safe over JSON.
   - Numbers used for DECIMAL/BigInt; switch to `string` if you need exact precision.
   - JSON columns are `unknown`; narrow them where you know the shape.
   - Keep DTOs flat by default; compose With<...> types when you need relations.
   ========================= */
