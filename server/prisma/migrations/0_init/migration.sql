-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."activity_action" AS ENUM ('created', 'moved', 'updated', 'commented', 'closed', 'reopened', 'assigned', 'unassigned', 'labeled', 'unlabeled', 'attached', 'detached');

-- CreateEnum
CREATE TYPE "public"."board_creation_restrictions" AS ENUM ('workspace_member', 'workspace_admin', 'nobody');

-- CreateEnum
CREATE TYPE "public"."board_role" AS ENUM ('admin', 'member', 'observer');

-- CreateEnum
CREATE TYPE "public"."board_sharing" AS ENUM ('anybody', 'only_workspace_member');

-- CreateEnum
CREATE TYPE "public"."board_visibility" AS ENUM ('private', 'workspace_members', 'public');

-- CreateEnum
CREATE TYPE "public"."commenting_restrictions" AS ENUM ('disabled', 'board_members', 'workspace_members');

-- CreateEnum
CREATE TYPE "public"."member_manage_restrictions" AS ENUM ('admins', 'members');

-- CreateEnum
CREATE TYPE "public"."membership_restrictions" AS ENUM ('anybody', 'specific_domain');

-- CreateEnum
CREATE TYPE "public"."slack_sharing" AS ENUM ('workspace_member', 'admins');

-- CreateEnum
CREATE TYPE "public"."theme" AS ENUM ('light', 'dark', 'system');

-- CreateEnum
CREATE TYPE "public"."workspace_role" AS ENUM ('admin', 'member', 'guest');

-- CreateEnum
CREATE TYPE "public"."workspace_type" AS ENUM ('marketing', 'sales_crm', 'humen_resources', 'small_business', 'engineering_it', 'education', 'operations', 'other');

-- CreateEnum
CREATE TYPE "public"."workspace_visibility" AS ENUM ('private', 'public');

-- CreateTable
CREATE TABLE "public"."activity_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "board_id" UUID NOT NULL,
    "card_id" UUID,
    "user_id" UUID,
    "action" "public"."activity_action" NOT NULL,
    "payload" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."attachments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "card_id" UUID NOT NULL,
    "user_id" UUID,
    "url" TEXT NOT NULL,
    "filename" TEXT,
    "bytes" BIGINT,
    "meta" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."board_members" (
    "board_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "public"."board_role" NOT NULL DEFAULT 'member',
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "board_members_pkey" PRIMARY KEY ("board_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."boards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "background" TEXT NOT NULL DEFAULT 'default_background_url',
    "created_by" UUID,
    "allow_covers" BOOLEAN NOT NULL DEFAULT true,
    "show_complete" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity_at" TIMESTAMPTZ(6),
    "visibility" "public"."board_visibility" NOT NULL DEFAULT 'workspace_members',
    "member_manage" "public"."member_manage_restrictions" NOT NULL DEFAULT 'members',
    "commenting" "public"."commenting_restrictions" NOT NULL DEFAULT 'board_members',

    CONSTRAINT "boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."card_assignees" (
    "card_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "card_assignees_pkey" PRIMARY KEY ("card_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."card_labels" (
    "card_id" UUID NOT NULL,
    "label_id" UUID NOT NULL,

    CONSTRAINT "card_labels_pkey" PRIMARY KEY ("card_id","label_id")
);

-- CreateTable
CREATE TABLE "public"."card_watchers" (
    "card_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "card_watchers_pkey" PRIMARY KEY ("card_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."cards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "list_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMPTZ(6),
    "start_date" TIMESTAMPTZ(6),
    "position" DECIMAL(16,6) NOT NULL,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_by" UUID,
    "cover_image_url" TEXT,
    "subscribed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "search_doc" tsvector DEFAULT to_tsvector('simple'::regconfig, ((COALESCE(title, ''::text) || ' '::text) || COALESCE(description, ''::text))),

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checklist_item_assignees" (
    "item_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "checklist_item_assignees_pkey" PRIMARY KEY ("item_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."checklist_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "checklist_id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "due_date" TIMESTAMPTZ(6),
    "position" DECIMAL(16,6) NOT NULL DEFAULT 1000,

    CONSTRAINT "checklist_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checklists" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "card_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "position" DECIMAL(16,6) NOT NULL DEFAULT 1000,

    CONSTRAINT "checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "card_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."labels" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "board_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."list_watchers" (
    "list_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "list_watchers_pkey" PRIMARY KEY ("list_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."lists" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "board_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "position" DECIMAL(16,6) NOT NULL,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "subscribed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "clerk_id" TEXT NOT NULL,
    "email" CITEXT NOT NULL,
    "username" CITEXT,
    "full_name" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL DEFAULT 'default_avatar_url',
    "theme" "public"."theme" NOT NULL DEFAULT 'system',
    "email_notification" BOOLEAN NOT NULL DEFAULT true,
    "push_notification" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bio" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workspace_members" (
    "workspace_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "public"."workspace_role" NOT NULL DEFAULT 'member',
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("workspace_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."workspaces" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "public"."workspace_visibility" NOT NULL DEFAULT 'private',
    "premium" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "public"."workspace_type" NOT NULL DEFAULT 'other',
    "created_by" UUID NOT NULL,
    "workspace_membership_restrictions" "public"."membership_restrictions" NOT NULL DEFAULT 'anybody',
    "public_board_creation" "public"."board_creation_restrictions" NOT NULL DEFAULT 'workspace_member',
    "workspace_board_creation" "public"."board_creation_restrictions" NOT NULL DEFAULT 'workspace_member',
    "private_board_creation" "public"."board_creation_restrictions" NOT NULL DEFAULT 'workspace_member',
    "public_board_deletion" "public"."board_creation_restrictions" NOT NULL DEFAULT 'workspace_member',
    "workspace_board_deletion" "public"."board_creation_restrictions" NOT NULL DEFAULT 'workspace_member',
    "private_board_deletion" "public"."board_creation_restrictions" NOT NULL DEFAULT 'workspace_member',
    "allow_guest_sharing" "public"."board_sharing" NOT NULL DEFAULT 'anybody',
    "allow_slack_integration" "public"."slack_sharing" NOT NULL DEFAULT 'workspace_member',

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_board_time_idx" ON "public"."activity_log"("board_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "activity_card_time_idx" ON "public"."activity_log"("card_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "attachments_card_time_idx" ON "public"."attachments"("card_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "board_members_user_idx" ON "public"."board_members"("user_id");

-- CreateIndex
CREATE INDEX "boards_workspace_idx" ON "public"."boards"("workspace_id");

-- CreateIndex
CREATE INDEX "card_assignees_user_idx" ON "public"."card_assignees"("user_id");

-- CreateIndex
CREATE INDEX "card_watchers_user_idx" ON "public"."card_watchers"("user_id");

-- CreateIndex
CREATE INDEX "cards_search_gin_idx" ON "public"."cards" USING GIN ("search_doc");

-- CreateIndex
CREATE UNIQUE INDEX "cards_order_idx" ON "public"."cards"("list_id", "position");

-- CreateIndex
CREATE INDEX "checklist_items_parent_pos_idx" ON "public"."checklist_items"("checklist_id", "position");

-- CreateIndex
CREATE INDEX "checklists_card_pos_idx" ON "public"."checklists"("card_id", "position");

-- CreateIndex
CREATE INDEX "comments_card_time_idx" ON "public"."comments"("card_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "labels_board_idx" ON "public"."labels"("board_id");

-- CreateIndex
CREATE UNIQUE INDEX "labels_board_id_name_key" ON "public"."labels"("board_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "lists_order_idx" ON "public"."lists"("board_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "public"."users"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_idx" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "workspaces_visibility_idx" ON "public"."workspaces"("visibility");

-- AddForeignKey
ALTER TABLE "public"."activity_log" ADD CONSTRAINT "activity_log_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."activity_log" ADD CONSTRAINT "activity_log_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."activity_log" ADD CONSTRAINT "activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."attachments" ADD CONSTRAINT "attachments_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."attachments" ADD CONSTRAINT "attachments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."board_members" ADD CONSTRAINT "board_members_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."board_members" ADD CONSTRAINT "board_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."boards" ADD CONSTRAINT "boards_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."boards" ADD CONSTRAINT "boards_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."card_assignees" ADD CONSTRAINT "card_assignees_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."card_assignees" ADD CONSTRAINT "card_assignees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."card_labels" ADD CONSTRAINT "card_labels_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."card_labels" ADD CONSTRAINT "card_labels_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "public"."labels"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."card_watchers" ADD CONSTRAINT "card_watchers_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."card_watchers" ADD CONSTRAINT "card_watchers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cards" ADD CONSTRAINT "cards_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cards" ADD CONSTRAINT "cards_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."checklist_item_assignees" ADD CONSTRAINT "checklist_item_assignees_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."checklist_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."checklist_item_assignees" ADD CONSTRAINT "checklist_item_assignees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."checklist_items" ADD CONSTRAINT "checklist_items_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "public"."checklists"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."checklists" ADD CONSTRAINT "checklists_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."labels" ADD CONSTRAINT "labels_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."list_watchers" ADD CONSTRAINT "list_watchers_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."list_watchers" ADD CONSTRAINT "list_watchers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."lists" ADD CONSTRAINT "lists_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."workspace_members" ADD CONSTRAINT "workspace_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."workspaces" ADD CONSTRAINT "workspaces_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

