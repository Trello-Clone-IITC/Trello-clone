import { z } from "zod";

// ==========================
// ENUM SCHEMAS
// ==========================
export const ActivityActionSchema = z.enum([
  "created",
  "moved",
  "updated",
  "commented",
  "closed",
  "reopened",
  "assigned",
  "unassigned",
  "labeled",
  "unlabeled",
  "attached",
  "detached",
]);

export const BoardCreationRestrictionsSchema = z.enum([
  "workspace_member",
  "workspace_admin",
  "nobody",
]);

export const BoardRoleSchema = z.enum(["admin", "member", "observer"]);

export const BoardSharingSchema = z.enum(["anybody", "only_workspace_member"]);

export const BoardVisibilitySchema = z.enum([
  "private",
  "workspace_members",
  "public",
]);

export const CommentingRestrictionsSchema = z.enum([
  "disabled",
  "board_members",
  "workspace_members",
]);

export const MemberManageRestrictionsSchema = z.enum(["admins", "members"]);

export const MembershipRestrictionsSchema = z.enum([
  "anybody",
  "specific_domain",
]);

export const SlackSharingSchema = z.enum(["workspace_member", "admins"]);

export const ThemeSchema = z.enum(["light", "dark", "system"]);

export const WorkspaceRoleSchema = z.enum(["admin", "member", "guest"]);

export const WorkspaceTypeSchema = z.enum([
  "marketing",
  "sales_crm",
  "human_resources",
  "small_business",
  "engineering_it",
  "education",
  "operations",
  "other",
]);

export const WorkspaceVisibilitySchema = z.enum(["private", "public"]);

// ==========================
// BASE DTO SCHEMAS
// ==========================
export const ActivityLogDtoSchema = z.object({
  id: z.uuid(),
  boardId: z.uuid(),
  cardId: z.uuid().nullable().optional(),
  userId: z.uuid().nullable().optional(),
  action: ActivityActionSchema,
  payload: z.unknown().optional(),
  createdAt: z.iso.datetime(),
});

export const AttachmentDtoSchema = z.object({
  id: z.uuid(),
  cardId: z.uuid(),
  userId: z.uuid().nullable().optional(),
  url: z.string(),
  filename: z.string().nullable().optional(),
  bytes: z.number().nullable().optional(),
  meta: z.unknown().optional(),
  createdAt: z.iso.datetime(),
});

export const BoardMemberDtoSchema = z.object({
  boardId: z.uuid(),
  userId: z.uuid(),
  role: BoardRoleSchema,
  joinedAt: z.iso.datetime(),
});

export const BoardDtoSchema = z.object({
  id: z.uuid(),
  workspaceId: z.uuid().nullable().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
  background: z.string(),
  createdBy: z.uuid().nullable().optional(),
  allowCovers: z.boolean(),
  showComplete: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  lastActivityAt: z.iso.datetime().nullable().optional(),
  visibility: BoardVisibilitySchema,
  memberManage: MemberManageRestrictionsSchema,
  commenting: CommentingRestrictionsSchema,
});

export const CardAssigneeDtoSchema = z.object({
  cardId: z.uuid(),
  userId: z.uuid(),
});

export const CardLabelDtoSchema = z.object({
  cardId: z.uuid(),
  labelId: z.uuid(),
});

export const CardWatcherDtoSchema = z.object({
  cardId: z.uuid(),
  userId: z.uuid(),
  createdAt: z.iso.datetime(),
});

export const CardDtoSchema = z.object({
  id: z.uuid(),
  listId: z.uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  dueDate: z.iso.datetime().nullable().optional(),
  startDate: z.iso.datetime().nullable().optional(),
  position: z.number(),
  isArchived: z.boolean(),
  createdBy: z.uuid().nullable().optional(),
  coverImageUrl: z.string().nullable().optional(),
  subscribed: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const ChecklistItemAssigneeDtoSchema = z.object({
  itemId: z.uuid(),
  userId: z.uuid(),
});

export const ChecklistItemDtoSchema = z.object({
  id: z.uuid(),
  checklistId: z.uuid(),
  text: z.string(),
  isCompleted: z.boolean(),
  dueDate: z.iso.datetime().nullable().optional(),
  position: z.number(),
});

export const ChecklistDtoSchema = z.object({
  id: z.uuid(),
  cardId: z.uuid(),
  title: z.string(),
  position: z.number(),
});

export const CommentDtoSchema = z.object({
  id: z.string().uuid(),
  cardId: z.string().uuid(),
  userId: z.string().uuid(),
  text: z.string(),
  createdAt: z.iso.datetime(),
});

export const LabelDtoSchema = z.object({
  id: z.uuid(),
  boardId: z.uuid(),
  name: z.string(),
  color: z.string(),
});

export const ListWatcherDtoSchema = z.object({
  listId: z.uuid(),
  userId: z.uuid(),
  createdAt: z.iso.datetime(),
});

export const ListDtoSchema = z.object({
  id: z.uuid(),
  boardId: z.uuid(),
  name: z.string(),
  position: z.number(),
  isArchived: z.boolean(),
  subscribed: z.boolean(),
});

export const UserDtoSchema = z.object({
  id: z.uuid(),
  clerkId: z.string(),
  email: z.email(),
  username: z.string().nullable().optional(),
  fullName: z.string(),
  avatarUrl: z.string(),
  theme: ThemeSchema,
  emailNotification: z.boolean(),
  pushNotification: z.boolean(),
  createdAt: z.iso.datetime(),
  bio: z.string().nullable().optional(),
});

export const WorkspaceMemberDtoSchema = z.object({
  workspaceId: z.uuid(),
  userId: z.uuid(),
  role: WorkspaceRoleSchema,
  joinedAt: z.iso.datetime(),
});

export const WorkspaceDtoSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  visibility: WorkspaceVisibilitySchema,
  premium: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  type: WorkspaceTypeSchema,
  createdBy: z.uuid(),
  workspaceMembershipRestrictions: MembershipRestrictionsSchema,
  publicBoardCreation: BoardCreationRestrictionsSchema,
  workspaceBoardCreation: BoardCreationRestrictionsSchema,
  privateBoardCreation: BoardCreationRestrictionsSchema,
  publicBoardDeletion: BoardCreationRestrictionsSchema,
  workspaceBoardDeletion: BoardCreationRestrictionsSchema,
  privateBoardDeletion: BoardCreationRestrictionsSchema,
  allowGuestSharing: BoardSharingSchema,
  allowSlackIntegration: SlackSharingSchema,
});

// ==========================
// COMPOSED DTO SCHEMAS
// ==========================

// Board
export const BoardWithLabelsSchema = BoardDtoSchema.extend({
  labels: z.array(LabelDtoSchema),
});

export const BoardWithListsSchema = BoardDtoSchema.extend({
  lists: z.array(ListDtoSchema),
});

export const BoardWithMembersSchema = BoardDtoSchema.extend({
  members: z.array(BoardMemberDtoSchema.extend({ user: UserDtoSchema })),
});

export const BoardWithCreatorSchema = BoardDtoSchema.extend({
  creator: UserDtoSchema.nullable(),
});

export const BoardWithWorkspaceSchema = BoardDtoSchema.extend({
  workspace: WorkspaceDtoSchema.nullable(),
});

export const ListWithCardsSchema = ListDtoSchema.extend({
  cards: z.array(CardDtoSchema),
});

export const BoardWithListsAndCardsSchema = BoardDtoSchema.extend({
  lists: z.array(ListWithCardsSchema),
});

export const BoardFullDtoSchema = BoardDtoSchema.extend({
  labels: z.array(LabelDtoSchema),
  members: z.array(BoardMemberDtoSchema.extend({ user: UserDtoSchema })),
  lists: z.array(
    ListDtoSchema.extend({
      watchers: z.array(ListWatcherDtoSchema),
      cards: z.array(CardDtoSchema),
    })
  ),
  creator: UserDtoSchema.nullable(),
  workspace: WorkspaceDtoSchema.nullable(),
});

// List
export const ListWithWatchersIdsSchema = ListDtoSchema.extend({
  watchers: z.array(ListWatcherDtoSchema),
});

export const ListWithWatchersSchema = ListDtoSchema.extend({
  watchers: z.array(ListWatcherDtoSchema.extend({ user: UserDtoSchema })),
});

export const ListWithCardsAndWatchersSchema = ListWithCardsSchema.extend({
  watchers: z.array(ListWatcherDtoSchema),
});

// Card
export const CardWithAttachmentsSchema = CardDtoSchema.extend({
  attachments: z.array(
    AttachmentDtoSchema.extend({ user: UserDtoSchema.nullable() })
  ),
});

export const CardWithAssigneesIdsSchema = CardDtoSchema.extend({
  assignees: z.array(CardAssigneeDtoSchema.pick({ userId: true })),
});

export const CardWithAssigneesSchema = CardDtoSchema.extend({
  assignees: z.array(CardAssigneeDtoSchema.extend({ user: UserDtoSchema })),
});

export const CardWithLabelsIdsSchema = CardDtoSchema.extend({
  cardLabels: z.array(CardLabelDtoSchema),
});

export const CardWithLabelsSchema = CardDtoSchema.extend({
  cardLabels: z.array(CardLabelDtoSchema.extend({ label: LabelDtoSchema })),
});

export const ChecklistItemWithAssigneesSchema = ChecklistItemDtoSchema.extend({
  assignees: z.array(
    ChecklistItemAssigneeDtoSchema.extend({ user: UserDtoSchema })
  ),
});

export const ChecklistWithItemsSchema = ChecklistDtoSchema.extend({
  items: z.array(ChecklistItemDtoSchema),
});

export const ChecklistWithItemsAndAssigneesSchema = ChecklistDtoSchema.extend({
  items: z.array(ChecklistItemWithAssigneesSchema),
});

export const CardWithChecklistsSchema = CardDtoSchema.extend({
  checklists: z.array(ChecklistDtoSchema),
});

export const CardWithChecklistsDeepSchema = CardDtoSchema.extend({
  checklists: z.array(ChecklistWithItemsAndAssigneesSchema),
});

export const CommentWithUserSchema = CommentDtoSchema.extend({
  user: UserDtoSchema,
});

export const CardWithCommentsSchema = CardDtoSchema.extend({
  comments: z.array(CommentWithUserSchema),
});

export const CardWithWatchersIdsSchema = CardDtoSchema.extend({
  watchers: z.array(CardWatcherDtoSchema),
});

export const CardWithWatchersSchema = CardDtoSchema.extend({
  watchers: z.array(CardWatcherDtoSchema.extend({ user: UserDtoSchema })),
});

export const CardWithCreatorSchema = CardDtoSchema.extend({
  creator: UserDtoSchema.nullable(),
});

export const CardWithListSchema = CardDtoSchema.extend({
  list: ListDtoSchema,
});

export const CardFullDtoSchema = CardDtoSchema.extend({
  attachments: z.array(
    AttachmentDtoSchema.extend({ user: UserDtoSchema.nullable() })
  ),
  assignees: z.array(CardAssigneeDtoSchema.extend({ user: UserDtoSchema })),
  cardLabels: z.array(CardLabelDtoSchema.extend({ label: LabelDtoSchema })),
  comments: z.array(CommentWithUserSchema),
  checklists: z.array(ChecklistWithItemsAndAssigneesSchema),
  watchers: z.array(CardWatcherDtoSchema.extend({ user: UserDtoSchema })),
  creator: UserDtoSchema.nullable(),
  list: ListDtoSchema,
});

// Label
export const LabelWithBoardSchema = LabelDtoSchema.extend({
  board: BoardDtoSchema,
});

// Attachment
export const AttachmentWithCardAndUserSchema = AttachmentDtoSchema.extend({
  card: CardDtoSchema,
  user: UserDtoSchema.nullable(),
});

// ActivityLog
export const ActivityLogWithBoardSchema = ActivityLogDtoSchema.extend({
  board: BoardDtoSchema,
});

export const ActivityLogWithCardSchema = ActivityLogDtoSchema.extend({
  card: CardDtoSchema.nullable(),
});

export const ActivityLogWithUserSchema = ActivityLogDtoSchema.extend({
  user: UserDtoSchema.nullable(),
});

export const ActivityLogFullSchema = ActivityLogDtoSchema.extend({
  board: BoardDtoSchema,
  card: CardDtoSchema.nullable(),
  user: UserDtoSchema.nullable(),
});

// User
export const UserWithCreatedBoardsSchema = UserDtoSchema.extend({
  boards: z.array(BoardDtoSchema),
});

export const UserWithBoardMembershipsSchema = UserDtoSchema.extend({
  boardMembers: z.array(BoardMemberDtoSchema.extend({ board: BoardDtoSchema })),
});

export const UserWithCreatedWorkspacesSchema = UserDtoSchema.extend({
  workspaces: z.array(WorkspaceDtoSchema),
});

export const UserWithWorkspaceMembershipsSchema = UserDtoSchema.extend({
  workspaceMembers: z.array(
    WorkspaceMemberDtoSchema.extend({ workspace: WorkspaceDtoSchema })
  ),
});

export const UserWithCardAssignmentsIdsSchema = UserDtoSchema.extend({
  cardAssignees: z.array(CardAssigneeDtoSchema),
});

export const UserWithCardAssignmentsSchema = UserDtoSchema.extend({
  cardAssignees: z.array(CardAssigneeDtoSchema.extend({ card: CardDtoSchema })),
});

export const UserWithWatchlistsSchema = UserDtoSchema.extend({
  listWatchers: z.array(ListWatcherDtoSchema.extend({ list: ListDtoSchema })),
});

export const UserWithCardWatchersSchema = UserDtoSchema.extend({
  cardWatchers: z.array(CardWatcherDtoSchema.extend({ card: CardDtoSchema })),
});

export const UserFullDtoSchema = UserDtoSchema.extend({
  boards: z.array(BoardDtoSchema),
  boardMembers: z.array(BoardMemberDtoSchema.extend({ board: BoardDtoSchema })),
  workspaces: z.array(WorkspaceDtoSchema),
  workspaceMembers: z.array(
    WorkspaceMemberDtoSchema.extend({ workspace: WorkspaceDtoSchema })
  ),
  cardAssignees: z.array(CardAssigneeDtoSchema.extend({ card: CardDtoSchema })),
  listWatchers: z.array(ListWatcherDtoSchema.extend({ list: ListDtoSchema })),
  cardWatchers: z.array(CardWatcherDtoSchema.extend({ card: CardDtoSchema })),
});

// Workspace
export const WorkspaceWithMembersSchema = WorkspaceDtoSchema.extend({
  workspaceMembers: z.array(
    WorkspaceMemberDtoSchema.extend({ user: UserDtoSchema })
  ),
});

export const WorkspaceWithBoardsSchema = WorkspaceDtoSchema.extend({
  boards: z.array(BoardDtoSchema),
});

export const WorkspaceWithCreatorSchema = WorkspaceDtoSchema.extend({
  creator: UserDtoSchema,
});

export const WorkspaceFullDtoSchema = WorkspaceDtoSchema.extend({
  workspaceMembers: z.array(
    WorkspaceMemberDtoSchema.extend({ user: UserDtoSchema })
  ),
  boards: z.array(BoardDtoSchema),
  creator: UserDtoSchema,
});

// ==========================
// TYPES FROM SCHEMAS
// ==========================
export type ActivityLogDto = z.infer<typeof ActivityLogDtoSchema>;
export type AttachmentDto = z.infer<typeof AttachmentDtoSchema>;
export type BoardDto = z.infer<typeof BoardDtoSchema>;
export type BoardMemberDto = z.infer<typeof BoardMemberDtoSchema>;
export type CardDto = z.infer<typeof CardDtoSchema>;
export type CardAssigneeDto = z.infer<typeof CardAssigneeDtoSchema>;
export type CardLabelDto = z.infer<typeof CardLabelDtoSchema>;
export type CardWatcherDto = z.infer<typeof CardWatcherDtoSchema>;
export type ChecklistDto = z.infer<typeof ChecklistDtoSchema>;
export type ChecklistItemDto = z.infer<typeof ChecklistItemDtoSchema>;
export type ChecklistItemAssigneeDto = z.infer<
  typeof ChecklistItemAssigneeDtoSchema
>;
export type CommentDto = z.infer<typeof CommentDtoSchema>;
export type LabelDto = z.infer<typeof LabelDtoSchema>;
export type ListDto = z.infer<typeof ListDtoSchema>;
export type ListWatcherDto = z.infer<typeof ListWatcherDtoSchema>;
export type UserDto = z.infer<typeof UserDtoSchema>;
export type WorkspaceDto = z.infer<typeof WorkspaceDtoSchema>;
export type WorkspaceMemberDto = z.infer<typeof WorkspaceMemberDtoSchema>;

// ==========================
// COMPLEX TYPES FROM SCHEMAS
// ==========================

// Board
export type BoardWithLabelsDto = z.infer<typeof BoardWithLabelsSchema>;
export type BoardWithListsDto = z.infer<typeof BoardWithListsSchema>;
export type BoardWithMembersDto = z.infer<typeof BoardWithMembersSchema>;
export type BoardWithCreatorDto = z.infer<typeof BoardWithCreatorSchema>;
export type BoardWithWorkspaceDto = z.infer<typeof BoardWithWorkspaceSchema>;
export type ListWithCardsDto = z.infer<typeof ListWithCardsSchema>;
export type BoardWithListsAndCardsDto = z.infer<
  typeof BoardWithListsAndCardsSchema
>;
export type BoardFullDto = z.infer<typeof BoardFullDtoSchema>;

// List
export type ListWithWatchersIdsDto = z.infer<typeof ListWithWatchersIdsSchema>;
export type ListWithWatchersDto = z.infer<typeof ListWithWatchersSchema>;
export type ListWithCardsAndWatchersDto = z.infer<
  typeof ListWithCardsAndWatchersSchema
>;

// Card
export type CardWithAttachmentsDto = z.infer<typeof CardWithAttachmentsSchema>;
export type CardWithAssigneesIdsDto = z.infer<
  typeof CardWithAssigneesIdsSchema
>;
export type CardWithAssigneesDto = z.infer<typeof CardWithAssigneesSchema>;
export type CardWithLabelsIdsDto = z.infer<typeof CardWithLabelsIdsSchema>;
export type CardWithLabelsDto = z.infer<typeof CardWithLabelsSchema>;
export type ChecklistItemWithAssigneesDto = z.infer<
  typeof ChecklistItemWithAssigneesSchema
>;
export type ChecklistWithItemsDto = z.infer<typeof ChecklistWithItemsSchema>;
export type ChecklistWithItemsAndAssigneesDto = z.infer<
  typeof ChecklistWithItemsAndAssigneesSchema
>;
export type CardWithChecklistsDto = z.infer<typeof CardWithChecklistsSchema>;
export type CardWithChecklistsDeepDto = z.infer<
  typeof CardWithChecklistsDeepSchema
>;
export type CommentWithUserDto = z.infer<typeof CommentWithUserSchema>;
export type CardWithCommentsDto = z.infer<typeof CardWithCommentsSchema>;
export type CardWithWatchersIdsDto = z.infer<typeof CardWithWatchersIdsSchema>;
export type CardWithWatchersDto = z.infer<typeof CardWithWatchersSchema>;
export type CardWithCreatorDto = z.infer<typeof CardWithCreatorSchema>;
export type CardWithListDto = z.infer<typeof CardWithListSchema>;
export type CardFullDto = z.infer<typeof CardFullDtoSchema>;

// Label
export type LabelWithBoardDto = z.infer<typeof LabelWithBoardSchema>;

// Attachment
export type AttachmentWithCardAndUserDto = z.infer<
  typeof AttachmentWithCardAndUserSchema
>;

// ActivityLog
export type ActivityLogWithBoardDto = z.infer<
  typeof ActivityLogWithBoardSchema
>;
export type ActivityLogWithCardDto = z.infer<typeof ActivityLogWithCardSchema>;
export type ActivityLogWithUserDto = z.infer<typeof ActivityLogWithUserSchema>;
export type ActivityLogFullDto = z.infer<typeof ActivityLogFullSchema>;

// User
export type UserWithCreatedBoardsDto = z.infer<
  typeof UserWithCreatedBoardsSchema
>;
export type UserWithBoardMembershipsDto = z.infer<
  typeof UserWithBoardMembershipsSchema
>;
export type UserWithCreatedWorkspacesDto = z.infer<
  typeof UserWithCreatedWorkspacesSchema
>;
export type UserWithWorkspaceMembershipsDto = z.infer<
  typeof UserWithWorkspaceMembershipsSchema
>;
export type UserWithCardAssignmentsIdsDto = z.infer<
  typeof UserWithCardAssignmentsIdsSchema
>;
export type UserWithCardAssignmentsDto = z.infer<
  typeof UserWithCardAssignmentsSchema
>;
export type UserWithWatchlistsDto = z.infer<typeof UserWithWatchlistsSchema>;
export type UserWithCardWatchersDto = z.infer<
  typeof UserWithCardWatchersSchema
>;
export type UserFullDto = z.infer<typeof UserFullDtoSchema>;

// Workspace
export type WorkspaceWithMembersDto = z.infer<
  typeof WorkspaceWithMembersSchema
>;
export type WorkspaceWithBoardsDto = z.infer<typeof WorkspaceWithBoardsSchema>;
export type WorkspaceWithCreatorDto = z.infer<
  typeof WorkspaceWithCreatorSchema
>;
export type WorkspaceFullDto = z.infer<typeof WorkspaceFullDtoSchema>;
