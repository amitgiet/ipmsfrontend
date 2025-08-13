import { UserRole } from '@/components/types/auth.ts';

// Define what actions each role can perform
export const permissions = {
  // Project management
  createProject: ['super-admin', 'admin', 'product_owner'] as UserRole[],
  editProject: ['super-admin', 'admin', 'product_owner'] as UserRole[],
  deleteProject: ['super-admin', 'admin'] as UserRole[],
  viewProject: ['super-admin', 'admin', 'team_lead', 'product_owner', 'developer', 'qa', 'client'] as UserRole[],
  
  // User story management
  createStory: ['super-admin', 'admin', 'product_owner'] as UserRole[],
  editStory: ['super-admin', 'admin', 'product_owner'] as UserRole[],
  deleteStory: ['super-admin', 'admin', 'product_owner'] as UserRole[],
  viewStory: ['super-admin', 'admin', 'team_lead', 'product_owner', 'developer', 'qa', 'client'] as UserRole[],
  groomStory: ['super-admin', 'admin', 'product_owner', 'team_lead'] as UserRole[],
  
  // Task management - UPDATED: team_lead, developer, and qa can create tasks
  createTask: ['super-admin', 'admin', 'team_lead', 'developer', 'qa'] as UserRole[],
  editTask: ['super-admin', 'admin', 'team_lead', 'developer', 'qa'] as UserRole[],
  deleteTask: ['super-admin', 'admin', 'team_lead', 'developer', 'qa'] as UserRole[],
  viewTask: ['super-admin', 'admin', 'team_lead', 'qa'] as UserRole[], // Removed developer - they'll use viewOwnTasks
  viewOwnTasks: ['developer'] as UserRole[], // NEW: Developers can only view their own tasks
  assignTask: ['super-admin', 'admin', 'team_lead'] as UserRole[],
  moveTask: ['super-admin', 'admin', 'team_lead', 'developer', 'qa'] as UserRole[],
  
  // Mindmap management - NEW: Team leads have view-only access like admins
  editMindmap: ['product_owner'] as UserRole[],
  viewMindmap: ['super-admin', 'admin', 'team_lead', 'product_owner', 'developer', 'qa', 'client'] as UserRole[],
  
  // Test case management - UPDATED: Team leads can view test cases
  viewTestCases: ['super-admin', 'admin', 'team_lead', 'qa', 'developer'] as UserRole[],
  manageTestCases: ['super-admin', 'admin', 'qa'] as UserRole[],
  unitTestCases: ['super-admin', 'admin', 'developer'] as UserRole[],
  qcApproveTestCases: ['super-admin', 'admin', 'qa'] as UserRole[],
  
  // Time logging
  logTime: ['super-admin', 'admin', 'team_lead', 'developer', 'qa'] as UserRole[],
  viewTimeLogs: ['super-admin', 'admin', 'team_lead', 'product_owner', 'developer', 'qa'] as UserRole[],
  
  // Team management - RESTRICTED TO ADMIN ONLY
  manageTeam: ['super-admin', 'admin', 'team_lead'] as UserRole[],
  viewTeam: ['super-admin', 'admin', 'team_lead'] as UserRole[],
  addTeamMember: ['super-admin', 'admin', 'team_lead'] as UserRole[],
  editTeamMember: ['super-admin', 'admin', 'team_lead'] as UserRole[],
  deleteTeamMember: ['super-admin', 'admin', 'team_lead'] as UserRole[],
  
  // Sprint management
  createSprint: ['super-admin', 'admin', 'team_lead'] as UserRole[],
  manageSprint: ['super-admin', 'admin', 'team_lead'] as UserRole[],
  viewSprint: ['super-admin', 'admin', 'team_lead', 'product_owner', 'developer', 'qa'] as UserRole[],
  
  // Comments and documents
  addComment: ['super-admin', 'admin', 'team_lead', 'product_owner', 'developer', 'qa'] as UserRole[],
  uploadDocument: ['super-admin', 'admin', 'product_owner'] as UserRole[],
  viewDocument: ['super-admin', 'admin', 'team_lead', 'product_owner', 'developer', 'qa', 'client'] as UserRole[],
};

// Helper function to check if a user has permission for an action
export const hasPermission = (userRole: UserRole | null, action: keyof typeof permissions): boolean => {
  if (!userRole) return false;
  return permissions[action].includes(userRole);
};

// Helper function to check multiple permissions
export const hasAnyPermission = (userRole: UserRole | null, actions: (keyof typeof permissions)[]): boolean => {
  return actions.some(action => hasPermission(userRole, action));
};
