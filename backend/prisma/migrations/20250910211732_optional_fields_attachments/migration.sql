/*
  Warnings:

  - Made the column `filename` on table `attachments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."attachments" ALTER COLUMN "filename" SET NOT NULL;
