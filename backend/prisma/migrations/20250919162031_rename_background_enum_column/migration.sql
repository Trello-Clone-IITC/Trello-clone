/*
  Warnings:

  - You are about to drop the column `backgroundEnum` on the `boards` table. All the data in the column will be lost.
  - Added the required column `background` to the `boards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."boards" 
RENAME COLUMN "backgroundEnum" TO "background";

ALTER TABLE "public"."boards"
ALTER COLUMN "background" SET NOT NULL;

