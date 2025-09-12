-- Add admin role for saythu000@gmail.com using Clerk user ID
INSERT INTO public.user_roles (user_id, role)
VALUES ('user_31mYUyLv5vkw9xhM6XWjafZ0vbv', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;