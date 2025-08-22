import { getProjectStatus } from '@/utils/projectStatusValidation';

export const canMoveCard = async (
  sourceStatus: string, 
  destinationStatus: string, 
  sprintStatus: 'created' | 'running' | 'completed',
  userRole?: string,
  projectId?: string
): Promise<{ canMove: boolean; reason?: string }> => {
  // Check if project is in progress
  if (projectId) {
    const projectStatus = await getProjectStatus(projectId);
    
    if (projectStatus !== 'in_progress') {
      return { 
        canMove: false, 
        reason: `Story status can only be updated when the project is in progress. Current project status: ${projectStatus}` 
      };
    }
  }

  // Only allow moving cards if sprint is running
  if (sprintStatus !== 'running') {
    return { canMove: false, reason: "Task status can only be updated when the sprint is in progress." };
  }

  // Only team_lead, developer, and qa can move cards
  if (!userRole || !['team_lead', 'developer', 'qa'].includes(userRole)) {
    return { canMove: false, reason: "Only Team Leads, Developers, and QA can move cards." };
  }

  // QA can only move cards from qa to done
  if (userRole === 'qa') {
    const canMove = sourceStatus === 'qa' && destinationStatus === 'done';
    return { 
      canMove, 
      reason: canMove ? undefined : "QA can only move cards from QA to Done." 
    };
  }

  // Team lead and developers can move cards from ready to in_progress and to qa
  if (userRole === 'team_lead' || userRole === 'developer') {
    if (sourceStatus === 'ready' && (destinationStatus === 'in_progress' || destinationStatus === 'qa')) {
      return { canMove: true };
    }
    if (sourceStatus === 'in_progress' && destinationStatus === 'qa') {
      return { canMove: true };
    }
    return { 
      canMove: false, 
      reason: "You can only move cards from To Do to In Progress/QA, or from In Progress to QA." 
    };
  }

  return { canMove: false, reason: "Permission denied." };
};

export const getPermissionErrorMessage = async (
  sprintStatus: 'created' | 'running' | 'completed',
  userRole?: string,
  projectId?: string
): Promise<string> => {
  if (projectId) {
    const projectStatus = await getProjectStatus(projectId);
    if (projectStatus !== 'in_progress') {
      return `Story status can only be updated when the project is in progress. Current project status: ${projectStatus}`;
    }
  }
  
  if (sprintStatus !== 'running') {
    return "Task status can only be updated when the sprint is in progress.";
  } else if (userRole === 'qa') {
    return "QA can only move cards from QA to Done.";
  } else if (userRole === 'team_lead' || userRole === 'developer') {
    return "You can only move cards from To Do to In Progress/QA, or from In Progress to QA.";
  } else {
    return "Only Team Leads, Developers, and QA can move cards.";
  }
};
