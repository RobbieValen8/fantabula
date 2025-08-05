-- Fix the column name in stories table to match the code
ALTER TABLE public.stories RENAME COLUMN story TO content;