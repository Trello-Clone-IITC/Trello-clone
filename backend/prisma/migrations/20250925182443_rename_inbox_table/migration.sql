/*
  Warnings:

  - You are about to drop the `Inbox` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Inbox" DROP CONSTRAINT "Inbox_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."cards" DROP CONSTRAINT "cards_inbox_user_id_fkey";

-- DropTable
DROP TABLE "public"."Inbox";

-- CreateTable
CREATE TABLE "public"."inboxes" (
    "userId" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inboxes_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "public"."cards" ADD CONSTRAINT "cards_inbox_user_id_fkey" FOREIGN KEY ("inbox_user_id") REFERENCES "public"."inboxes"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."inboxes" ADD CONSTRAINT "inboxes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
