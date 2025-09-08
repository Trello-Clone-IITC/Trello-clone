/*
  Warnings:

  - Made the column `workspace_id` on table `boards` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `boards` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."boards" DROP CONSTRAINT "boards_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."boards" DROP CONSTRAINT "boards_workspace_id_fkey";

-- AlterTable
ALTER TABLE "public"."boards" ALTER COLUMN "workspace_id" SET NOT NULL,
ALTER COLUMN "background" DROP DEFAULT,
ALTER COLUMN "created_by" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."boards" ADD CONSTRAINT "boards_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."boards" ADD CONSTRAINT "boards_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
