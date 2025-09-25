-- Record missing changes so shadow DB matches real DB
ALTER TYPE color ADD VALUE IF NOT EXISTS 'default';

ALTER TABLE "labels" ALTER COLUMN "name" DROP NOT NULL;
