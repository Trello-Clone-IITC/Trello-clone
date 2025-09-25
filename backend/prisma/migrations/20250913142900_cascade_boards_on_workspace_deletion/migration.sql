-- DropForeignKey
ALTER TABLE "public"."boards" DROP CONSTRAINT "boards_workspace_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."boards" ADD CONSTRAINT "boards_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
