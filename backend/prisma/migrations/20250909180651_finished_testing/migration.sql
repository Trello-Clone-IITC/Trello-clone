/*
  Warnings:

  - The values [test] on the enum `color` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."color_new" AS ENUM ('subtle_yellow', 'subtle_orange', 'subtle_red', 'subtle_purple', 'green', 'yellow', 'orange', 'red', 'purple', 'bold_green', 'bold_yellow', 'bold_orange', 'bold_red', 'bold_purple', 'subtle_blue', 'subtle_sky', 'subtle_lime', 'subtle_pink', 'subtle_black', 'blue', 'sky', 'lime', 'pink', 'black', 'bold_blue', 'bold_sky', 'bold_lime', 'bold_pink', 'bold_black', 'default');
ALTER TABLE "public"."labels" ALTER COLUMN "color" TYPE "public"."color_new" USING ("color"::text::"public"."color_new");
ALTER TYPE "public"."color" RENAME TO "color_old";
ALTER TYPE "public"."color_new" RENAME TO "color";
DROP TYPE "public"."color_old";
COMMIT;
