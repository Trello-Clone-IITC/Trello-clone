-- AlterTable
ALTER TABLE "public"."cards" ADD COLUMN     "inbox_user_id" UUID,
ALTER COLUMN "list_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Inbox" (
    "userId" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inbox_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "public"."cards" ADD CONSTRAINT "cards_inbox_user_id_fkey" FOREIGN KEY ("inbox_user_id") REFERENCES "public"."Inbox"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Inbox" ADD CONSTRAINT "Inbox_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
