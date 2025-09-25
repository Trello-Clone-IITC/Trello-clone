/*
  Warnings:

  - Made the column `user_id` on table `attachments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `cards` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."attachments" DROP CONSTRAINT "attachments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cards" DROP CONSTRAINT "cards_created_by_fkey";

-- AlterTable
ALTER TABLE "public"."attachments" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."cards" ALTER COLUMN "created_by" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."attachments" ADD CONSTRAINT "attachments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cards" ADD CONSTRAINT "cards_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
