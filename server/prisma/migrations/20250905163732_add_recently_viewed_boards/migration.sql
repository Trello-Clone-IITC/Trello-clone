-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "recently_viewed_boards" TEXT[] DEFAULT ARRAY[]::TEXT[];
