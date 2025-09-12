-- Drop all foreign key constraints on user_roles table
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;

-- Now safely alter the column type to text
ALTER TABLE public.user_roles ALTER COLUMN user_id TYPE text;

-- Ensure the admin role exists for the user
INSERT INTO public.user_roles (user_id, role)
VALUES ('user_31mYUyLv5vkw9xhM6XWjafZ0vbv', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;