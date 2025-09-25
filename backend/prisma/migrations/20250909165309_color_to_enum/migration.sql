-- 1) Create the enum type (use the exact name/case used in schema.prisma)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Color') THEN
    CREATE TYPE "Color" AS ENUM (
      'subtle_yellow','subtle_orange','subtle_red','subtle_purple',
      'green','yellow','orange','red','purple',
      'bold_green','bold_yellow','bold_orange','bold_red','bold_purple',
      'subtle_blue','subtle_sky','subtle_lime','subtle_pink','subtle_black',
      'blue','sky','lime','pink','black',
      'bold_blue','bold_sky','bold_lime','bold_pink','bold_black'
    );
  END IF;
END$$;

-- 2) Ensure every current value is valid (OPTIONAL, uncomment to check)
-- -- If this returns rows, fix them before casting.
-- SELECT DISTINCT color
-- FROM public.labels
-- EXCEPT
-- SELECT unnest(ARRAY[
--   'subtle_yellow','subtle_orange','subtle_red','subtle_purple',
--   'green','yellow','orange','red','purple',
--   'bold_green','bold_yellow','bold_orange','bold_red','bold_purple',
--   'subtle_blue','subtle_sky','subtle_lime','subtle_pink','subtle_black',
--   'blue','sky','lime','pink','black',
--   'bold_blue','bold_sky','bold_lime','bold_pink','bold_black'
-- ]);

-- 3) Convert the column IN PLACE using USING; NO DROP/ADD
ALTER TABLE public.labels
  ALTER COLUMN color TYPE "Color"
  USING (color::text::"Color");
