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

export const ColorSchema = z.enum([
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

export const BoardBackgroundSchema = z.enum([
  "mountain",
  "valley",
  "tree",
  "snow",
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
export const UserDtoSchema = z.object({
  id: z.uuid(),
  clerkId: z.string(),
  email: z.email(),
  username: z.string().nullable().optional(),
  fullName: z.string(),
  avatarUrl: z.string(),
  theme: ThemeSchema,
  recentlyViewedBoards: z.array(z.string()),
  emailNotification: z.boolean(),
  pushNotification: z.boolean(),
  createdAt: z.iso.datetime(),
  bio: z.string().nullable().optional(),
});

export const LabelDtoSchema = z.object({
  id: z.uuid(),
  boardId: z.uuid(),
  name: z.string().optional().nullable(),
  color: ColorSchema,
});

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
  userId: z.uuid(),
  url: z.string(),
  filename: z.string(),
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
  workspaceId: z.uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  background: BoardBackgroundSchema,
  createdBy: z.uuid(),
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

export const CardLocationDtoSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
});

export const CardDtoSchema = z.object({
  id: z.uuid(),
  listId: z.uuid().nullable().optional(),
  inboxUserId: z.uuid().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  dueDate: z.iso.datetime().nullable().optional(),
  startDate: z.iso.datetime().nullable().optional(),
  position: z.number(),
  isWatch: z.boolean(),
  cardAssignees: z.array(
    UserDtoSchema.pick({
      avatarUrl: true,
      fullName: true,
      username: true,
      id: true,
    })
  ),
  attachmentsCount: z.number(),
  commentsCount: z.number(),
  checklistItemsCount: z.number(),
  completedChecklistItemsCount: z.number(),
  labels: z.array(
    LabelDtoSchema.pick({
      color: true,
      name: true,
    })
  ),
  location: CardLocationDtoSchema.nullable().optional(),
  isArchived: z.boolean(),
  isCompleted: z.boolean(),
  createdBy: z.uuid(),
  coverImageUrl: z.string().nullable().optional(),
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

export const JoinRequestDtoSchema = z.object({
  userId: z.uuid(),
  boardId: z.uuid(),
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

export const SearchResultsDtoSchema = z.object({
  users: z
    .array(
      UserDtoSchema.pick({
        id: true,
        fullName: true,
        avatarUrl: true,
        username: true,
      })
    )
    .optional(),

  boards: z
    .array(
      BoardDtoSchema.pick({
        id: true,
        name: true,
        background: true,
        updatedAt: true,
      }).extend({
        workspace: z.object({
          name: z.string(),
        }),
      })
    )
    .optional(),

  cards: z
    .array(
      CardDtoSchema.pick({
        title: true,
        inboxUserId: true,
      }).extend({
        list: z
          .object({
            board: z.object({
              name: z.string(),
              workspace: z.object({
                name: z.string(),
              }),
            }),
          })
          .nullable(),
      })
    )
    .optional(),

  recentlyViewedBoards: z
    .array(
      BoardDtoSchema.pick({
        id: true,
        name: true,
        background: true,
        updatedAt: true,
      }).extend({
        workspace: z.object({
          name: z.string(),
        }),
      })
    )
    .optional(),
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

// Board members
export const BoardMemberWithUserSchema = BoardMemberDtoSchema.extend({
  user: UserDtoSchema,
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
export const CreateWorkspaceInputSchema = WorkspaceDtoSchema.pick({
  name: true,
  description: true,
  type: true,
});

export const CreateBoardInputSchema = BoardDtoSchema.pick({
  name: true,
  background: true,
  visibility: true,
  workspaceId: true,
});

export const CreateListInputSchema = ListDtoSchema.pick({
  name: true,
});

export const CreateLabelInputSchema = LabelDtoSchema.pick({
  name: true,
  color: true,
});

export const CreateCardLabelInputSchema = CardLabelDtoSchema.pick({
  labelId: true,
});

export const CreateCardInputSchema = CardDtoSchema.pick({
  title: true,
  location: true,
  position: true,
});

export const CreateChecklistInputSchema = ChecklistDtoSchema.pick({
  title: true,
  position: true,
});

export const CreateChecklistItemInputSchema = ChecklistItemDtoSchema.pick({
  text: true,
  position: true,
});

export const CreateJoinRequestInputSchema = JoinRequestDtoSchema.pick({
  boardId: true,
});

export const CreateOnBoardingInputSchema = z.object({
  fullName: z.string().min(1).max(100),
  email: z.email(),
  avatarUrl: z.url(),
  password: z.string().min(8).max(100).optional(),
});

export const CreateUserInputSchema = UserDtoSchema.pick({
  email: true,
  fullName: true,
  avatarUrl: true,
});

export const CreateCommentInputSchema = CommentDtoSchema.pick({
  text: true,
});

export const CreateWorkspaceMemberInputSchema = WorkspaceMemberDtoSchema.pick({
  role: true,
  userId: true,
});

export const CreateBoardMemberInputSchema = BoardMemberDtoSchema.pick({
  role: true,
  userId: true,
});

export const CreateAttachmentInputSchema = AttachmentDtoSchema.pick({
  url: true,
  filename: true,
  bytes: true,
  meta: true,
});

// ==========================
//  Update Input Schemas
// ==========================
export const UpdateWorkspaceSchema = WorkspaceDtoSchema.partial();
export const UpdateBoardSchema = BoardDtoSchema.partial();
export const UpdateListSchema = ListDtoSchema.partial();
export const UpdateLabelSchema = LabelDtoSchema.partial();
export const UpdateCardSchema = CardDtoSchema.partial();
export const UpdateChecklistSchema = ChecklistDtoSchema.partial();
export const UpdateChecklistItemSchema = ChecklistItemDtoSchema.partial();
export const UpdateUserSchema = UserDtoSchema.partial();
export const UpdateCommentSchema = CommentDtoSchema.partial();
export const UpdateWorkspaceMemberSchema = WorkspaceMemberDtoSchema.pick({
  role: true,
}).partial();
export const UpdateBoardMemberSchema = BoardMemberDtoSchema.pick({
  role: true,
}).partial();
export const UpdateAttachmentSchema = AttachmentDtoSchema.pick({
  filename: true,
}).partial();

// ==========================
// BASE PARAM & QUERY SCHEMAS
// ==========================
export const IdParamSchema = z.object({
  id: z.uuid(),
});

export const SearchQuerySchema = z.object({
  search: z.string().optional(),
});

// ==========================
// RESOURCE ID SCHEMAS
// ==========================
// User
export const UserIdParamSchema = z.object({
  userId: z.uuid(),
});

// Workspace
export const WorkspacesIdParamSchema = z.object({
  workspaceId: z.uuid(),
});

// Board
export const BoardIdParamSchema = z.object({
  boardId: z.uuid(),
});

// List
export const ListIdParamSchema = z.object({
  listId: z.uuid(),
});

// Card
export const CardIdParamSchema = z.object({
  cardId: z.uuid(),
});

// Label
export const LabelIdParamSchema = z.object({
  labelId: z.uuid(),
});

// Checklist
export const ChecklistIdParamSchema = z.object({
  checklistId: z.uuid(),
});

// Checklist Item
export const ChecklistItemIdParamSchema = z.object({
  itemId: z.uuid(),
});

// Comment
export const CommentIdParamSchema = z.object({
  commentId: z.uuid(),
});
