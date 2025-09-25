-- inside migration.sql
ALTER TYPE "Color" RENAME TO color;

ALTER TABLE public.labels
  ALTER COLUMN color TYPE color
  USING (color::text::color);
