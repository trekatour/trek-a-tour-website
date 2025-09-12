-- Add admin role for specific user (run this AFTER they sign up)
-- Replace 'USER_ID_HERE' with the actual Clerk user ID after signup

-- First, let's create a helper function to add admin by user ID
CREATE OR REPLACE FUNCTION public.add_admin_role(target_user_id UUID)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
$$;

-- You'll run this after saythu000@gmail.com signs up:
-- SELECT public.add_admin_role('their-clerk-user-id-here');