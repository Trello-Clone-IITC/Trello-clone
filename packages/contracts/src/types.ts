import z from "zod";
import * as schemas from "./schemas.js";

// ==========================
// DTO TYPES FROM SCHEMAS
// ==========================
export type ActivityLogDto = z.infer<typeof schemas.ActivityLogDtoSchema>;
export type AttachmentDto = z.infer<typeof schemas.AttachmentDtoSchema>;
export type BoardDto = z.infer<typeof schemas.BoardDtoSchema>;
export type BoardMemberDto = z.infer<typeof schemas.BoardMemberDtoSchema>;
export type CardDto = z.infer<typeof schemas.CardDtoSchema>;
export type CardAssigneeDto = z.infer<typeof schemas.CardAssigneeDtoSchema>;
export type CardLabelDto = z.infer<typeof schemas.CardLabelDtoSchema>;
export type CardWatcherDto = z.infer<typeof schemas.CardWatcherDtoSchema>;
export type ChecklistDto = z.infer<typeof schemas.ChecklistDtoSchema>;
export type ChecklistItemDto = z.infer<typeof schemas.ChecklistItemDtoSchema>;
export type ChecklistItemAssigneeDto = z.infer<
  typeof schemas.ChecklistItemAssigneeDtoSchema
>;
export type CommentDto = z.infer<typeof schemas.CommentDtoSchema>;
export type LabelDto = z.infer<typeof schemas.LabelDtoSchema>;
export type ListDto = z.infer<typeof schemas.ListDtoSchema>;
export type ListWatcherDto = z.infer<typeof schemas.ListWatcherDtoSchema>;
export type UserDto = z.infer<typeof schemas.UserDtoSchema>;
export type WorkspaceDto = z.infer<typeof schemas.WorkspaceDtoSchema>;
export type WorkspaceMemberDto = z.infer<
  typeof schemas.WorkspaceMemberDtoSchema
>;
export type CardLocationDto = z.infer<typeof schemas.CardLocationDtoSchema>;
export type SearchResultsDto = z.infer<typeof schemas.SearchResultsDtoSchema>;

// ==========================
// CREATE INPUT TYPES FROM SCHEMAS
// ==========================
export type CreateWorkspaceInput = z.infer<
  typeof schemas.CreateWorkspaceInputSchema
>;
export type CreateBoardInput = z.infer<typeof schemas.CreateBoardInputSchema>;
export type CreateListInput = z.infer<typeof schemas.CreateListInputSchema>;
export type CreateLabelInput = z.infer<typeof schemas.CreateLabelInputSchema>;
export type CreateCardLabelInput = z.infer<
  typeof schemas.CreateCardLabelInputSchema
>;
export type CreateCardInput = z.infer<typeof schemas.CreateCardInputSchema>;
export type CreateChecklistInput = z.infer<
  typeof schemas.CreateChecklistInputSchema
>;
export type CreateChecklistItemInput = z.infer<
  typeof schemas.CreateChecklistItemInputSchema
>;
export type CreateCommentInput = z.infer<
  typeof schemas.CreateCommentInputSchema
>;
export type CreateOnBoardingInput = z.infer<
  typeof schemas.CreateOnBoardingInputSchema
>;
export type CreateUserInput = z.infer<typeof schemas.CreateUserInputSchema>;
export type CreateAttachmentInput = z.infer<
  typeof schemas.CreateAttachmentInputSchema
>;
export type CreateBoardMemberInput = z.infer<
  typeof schemas.CreateBoardMemberInputSchema
>;
export type CreateWorkspaceMemberInput = z.infer<
  typeof schemas.CreateWorkspaceMemberInputSchema
>;

// ==========================
// UPDATE INPUT TYPES FROM SCHEMAS
// ==========================
export type UpdateWorkspaceInput = z.infer<
  typeof schemas.UpdateWorkspaceSchema
>;
export type UpdateBoardInput = z.infer<typeof schemas.UpdateBoardSchema>;
export type UpdateListInput = z.infer<typeof schemas.UpdateListSchema>;
export type UpdateLabelInput = z.infer<typeof schemas.UpdateLabelSchema>;
export type UpdateCardInput = z.infer<typeof schemas.UpdateCardSchema>;
export type UpdateChecklistInput = z.infer<
  typeof schemas.UpdateChecklistSchema
>;
export type UpdateChecklistItemInput = z.infer<
  typeof schemas.UpdateChecklistItemSchema
>;
export type UpdateUserInput = z.infer<typeof schemas.UpdateUserSchema>;
export type UpdateCommentInput = z.infer<typeof schemas.UpdateCommentSchema>;
export type UpdateAttachmentInput = z.infer<
  typeof schemas.UpdateAttachmentSchema
>;
export type UpdateBoardMemberInput = z.infer<
  typeof schemas.UpdateBoardMemberSchema
>;
export type UpdateWorkspaceMemberInput = z.infer<
  typeof schemas.UpdateWorkspaceMemberSchema
>;

// ==========================
// PARAM & QUERY TYPES FROM SCHEMAS
// ==========================
export type IdParam = z.infer<typeof schemas.IdParamSchema>;
export type SearchQuery = z.infer<typeof schemas.SearchQuerySchema>;
export type CardIdParam = z.infer<typeof schemas.CardIdParamSchema>;

// ==========================
// ENUM TYPES FROM SCHEMAS
// ==========================
export type ActivityAction = z.infer<typeof schemas.ActivityActionSchema>;
export type ColorType = z.infer<typeof schemas.ColorSchema>;
export type BoardCreationRestrictions = z.infer<
  typeof schemas.BoardCreationRestrictionsSchema
>;
export type BoardRole = z.infer<typeof schemas.BoardRoleSchema>;
export type BoardSharing = z.infer<typeof schemas.BoardSharingSchema>;
export type BoardVisibility = z.infer<typeof schemas.BoardVisibilitySchema>;
export type BoardBackground = z.infer<typeof schemas.BoardBackgroundSchema>;
export type CommentingRestrictions = z.infer<
  typeof schemas.CommentingRestrictionsSchema
>;
export type MemberManageRestrictions = z.infer<
  typeof schemas.MemberManageRestrictionsSchema
>;
export type MembershipRestrictions = z.infer<
  typeof schemas.MembershipRestrictionsSchema
>;
export type SlackSharing = z.infer<typeof schemas.SlackSharingSchema>;
export type Theme = z.infer<typeof schemas.ThemeSchema>;
export type WorkspaceRole = z.infer<typeof schemas.WorkspaceRoleSchema>;
export type WorkspaceType = z.infer<typeof schemas.WorkspaceTypeSchema>;
export type WorkspaceVisibility = z.infer<
  typeof schemas.WorkspaceVisibilitySchema
>;

// ==========================
// COMPLEX TYPES FROM SCHEMAS
// ==========================

// Board
export type BoardWithLabelsDto = z.infer<typeof schemas.BoardWithLabelsSchema>;
export type BoardWithListsDto = z.infer<typeof schemas.BoardWithListsSchema>;
export type BoardWithMembersDto = z.infer<
  typeof schemas.BoardWithMembersSchema
>;
export type BoardWithCreatorDto = z.infer<
  typeof schemas.BoardWithCreatorSchema
>;
export type BoardWithWorkspaceDto = z.infer<
  typeof schemas.BoardWithWorkspaceSchema
>;
export type ListWithCardsDto = z.infer<typeof schemas.ListWithCardsSchema>;
export type BoardWithListsAndCardsDto = z.infer<
  typeof schemas.BoardWithListsAndCardsSchema
>;
export type BoardFullDto = z.infer<typeof schemas.BoardFullDtoSchema>;

// Board member
export type BoardMemberWithUserDto = z.infer<
  typeof schemas.BoardMemberWithUserSchema
>;

// List
export type ListWithWatchersIdsDto = z.infer<
  typeof schemas.ListWithWatchersIdsSchema
>;
export type ListWithWatchersDto = z.infer<
  typeof schemas.ListWithWatchersSchema
>;
export type ListWithCardsAndWatchersDto = z.infer<
  typeof schemas.ListWithCardsAndWatchersSchema
>;

// Card
export type CardWithAttachmentsDto = z.infer<
  typeof schemas.CardWithAttachmentsSchema
>;
export type CardWithAssigneesIdsDto = z.infer<
  typeof schemas.CardWithAssigneesIdsSchema
>;
export type CardWithAssigneesDto = z.infer<
  typeof schemas.CardWithAssigneesSchema
>;
export type CardWithLabelsIdsDto = z.infer<
  typeof schemas.CardWithLabelsIdsSchema
>;
export type CardWithLabelsDto = z.infer<typeof schemas.CardWithLabelsSchema>;
export type ChecklistItemWithAssigneesDto = z.infer<
  typeof schemas.ChecklistItemWithAssigneesSchema
>;
export type ChecklistWithItemsDto = z.infer<
  typeof schemas.ChecklistWithItemsSchema
>;
export type ChecklistWithItemsAndAssigneesDto = z.infer<
  typeof schemas.ChecklistWithItemsAndAssigneesSchema
>;
export type CardWithChecklistsDto = z.infer<
  typeof schemas.CardWithChecklistsSchema
>;
export type CardWithChecklistsDeepDto = z.infer<
  typeof schemas.CardWithChecklistsDeepSchema
>;
export type CommentWithUserDto = z.infer<typeof schemas.CommentWithUserSchema>;
export type CardWithCommentsDto = z.infer<
  typeof schemas.CardWithCommentsSchema
>;
export type CardWithWatchersIdsDto = z.infer<
  typeof schemas.CardWithWatchersIdsSchema
>;
export type CardWithWatchersDto = z.infer<
  typeof schemas.CardWithWatchersSchema
>;
export type CardWithCreatorDto = z.infer<typeof schemas.CardWithCreatorSchema>;
export type CardWithListDto = z.infer<typeof schemas.CardWithListSchema>;
export type CardFullDto = z.infer<typeof schemas.CardFullDtoSchema>;

// Label
export type LabelWithBoardDto = z.infer<typeof schemas.LabelWithBoardSchema>;

// Attachment
export type AttachmentWithCardAndUserDto = z.infer<
  typeof schemas.AttachmentWithCardAndUserSchema
>;

// ActivityLog
export type ActivityLogWithBoardDto = z.infer<
  typeof schemas.ActivityLogWithBoardSchema
>;
export type ActivityLogWithCardDto = z.infer<
  typeof schemas.ActivityLogWithCardSchema
>;
export type ActivityLogWithUserDto = z.infer<
  typeof schemas.ActivityLogWithUserSchema
>;
export type ActivityLogFullDto = z.infer<typeof schemas.ActivityLogFullSchema>;

// User
export type UserWithCreatedBoardsDto = z.infer<
  typeof schemas.UserWithCreatedBoardsSchema
>;
export type UserWithBoardMembershipsDto = z.infer<
  typeof schemas.UserWithBoardMembershipsSchema
>;
export type UserWithCreatedWorkspacesDto = z.infer<
  typeof schemas.UserWithCreatedWorkspacesSchema
>;
export type UserWithWorkspaceMembershipsDto = z.infer<
  typeof schemas.UserWithWorkspaceMembershipsSchema
>;
export type UserWithCardAssignmentsIdsDto = z.infer<
  typeof schemas.UserWithCardAssignmentsIdsSchema
>;
export type UserWithCardAssignmentsDto = z.infer<
  typeof schemas.UserWithCardAssignmentsSchema
>;
export type UserWithWatchlistsDto = z.infer<
  typeof schemas.UserWithWatchlistsSchema
>;
export type UserWithCardWatchersDto = z.infer<
  typeof schemas.UserWithCardWatchersSchema
>;
export type UserFullDto = z.infer<typeof schemas.UserFullDtoSchema>;

// Workspace
export type WorkspaceWithMembersDto = z.infer<
  typeof schemas.WorkspaceWithMembersSchema
>;
export type WorkspaceWithBoardsDto = z.infer<
  typeof schemas.WorkspaceWithBoardsSchema
>;
export type WorkspaceWithCreatorDto = z.infer<
  typeof schemas.WorkspaceWithCreatorSchema
>;
export type WorkspaceFullDto = z.infer<typeof schemas.WorkspaceFullDtoSchema>;
