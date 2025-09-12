import { useUser } from '@clerk/clerk-react';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserRole {
  role: string;
}

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<string>('user');
  const [isAdmin, setIsAdmin] = useState(false);

  const checkUserRole = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      const role = data?.role || 'user';
      setUserRole(role);
      setIsAdmin(role === 'admin');
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isLoaded && user) {
      checkUserRole();
    }
  }, [isLoaded, user, checkUserRole]);

  return {
    user,
    isLoaded,
    userRole,
    isAdmin,
    checkUserRole
  };
};