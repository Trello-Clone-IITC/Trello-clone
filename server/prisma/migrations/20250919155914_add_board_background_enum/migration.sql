-- CreateEnum
CREATE TYPE "public"."board_background" AS ENUM ('mountain', 'valley', 'tree', 'snow');

-- AlterTable
ALTER TABLE "public"."boards" ADD COLUMN     "backgroundEnum" "public"."board_background";
