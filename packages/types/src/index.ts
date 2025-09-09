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

export const Color = z.enum([
  "subtle_yellow",
  "subtle_orange",
  "subtle_red",
  "subtle_purple",
  "green",
  "yellow",
  "orange",
  "red",
  "purple",
  "bold_green",
  "bold_yellow",
  "bold_orange",
  "bold_red",
  "bold_purple",
  "subtle_blue",
  "subtle_sky",
  "subtle_lime",
  "subtle_pink",
  "subtle_black",
  "blue",
  "sky",
  "lime",
  "pink",
  "black",
  "bold_blue",
  "bold_sky",
  "bold_lime",
  "bold_pink",
  "bold_black",
  "default",
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
  id: z.uuid(),
  cardId: z.uuid(),
  userId: z.uuid(),
  text: z.string(),
  createdAt: z.iso.datetime(),
});

export const LabelDtoSchema = z.object({
  id: z.uuid(),
  boardId: z.uuid(),
  name: z.string().optional().nullable(),
  color: Color,
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
// Create Input Schemas
// ==========================
export const CreateWorkspaceInputSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable().optional(),
  type: WorkspaceTypeSchema,
});

export const CreateBoardInputSchema = z.object({
  name: z.string().min(1).max(100),
  background: z.string(),
  visibility: BoardVisibilitySchema,
});

export const CreateListInputSchema = z.object({
  name: z.string().min(1).max(100),
  position: z.number().min(0),
});

export const CreateLabelInputSchema = z.object({
  name: z.string().min(1).max(50).optional().nullable(),
  color: Color,
});

export const CreateCardLabelInputSchema = z.object({
  labelId: z.uuid(),
});

export const CreateCardInputSchema = z.object({
  title: z.string().min(1).max(100),
  position: z.number().min(0),
});

export const CreateChecklistInputSchema = z.object({
  title: z.string().min(1).max(100),
  position: z.number().min(0),
});

export const CreateChecklistItemInputSchema = z.object({
  text: z.string().min(1).max(200),
  position: z.number().min(0),
});

export const CreateOnBoardingInputSchema = z.object({
  fullName: z.string().min(1).max(100),
  email: z.email(),
  avatarUrl: z.url(),
  password: z.string().min(8).max(100).optional(),
});

export const CreateUserInputSchema = z.object({
  email: z.email(),
  fullName: z.string().min(1).max(100),
  avatarUrl: z.url(),
});

export const CreateCommentInputSchema = z.object({
  text: z.string().min(1).max(1000),
});

// ==========================
// BASE PARAM & QUERY SCHEMAS
// ==========================
export const IdParamSchema = z.object({
  id: z.uuid(),
});

export const SearchQuerySchema = z.object({
  search: z.string().optional(),
});

export const GetByIdRequestSchema = z.object({
  params: IdParamSchema,
});

// ==========================
// WORKSPACE REQUEST SCHEMAS
// ==========================
export const CreateWorkspaceRequestSchema = z.object({
  body: CreateWorkspaceInputSchema,
  query: z.object({}),
  params: z.object({}),
});

export const UpdateWorkspaceRequestSchema = z.object({
  body: WorkspaceDtoSchema.partial(),
  params: IdParamSchema,
  query: z.object({}),
});

// ==========================
// BOARD REQUEST SCHEMAS
// ==========================

export const CreateBoardRequestSchema = z.object({
  body: CreateBoardInputSchema,
  query: z.object({}),
  params: z.object({}),
});

export const UpdateBoardRequestSchema = z.object({
  body: BoardDtoSchema.partial(),
  params: IdParamSchema,
  query: z.object({}),
});

// ==========================
// LIST REQUEST SCHEMAS
// ==========================
export const CreateListRequestSchema = z.object({
  body: CreateListInputSchema,
  params: IdParamSchema,
  query: z.object({}),
});

export const UpdateListRequestSchema = z.object({
  body: ListDtoSchema.partial(),
  params: IdParamSchema,
  query: z.object({}),
});

// ==========================
// LABEL REQUEST SCHEMAS
// ==========================
export const CreateLabelRequestSchema = z.object({
  body: CreateLabelInputSchema,
  params: IdParamSchema,
  query: z.object({}),
});

export const CreateCardLabelRequestSchema = z.object({
  body: CreateCardLabelInputSchema,
  params: IdParamSchema,
  query: z.object({}),
});

export const UpdateLabelRequestSchema = z.object({
  body: LabelDtoSchema.partial(),
  params: IdParamSchema,
  query: z.object({}),
});

// ==========================
// CARD REQUEST SCHEMAS
// ==========================
export const CreateCardRequestSchema = z.object({
  body: CreateCardInputSchema,
  params: IdParamSchema,
  query: z.object({}),
});

export const UpdateCardRequestSchema = z.object({
  body: CardDtoSchema.partial(),
  params: IdParamSchema,
  query: z.object({}),
});

// ==========================
// CHECKLIST REQUEST SCHEMAS
// ==========================
export const CreateChecklistRequestSchema = z.object({
  body: CreateChecklistInputSchema,
  params: IdParamSchema,
  query: z.object({}),
});

export const UpdateChecklistRequestSchema = z.object({
  body: ChecklistDtoSchema.partial(),
  params: IdParamSchema,
  query: z.object({}),
});

// ==========================
// CHECKLIST ITEMS REQUEST SCHEMAS
// ==========================
export const CreateChecklistItemRequestSchema = z.object({
  body: CreateChecklistItemInputSchema,
  params: IdParamSchema,
  query: z.object({}),
});

export const UpdateChecklistItemRequestSchema = z.object({
  body: ChecklistItemDtoSchema.partial(),
  params: IdParamSchema,
  query: z.object({}),
});

// ==========================
// ONBOARDING ITEMS REQUEST SCHEMAS
// ==========================
export const CreateOnBoardingRequestSchema = z.object({
  body: CreateOnBoardingInputSchema,
  params: z.object({}),
  query: z.object({}),
});

// ==========================
// USER REQUEST SCHEMAS
// ==========================
export const CreateUserRequestSchema = z.object({
  body: CreateUserInputSchema,
  params: z.object({}),
  query: z.object({}),
});

export const UpdateUserRequestSchema = z.object({
  body: UserDtoSchema.partial(),
  params: z.object({}),
  query: z.object({}),
});

// ==========================
// COMMENT REQUEST SCHEMAS
// ==========================
export const CreateCommentRequestSchema = z.object({
  body: CreateCommentInputSchema,
  params: IdParamSchema,
  query: z.object({}),
});

export const UpdateCommentRequestSchema = z.object({
  body: CommentDtoSchema.partial(),
  params: IdParamSchema,
  query: z.object({}),
});

// ==========================
// DTO TYPES FROM SCHEMAS
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
// CREATE INPUT TYPES FROM SCHEMAS
// ==========================
export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceInputSchema>;
export type CreateBoardInput = z.infer<typeof CreateBoardInputSchema>;
export type CreateListInput = z.infer<typeof CreateListInputSchema>;
export type CreateLabelInput = z.infer<typeof CreateLabelInputSchema>;
export type CreateCardLabelInput = z.infer<typeof CreateCardLabelInputSchema>;
export type CreateCardInput = z.infer<typeof CreateCardInputSchema>;
export type CreateChecklistInput = z.infer<typeof CreateChecklistInputSchema>;
export type CreateChecklistItemInput = z.infer<
  typeof CreateChecklistItemInputSchema
>;
export type CreateCommentInput = z.infer<typeof CreateCommentInputSchema>;
export type CreateOnBoardingInput = z.infer<typeof CreateOnBoardingInputSchema>;
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

// ==========================
// UPDATE INPUT TYPES FROM SCHEMAS
// ==========================
export type UpdateWorkspaceInput = z.infer<typeof WorkspaceDtoSchema>;
export type UpdateBoardInput = z.infer<typeof BoardDtoSchema>;
export type UpdateListInput = z.infer<typeof ListDtoSchema>;
export type UpdateLabelInput = z.infer<typeof LabelDtoSchema>;
export type UpdateCardInput = z.infer<typeof CardDtoSchema>;
export type UpdateChecklistInput = z.infer<typeof ChecklistDtoSchema>;
export type UpdateChecklistItemInput = z.infer<typeof ChecklistItemDtoSchema>;
export type UpdateUserInput = z.infer<typeof UserDtoSchema>;
export type UpdateCommentInput = z.infer<typeof CommentDtoSchema>;

// ==========================
// PARAM & QUERY TYPES FROM SCHEMAS
// ==========================
export type IdParam = z.infer<typeof IdParamSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;

// ==========================
// ENUM TYPES FROM SCHEMAS
// ==========================
export type ActivityAction = z.infer<typeof ActivityActionSchema>;
export type ColorType = z.infer<typeof Color>;
export type BoardCreationRestrictions = z.infer<
  typeof BoardCreationRestrictionsSchema
>;
export type BoardRole = z.infer<typeof BoardRoleSchema>;
export type BoardSharing = z.infer<typeof BoardSharingSchema>;
export type BoardVisibility = z.infer<typeof BoardVisibilitySchema>;
export type CommentingRestrictions = z.infer<
  typeof CommentingRestrictionsSchema
>;
export type MemberManageRestrictions = z.infer<
  typeof MemberManageRestrictionsSchema
>;
export type MembershipRestrictions = z.infer<
  typeof MembershipRestrictionsSchema
>;
export type SlackSharing = z.infer<typeof SlackSharingSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type WorkspaceRole = z.infer<typeof WorkspaceRoleSchema>;
export type WorkspaceType = z.infer<typeof WorkspaceTypeSchema>;
export type WorkspaceVisibility = z.infer<typeof WorkspaceVisibilitySchema>;

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
