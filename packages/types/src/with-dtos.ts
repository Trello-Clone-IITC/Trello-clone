import type {
  With,
  ActivityLogDto,
  AttachmentDto,
  BoardDto,
  BoardMemberDto,
  CardDto,
  CardAssigneeDto,
  CardLabelDto,
  CardWatcherDto,
  ChecklistDto,
  ChecklistItemDto,
  ChecklistItemAssigneeDto,
  CommentDto,
  LabelDto,
  ListDto,
  ListWatcherDto,
  UserDto,
  WorkspaceDto,
  WorkspaceMemberDto,
} from "./base-dtos";

type Merge<A, B> = Omit<A, keyof B> & B;

// ---------- Board ----------
export type BoardWithLabelsDto = With<BoardDto, "labels", LabelDto[]>;

export type BoardWithListsDto = With<BoardDto, "lists", ListDto[]>;

export type BoardWithMembersDto = With<
  BoardDto,
  "members",
  Array<With<BoardMemberDto, "user", UserDto>>
>;

export type BoardWithCreatorDto = With<BoardDto, "creator", UserDto | null>;

export type BoardWithWorkspaceDto = With<
  BoardDto,
  "workspace",
  WorkspaceDto | null
>;

export type ListWithCardsDto = With<ListDto, "cards", CardDto[]>;

export type BoardWithListsAndCardsDto = With<
  BoardDto,
  "lists",
  ListWithCardsDto[]
>;

export type BoardFullDto = Merge<
  Merge<BoardWithLabelsDto, BoardWithMembersDto>,
  Merge<
    With<
      BoardDto,
      "lists",
      Array<
        Merge<With<ListDto, "watchers", ListWatcherDto[]>, ListWithCardsDto>
      >
    >,
    Merge<BoardWithCreatorDto, BoardWithWorkspaceDto>
  >
>;

// ---------- List ----------
export type ListWithWatchersIdsDto = With<
  ListDto,
  "watchers",
  ListWatcherDto[]
>;

export type ListWithWatchersDto = With<
  ListDto,
  "watchers",
  Array<Merge<ListWatcherDto, { user: UserDto }>>
>;

export type ListWithCardsAndWatchersDto = Merge<
  ListWithCardsDto,
  ListWithWatchersIdsDto
>;

// ---------- Card ----------
export type CardWithAttachmentsDto = With<
  CardDto,
  "attachments",
  Array<With<AttachmentDto, "user", UserDto | null>>
>;

export type CardWithAssigneesIdsDto = With<
  CardDto,
  "assignees",
  Array<Pick<CardAssigneeDto, "userId">>
>;

export type CardWithAssigneesDto = With<
  CardDto,
  "assignees",
  Array<With<CardAssigneeDto, "user", UserDto>>
>;

export type CardWithLabelsIdsDto = With<CardDto, "cardLabels", CardLabelDto[]>;

export type CardWithLabelsDto = With<
  CardDto,
  "cardLabels",
  Array<With<CardLabelDto, "label", LabelDto>>
>;

export type ChecklistItemWithAssigneesDto = With<
  ChecklistItemDto,
  "assignees",
  Array<With<ChecklistItemAssigneeDto, "user", UserDto>>
>;

export type ChecklistWithItemsDto = With<
  ChecklistDto,
  "items",
  ChecklistItemDto[]
>;

export type ChecklistWithItemsAndAssigneesDto = With<
  ChecklistDto,
  "items",
  ChecklistItemWithAssigneesDto[]
>;

export type CardWithChecklistsDto = With<CardDto, "checklists", ChecklistDto[]>;

export type CardWithChecklistsDeepDto = With<
  CardDto,
  "checklists",
  ChecklistWithItemsAndAssigneesDto[]
>;

export type CommentWithUserDto = With<CommentDto, "user", UserDto>;

export type CardWithCommentsDto = With<
  CardDto,
  "comments",
  CommentWithUserDto[]
>;

export type CardWithWatchersIdsDto = With<
  CardDto,
  "watchers",
  CardWatcherDto[]
>;

export type CardWithWatchersDto = With<
  CardDto,
  "watchers",
  Array<With<CardWatcherDto, "user", UserDto>>
>;

export type CardWithCreatorDto = With<CardDto, "creator", UserDto | null>;
export type CardWithListDto = With<CardDto, "list", ListDto>;

export type CardFullDto = Merge<
  Merge<CardWithAttachmentsDto, CardWithAssigneesDto>,
  Merge<
    Merge<CardWithLabelsDto, CardWithCommentsDto>,
    Merge<
      CardWithChecklistsDeepDto,
      Merge<CardWithWatchersDto, Merge<CardWithCreatorDto, CardWithListDto>>
    >
  >
>;

// ---------- Label ----------
export type LabelWithBoardDto = With<LabelDto, "board", BoardDto>;

// ---------- Attachment ----------
export type AttachmentWithCardAndUserDto = Merge<
  With<AttachmentDto, "card", CardDto>,
  With<AttachmentDto, "user", UserDto | null>
>;

// ---------- ActivityLog ----------
export type ActivityLogWithBoardDto = With<ActivityLogDto, "board", BoardDto>;
export type ActivityLogWithCardDto = With<
  ActivityLogDto,
  "card",
  CardDto | null
>;
export type ActivityLogWithUserDto = With<
  ActivityLogDto,
  "user",
  UserDto | null
>;

export type ActivityLogFullDto = Merge<
  ActivityLogWithBoardDto,
  Merge<ActivityLogWithCardDto, ActivityLogWithUserDto>
>;

// ---------- User ----------
export type UserWithCreatedBoardsDto = With<UserDto, "boards", BoardDto[]>;

export type UserWithBoardMembershipsDto = With<
  UserDto,
  "boardMembers",
  Array<With<BoardMemberDto, "board", BoardDto>>
>;

export type UserWithCreatedWorkspacesDto = With<
  UserDto,
  "workspaces",
  WorkspaceDto[]
>;

export type UserWithWorkspaceMembershipsDto = With<
  UserDto,
  "workspaceMembers",
  Array<With<WorkspaceMemberDto, "workspace", WorkspaceDto>>
>;

export type UserWithCardAssignmentsIdsDto = With<
  UserDto,
  "cardAssignees",
  CardAssigneeDto[]
>;

export type UserWithCardAssignmentsDto = With<
  UserDto,
  "cardAssignees",
  Array<With<CardAssigneeDto, "card", CardDto>>
>;

export type UserWithWatchlistsDto = With<
  UserDto,
  "listWatchers",
  Array<With<ListWatcherDto, "list", ListDto>>
>;

export type UserWithCardWatchersDto = With<
  UserDto,
  "cardWatchers",
  Array<With<CardWatcherDto, "card", CardDto>>
>;

export type UserFullDto = Merge<
  Merge<UserWithCreatedBoardsDto, UserWithBoardMembershipsDto>,
  Merge<
    Merge<UserWithCreatedWorkspacesDto, UserWithWorkspaceMembershipsDto>,
    Merge<
      UserWithCardAssignmentsDto,
      Merge<UserWithWatchlistsDto, UserWithCardWatchersDto>
    >
  >
>;

// ---------- Workspace ----------
export type WorkspaceWithMembersDto = With<
  WorkspaceDto,
  "workspaceMembers",
  Array<With<WorkspaceMemberDto, "user", UserDto>>
>;

export type WorkspaceWithBoardsDto = With<WorkspaceDto, "boards", BoardDto[]>;

export type WorkspaceWithCreatorDto = With<WorkspaceDto, "creator", UserDto>;

export type WorkspaceFullDto = Merge<
  WorkspaceWithMembersDto,
  Merge<WorkspaceWithBoardsDto, WorkspaceWithCreatorDto>
>;
