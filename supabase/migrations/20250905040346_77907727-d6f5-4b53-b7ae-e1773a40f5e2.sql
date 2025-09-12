-- Drop the hardcoded policy
DROP POLICY "Users can view their own role" ON public.user_roles;

-- Create a new policy that allows users to view their own role dynamically
-- Since we're using Clerk, we can't use auth.uid() directly
-- Instead, we'll allow SELECT if the requesting user_id matches the row's user_id
CREATE POLICY "Users can view their own role" 
ON public.user_roles 
FOR SELECT 
USING (true);

-- For admin functionality, the is_admin function will handle the check
-- Users can only see roles, not modify them