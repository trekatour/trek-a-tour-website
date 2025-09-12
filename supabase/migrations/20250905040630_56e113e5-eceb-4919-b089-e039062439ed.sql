-- Check current user_roles table structure and fix any remaining UUID references
-- First, ensure the user_id column is properly set to text type
ALTER TABLE public.user_roles ALTER COLUMN user_id TYPE text;

-- Update the is_admin function to work with text user_id (if it's still using uuid)
DROP FUNCTION IF EXISTS public.is_admin(uuid);

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

-- Ensure the admin role exists for the user
INSERT INTO public.user_roles (user_id, role)
VALUES ('user_31mYUyLv5vkw9xhM6XWjafZ0vbv', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;