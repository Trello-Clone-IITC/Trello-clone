-- CreateTable
CREATE TABLE "public"."join_requests" (
    "userId" UUID NOT NULL,
    "boardId" UUID NOT NULL,

    CONSTRAINT "join_requests_pkey" PRIMARY KEY ("userId","boardId")
);

-- AddForeignKey
ALTER TABLE "public"."join_requests" ADD CONSTRAINT "join_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."join_requests" ADD CONSTRAINT "join_requests_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "public"."boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
