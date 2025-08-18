import { useAuth } from '@/hooks/useAuth.jsx';
import { UserRole } from '@/components/types/auth';

export const useUserRole = () => {
  const { user, teamUser } = useAuth();
  
  // Get the current user and their role
  const currentUser = user || teamUser;
  const userRole: UserRole | null = currentUser?.role || null;
  
  return {
    currentUser,
    userRole,
    isAdmin: userRole === 'admin',
    isTeamLead: userRole === 'team_lead',
    isProductOwner: userRole === 'product_owner',
    isDeveloper: userRole === 'developer',
    isQA: userRole === 'qa',
    isClient: userRole === 'client',
  };
};
