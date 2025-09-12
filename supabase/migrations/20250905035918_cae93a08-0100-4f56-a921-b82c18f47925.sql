-- Update user_roles table to use text instead of uuid for user_id to support Clerk IDs
ALTER TABLE public.user_roles ALTER COLUMN user_id TYPE text;