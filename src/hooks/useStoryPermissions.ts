
import { useUserRole } from '@/hooks/useUserRole';

export const useStoryPermissions = (isStoryReady: boolean) => {
  const { userRole } = useUserRole();
  
  // Check if user can add comments (all roles can add comments, but only if story is not ready)
  const canAddComments = userRole && !isStoryReady;
  
  // Check if user can edit content (only product_owner and only if story is not ready)
  const canEditContent = userRole === 'product_owner' && !isStoryReady;
  
  // Check if user can edit story points (only team_lead or developer and only if story is not ready)
  const canEditStoryPoints = userRole && (userRole === 'team_lead' || userRole === 'developer') && !isStoryReady;

  return {
    userRole,
    canAddComments,
    canEditContent,
    canEditStoryPoints
  };
};
