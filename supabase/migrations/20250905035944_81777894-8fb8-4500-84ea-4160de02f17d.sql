-- Drop existing policy
DROP POLICY "Users can view their own role" ON public.user_roles;

-- Update user_id column to text type to support Clerk IDs
ALTER TABLE public.user_roles ALTER COLUMN user_id TYPE text;

-- Update the is_admin function to work with text user_id
CREATE OR REPLACE FUNCTION public.is_admin(user_id text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = $1 AND role = 'admin'
  );
$function$;

-- Recreate the policy with text comparison
CREATE POLICY "Users can view their own role" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid()::text = user_id);

-- Add admin role for saythu000@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('user_31mYUyLv5vkw9xhM6XWjafZ0vbv', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;